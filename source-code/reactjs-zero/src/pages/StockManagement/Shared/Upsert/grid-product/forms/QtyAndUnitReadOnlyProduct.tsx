import {Form, FormListFieldData, Space} from "antd";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";

import {MoveType, StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {useUpsertStockMove} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";

const QtyAndUnitReadOnlyProduct = (props: {
    field: FormListFieldData
}) => {
    const {field} = props;
    const {editData} = useUpsertStockMove();
    const unitName_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'unitName']);
    const maxQtyEnable_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'maxQtyEnable']);
    return (<>
        <Space.Compact>
            <Form.Item noStyle hidden name={[field.name, 'convertRate']}/>
            <Form.Item noStyle name={[field.name, 'maxQtyEnable']} hidden />
            <Form.Item name={[field.name, 'qty']}
                       className='ord-input-bottom-line'
                       rules={[ValidateUtils.mustGreaterThanZero]}>
                <PriceNumberInput
                    disabled={editData?.moveDto?.moveType === MoveType.PhieuXuatTraNhaCungCap}
                                  min={0} max={maxQtyEnable_w} className={'not-handler-wrap text-right'}/>
            </Form.Item>
            <span className={'italic ms-1 mt-1'}>{unitName_w}</span>
        </Space.Compact>
        {
            !!maxQtyEnable_w && maxQtyEnable_w > 0 &&
            <div className={'text-red text-end'}>
                <span>/ {maxQtyEnable_w} </span>
                <span className={'italic ms-1'}>{unitName_w}</span>
            </div>
        }
    </>)
}
export default QtyAndUnitReadOnlyProduct;
