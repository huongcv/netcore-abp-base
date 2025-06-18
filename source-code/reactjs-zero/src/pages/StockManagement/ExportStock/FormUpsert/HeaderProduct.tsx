import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import React from "react";
import {Form} from "antd";
import {HeaderCssProduct, MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {observer} from "mobx-react-lite";
import {useUpsertStockMove} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";

const ExportHeaderProduct = () => {
    const {stockMoveStore} = useStore();
    const {formMoveTicket} = useUpsertStockMove();

    const {t} = useTranslation('stock');
    const tWithMoveType = (name: string) => {
        return t(stockMoveStore.moveType + '.' + name);
    }
    const form = Form.useFormInstance();
    const moveType_w = Form.useWatch('moveType', formMoveTicket);

    const thClassName = HeaderCssProduct;

    return (<>

        <th className={thClassName + ' w-[30px] text-center'}>
            #
        </th>
        <th className={thClassName}>
            {t('product')}
        </th>
        {
            moveType_w == MoveType.PhieuXuatHuy
            &&
            <>
                <th className={thClassName + ' w-[90px] text-center'}>
                    {t('qty')}
                </th>
                <th className={thClassName + ' w-[100px] text-center'}>
                    {t('unit')}
                </th>
                <th className={thClassName + ' w-[200px] text-center'}>
                    {t('cancelReason')}
                </th>
                <th className={thClassName + ' w-[120px] text-right'}>
                    {t('costPrice')}
                </th>
                <th className={thClassName + ' w-[160px] text-right'}>
                    {t('exportOther.totalAmount')}
                </th>
            </>
        }
        {
            moveType_w == MoveType.PhieuXuatTraNhaCungCap &&
            <>
            <th className={thClassName + ' w-[90px] text-center'}>
                    {t('qty')}
                </th>
                <th className={thClassName + ' w-[100px] text-center'}>
                    {tWithMoveType('price')}
                </th>
                <th className={thClassName + ' w-[150px] text-center'}>
                    {t('discount')}
                </th>
                <th className={thClassName + ' w-[120px] text-center'}>
                    {t('vat')}
                </th>
                <th className={thClassName + ' w-[150px] text-right'}>
                    {t('totalAmount2')}
                </th>
            </>
        }

        <th className={thClassName + ' w-[30px] text-right'}>

        </th>
    </>);
}
export default observer(ExportHeaderProduct);
