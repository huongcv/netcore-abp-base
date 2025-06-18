import {Form, FormListFieldData, Space} from "antd";
import React, {useEffect, useState} from "react";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import Utils from "@ord-core/utils/utils";
import {PriceCell} from "@ord-components/table/cells/priceCell";

export const QtyInventoryStockWithUnit = (props: {
    qty?: number | null,
    field: FormListFieldData,
    isProductNotUseLotNumber?: boolean
}) => {
    const {field, isProductNotUseLotNumber} = props;
    const [qty, setQty] = useState<number>(0);
    const convertRate_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'convertRate']);
    const unitName_w = Form.useWatch([StockMoveFormName.ProductItems, field.name, 'unitName']);

    useEffect(() => {
        const rate = convertRate_w || 1;
        if (!!props.qty && props.qty > 0) {
            setQty(Utils.parseFloatWithFixed(props.qty / rate, 0) || 0);
        }
    }, [props.qty, convertRate_w]);
    return (<>
        <Space wrap>
           Tồn:
            <span>
                <PriceCell value={qty}/>
                <span className={'ms-1 italic'}>{unitName_w}</span>
            </span>
        </Space>
    </>);
}
