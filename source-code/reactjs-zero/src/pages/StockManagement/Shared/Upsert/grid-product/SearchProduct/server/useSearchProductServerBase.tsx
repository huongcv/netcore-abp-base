import { useEffect, useState } from "react";
import Utils from "@ord-core/utils/utils";
import { MoveType } from "@pages/StockManagement/Shared/Const/StockMoveConst";
declare var ord: any;
/**
 * Hook cơ bản dùng chung cho việc tìm kiếm sản phẩm.
 */
export const useSearchProductServerBase = (
    searchValue: string,
    focusReady: boolean,
    loadMore: number,
    fetchApi: (body: any) => Promise<any>,
    extraParams: Record<string, any> = {},
    renderItem: (item: any) => any
) => {
    const MAX_RESULT = 20;
    const GET_ALL_IF = 200;

    const [data, setData] = useState<any[]>([]);
    const [dataSearchClient, setDataSearchClient] = useState<any[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [isSearchOnClient, setSearchOnClient] = useState(false);
    const [dataNotFull, setDataNotFull] = useState(false);


    const fetchData = async (isLoadMore: boolean) => {
        setIsPending(true);
        try {
            const skipCount = isLoadMore ? data.length : 0;
            const requestBody = {
                filter: searchValue,
                maxResultCount: GET_ALL_IF,
                skipCount,
                maxGetAllSize: GET_ALL_IF,
                ...extraParams, 
             
            };
            const paged = await fetchApi({ body: requestBody });
            const totalCount = +(paged.totalCount || '0');
            const isSearchInClient = Utils.isNullOrEmpty(searchValue) && !isLoadMore && totalCount <= GET_ALL_IF;
            if (isSearchInClient) {
                setSearchOnClient(true);
            }
            if (skipCount + (paged.items?.length || 0) >= totalCount) {
                setDataNotFull(false);
            }
            if (paged.items) {
                const optionSelectItems = paged?.items?.map(renderItem);
                if (isSearchInClient) {
                    setDataSearchClient([...optionSelectItems]);
                }
                if (isLoadMore) {
                    setData([
                        ...data,
                        ...optionSelectItems
                    ]);
                } else {
                    setData(optionSelectItems);
                }
            }

        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsPending(false);
        }
    }

    useEffect(() => {
        if (!focusReady) return;

        if (isSearchOnClient) {
            const fts = Utils.fts(searchValue);
            setData(dataSearchClient.filter((s) => s.fts?.includes(fts)));
            setIsPending(false);
        } else {
            setData([]);
            setDataNotFull(true);
            fetchData(false).then();
        }
    }, [searchValue, focusReady, isSearchOnClient]);

    useEffect(() => {
        if (loadMore > 0 && dataNotFull && !isSearchOnClient) {
            fetchData(true).then();
        }
    }, [loadMore, dataNotFull, isSearchOnClient]);

    useEffect(() => {
        const reloadDataForce = () => fetchData(false);
        ord.event.on('event@stock.searchProduct.reloadAfterAddNew', reloadDataForce);
        return () => {
            ord.event.on('event@stock.searchProduct.reloadAfterAddNew', reloadDataForce);
        };
    }, [fetchData]);


    return { data, isPending, isSearchOnClient };
};
