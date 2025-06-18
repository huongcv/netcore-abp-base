import { ProductSearchWithUnitDto, StockProductSelectUnitDto } from "@api/index.defs";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { Form, FormListFieldData, Select } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const QtyAndUnitProduct = (props: {
    field: FormListFieldData,
    productItem: ProductSearchWithUnitDto,
    tdClassName?: string
}) => {
    const { productItem, field, tdClassName } = props;
    const [units, setUnits] = useState<{ value: number, label: string, data: StockProductSelectUnitDto }[]>([]);
    const form = Form.useFormInstance();
    const maxQtyEnable_w = Form.useWatch(['saleInvoiceDetails', field.name, 'maxQtyEnable']);
    const qty_w = Form.useWatch(['saleInvoiceDetails', field.name, 'qty']);
    const units_w = Form.useWatch(['saleInvoiceDetails', field.name, 'units']);
    const { t } = useTranslation('stock');

    const handlerChangeUnit = (v: any, item: any) => {
        form.setFieldValue(['saleInvoiceDetails', field.name, 'convertRate'], item?.data?.convertRate);
        form.setFieldValue(['saleInvoiceDetails', field.name, 'unitName'], item?.data?.unitName);
        form.setFieldValue(['saleInvoiceDetails', field.name, 'price'], item?.data?.price);

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
            <Form.Item noStyle name={[field.name, 'convertRate']} />
            <Form.Item noStyle name={[field.name, 'maxQtyEnable']} initialValue={Number.MAX_VALUE}>
            </Form.Item>

        </p>
        <td className={tdClassName}>
            <Form.Item name={[field.name, 'qty']}
                className='ord-input-bottom-line'
                rules={[ValidateUtils.mustGreaterThanZeroWithText(t('qty'))]}>
                <PriceNumberInput min={0} max={maxQtyEnable_w} className={'not-handler-wrap text-right'} />
            </Form.Item>
            <div>
                {
                    (!!maxQtyEnable_w && maxQtyEnable_w > 0 && !!qty_w && qty_w > 0) &&
                    <span className='text-red'>
                        {
                            form.getFieldError(['saleInvoiceDetails', field.name, 'checkValidateQyt'])
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
                    <Select options={units} className='h-[31px]'
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
