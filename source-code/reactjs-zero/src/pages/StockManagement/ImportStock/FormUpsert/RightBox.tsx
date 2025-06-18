import {Button, Col, Form, Radio, Row} from "antd";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import "../../Shared/Upsert/index.scss";
import {observer} from "mobx-react-lite";
import PartnerSupplierInput from "@pages/StockManagement/Shared/Upsert/right/forms/PartnerSupplierInput";
import {NoteInput} from "@pages/StockManagement/Shared/Upsert/right/forms/NoteInput";
import {SaveBtnGroup} from "@pages/StockManagement/Shared/Upsert/right/SaveBtnGroup";
import {MoveDateAndMoveCode} from "@pages/StockManagement/Shared/Upsert/right/forms/MoveDateAndMoveCode";
import {MoveType,} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {MoveTypeHeader} from "@pages/StockManagement/Shared/Upsert/right/MoveTypeHeader";
import StockInitialValueInput from "@pages/StockManagement/Shared/Upsert/right/forms/StockInitialValueInput";
import ValidateUtils from "@ord-core/utils/validate.utils";
import UpsertFormUtil from "@pages/StockManagement/Shared/utils/UpsertForm.util";
import {useStore} from "@ord-store/index";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import {useSelectPaymentMethod} from "@ord-components/forms/select/selectDataSource/useSelectPaymentMethod";
import {PaymentMethodEnum} from "@pages/SalesInvoice/Form/paymentMethodForm";
import OrdSelect, {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {useSelectTaxCode} from "@ord-components/forms/select/selectDataSource/useSelectTaxPercent";
import {debounce, round} from "lodash";
import RegexUtil from "@ord-core/utils/regex.util";
import OrdInputRegexText from "@ord-components/forms/OrdInputRegexText";
import OrdDateTimeInput from "@ord-components/forms/OrdDateTimeInput";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";

const debounceTime = 200;

type IImportRightBoxProps = {
    onSave: (isDraft: boolean) => void;
}

const ImportRightBox = (props: IImportRightBoxProps) => {
    const {onSave} = props;
    const [t] = useTranslation("stock")
    const {importStockUpsertStore: mainStore} = useStore();
    const [maxDiscountValue, setMaxDiscountValue] = useState(0);

    const form = Form.useFormInstance();
    const moveType_w = Form.useWatch("moveType", form);
    const partnerId_w = Form.useWatch("partnerId", form);
    const debtAmount_w = Form.useWatch("debtAmount", form);
    const totalAmountRound_w = Form.useWatch("totalAmountRound", form);
    const discountType_w = Form.useWatch("discountType", form);
    const totalAmount_w = Form.useWatch("totalAmount", form);
    const moveId_w = Form.useWatch("moveId", form);
    const totalAmountBeforeDiscount_w = Form.useWatch("totalAmountBeforeDiscount", form);
    const today = new Date();

    useEffect(() => {
        form.setFieldValue(
            "moveType",
            partnerId_w ? MoveType.PhieuNhapNhaCungCap : MoveType.PhieuNhapTon
        );
    }, [partnerId_w]);

    const changeTaxDiscountCode = debounce((value?: number, option?: any) => {
        form.setFieldValue("taxDiscountPercent", option.data?.taxPercent);
        calculatorForm();
    }, debounceTime);

    const changeDiscountMove = debounce((value?: number) => {
        calculatorDiscount();
        calculatorForm();
    }, debounceTime);

    const calculatorDiscount = () => {
        const values = form.getFieldsValue();
        const totalAmountBeforeDiscount = values.totalAmountBeforeDiscount || 0;
        const discountValue = isNaN(values.discountValue) ? 0 : +values.discountValue;

        let discountAmount = 0;
        switch (values.discountType) {
            case DiscountTypeEnum.Value:
                form.setFieldValue('discountAmount', discountValue);
                form.setFieldValue('discountPercent', 0);
                discountAmount = discountValue;
                break;
            case DiscountTypeEnum.Percent:
                form.setFieldValue('discountPercent', discountValue);
                discountAmount = round(totalAmountBeforeDiscount * (discountValue) / 100, 2) ?? 0;
                form.setFieldValue('discountAmount', discountAmount);
                break;
        }

        discountAmount = discountAmount ? discountAmount : 0;
        const num = (round(totalAmountBeforeDiscount || 0, 2) || 0) - (round(discountAmount || 0, 2) || 0);
        form.setFieldValue('totalAmountAfterDiscount', num);
        form.setFieldValue('totalAmountBeforeTax', num);
    }

    const onSetPaymentFull = () => {
        form.setFieldValue("paymentAmount", totalAmountRound_w);
        calculatorDebtAmount();
    };

    const onPaymentAmount = debounce(() => {
        calculatorDebtAmount();
    }, debounceTime);

    const calculatorDebtAmount = () => {
        const values = form.getFieldsValue();
        const paymentAmount = values.paymentAmount || 0;
        const totalAmountRound = values.totalAmountRound || 0;
        let debtAmount = totalAmountRound - paymentAmount;
        debtAmount = debtAmount < 0 ? 0 : debtAmount;
        form.setFieldValue("debtAmount", debtAmount ?? 0);
    }

    const onChangeDiscountType = debounce(() => {
        form.setFieldValue('discountValue', 0);
        calculatorDiscount();
        calculatorForm();
    }, debounceTime);

    //Tính lại toàn bộ giá trị
    const calculatorForm = () => {
        const moveValueForm = form.getFieldsValue();
        const {
            products,
            move
        } = UpsertFormUtil.calculatorAllProduct(mainStore.productItems, moveValueForm);
        mainStore.productItems = [...products];
        form.setFieldsValue({
            ...moveValueForm,
            ...move
        });
    };

    useEffect(() => {
        if (discountType_w == DiscountTypeEnum.Percent) {
            setMaxDiscountValue(100);
        } else if (totalAmountBeforeDiscount_w > 0) {
            setMaxDiscountValue(totalAmountBeforeDiscount_w);
        }
    }, [totalAmountBeforeDiscount_w, discountType_w]);


    // useEffect(() => {
    //     if (moveType_w == MoveType.PhieuNhapNhaCungCap ||
    //         moveType_w == MoveType.PhieuXuatTraNhaCungCap) {
    //         form.setFieldValue("paymentAmount", totalAmountRound_w);
    //         form.setFieldValue("debtAmount", 0);
    //     }
    // }, [totalAmountRound_w]);

    return (
        <>
            <div className="stock-right">
                {!!moveType_w && (
                    <h3 className={"move-title-header"}>
                        {t("informationStockMove")}
                    </h3>
                )}
                <Row gutter={16}>
                    <MoveDateAndMoveCode/>
                    <MoveTypeHeader></MoveTypeHeader>
                    <StockInitialValueInput/>
                    <Col span={24}>
                        <FloatLabel label={'Nhà cung cấp'} required>
                            <Form.Item name={"partnerId"} rules={[ValidateUtils.required]}>
                                <PartnerSupplierInput/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={24}>
                        <FloatLabel label={'Mã hoá đơn'}>
                            <Form.Item name={"partnerInvoiceCode"}>
                                <OrdInputRegexText regex={RegexUtil.CodeRegex}/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>

                    <Col span={24}>
                        <FloatLabel label={'Ngày tạo hoá đơn'}>
                            <Form.Item name={"partnerInvoiceDate"}>
                                <OrdDateTimeInput
                                    rootClassName='date-stock'
                                    format={{
                                        format: 'DD/MM/YYYY                         HH:mm',
                                        type: 'mask',
                                    }}
                                />
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                </Row>
            </div>

            <div className="stock-right mt-2">
                <h3 className={"move-title-header"}>
                    {t("paymentInfo")}
                </h3>
                <Row gutter={16}>
                    <Col span={24}>
                        <FloatLabel label={t("priceBoxMove.totalAmountBeforeDiscount")}>
                            <Form.Item name="totalAmountBeforeDiscount" className="text-right">
                                <PriceNumberInput disabled></PriceNumberInput>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={24}>
                        <FloatLabel label={t("priceBoxMove.discountAmount")}>
                            <div className="relative stock-discount-amount">
                                <Form.Item
                                    name="discountType"
                                    initialValue={DiscountTypeEnum.Percent}
                                    className="absolute z-10 left-[1px] top-[7px]"
                                >
                                    <Radio.Group
                                        disabled={moveType_w === MoveType.PhieuXuatTraNhaCungCap}
                                        className="!pt-0 radio-wrapper"
                                        size="small"
                                        onChange={() => onChangeDiscountType()}
                                    >
                                        <Radio.Button
                                            className="!h-7 !w-11 radio-custom"
                                            value={DiscountTypeEnum.Percent}
                                        >
                                            %
                                        </Radio.Button>
                                        <Radio.Button
                                            className="!h-7 !w-11 radio-custom"
                                            value={DiscountTypeEnum.Value}
                                        >
                                            VNĐ
                                        </Radio.Button>
                                    </Radio.Group>
                                </Form.Item>

                                <Form.Item noStyle name={'discountValue'}>
                                    <PriceNumberInput className={'not-handler-wrap text-right'}
                                                      max={maxDiscountValue}
                                                      min={0}
                                                      onInput={(e) => changeDiscountMove()}
                                                      decimalLimit={0}
                                                      isOnlyNumberInput={true}
                                                      addonAfter={(discountType_w === DiscountTypeEnum.Value ? 'VNĐ' : '%')}/>
                                </Form.Item>
                            </div>
                        </FloatLabel>
                    </Col>
                    <Col span={24}>
                        <FloatLabel label={t("taxDiscountPercent")}>
                            <Form.Item name="taxDiscountCode">
                                <OrdSelect
                                    allowClear={false}
                                    datasource={useSelectTaxCode()}
                                    onChange={(data, option: IOrdSelectOption) => {
                                        changeTaxDiscountCode(data, option);
                                    }}
                                    disabled={moveType_w === MoveType.PhieuXuatTraNhaCungCap}
                                />
                            </Form.Item>
                            <Form.Item hidden name="taxDiscountPercent"/>
                        </FloatLabel>
                    </Col>
                    <Col span={24}>
                        <FloatLabel label={t("taxAmount")}>
                            <Form.Item name="taxAmount" className="text-right">
                                <PriceNumberInput disabled></PriceNumberInput>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={24}>
                        <FloatLabel label={t("totalAmount")}>
                            <Form.Item name="totalAmountRound" className="text-right">
                                <PriceNumberInput disabled></PriceNumberInput>
                            </Form.Item>
                        </FloatLabel>
                        <Form.Item noStyle name="totalAmount"/>
                    </Col>
                    <Col span={24}>
                        <FloatLabel label={t("Thanh toán")}>
                            <Form.Item name="paymentAmount" initialValue={totalAmountRound_w}>
                                <PriceNumberInput
                                    max={totalAmountRound_w}
                                    min={0}
                                    onInput={onPaymentAmount}
                                    integerLimit={17}
                                    decimalLimit={0}
                                    isOnlyNumberInput
                                    step={1000}
                                    className="not-handler-wrap text-right"
                                ></PriceNumberInput>
                            </Form.Item>
                            {debtAmount_w > 0 && (
                                <Button
                                    size={"small"}
                                    className="float-right mb-2"
                                    onClick={() => onSetPaymentFull()}
                                >
                                    {t("paymentFull")}
                                </Button>
                            )}
                        </FloatLabel>
                    </Col>
                    <Col span={24}>
                        <FloatLabel label={t("priceBoxMove.debtAmount")}>
                            <Form.Item name="debtAmount" className="text-right">
                                <PriceNumberInput disabled></PriceNumberInput>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    {/*{*/}
                    {/*    !!debtAmount_w && <Col span={24}>*/}
                    {/*        <FloatLabel label={t('priceBoxMove.debtDueDate')}>*/}
                    {/*            <Form.Item name='debtDueDate'} className='text-right'>*/}
                    {/*                <OrdDateInput*/}
                    {/*                    disabledDate={(current) => current && current.isBefore(dayjs(moveDate_w), "day")}/>*/}
                    {/*            </Form.Item>*/}
                    {/*        </FloatLabel>*/}
                    {/*    </Col>*/}
                    {/*}*/}
                    <Col span={24}>
                        <FloatLabel label={t("Phương thức thanh toán")}>
                            <Form.Item
                                name="paymentMethod"
                                initialValue={PaymentMethodEnum.TIEN_MAT}
                            >
                                <OrdSelect
                                    allowClear={false}
                                    disabled={moveType_w === MoveType.PhieuXuatTraNhaCungCap}
                                    datasource={useSelectPaymentMethod()}
                                ></OrdSelect>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <NoteInput/>
                </Row>
                <SaveBtnGroup onSave={onSave}/>
            </div>
            <div hidden>
                <Form.Item name='moveId'/>
                <Form.Item name='moveHashId'/>
                <Form.Item name='moveType'/>
                <Form.Item noStyle name={'discountAmount'}/>
                <Form.Item noStyle name={'discountPercent'}/>
                <Form.Item noStyle name={'totalAmountAfterDiscount'}/>
                <Form.Item noStyle name={'totalAmountBeforeTax'}/>
            </div>
        </>
    );
};
export default observer(ImportRightBox);
