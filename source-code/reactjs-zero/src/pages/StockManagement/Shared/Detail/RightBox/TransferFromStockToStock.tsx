import {TransferStockMoveDto} from "@api/index.defs";
import {useTranslation} from "react-i18next";
import React from "react";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import {useSelectShop} from "@ord-components/forms/select/selectDataSource/useSelectShop";

export const TransferFromStockToStock = (props: {
    moveDto?: TransferStockMoveDto | null,
}) => {
    const {t} = useTranslation(['stock-detail']);
    const {moveDto} = props;
    return (<>
        <tr>
            <td>
                {t('transfer.fromShop')}
            </td>
            <td className='text-right infor-col'>
                <DisplayTextFormSelectDataSource value={moveDto?.shopId}
                                                 datasource={useSelectShop()}></DisplayTextFormSelectDataSource>
            </td>
        </tr>
        {/*   <tr className={'text-red'}>
                        <td>
                            {t('transfer.fromStock')}
                        </td>
                        <td className='text-right infor-col'>
                            <DisplayTextFormSelectDataSource value={moveDto?.inventoryId}
                                                             datasource={useSelectStockByShopId(moveDto?.shopId || 0)}></DisplayTextFormSelectDataSource>
                        </td>
                    </tr>*/}
        <tr>
            <td>
                {t('transfer.toShop')}
            </td>
            <td className='text-right infor-col'>
                <DisplayTextFormSelectDataSource value={moveDto?.relatedShopId}
                                                 datasource={useSelectShop()}></DisplayTextFormSelectDataSource>
            </td>
        </tr>
        {/* <tr className={'text-green-500'}>
                        <td>
                            {t('transfer.toStock')}
                        </td>
                        <td className='text-right infor-col'>
                            <DisplayTextFormSelectDataSource value={moveDto?.relatedInventoryId}
                                                             datasource={useSelectStockByShopId(moveDto?.relatedShopId || 0 as any)}></DisplayTextFormSelectDataSource>
                        </td>
                    </tr>*/}
    </>);
}
