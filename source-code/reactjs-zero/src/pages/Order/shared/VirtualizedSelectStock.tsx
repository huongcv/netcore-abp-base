import { StockHelperService } from "@api/StockHelperService";
import { MOVE_TYPE, ProductUnitViewDto, StockSearchWithUnitCommand } from "@api/index.defs";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import { l } from "@ord-core/language/lang.utils";
import { MoveType } from "@pages/StockManagement/Shared/Const/StockMoveConst";
import { Flex, Select, Tooltip } from "antd";
import debounce from "lodash/debounce";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

const {Option} = Select;
const PAGE_SIZE = 50;

interface VirtualizedSelectStockProps {
    onProductSelected?: (dto: ProductUnitViewDto) => void
}

const VirtualizedSelectStock = (props: VirtualizedSelectStockProps) => {
    const inventoryId_w = 0; 
    const [data, setData] = useState<ProductUnitViewDto[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState("");
    const [t] = useTranslation("stock");
    const location = useLocation();

    useEffect(() => {
        loadData(1, "").then();
    }, []);

    const loadData = async (pageNumber: number, keyword: string) => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const body: StockSearchWithUnitCommand = {
                filter: keyword,
                moveType: getMoveType() as MOVE_TYPE,
                inventoryId: "",
                maxResultCount: PAGE_SIZE,
                skipCount: (pageNumber - 1) * PAGE_SIZE
            };

            const response = await StockHelperService.searchWithUnit({
                body
            })

            const newData = response.items!;

            if (pageNumber === 1) {
                setData(newData);
            } else {
                setData((prevData) => [...prevData, ...newData]);
            }

            if (newData.length === 0) {
                setHasMore(false);
            } else {
                setPage(pageNumber + 1);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePopupScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
            loadData(page, search).then();
        }
    };

    const handleSearch = debounce((value: string) => {
        setSearch(value);
        setPage(1);
        setHasMore(true);
        loadData(1, value).then();
    }, 500);

    const handleSelect = (value: number, option: any) => {
        props.onProductSelected && props.onProductSelected(option.data);
    };

    const getMoveType = (): MOVE_TYPE | number | undefined => {
        let moveType;
        if (location.pathname.includes('/stock/import')) {
            moveType = MoveType.PhieuNhapNhaCungCap;
        } else if (location.pathname.includes('/stock/export-cancel')) {
            moveType = MoveType.PhieuXuatHuy;
        } else if (location.pathname.includes('/stock/transfer')) {
            moveType = MoveType.PhieuDieuChuyen;
        } else if (location.pathname.includes('/stock/check')) {
            moveType = MoveType.PhieuKiemKho;
        }

        return moveType;
    }

    return (
        <Select
            showSearch
            filterOption={false}
            style={{width: "100%"}}
            placeholder={t("searchInputPlaceholderHotKey")}
            onSearch={handleSearch}
            onPopupScroll={handlePopupScroll}
            loading={loading}
            value={null}
            onChange={handleSelect}
        >
            {data.map((item) => (
                <Option key={item.productUnitId} value={item.productUnitId} data={item}>
                    <div className='product-search'>
                        <div>
                            <Flex>
                                <Tooltip title={item.productName}>
                                    <b className='max-w-96 overflow-hidden text-ellipsis'>{item.productName}</b>
                                </Tooltip>
                                {
                                    !!item.unitName && <>
                                        <span className={'ml-2 min-w-[40px]'}>- {item.unitName}</span>
                                    </>
                                }

                            </Flex>
                            <Flex>
                                {
                                    !!item.productCode &&
                                    <span className='inline-block'>{item.productCode} </span>
                                }
                                <span className='inline-block ms-3 '>Tồn: {item.inventoryQty} </span>
                                {
                                    !!item.price &&
                                    <p className={'ms-3 italic'}>
                            <span>
                            {l.transCommon('price')}:
                            </span>
                                        <span className={'ms-1'}>
                                    <PriceCell value={item.price} fixed={0}/>
                                </span>
                                    </p>
                                }
                            </Flex>
                        </div>
                    </div>
                </Option>
            ))}
        </Select>
    );
};

export default VirtualizedSelectStock;
