import {Col, Form, Row} from "antd";
import {useTranslation} from "react-i18next";
import React, {useEffect} from "react";
import '../../Shared/Upsert/index.scss';
import {observer} from "mobx-react-lite";
import {useStore} from "@ord-store/index";
import {NoteInput} from "@pages/StockManagement/Shared/Upsert/right/forms/NoteInput";
import {IRightBoxProp} from "@pages/StockManagement/Shared/Upsert/Props";
import {SaveBtnGroup} from "@pages/StockManagement/Shared/Upsert/right/SaveBtnGroup";
import {useUpsertStockMove} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import Utils from "@ord-core/utils/utils";
import {MoveTypeHeader} from "@pages/StockManagement/Shared/Upsert/right/MoveTypeHeader";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdInputRegexText from "@ord-components/forms/OrdInputRegexText";
import RegexUtil from "@ord-core/utils/regex.util";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectPaymentMethod} from "@ord-components/forms/select/selectDataSource/useSelectPaymentMethod";
import {PaymentMethodEnum} from "@pages/SalesInvoice/Form/paymentMethodForm";

const GdpOrderRightBox = (props: IRightBoxProp) => {
    const {formMoveTicket, editData, formProductItems} = useUpsertStockMove();
    const [t] = useTranslation('orderStock');
    const {stockMoveStore, sessionStore} = useStore();

    const tWithMoveType = (name: string) => {
        return t(stockMoveStore.moveType + '.' + name);
    }
    const form = Form.useFormInstance();
    const moveHashId_w = Form.useWatch('moveHashId', form);
    const productItems_w = Form.useWatch(StockMoveFormName.ProductItemsFromShop, formProductItems);
    useEffect(() => {
        let totalAmount = 0;
        const items: {
            [StockMoveFormName.ProductItems]: [
                {
                    totalAmount: number
                }
            ]
        }[] = productItems_w || [];
        items.forEach(itR => {
            itR[StockMoveFormName.ProductItems].forEach(it => {
                totalAmount = totalAmount + (it.totalAmount || 0);
            });
        });
        form.setFieldValue('totalAmount', Utils.parseFloatWithFixed(totalAmount));
    }, [productItems_w]);
    const today = new Date();
    return (
        <div className='stock-right'>
            <Row gutter={16}>
                <MoveTypeHeader/>
                <Col span={24}>
                    <FloatLabel label={t('orderDate')}>
                        <Form.Item name={'orderDate'} rules={[ValidateUtils.requiredShortMess]}
                                   initialValue={today}>
                            <OrdDateInput disabled/>
                        </Form.Item>
                    </FloatLabel>
                </Col>

                <Col span={24}>
                    <FloatLabel label={t('desiredDeliveryDate')}>
                        <Form.Item name={'desiredDeliveryDate'}>
                            <OrdDateInput disabled/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={24}>
                    <FloatLabel label={t('orderCode')}>
                        <Form.Item name={'orderCode'}>
                            <OrdInputRegexText disabled regex={RegexUtil.CodeRegex}/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                {/*<Col span={24}>*/}
                {/*    <FloatLabel label={t('paymentMethod')}>*/}
                {/*        <Form.Item name={'paymentMethod'}*/}
                {/*                   initialValue={PaymentMethodEnum.TIEN_MAT}*/}
                {/*                   rules={[ValidateUtils.required]}>*/}
                {/*            <OrdSelect allowClear datasource={useSelectPaymentMethod()}/>*/}
                {/*        </Form.Item>*/}
                {/*    </FloatLabel>*/}
                {/*</Col>*/}
                <NoteInput disabled={true}/>
                <Col span={24}>
                    <table className='box-price-move-tbl w-full'>
                        <tbody>
                        <tr style={{width: 120}}>
                            <td>
                                {t('orderStock.totalAmount')}
                            </td>
                            <td className='text-right number-readonly'>
                                <Form.Item name={'totalAmount'}>
                                    <PriceNumberInput disabled></PriceNumberInput>
                                </Form.Item>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </Col>
            </Row>
            <SaveBtnGroup {...props}/>

        </div>
    );
}
export default observer(GdpOrderRightBox);
