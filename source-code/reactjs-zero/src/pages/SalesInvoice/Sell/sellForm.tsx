import "./sellForm.scss";
import {
    Alert,
    Button,
    Checkbox,
    Collapse,
    CollapseProps,
    Flex,
    Form,
    FormInstance,
    Input,
    Result,
    Space,
    Tag,
} from "antd";
import React, {memo, useEffect, useMemo, useRef} from "react";
import {MinusOutlined, PlusOutlined, QrcodeOutlined,} from "@ant-design/icons";
import {DiscountForm} from "@pages/SalesInvoice/Sell/discountForm";
import {ProductOrderForm} from "@pages/SalesInvoice/Sell/productOrderForm";
import {NumericFormat} from "react-number-format";
import {GetFileUrl} from "@ord-core/service-proxies/axios.base";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import {useTranslation} from "react-i18next";
import {CustomerSelectForm} from "@pages/SalesInvoice/Form/CustomerSelectForm";
import DateUtil from "@ord-core/utils/date.util";
import {InvoiceInfoForm} from "@pages/SalesInvoice/Form/InvoiceInfoForm";
import {IProductSaleDto} from "@pages/SalesInvoice/Sell/index";
import {PaymentMethodForm} from "@pages/SalesInvoice/Form/paymentMethodForm";
import {SaleInvoiceStatusEnum} from "@pages/SalesInvoice/Utils/saleCommon";
import {DeleteIcon} from "@ord-components/icon/DeleteIcon";
import {WalletIcon} from "@ord-components/icon/WalletIcon";
import {EmptyIcon} from "@ord-components/icon/EmptyIcon";
import {currencyDefault} from "@ord-core/AppConst";
import Utils from "@ord-core/utils/utils";
import OrdDisplayEllipsisTextLong from "@ord-components/displays/OrdDisplayEllipsisTextLong";
import {PrescriptionTypeEnum} from "@api/index.defs";
import {round} from "lodash";
import {useDebouncedCallback} from 'use-debounce';
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";
import {CalculatorCurrencyUtil} from "@ord-core/utils/calculatorCurrency.util";

export const SellForm = (props: {
    form: FormInstance;
    products: IProductSaleDto[];
    refreshDate: Date;
    removeProductHandler: React.EventHandler<any>;
    upOrDownProductHandler: React.EventHandler<any>;
    changeNotesProduct: React.EventHandler<any>;
    refreshProductHandler: Function;
    onShowSalePrescription: () => void;
    onShowSalePrescriptionNation: () => void;
}) => {
    const [collapsePrice, setCollapsePrice] = React.useState<boolean>(true);
    const {t} = useTranslation("sale-invoice");
    const partnerId_w = Form.useWatch("partnerId", props.form);
    const notesRef = useRef<{ [key: number]: string }>({});
    const taxDiscountAmount_w = Form.useWatch("taxDiscountAmount", props.form) ?? 0;
    const paymentAmount_w = Form.useWatch("paymentAmount", props.form) ?? 0;
    const discountAmount_w = Form.useWatch("discountAmount", props.form) ?? 0;
    const isShowInfoExportEInvoice_w = Form.useWatch("isShowInfoExportEInvoice", props.form);
    const partnerObj = Form.useWatch("partnerObj", props.form);

    const {
        totalAmountBeforeDiscount_w = 0,
        taxAmountFromProduct_w = 0,
        totalProduct_w = 0,
    } = useMemo(() => {
        let totalSubTax = 0;

        props.products.forEach((p) => {
            totalSubTax += p.subTaxAmount ?? 0;
        });

        return {
            totalAmountBeforeDiscount_w: CalculatorCurrencyUtil.summaryTotalAmountBeforeDiscount(props.products?.map(x => x.totalAmountAfterDiscount || 0) || []),
            taxAmountFromProduct_w: round(totalSubTax, CalculatorCurrencyUtil.decimalRound),
            totalProduct_w: props.products.length
        }
    }, [props.products, props.refreshDate])

    useEffect(() => {
        const discountType = props.form.getFieldValue("discountType") ||
                            DiscountTypeEnum.Percent;
        const discountPercent = props.form.getFieldValue("discountPercent");
        const discountAmount = props.form.getFieldValue("discountAmount");
        const taxDiscountPercent = props.form.getFieldValue("taxDiscountPercent");
        const calculateDiscount = CalculatorCurrencyUtil.calculateDiscount(
            discountType, discountPercent, discountAmount, totalAmountBeforeDiscount_w)

        const taxDiscountAmount = CalculatorCurrencyUtil.summaryTaxDiscountAmount(
            calculateDiscount.discountAmount, taxDiscountPercent);

        props.form.setFieldsValue({
            discountAmount: calculateDiscount.discountAmount,
            discountPercent: calculateDiscount.discountPercent,
            taxDiscountAmount: taxDiscountAmount,
            totalAmountBeforeDiscount: round(totalAmountBeforeDiscount_w, CalculatorCurrencyUtil.decimalRound)
        });

    }, [totalAmountBeforeDiscount_w,]);

    useEffect(() => {
        if (totalProduct_w == 0) {
            props.form.setFieldsValue({
                taxDiscountAmount: 0,
                discountAmount: 0,
                discountPercent: 0
            });
        }

    }, [totalProduct_w,]);

    const totalTax = useMemo(() => {
        return round(taxAmountFromProduct_w - taxDiscountAmount_w, CalculatorCurrencyUtil.decimalRound);
    }, [taxAmountFromProduct_w, taxDiscountAmount_w]);

    const totalAmountBeforeTax = useMemo(() => {
        return CalculatorCurrencyUtil.summaryTotalAmountBeforeTax2(totalAmountBeforeDiscount_w, discountAmount_w);  //- Khuyến mại nếu có
    }, [totalAmountBeforeDiscount_w, discountAmount_w]);

    const totalNeedPayment = useMemo(() => {
        const totalAmountSummary = CalculatorCurrencyUtil.summaryTotalAmount2(totalAmountBeforeTax, totalTax);
        return CalculatorCurrencyUtil.summaryTotalAmountRound(totalAmountSummary);
    }, [totalAmountBeforeTax, totalTax]);

    const debtAmount = useMemo(() => {
        return CalculatorCurrencyUtil.summaryDebtAmount(totalNeedPayment, paymentAmount_w);
    }, [paymentAmount_w, totalNeedPayment]);

    useEffect(() => {
        props.form.setFieldValue("paymentAmount", round(totalNeedPayment, 0));
    }, [totalNeedPayment]);

    const upProduct = (item: any) => {
        props.upOrDownProductHandler({item: item, num: 1});
    };

    const downProduct = (item: any) => {
        props.upOrDownProductHandler({item: item, num: -1});
    };
    const changeNumProduct = (e: any, item: any) => {
        const newNum = e - item.qty;
        props.upOrDownProductHandler({item: item, num: newNum ?? 1});
    };

    const debouncedChangeNotesProduct = useDebouncedCallback((item: any) => {
        props.changeNotesProduct({item: item, notes: notesRef.current[item.id]});
    }, 300);

    const changeNotesProduct = (e: React.ChangeEvent<HTMLInputElement>, item: any) => {
        notesRef.current[item.id] = e.target.value;
        debouncedChangeNotesProduct(item);
    };

    const removeProduct = (item: any) => {
        props.removeProductHandler(item);
    };

    const refreshProduct = () => {
        props.refreshProductHandler();
    };

    const productFormRef = useRef();
    const openProductOrderForm = (product: any) => {
        // @ts-ignore
        productFormRef.current.showModal(product);
    };

    const collapseItems: CollapseProps["items"] = [
        {
            key: "1",
            forceRender: true,
            label: (
                <Flex justify={"space-between"}>
                    <span className="text-base">
                        <strong>{t("paymentInformation")}</strong>
                        {/*<strong>{props.products.length}</strong> sản phẩm)*/}
                    </span>
                    {collapsePrice && <strong>
                        {props.products.length} sản phẩm
                    </strong>}
                </Flex>
            ),
            children: (
                <div className='overflow-y-auto overflow-x-hidden h-[35vh] scroll-hidden'>
                    <div className="flex flex-col gap-0 text-[#636363]">
                        <Form.Item name="totalProductPrice" hidden>
                            <Input/>
                        </Form.Item>
                        <Form.Item name="subTaxAmount" hidden>
                            <Input/>
                        </Form.Item>
                        <Form.Item name="totalAmountBeforeDiscount" hidden>
                            <Input/>
                        </Form.Item>
                   {/*     <div className="flex justify-between items-center  h-[33px]">
                            <div>{t("channel")}</div>
                            <Flex className="items-center cs-input">
                                <Form.Item name="saleChannelTypeId" initialValue={0}>
                                    <OrdSelect
                                        placeholder={t("channel")}
                                        datasource={useSelectChannelType()}
                                    ></OrdSelect>
                                </Form.Item>
                            </Flex>
                        </div>*/}
                        <div className="flex justify-between text-md items-center  h-[33px]">
                            <div>
                                Tạm tính : (<strong>{props.products.length}</strong> sản phẩm)
                            </div>
                            <strong>
                                {
                                    <NumericFormat
                                        value={totalAmountBeforeDiscount_w}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                    />
                                }{" "}
                                {currencyDefault}
                            </strong>
                        </div>
                        <DiscountForm form={props.form}></DiscountForm>
                        {/*<div className="flex justify-between text-md items-center  h-[33px]">*/}
                        {/*    <div>*/}
                        {/*        Giảm giá*/}
                        {/*    </div>*/}
                        {/*    <Form.Item name="discountAmountFromProduct" hidden>*/}
                        {/*    </Form.Item>*/}
                        {/*    {Utils.formatterNumber(discountAmountFromProduct_w, 0)} {currencyDefault}*/}
                        {/*</div>*/}
                        <div className="flex justify-between text-md items-center  h-[33px]">
                            <div>
                                Tổng tiền trước thuế
                            </div>
                            <strong>
                                {Utils.formatterNumber(totalAmountBeforeTax, 2)} {currencyDefault}
                            </strong>
                        </div>
                        <div className="flex justify-between text-md items-center  h-[33px]">
                            <div>
                                Tổng tiền thuế
                            </div>
                            {Utils.formatterNumber(totalTax, 2)} {currencyDefault}
                        </div>

                        <div className="flex justify-between text-xl items-center h-[33px] font-bold">
                            {/*<Tooltip*/}
                            {/*    placement="leftBottom"*/}
                            {/*    title={t("totalAmountIncludeTax")}*/}
                            {/*>*/}

                            {/*    <InfoCircleTwoTone className="ml-1"/>*/}
                            {/*</Tooltip>*/}
                            <strong className=''>{t("totalAmount")}</strong>
                            <strong>
                                {Utils.formatterNumber(totalNeedPayment, 0)} {currencyDefault}
                            </strong>
                        </div>

                        <div>
                            <div hidden={!partnerId_w || partnerId_w <= 0}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        {t("customerPayment")}
                                        <span
                                            className={
                                                "text-[12px] opacity-80 " +
                                                (debtAmount > 0 ? "text-red-500" : "text-emerald-500")
                                            }
                                        >
                                            {debtAmount > 0 ? (
                                                <>
                                                    {" "}
                                                    (Còn:{" "}
                                                    <NumericFormat
                                                        value={debtAmount}
                                                        displayType={"text"}
                                                        thousandSeparator={true}
                                                    />
                                                    ){" "}
                                                </>
                                            ) : debtAmount < 0 ? (
                                                <>
                                                    {" "}
                                                    (Dư:{" "}
                                                    <NumericFormat
                                                        value={0 - debtAmount}
                                                        displayType={"text"}
                                                        thousandSeparator={true}
                                                    />
                                                    ){" "}
                                                </>
                                            ) : (
                                                ""
                                            )}
                                        </span>
                                    </div>
                                    <Flex className="items-center cs-input">
                                        <Form.Item name="paymentAmount" style={{width: 120}}>
                                            <PriceNumberInput
                                                className="border-none w-full font-semibold"
                                                step={1000}
                                                min={0}
                                            />
                                        </Form.Item>
                                        &nbsp;<strong>{currencyDefault}</strong>
                                    </Flex>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-between items-center mt-2 mb-3">
                            <div>{t("paymentMethod")} </div>
                            <PaymentMethodForm
                                totalPayment={totalNeedPayment}
                            ></PaymentMethodForm>
                        </div>
                        <InvoiceInfoForm/>
                    </div>

                    <Space.Compact style={{width: "100%", marginBottom: 5}}>
                        <Form.Item
                            noStyle
                            name="isShowInfoExportEInvoice"
                            valuePropName="checked"
                            initialValue={false}
                        >
                            <Checkbox>{t("exportEInvoice")}</Checkbox>
                        </Form.Item>
                    </Space.Compact>
                    {isShowInfoExportEInvoice_w && (
                        <div className="mb-1">
                            <div className="flex justify-between items-center ">
                                <div className="font-bold">
                                    {t("eInvoiceBuyerName")}
                                </div>
                                <Flex className="items-center cs-input">
                                    <Form.Item
                                        name={"eInvoiceBuyerName"}
                                        style={{width: 220}}
                                    >
                                        <Input
                                            placeholder={t("eInvoiceBuyerName")}
                                            className="border-none w-full font-semibold"
                                        ></Input>
                                        {/*<PriceNumberInput className="border-none w-full font-semibold" step={1000} min={0}/>*/}
                                    </Form.Item>
                                </Flex>
                            </div>
                            <div className="flex justify-between items-center ">
                                <div>{t("eInvoiceCompany")}</div>
                                <Flex className="items-center cs-input">
                                    <Form.Item name={"eInvoiceCompany"} style={{width: 220}}>
                                        <Input
                                            placeholder={t("eInvoiceCompany")}
                                            className="border-none w-full font-semibold"
                                        ></Input>
                                    </Form.Item>
                                </Flex>
                            </div>
                            <div className="flex justify-between items-center ">
                                <div>{t("eInvoiceTaxCode")}</div>
                                <Flex className="items-center cs-input">
                                    <Form.Item name={"eInvoiceTaxCode"} style={{width: 220}}>
                                        <Input
                                            placeholder={t("eInvoiceTaxCode")}
                                            className="border-none w-full font-semibold"
                                        ></Input>
                                    </Form.Item>
                                </Flex>
                            </div>
                            <div className="flex justify-between items-center ">
                                <div className="font-bold">
                                    {t("eInvoiceBuyerAddress")}
                                </div>
                                <Flex className="items-center cs-input">
                                    <Form.Item
                                        name={"eInvoiceBuyerAddress"}
                                        style={{width: 220}}
                                    >
                                        <Input
                                            placeholder={t("eInvoiceBuyerAddress")}
                                            className="border-none w-full font-semibold"
                                        ></Input>
                                    </Form.Item>
                                </Flex>
                            </div>
                            <div className="flex justify-between items-center ">
                                <div>{t("eInvoiceBuyerPhone")}</div>
                                <Flex className="items-center cs-input">
                                    <Form.Item name={"eInvoiceBuyerPhone"} style={{width: 220}}>
                                        <Input
                                            placeholder={t("eInvoiceBuyerPhone")}
                                            className="border-none w-full font-semibold"
                                        ></Input>
                                    </Form.Item>
                                </Flex>
                            </div>
                            <div className="flex justify-between items-center ">
                                <div>{t("eInvoiceBuyerEmail")}</div>
                                <Flex className="items-center cs-input">
                                    <Form.Item name={"eInvoiceBuyerEmail"} style={{width: 220}}>
                                        <Input
                                            placeholder={t("eInvoiceBuyerEmail")}
                                            className="border-none w-full font-semibold"
                                        ></Input>
                                    </Form.Item>
                                </Flex>
                            </div>
                        </div>
                    )}

                </div>
            ),
        },
    ];
    const collapseOnChange = (value: any) => {
        if (value && value.indexOf("1") < 0) setCollapsePrice(true);
        else setCollapsePrice(false);
    };

    useEffect(() => {
        if (isShowInfoExportEInvoice_w) {
            props.form.setFieldsValue({
                eInvoiceBuyerName: partnerObj?.name,
                eInvoiceCompany: partnerObj?.companyName,
                eInvoiceTaxCode: partnerObj?.taxCode,
                eInvoiceBuyerAddress: partnerObj?.address,
                eInvoiceBuyerPhone: partnerObj?.phone,
                eInvoiceBuyerEmail: partnerObj?.email,
            });
        }
    }, [partnerObj, isShowInfoExportEInvoice_w]);

    // useEffect(() => {
    //     if(paymentMethod_w == 3) {
    //         props.form.setFieldValue('isShowInfoExportEInvoice', true);
    //     }
    // }, [paymentMethod_w])

    const PrescriptionInfo = memo((prop: { prescriptionType: PrescriptionTypeEnum }) => {
        const {prescriptionType} = prop;
        // Tránh render nếu w_isPrescription = false
        if (!prescriptionType) return null;

        return (
            <Alert
                message={
                    <>
                        <a onClick={() => {
                            switch (prescriptionType) {
                                case 1:
                                    props.onShowSalePrescription();
                                    break;
                                case 2:
                                    props.onShowSalePrescriptionNation();
                                    break;
                                default:
                                    alert("Dev Check")
                            }
                        }}>
                            {t("isSalesPrescription")}
                        </a>
                    </>
                }
                action={
                    <Button
                        size="small"
                        danger
                        onClick={() => {
                            props.form.setFieldsValue({
                                prescriptionType: undefined,
                                prescriptionInfo: undefined,
                            });
                        }}
                    >
                        {t("destroyPrescription")}
                    </Button>
                }
                type="info"
                showIcon
            />
        );
    });

    return (
        <div className="flex flex-col gap-1 justify-between h-[100%]">
            <div className="relative">
                <Form.Item name="id" hidden>
                    <Input/>
                </Form.Item>
                <Form.Item name="invoiceCode" hidden>
                    <Input/>
                </Form.Item>
                <CustomerSelectForm
                    form={props.form}
                    usingPartnerObj={true}
                />
            </div>

            <div className="flex-1 overflow-auto mx-[-15px] px-[15px]">
                <Form.Item name="prescriptionInfo" hidden>
                    <Input/>
                </Form.Item>
                <Form.Item name="prescriptionType" hidden>
                    <Input/>
                </Form.Item>
                <PrescriptionInfo
                    prescriptionType={Form.useWatch("prescriptionType", props.form)}
                ></PrescriptionInfo>
                <div className="product-select mt-3 cursor-pointer">
                    {(!props.products || props.products.length == 0) && (
                        <Result
                            className="mt-[10%]"
                            icon={<EmptyIcon className="w-[100px]"/>}
                            title={
                                <div className="text-xl">
                                    Vui lòng chọn sản phẩm cho hóa đơn
                                </div>
                            }
                        />
                    )}
                    {props.products.map((pro) => {
                        const isDisabledPlus = !!(pro.inventoryCurrentQty && pro.qty === pro.inventoryCurrentQty);
                        const hasDiscount = !!pro.discountAmount;
                        const hasTax = !!pro.taxPercent;

                        const UnitDisplay = () => (
                            pro.basicUnitName ? <>(ĐVT: {pro.basicUnitName})</> : (<></>)
                        );

                        const LotInfo = () => (
                            pro.lotNumber ? (
                                <div>
                                    <Tag style={{marginInlineEnd: 0, lineHeight: "15px", fontSize: "12px"}}
                                         bordered={false} color="green">
                                        Số lô: {pro.lotNumber}
                                    </Tag>
                                    <Tag style={{lineHeight: "15px", fontSize: "12px"}} color="orange" bordered={false}>
                                        Hạn: {DateUtil.toFormat(pro.lotExpiryDate, "DD/MM/YYYY")}
                                    </Tag>
                                </div>
                            ) : <></>
                        );

                        return (
                            <div key={pro.productId} className="w-full mb-1">
                                <div className="flex w-full min-h-[60px] relative items-center">
                                    <img
                                        onClick={() => openProductOrderForm(pro)}
                                        className="object-cover size-[44px] p-1 border-[1px] rounded-md"
                                        src={pro.imageUrl ? GetFileUrl(pro.imageUrl) : "/images/product-placeholder.png"}
                                    />
                                    <div className='flex flex-col flex-1 pl-4 py-1'>
                                        <div className='flex item-center justify-between'>
                                            <div
                                                className="flex flex-1 font-semibold hover:underline line-clamp-2 leading-normal"
                                                onClick={() => openProductOrderForm(pro)}>
                                                <OrdDisplayEllipsisTextLong text={pro.productName ?? ""}
                                                                            maxWidth={300}/>
                                                <span className="text-sm pl-1 pt-[0.15rem]">
                                                    <UnitDisplay/>
                                                </span>
                                            </div>
                                            <Button
                                                onClick={() => removeProduct(pro)}
                                                type="text"
                                                size="small"
                                                icon={<DeleteIcon style={{color: "red"}}/>}
                                                className="absolute top-1 right-0 ml-4"
                                            />
                                        </div>

                                        <div className=" flex items-start justify-between">
                                            <div className='flex-1 ord-input-bottom-line note-sale'>
                                                <Input placeholder='Ghi chú' defaultValue={pro.notes}
                                                       onChange={(e) => changeNotesProduct(e, pro)}/>
                                            </div>
                                            <div className='ml-3 min-w-[200px] max-w-[300px] flex justify-end'>
                                                <div className='mr-4'>
                                                    <Button
                                                        size="small"
                                                        disabled={(pro.qty ?? 0) <= 1}
                                                        onClick={() => downProduct(pro)}
                                                        icon={<MinusOutlined/>}
                                                    />
                                                    <PriceNumberInput
                                                        value={pro.qty}
                                                        onChange={(e) => changeNumProduct(e, pro)}
                                                        min={1}
                                                        max={pro.isProductUseInventory ? pro.inventoryCurrentQty : undefined}
                                                        integerLimit={6}
                                                        decimalLimit={3}
                                                        controls={false}
                                                        className="border-0 align-center w-[60px]"
                                                    />
                                                    <Button
                                                        size="small"
                                                        onClick={() => upProduct(pro)}
                                                        icon={<PlusOutlined/>}
                                                        disabled={isDisabledPlus}
                                                    />
                                                </div>
                                                <div className="flex flex-row items-center"
                                                     onClick={() => openProductOrderForm(pro)}>
                                                    <div
                                                        className={`whitespace-nowrap font-semibold text-base ${hasDiscount ? "text-red" : "text-[#45494E]"}`}>
                                                        {/*{Utils.formatterNumber(pro.subTotalAmount, 2)}*/}
                                                        <NumericFormat value={round(pro.subTotalAmount ?? 0, 2)}
                                                                       displayType="text"
                                                                       thousandSeparator/>
                                                        {" "}{currencyDefault}
                                                    </div>
                                                    {hasTax && (
                                                        <div
                                                            className="ml-1 text-[#636363] leading-3 text-sm font-normal whitespace-nowrap">
                                                            <span>(VAT: {pro.taxPercent}%)</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/*{hasDiscount && (*/}
                                            {/*    <div className="leading-3">*/}
                                            {/*  <span className="text-sm text-[#636363] font-semibold line-through whitespace-nowrap">*/}
                                            {/*    <NumericFormat value={Utils.formatterNumber(pro.discountAmount, 0)} displayType="text"*/}
                                            {/*                   thousandSeparator/>*/}
                                            {/*      {" "}{currencyDefault}*/}
                                            {/*  </span>*/}
                                            {/*    </div>*/}
                                            {/*)}*/}
                                        </div>
                                    </div>
                                </div>

                                <LotInfo/>
                            </div>
                        );
                    })}

                    <ProductOrderForm
                        products={props.products}
                        refreshProductHandler={refreshProduct}
                        ref={productFormRef}
                    ></ProductOrderForm>
                </div>
            </div>

            <div>
                <Collapse
                    onChange={collapseOnChange}
                    items={collapseItems}
                    defaultActiveKey={[]}
                    expandIconPosition="end"
                    className="collapsed-sell-form mx-[-15px] rounded-none border-0"
                ></Collapse>
                {collapsePrice &&
                    <div className="flex justify-between text-xl items-center h-[33px] font-bold">
                        <strong className=''>{t("totalAmount")}</strong>
                        <strong>
                            {Utils.formatterNumber(totalNeedPayment, 0)} {currencyDefault}
                        </strong>
                    </div>}
                <div className="flex">
                    <Form.Item name="status"></Form.Item>
                    {/*Tạm ẩn*/}
                    <div className="flex-1 pr-1 hidden">
                        <Button
                            onClick={() => {
                                props.form.setFieldValue(
                                    "status",
                                    SaleInvoiceStatusEnum.DANG_SOAN
                                );
                                props.form.submit();
                            }}
                            size="large"
                            className="w-full"
                            icon={<QrcodeOutlined/>}
                        >
                            {t("paymentByQr")}
                        </Button>
                    </div>
                    <div className="flex-1 pl-1">
                        <Button
                            onClick={() => {
                                props.form.setFieldValue(
                                    "status",
                                    SaleInvoiceStatusEnum.DA_HOAN_THANH
                                );
                                props.form.submit();
                            }}
                            size="large"
                            className="w-full"
                            type="primary"
                            icon={<WalletIcon/>}
                        >
                            {t("payment")}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
