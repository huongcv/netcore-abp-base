import {Form} from "antd";
import React from "react";
import '../../Shared/Upsert/index.scss';
import {observer} from "mobx-react-lite";
import {IRightBoxProp} from "@pages/StockManagement/Shared/Upsert/Props";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import ExportReturnSupplierRightBox from "@pages/StockManagement/ExportStock/FormUpsert/return-supplier/RightBox";
import {useUpsertStockMove} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import {MoveTypeHeader} from "@pages/StockManagement/Shared/Upsert/right/MoveTypeHeader";

const ExportRightBox = (props: IRightBoxProp) => {
    const {formMoveTicket, formProductItems, editData} = useUpsertStockMove();
    const moveType_w = Form.useWatch('moveType', formMoveTicket);

    return (
        <>
            <MoveTypeHeader/>
            {
                moveType_w == MoveType.PhieuXuatTraNhaCungCap &&
                <ExportReturnSupplierRightBox {...props}/>
            }
        </>

    );
}
export default observer(ExportRightBox);
