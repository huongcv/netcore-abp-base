import {Form, Row} from "antd";
import {useTranslation} from "react-i18next";
import React from "react";
import '../../Shared/Upsert/index.scss';
import {observer} from "mobx-react-lite";
import {useStore} from "@ord-store/index";
import {NoteInput} from "@pages/StockManagement/Shared/Upsert/right/forms/NoteInput";
import {IRightBoxProp} from "@pages/StockManagement/Shared/Upsert/Props";
import {SaveBtnGroup} from "@pages/StockManagement/Shared/Upsert/right/SaveBtnGroup";
import {MoveDateAndMoveCode} from "@pages/StockManagement/Shared/Upsert/right/forms/MoveDateAndMoveCode";
import {useUpsertStockMove} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import {MoveTypeHeader} from "@pages/StockManagement/Shared/Upsert/right/MoveTypeHeader";
import StockInitialValueInput from "@pages/StockManagement/Shared/Upsert/right/forms/StockInitialValueInput";

const CheckStockRightBox = (props: IRightBoxProp) => {
    const {formMoveTicket, editData} = useUpsertStockMove();
    const [t] = useTranslation('stock');
    const {stockMoveStore, sessionStore} = useStore();
    const form = Form.useFormInstance();
    const moveType_w = Form.useWatch('moveType', form);
    const moveHashId_w = Form.useWatch('moveHashId', form);
    return (
        <div className='stock-right'>
            <Row gutter={16}>
                <MoveTypeHeader/>
                <StockInitialValueInput/>
                <MoveDateAndMoveCode/>
                <NoteInput/>
            </Row>
            <SaveBtnGroup {...props}/>

        </div>
    );
}
export default observer(CheckStockRightBox);
