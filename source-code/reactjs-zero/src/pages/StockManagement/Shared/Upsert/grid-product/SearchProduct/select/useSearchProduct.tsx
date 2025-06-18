import {useEffect, useRef, useState} from "react";
import _ from "lodash";
import {SaleInvoiceService} from "@api/SaleInvoiceService";

export const useSearchProduct = (searchTerm: string | undefined, groupsIdList: any[],
                                 priceListId: string, onSearchBeginning_w: string, MAX_RESULT: number) => {
    const [data, setData] = useState<any[]>([]);
    const [totalRecord, setTotalRecord] = useState<number>(0);
    const [isPending, setIsPending] = useState(false);
    const [dataNotFull, setDataNotFull] = useState(false);
    const [loadMore, setLoadMore] = useState(0);
    const [prId, setPrId] = useState<any>();
    const isFirstRender = useRef(true);

    const fetchData = async (isLoadMore: boolean, searchTerm?: string, groupsIdList?: any[], priceListId?: string) => {
        try {
            // @ts-ignore
            if (groupsIdList?.indexOf("uncheck") >= 0) {
                setData([]);
                setTotalRecord(0);
                return;
            }

            const skipCount = isLoadMore ? loadMore : 0;
            const paged = await SaleInvoiceService.getProducts({
                body: {
                    filter: searchTerm,
                    listProductGroupId: groupsIdList,
                    isActived: true,
                    maxResultCount: MAX_RESULT,
                    priceListId: priceListId,
                    skipCount: skipCount,
                }
            });

            // const paged = await SaleInvoiceApiResourceService.getProducts({
            //     body: {
            //         filter: searchTerm,
            //         maxResultCount: MAX_RESULT,
            //         listProductGroupId: groupsIdList,
            //         priceListId: priceListId,
            //         skipCount: skipCount
            //     }
            // });
            const totalCount = +(paged.totalCount || '0');

            if (skipCount + (paged.items?.length || 0) >= totalCount) {
                setDataNotFull(false);
            }
            setTotalRecord(totalCount);
            if (paged.items) {
                if (!isLoadMore) {
                    setData(paged?.items);
                } else {
                    setData([
                        ...data,
                        ...paged?.items
                    ]);
                }
            }
        } catch (error) {
        } finally {
            setIsPending(false);
            isFirstRender.current = true;
        }
    };

    useEffect(() => {
        setIsPending(true);
        setLoadMore(0);
        setData([]);
        setDataNotFull(true);
        // debouncedFetchData(false);
        debouncedFetchData2(false, searchTerm, groupsIdList, prId);
    }, [searchTerm, groupsIdList, prId, onSearchBeginning_w]);

    useEffect(() => {
        setPrId(priceListId || 0)
    }, [priceListId]);

    useEffect(() => {
        if (loadMore > 0 && dataNotFull) {
            setIsPending(true);
            debouncedFetchData(true);
        }
    }, [loadMore]);

    const debouncedFetchData = _.debounce((isLoadMore: boolean) => {
        fetchData(isLoadMore, searchTerm, groupsIdList, prId).then();
    }, 500);

    const debouncedFetchData2 = useRef(_.debounce((isLoadMore: boolean, searchTerm?: string, groupsIdList?: any[], priceListId?: string) => {
        // Your fetch data function
        //     console.log('Fetching data with', { isLoadMore, searchTerm, groupsIdList, priceListId });
        fetchData(isLoadMore, searchTerm, groupsIdList, priceListId).then();
    }, 500)).current;

    return {data, totalRecord, isPending, loadMore, setLoadMore};
}
