import React, {memo, useEffect, useRef, useState} from 'react';
import {FoodGridDto} from "@api/index.defs";
import {OrderRestaurantService} from "@api/OrderRestaurantService";
import UiUtils from "@ord-core/utils/ui.utils";
import InfiniteScroll from "react-infinite-scroll-component";
import {Spin} from "antd";
import CardFoodOrder from "@pages/2.Restaurant/Order/Foods/CardFoodOrder";
import {orderFilterStore} from "@ord-store/Restaurant/Order/OrderFilterStore";
import {observer} from "mobx-react-lite";

const GridFoodOrder = () => {
    const [foods, setFoods] = useState<FoodGridDto[]>([]);
    const [page, setPage] = useState(1);
    const pageSizeRef = useRef<number>(28);
    const [hasMore, setHasMore] = useState(true);

    const loadMore = async (pageNumber: number) => {
        if (!orderFilterStore.priceListId) {
            return;
        }

        const response = await OrderRestaurantService.getFoodGrid({
            body: {
                filter: orderFilterStore.filterFood || '',
                priceListId: orderFilterStore.priceListId || null,
                productGroupId: orderFilterStore.productGroupId as any,
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

        setFoods(prev => [...prev, ...response.data!.items!]);
        setPage(prev => prev + 1);
    };

    const refresh = async () => {
        setPage(1);
        setFoods([]);
        await loadMore(1);
    }

    useEffect(() => {
        refresh();
    }, [orderFilterStore.filterFood, orderFilterStore.productGroupId, orderFilterStore.priceListId])

    // console.log('GridFoodOrder')

    return (
        <InfiniteScroll
            dataLength={foods.length}
            next={() => loadMore(page)}
            hasMore={hasMore}
            loader={<div className={"text-center"}>
                <Spin/>
            </div>}
            className='hide-scrollbar'
            height={"calc(100vh - 264px)"}
        >
            {
                !!foods.length && (
                    <div className='grid gap-4 2xl:grid-cols-7 grid-cols-4'>
                        {
                            foods.map((table: FoodGridDto, index: number) => <div key={table.productId || index}>
                                <CardFoodOrder data={table as any}/>
                            </div>)
                        }
                    </div>
                )
            }
        </InfiniteScroll>
    );
};

export default memo(observer(GridFoodOrder));