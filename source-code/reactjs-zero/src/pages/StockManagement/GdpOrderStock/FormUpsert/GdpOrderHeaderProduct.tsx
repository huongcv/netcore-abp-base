import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import React from "react";
import {Form} from "antd";
import {HeaderCssProduct} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {observer} from "mobx-react-lite";

const GdpOrderHeaderProduct = () => {
    const {stockMoveStore} = useStore();

    const {t} = useTranslation('gdpOrderStock');
    const tWithMoveType = (name: string) => {
        return t(stockMoveStore.moveType + '.' + name);
    }
    const form = Form.useFormInstance();
    const moveType_w = Form.useWatch('moveType', form);

    const thClassName = HeaderCssProduct;

    return (<>
        <tr>
            <th rowSpan={2} className={thClassName + ' w-[30px] text-center'}>
                #
            </th>
            <th rowSpan={2} className={thClassName}>
                {t('product')}
            </th>
            <th rowSpan={2} className={thClassName + ' text-center'}>
                {t('qtyOrderInfo')}
            </th>
            <th colSpan={4} className={thClassName + ' text-center'}>
                {t('exportInfo')}
            </th>
            <th rowSpan={2} className={thClassName + ' w-[30px] text-right'}>

            </th>
        </tr>
        <tr>
            <th className={thClassName + ' text-center w-[200px]'}>
                {t('expQty')}
            </th>
            <th className={thClassName + ' text-center w-[200px]'}>
                {t('expPrice')}
            </th>
            <th className={thClassName + ' text-center w-[150px]'}>
                {t('discount')}
            </th>
            <th className={thClassName + ' w-[160px] text-right'}>
                {t('expTotalAmount')}
            </th>
        </tr>
    </>);
}
export default observer(GdpOrderHeaderProduct);
