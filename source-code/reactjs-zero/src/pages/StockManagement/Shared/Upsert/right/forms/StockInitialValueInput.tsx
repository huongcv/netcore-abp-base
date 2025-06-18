import {Form} from "antd";
import React, {useEffect} from "react";
import {observer} from "mobx-react-lite";
import {useSelectStock} from "@ord-components/forms/select/selectDataSource/useSelectStock";

const StockInitialValueInput = () => {
    const form = Form.useFormInstance();
    // const inventoryId_w = Form.useWatch('inventoryId', form);
    // const moveHashId_w = Form.useWatch('moveHashId', form);
    // const relatedMoveId_w = Form.useWatch('relatedMoveId', form);
    // const moveType_w = Form.useWatch('moveType', form);
    // const [t] = useTranslation('stock');
    // const {stockMoveStore} = useStore();
    // const tWithMoveType = (name: string) => {
    //     return t(stockMoveStore.moveType + '.' + name);
    // }
    const stockList = useSelectStock();
    useEffect(() => {
        if (stockList && !!stockList.data && stockList.data.length > 0) {
            form.setFieldValue('inventoryId', stockList.data[0].value);
        }
    }, [stockList]);

    // const [hiddenAddNewBtn, setHiddenAddNewBtn] = useState<boolean>(true);
    // useEffect(() => {
    //     if (moveType_w &&
    //         (moveType_w == MoveType.PhieuNhapNhaCungCap
    //             || moveType_w == MoveType.PhieuNhapTon)) {
    //         setHiddenAddNewBtn(false);
    //     }
    // }, [moveType_w]);

    return (<div hidden>
            <Form.Item name={'inventoryId'}></Form.Item>

        {/*<Col span={24}>*/}
        {/*    <FloatLabel label={tWithMoveType('InventoryId')} required>*/}
        {/*        <Form.Item name={'inventoryId'} rules={[ValidateUtils.requiredShortMess]}*/}
        {/*                   initialValue={defaultInventoryId}>*/}
        {/*            <StockInput disabled={moveHashId_w || relatedMoveId_w} hiddenAddNewBtn={hiddenAddNewBtn}/>*/}
        {/*        </Form.Item>*/}
        {/*    </FloatLabel>*/}
        {/*</Col>*/}
    </div>);
}
export default observer(StockInitialValueInput);
