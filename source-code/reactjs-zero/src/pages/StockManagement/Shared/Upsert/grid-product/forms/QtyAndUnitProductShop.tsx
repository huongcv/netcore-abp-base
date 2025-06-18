import {Form, FormListFieldData} from "antd";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import React, {useEffect} from "react";
import {useSelectProductUnit} from "@ord-components/forms/select/selectDataSource/useSelectProductUnit";
import {OrderStockMoveDetailDto, ProductSearchWithUnitDto} from "@api/index.defs";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {useTranslation} from "react-i18next";
import Utils from "@ord-core/utils/utils";
import {useUpsertStockMove} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";

const QtyAndUnitProductShop = (props: {
    field: FormListFieldData,
    fieldShop: FormListFieldData,
    productItem: OrderStockMoveDetailDto
}) => {
    const {productItem, field, fieldShop} = props;
    const {formMoveTicket} = useUpsertStockMove();
    const form = Form.useFormInstance();
    const handlerChangeUnit = (v: any, item: any) => {
        form.setFieldValue([StockMoveFormName.ProductItemsFromShop, fieldShop.name, StockMoveFormName.ProductItems, field.name, 'convertRate'], item?.data?.convertRate);
        form.setFieldValue([StockMoveFormName.ProductItemsFromShop, fieldShop.name, StockMoveFormName.ProductItems, field.name, 'unitName'], item?.data?.unitName);
    }
    // const [t] = useTranslation('stock');
    // const listLotNumberCheck_w = Form.useWatch([StockMoveFormName.ProductItemsFromShop,fieldShop.name,StockMoveFormName.ProductItems, field.name, 'listLotNumberCheck']);
    // const lotNumber_w = Form.useWatch([StockMoveFormName.ProductItemsFromShop,fieldShop.name,StockMoveFormName.ProductItems, field.name, 'lotNumber']);
    // const convertRate_w = Form.useWatch([StockMoveFormName.ProductItemsFromShop,fieldShop.name,StockMoveFormName.ProductItems, field.name, 'convertRate']);
    // const unitName_w = Form.useWatch([StockMoveFormName.ProductItemsFromShop,fieldShop.name,StockMoveFormName.ProductItems, field.name, 'unitName']);
    const maxQtyEnable_w = Form.useWatch([StockMoveFormName.ProductItemsFromShop, fieldShop.name, StockMoveFormName.ProductItems, field.name, 'maxQtyEnable']);
    const qty_w = Form.useWatch([StockMoveFormName.ProductItemsFromShop, fieldShop.name, StockMoveFormName.ProductItems, field.name, 'qty']);
    const shopId_w = Form.useWatch([StockMoveFormName.ProductItemsFromShop, fieldShop.name, "shopId"]);
    const relatedMoveId_w = Form.useWatch('relatedMoveId', formMoveTicket);

    const productUnitSelectOption = useSelectProductUnit(productItem?.productId, shopId_w);

    return (<>

        <p hidden>
            <Form.Item noStyle name={[field.name, 'convertRate']}/>
            <Form.Item noStyle name={[field.name, 'checkValidateQyt']} rules={[ValidateUtils.required]}
                       initialValue={'done'}/>
            <Form.Item noStyle name={[field.name, 'maxQtyEnable']} initialValue={Number.MAX_VALUE}>
            </Form.Item>

        </p>
        <div>
            <Form.Item name={[field.name, 'qty']}
                       className='ord-input-bottom-line'
                       rules={[ValidateUtils.mustGreaterThanZero]}>
                <PriceNumberInput min={0} max={maxQtyEnable_w} className={'not-handler-wrap text-right'}/>
            </Form.Item>
        </div>
        <div>
            {
                <Form.Item name={[field.name, 'productUnitId']}
                           className='min-w-[80px] ord-input-bottom-line'
                           rules={[ValidateUtils.requiredShortMess]}>
                    <OrdSelect disabled={!!relatedMoveId_w} datasource={productUnitSelectOption}
                               onChange={handlerChangeUnit}></OrdSelect>
                </Form.Item>
            }
        </div>
        <div>
            {
                (!!maxQtyEnable_w && maxQtyEnable_w > 0 && !!qty_w && qty_w > 0) &&
                <span className='text-red'>
                    {
                        form.getFieldError([StockMoveFormName.ProductItems, field.name, 'checkValidateQyt'])
                    }
                </span>
            }

        </div>
    </>)
}
export default QtyAndUnitProductShop;
