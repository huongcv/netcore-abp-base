import {StockMovePagedOutputDto, TransferStockMoveDto} from "@api/index.defs";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import {useSelectShop} from "@ord-components/forms/select/selectDataSource/useSelectShop";
import React from "react";
import {useSelectStockByShopId} from "@ord-components/forms/select/selectDataSource/useSelectStock";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";

export const ImportStockTransferCell = (props: {
    moveDto?: StockMovePagedOutputDto | null,
}) => {
    const {moveDto} = props;
    return (
        <>
            {
                !!moveDto && moveDto.moveType === MoveType.PhieuDieuChuyen ?

                    <>
                        {moveDto?.relatedShopName}
                    </>
                    :
                    <>
                        {moveDto?.shopName}
                    </>
            }
        </>
    );
}
