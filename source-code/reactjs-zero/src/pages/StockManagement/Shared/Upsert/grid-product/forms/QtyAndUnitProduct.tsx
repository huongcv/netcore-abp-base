import {Form, FormListFieldData, Select} from "antd";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import {ProductSearchWithUnitDto, StockProductSelectUnitDto} from "@api/index.defs";
import {MoveType, StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {useUpsertStockMove} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";

const QtyAndUnitProduct = (props: {
    field: FormListFieldData,
    productItem: ProductSearchWithUnitDto,
    tdClassName?: string
}) => {
    const {productItem, field, tdClassName} = props;
    const {formMoveTicket} = useUpsertStockMove();
    const [units, setUnits] = useState<{ value: number, label: string, data: StockProductSelectUnitDto }[]>([]);
    const form = Form.useFormInstance();
    const maxQtyEnable_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'maxQtyEnable']);
    const qty_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'qty']);
    const costPrice_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'costPrice']);
    const latestImportPrice_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'latestImportPrice']);
    const units_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'units']);
    const relatedMoveId_w = Form.useWatch('relatedMoveId', formMoveTicket);
    const {t} = useTranslation('stock');

    const handlerChangeUnit = (v: any, item: any) => {
        form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'convertRate'], item?.data?.convertRate);
        form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'unitName'], item?.data?.unitName);

        // khi thay doi don vi tinh thi thay doi gia cua san pham theo don vi quy doi
        const moveTypes = [MoveType.PhieuNhapNhaCungCap, MoveType.PhieuNhapTon,
            MoveType.PhieuXuatHuy, MoveType.PhieuDieuChuyen];
        const moveType = +(formMoveTicket.getFieldValue('moveType') ?? 0);
        if (moveTypes.includes(moveType)) {
            //neu la nhap ncc, nhap ton => lay gia = gia nhap gan nhat * ty le quy doi
            if (moveType === MoveType.PhieuNhapNhaCungCap || moveType === MoveType.PhieuNhapTon) {
                form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'price'], (item?.data.latestImportPrice || 0));
            } else {
                //gia = gia von * ty le quy doi
                form.setFieldValue([StockMoveFormName.ProductItems, field.name, 'price'], item?.data.costPrice);
            }
        }
    }

    useEffect(() => {
        if (!!units_w) {
            setUnits(units_w.map((x: StockProductSelectUnitDto) => ({
                value: x.productUnitId,
                label: x.unitName || " ",
                data: x
            })));
        }
    }, [units_w]);

    return (<>
        <p hidden>
            <Form.Item noStyle name={[field.name, 'convertRate']}/>
            <Form.Item noStyle name={[field.name, 'maxQtyEnable']} initialValue={Number.MAX_VALUE}>
            </Form.Item>

        </p>
        <td className={tdClassName}>
            <Form.Item name={[field.name, 'qty']}
                       className='ord-input-bottom-line'
                       rules={[ValidateUtils.mustGreaterThanZeroWithText(t('qty'))]}>
                <PriceNumberInput min={0} max={maxQtyEnable_w} className={'not-handler-wrap text-right'}/>
            </Form.Item>
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
        </td>
        <td className={tdClassName}>
            {
                productItem.unitName &&
                <Form.Item name={[field.name, 'productUnitId']}
                           className='min-w-[80px] ord-input-bottom-line'
                           rules={[ValidateUtils.requiredShortMess]}>
                    <Select options={units} className='h-[31px]' disabled={!!relatedMoveId_w}
                            onChange={handlerChangeUnit}></Select>
                </Form.Item>
            }
        </td>
        <div hidden>
            <Form.Item name={[field.name, 'units']}>
            </Form.Item>
        </div>
    </>)
}
export default QtyAndUnitProduct;
