import React, {memo, useDeferredValue, useEffect, useRef, useState} from 'react';
import {Spin} from "antd";
import CardTable from "@pages/2.Restaurant/Order/Tables/CardTableOrder";
import InfiniteScroll from "react-infinite-scroll-component";
import {OrderRestaurantService} from "@api/OrderRestaurantService";
import UiUtils from "@ord-core/utils/ui.utils";
import {TableGridDto} from "@api/index.defs";
import {orderFilterStore} from "@ord-store/Restaurant/Order/OrderFilterStore";
import {observer} from "mobx-react-lite";

const GridCardTableOrder = () => {
    const [tables, setTables] = useState<TableGridDto[]>([]);
    const tablesRender = useDeferredValue<TableGridDto[]>(tables)
    const [page, setPage] = useState(1);
    const pageSizeRef = useRef<number>(20);
    const [hasMore, setHasMore] = useState(true);

    const loadMore = async (pageNumber: number) => {
        const response = await OrderRestaurantService.getTableGrid({
            body: {
                filter: orderFilterStore.filterTable || '',
                areaId: orderFilterStore.areaId as any,
                maxResultCount: pageSizeRef.current,
                skipCount: (pageNumber - 1) * pageSizeRef.current
            }
        });

        if (!response.isSuccessful) {
            UiUtils.showError(response.message);
            return;
        }

        if ((pageNumber - 1) * pageSizeRef.current + pageSizeRef.current >= +response.data!.totalCount!) {
            setHasMore(false);
        }

        setTables(prev => [...prev, ...response.data!.items!]);
        setPage(prev => prev + 1);
    };

    const refresh = async () => {
        setPage(1);
        setTables([]);
        await loadMore(1);
    }

    useEffect(() => {
        // console.log('GridCardTableOrder refresh')
        refresh();
    }, [orderFilterStore.timeStampTableFilter])


    // console.log('GridCardTableOrder')

    return (
        <InfiniteScroll
            dataLength={tables.length}
            next={() => loadMore(page)}
            hasMore={hasMore}
            loader={<div className={"text-center"}>
                <Spin/>
            </div>}
            className='hide-scrollbar'
            height={"calc(100vh - 254px)"}
        >
            {
                !!tablesRender.length && (
                    <div className='grid gap-4 2xl:grid-cols-5 grid-cols-4'>
                        {
                            tables.map((table: TableGridDto, index: number) => <div key={table.tableId || index}>
                                <CardTable data={table as any}/>
                            </div>)
                        }
                    </div>
                )
            }
        </InfiniteScroll>
    );
};

export default memo(observer(GridCardTableOrder));