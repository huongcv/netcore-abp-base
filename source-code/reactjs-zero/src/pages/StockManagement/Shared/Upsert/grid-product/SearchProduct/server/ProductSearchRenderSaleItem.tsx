import { ProductSearchWithUnitDto } from "@api/index.defs";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import { l } from "@ord-core/language/lang.utils";
import Utils from "@ord-core/utils/utils";
import { Flex, Tooltip } from "antd";


export const ProductSearchRenderSaleItem = (dto: ProductSearchWithUnitDto) => ({
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
                    {
                        !!dto.unitName && <>
                            <span className={'ml-2 min-w-[40px]'}>- {dto.unitName}</span>
                        </>
                    }

                </Flex>
                <Flex>
                    {
                        !!dto.productCode &&
                        <span className='inline-block'>{dto.productCode} </span>
                    }
                    <span className='inline-block ms-3 '>Tồn: {dto.inventoryQty ?? 0} </span>
                    {
                        (!!dto.productPriceByPriceList || !!dto.price) && 
                        <p className={'ms-3 italic'}>
                            <span>
                            {l.transCommon('price')}:
                            </span>
                            <span className={'ms-1'}>
                                    <PriceCell value={dto.productPriceByPriceList ?? dto.price ?? 0} fixed={0}/>
                                </span>
                        </p>
                    }

                </Flex>
            </div>
        </div>

    ),
});

