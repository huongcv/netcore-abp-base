import DateUtil from "@ord-core/utils/date.util";
import React from "react";
import {ImportStockMoveDetailDto} from "@api/index.defs";
import {useTranslation} from "react-i18next";

export const StockMoveDetail_ProductColumn = (props: {
    dto: ImportStockMoveDetailDto
}) => {
    const {t} = useTranslation('stock');
    const {dto} = props;
    const {productDetail} = dto;
    return <>
        {
            productDetail &&
            <>
                <div>
                    <span className='font-semibold'>{productDetail.productName}</span>
                </div>
                {
                    dto.lotNumber &&
                    <div className='mt-1'>
                        <span>{t('lotNumber')}:</span>
                        <span
                            className='italic me-2 ms-1'>{dto.lotNumber} - {DateUtil.showWithFormat(dto.expiryDate)} </span>
                    </div>
                }
            </>
        }
    </>
}
