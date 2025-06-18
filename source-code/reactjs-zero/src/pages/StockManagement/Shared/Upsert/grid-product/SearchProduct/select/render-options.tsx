import {ProductFromInventoryWithUnitDto, ProductSearchWithUnitDto} from "@api/index.defs";
import Utils from "@ord-core/utils/utils";
import {Flex, Tooltip} from "antd";
import {l} from "@ord-core/language/lang.utils";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import React from "react";
import DateUtil from "@ord-core/utils/date.util";
import {isNumber} from "lodash";

export const ProductSearchSelectRenderItem = (dto: ProductSearchWithUnitDto) => ({
    value: '' + dto.productUnitId,
    data: dto,
    fts: Utils.toLowerCaseNonAccentVietnamese(dto.productCode) + ' ' + Utils.toLowerCaseNonAccentVietnamese(dto.productName),
    label: (
        <div className='product-search'>
            <div>
                <Flex>
                    <Tooltip title={dto.productName}>
                        <b className='max-w-96 overflow-hidden text-ellipsis'>{dto.productName}</b>
                    </Tooltip>
                    <span className='text-primary ms-2 inline'>{dto.productCode}</span>
                </Flex>
                <Flex>
                    {
                        !!dto.unitName && <>
                            <b className={'text-primary min-w-[40px]'}>{dto.unitName}</b>
                        </>
                    }


                    {
                        dto.price &&
                        <p className={'ms-3 italic'}>
                            <span>
                            {l.transCommon('price')}:
                            </span>
                            <span className={'ms-1'}>
                                    <PriceCell value={dto.price} fixed={0}/>
                                </span>
                        </p>
                    }

                </Flex>
            </div>
        </div>

    ),
});


export const ProductFromInventorySearchSelectRenderItem = (dto: ProductFromInventoryWithUnitDto) => ({
    value: '' + dto.rowkey,
    data: dto,
    fts: Utils.toLowerCaseNonAccentVietnamese(dto.productCode) + ' ' + Utils.toLowerCaseNonAccentVietnamese(dto.productName),
    label: (
        <div className='product-search'>
            <div>
                <Flex>
                    <b>{dto.productName}</b>
                    <span className='text-primary ms-2 inline'>{dto.productCode}</span>
                </Flex>
                <Flex>
                    {dto.lotNumber && <span className='mr-1.5'>{l.transCommon('lotNumber')}:
                        <strong className={'text-primary min-w-[40px]'}> {dto.lotNumber}</strong>
                    </span>}
                    {dto.expiryDate && <span className='ml-1.5'>{l.transCommon('expiryDate')}:<strong
                        className={'text-primary min-w-[40px]'}> {DateUtil.showWithFormat(dto.expiryDate)}</strong>
                    </span>}

                </Flex>
                <Flex>
                    {isNumber(dto.qty) && dto.qty > 0 && <span>{l.transCommon('qty')}:<strong
                        className={'text-primary min-w-[40px] mr-1'}> {dto.qty} </strong>
                    </span>}
                    {
                        !!dto.unitName && <>
                            <strong className={'text-primary min-w-[40px]'}>{dto.unitName}</strong>
                        </>
                    }


                    {
                        dto.price &&
                        <p className={'ms-3 italic'}>
                            <span>
                            {l.transCommon('costPrice')}:
                            </span>
                            <span className={'ms-1'}>
                                    <PriceCell value={dto.costPrice} fixed={0}/>
                                </span>
                        </p>
                    }

                </Flex>
            </div>
        </div>

    ),
});

