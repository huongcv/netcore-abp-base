import React, {useEffect, useState} from "react";
import {Flex} from "antd";
import {PartnerDto, PartnerSyncDto} from "@api/index.defs";
import Utils from "@ord-core/utils/utils";
import {SaleInvoiceService} from "@api/SaleInvoiceService";
import {useTranslation} from "react-i18next";
import {l} from "@ord-core/language/lang.utils";

export const CustomerSelectOptionRender = (dto: PartnerSyncDto) => ({
    value: dto.id,
    data: dto,
    fts: Utils.toLowerCaseNonAccentVietnamese(dto.code) + ' ' + Utils.toLowerCaseNonAccentVietnamese(dto.name),
    label: (
        <div className='customer-search'>
            <div>
                <Flex>
                    <b className='max-w-96 overflow-hidden text-ellipsis'>{dto.name}</b>
                    <span className='text-red ms-2 inline'>{dto.phone}</span>
                </Flex>
                <Flex>
                    {
                        !!dto.gender && <>
                            <b className={'text-red min-w-[40px]'}>{l.trans('enum.GENDER.' + dto.gender || '')}</b>
                        </>
                    }
                    {
                        dto.address &&
                        <p className={'italic'}>
                            <span>
                             - {('Địa chỉ')}:
                            </span>
                            <span className={'ms-1'}>
                                    {dto.address}
                                </span>
                        </p>
                    }

                </Flex>
            </div>
        </div>

    ),
})

export const useSearchCustomer = (searchValue: string, focusReady: boolean, loadMore: number,
                                  status: number) => {
    const MAX_RESULT = 10;
    const MAX_ITEM_SEARCH_CLIENT = 1000;
    const [dataSearchClient, setDataSearchClient] = useState<any[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [isSearchOnClient, setSearchOnClient] = useState(false);
    const [dataNotFull, setDataNotFull] = useState(false);
    const {t: tEnum} = useTranslation('enum');
    const fetchData = async (isLoadMore: boolean) => {
        setIsPending(true);
        try {
            const skipCount = isLoadMore ? data.length : 0;
            const paged = await SaleInvoiceService.searchCustomer({
                body: {
                    filter: searchValue,
                    isActived: true,
                    maxResultCount: MAX_RESULT,
                    skipCount: skipCount,
                    maxGetAllSize: MAX_ITEM_SEARCH_CLIENT,
                    type: 1
                }
            });
            const totalCount = +(paged.totalCount || '0');
            const isSearchInClient = Utils.isNullOrEmpty(searchValue) && !isLoadMore && totalCount <= MAX_ITEM_SEARCH_CLIENT;
            if (isSearchInClient) {
                setSearchOnClient(true);
            }
            if (skipCount + (paged.items?.length || 0) >= totalCount) {
                setDataNotFull(false);
            }
            if (paged.items) {
                const optionSelectItems = paged?.items?.map(it => CustomerSelectOptionRender(it));
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
        } finally {
            setIsPending(false);
        }
    };
    useEffect(() => {
        if (!focusReady) {
            return;
        }
        if (isSearchOnClient) {
            const fts = Utils.toLowerCaseNonAccentVietnamese(searchValue);
            const filter = dataSearchClient.filter(s => s.fts && s.fts.indexOf(fts) > -1);
            setData([...filter]);
            setIsPending(false);
        } else {
            setData([]);
            setDataNotFull(true);
            fetchData(false).then();
        }
    }, [searchValue, focusReady]);
    useEffect(() => {

        if (loadMore > 0 && dataNotFull && !isSearchOnClient) {
            fetchData(true).then();
        }

    }, [loadMore]);
    return {data, isPending, isSearchOnClient};
}
