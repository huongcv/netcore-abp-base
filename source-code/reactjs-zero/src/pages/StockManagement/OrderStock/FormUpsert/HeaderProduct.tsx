import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import React from "react";
import {Form} from "antd";
import {HeaderCssProduct} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {observer} from "mobx-react-lite";

const OrderHeaderProduct = () => {
    const {stockMoveStore} = useStore();

    const {t} = useTranslation('orderStock');
    const tWithMoveType = (name: string) => {
        return t(stockMoveStore.moveType + '.' + name);
    }
    const form = Form.useFormInstance();
    const moveType_w = Form.useWatch('moveType', form);

    const thClassName = HeaderCssProduct;

    return (<>
        <th className={thClassName + ' w-[30px] text-center'}>
            #
        </th>
        <th className={thClassName}>
            {t('product')}
        </th>
        <th className={thClassName + ' w-[200px]'}>
            {t('transferQty')}
        </th>
        <th className={thClassName + ' w-[200px] text-right'}>
            {t('transferPrice')}
        </th>
        <th className={thClassName + ' w-[160px] text-right'}>
            {t('transferTotalAmount')}
        </th>

        <th className={thClassName + ' w-[30px] text-right'}>

        </th>
    </>);
}
export default observer(OrderHeaderProduct);
