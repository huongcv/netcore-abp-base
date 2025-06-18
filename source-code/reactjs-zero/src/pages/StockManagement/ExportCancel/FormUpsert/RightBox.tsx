import {IRightBoxProp} from "@pages/StockManagement/Shared/Upsert/Props";
import {useTranslation} from "react-i18next";
import {Col, Form, Row} from "antd";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import React, {useEffect} from "react";
import {observer} from "mobx-react-lite";
import {MoveDateAndMoveCode} from "@pages/StockManagement/Shared/Upsert/right/forms/MoveDateAndMoveCode";
import {MoveType, StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import Utils from "@ord-core/utils/utils";
import StockInitialValueInput from "@pages/StockManagement/Shared/Upsert/right/forms/StockInitialValueInput";
import {MoveTypeHeader} from "@pages/StockManagement/Shared/Upsert/right/MoveTypeHeader";
import {SaveBtnGroup} from "@pages/StockManagement/Shared/Upsert/right/SaveBtnGroup";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {NoteInput} from "@pages/StockManagement/Shared/Upsert/right/forms/NoteInput";
import NumberUtil from "@ord-core/utils/number.util";

const ExportCancelRightBox = (props: IRightBoxProp) => {
    const {formProductItems} = props;
    const [t] = useTranslation('stock');
    const form = Form.useFormInstance();
    const productItems_w = Form.useWatch(StockMoveFormName.ProductItems, formProductItems);
    const inventoryId_w = Form.useWatch('inventoryId', form);
    useEffect(() => {
        let totalAmount = 0;
        const items: {
            totalAmount: number
        }[] = productItems_w || [];
        items.forEach(it => {
            totalAmount = totalAmount + (it.totalAmount || 0);
        });

        totalAmount = Utils.parseFloatWithFixed(totalAmount, 2) || 0;
        form.setFieldValue('totalAmount', totalAmount);
        form.setFieldValue('totalAmountRound', NumberUtil.ceil(totalAmount));

    }, [productItems_w]);
    useEffect(() => {
        if (!form?.getFieldValue('moveHashId')) {
            formProductItems.resetFields();
            formProductItems.setFieldValue(StockMoveFormName.ProductItems, []);
        }
    }, [inventoryId_w]);
    useEffect(() => {
        form.setFieldValue('relatedMoveId', null);
    }, []);
    return (
        <>
            <div className='stock-right'>
                <h3 className={"move-title-header"}>
                    {t("ticketInfo")}
                </h3>
                <Row gutter={16}>
                    <MoveTypeHeader></MoveTypeHeader>
                    <MoveDateAndMoveCode/>
                    <StockInitialValueInput/>
                    <Col span={24}>
                        <FloatLabel label={t('exportOther.totalAmount')}>
                            <Form.Item name={'totalAmountRound'}>
                                <PriceNumberInput disabled></PriceNumberInput>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <NoteInput/>
                </Row>
                <SaveBtnGroup {...props}/>
            </div>
            <div hidden>
                <Form.Item noStyle name={"id"}/>
                <Form.Item noStyle name={"idHash"}/>
                <Form.Item noStyle name={"moveType"} initialValue={MoveType.PhieuXuatHuy}/>
                <Form.Item noStyle name={"moveHashId"}/>
                <Form.Item noStyle name={"moveStatus"}/>
            </div>
        </>
    );
}
export default observer(ExportCancelRightBox);
