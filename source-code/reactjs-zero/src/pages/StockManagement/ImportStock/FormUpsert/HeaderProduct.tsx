import React from "react";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";

export const ImportProductHeaderTable = () => {
    const {stockMoveStore} = useStore();
    const {t} = useTranslation('stock');
    const tWithMoveType = (name: string) => {
        return t(stockMoveStore.moveType + '.' + name);
    }
    const thClassName = "py-2 px-1 border-b border-gray-200 text-left text-gray-600";

    return (<>
        <th className={thClassName + ' w-[30px] text-center'}>
            #
        </th>
        <th className={thClassName + ' w-[200px]'}>
            {t('product')}
        </th>
        {/*<th className={thClassName + ' w-[300px]'}>*/}
        {/*    {t('unitCol')}*/}
        {/*</th>*/}
        <th className={thClassName + ' w-[80px] text-right'}>
            {t('qty')}
        </th>
        <th className={thClassName + ' w-[100px]'}>
            {t('unit')}
        </th>
        <th className={thClassName + ' w-[150px] text-right'}>
            {tWithMoveType('price')}
        </th>
        <th className={thClassName + ' w-[150px] text-center'}>
            {t('discount')}
        </th>
        <th className={thClassName + ' w-[120px] text-center'}>
            {t('vat')}
        </th>
        <th className={thClassName + ' w-[150px] text-right'}>
            {t('totalAmountDetail')}
        </th>
        <th className={thClassName + ' w-[30px] text-right'}>
        </th>
    </>);
}
