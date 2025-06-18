import {Form, FormListFieldData} from "antd";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import React, {useEffect} from "react";
import {useSelectProductUnit} from "@ord-components/forms/select/selectDataSource/useSelectProductUnit";
import {GdpOrderStockMoveDetailDto, ProductSearchWithUnitDto} from "@api/index.defs";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {useTranslation} from "react-i18next";
import Utils from "@ord-core/utils/utils";
import {useUpsertStockMove} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";

const GdpQtyAndUnitProduct = (props: {
    field: FormListFieldData,
    productItem: GdpOrderStockMoveDetailDto
}) => {
    const {productItem, field} = props;
    const {formMoveTicket} = useUpsertStockMove();
    const productUnitSelectOption = useSelectProductUnit(productItem?.productId);
    const form = Form.useFormInstance();
    const handlerChangeUnit = (v: any, item: any) => {
        form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'convertRate'], item?.data?.convertRate);
        form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'unitName'], item?.data?.unitName);
    }
    const [t] = useTranslation('stock');
    const listLotNumberCheck_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'listLotNumberCheck']);
    const lotNumber_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'lotNumber']);
    const convertRate_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'convertRate']);
    const unitName_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'unitName']);
    const maxQtyEnable_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'maxQtyEnable']);
    const qty_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'qty']);
    const relatedMoveId_w = Form.useWatch('relatedMoveId', formMoveTicket);
    useEffect(() => {
        if (!!listLotNumberCheck_w && !!convertRate_w) {
            const lotItems: any[] = listLotNumberCheck_w || [];
            if (lotItems.length > 0) {
                let lotItem = lotItems[0];
                if (productItem?.isProductUseLotNumber === true) {
                    lotItem = lotItems.find(x => x.lotNumber == lotNumber_w);
                }
                if (lotItem) {
                    const maxQtyEnable = Utils.parseFloatWithFixed(lotItem.qty / convertRate_w, 0) || Number.MAX_VALUE;
                    form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'maxQtyEnable'], maxQtyEnable);
                    if (qty_w > maxQtyEnable) {
                        form.setFields([
                            {
                                name: [StockMoveFormName.ProductItems, field.name, 'checkValidateQyt'],
                                errors: [t('qtyInvalidNotEnough')],
                                value: null,
                            },
                        ]);
                    } else {
                        form.setFields([
                            {
                                name: [StockMoveFormName.ProductItems, field.name, 'checkValidateQyt'],
                                errors: [],
                                value: 'done'
                            },
                        ]);
                    }
                }

            }

        }
    }, [listLotNumberCheck_w, lotNumber_w, convertRate_w, unitName_w, qty_w]);


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
                    <OrdSelect datasource={productUnitSelectOption}
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
export default GdpQtyAndUnitProduct;
