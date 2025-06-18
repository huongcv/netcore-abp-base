import {Form, Select} from "antd";
import React, {useEffect, useMemo, useState} from "react";
import {useDebounce} from "use-debounce";
import {SelectProps} from "antd/lib";
import {useTranslation} from "react-i18next";
import {PartnerSyncDto, SaleInvoiceDto} from "@api/index.defs";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import {useSearchCustomerInDbClient} from "@pages/SalesInvoice/Utils/useSearchCustomerInDbClient";
import {debounce} from "lodash";

export interface CustomerSelectSearchApiProps extends SelectProps {
    onCustomerSelected?: (dto: SaleInvoiceDto) => void;
}

export const CustomerSelectSearchApi = (props: CustomerSelectSearchApiProps) => {
    const {onCustomerSelected, ...rest} = props;
    const form = Form.useFormInstance();
    const [t] = useTranslation('sale-invoice');
    const [value, setValue] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState<string>('');
    const [delayTimeSearch, setDelayTimeSearch] = useState<number>(666);
    const [debouncedSearchValue] = useDebounce(searchValue, delayTimeSearch);
    const [focusReady, setFocusReady] = useState(false);
    const firstFocusRef = useAutoFocus()
    const customerId_w = Form.useWatch('partnerId', form);

    const [loadMore, setLoadMore] = useState(0);
    const {
        data,
        isPending,
        isSearchOnClient
    } = useSearchCustomerInDbClient(debouncedSearchValue, focusReady, loadMore, 4);
    useEffect(() => {
        setSearchValue(props.searchValue ?? '')
    }, [props.searchValue]);

    useEffect(() => {
        setLoading(isPending);
    }, [isPending]);
    useEffect(() => {
        if (isSearchOnClient) {
            setDelayTimeSearch(100);
        }
    }, [isSearchOnClient]);

    const handlerSearch = (v: string) => {
        setSearchValue(v?.trim());
        setLoading(true);
        if (props.onSearch) {
            props.onSearch(v);
        }

    }
    const handlerChange = (v: number, dto: any) => {
        setValue(v);
        if (onCustomerSelected) {
            onCustomerSelected(dto?.data);
        }
    }
    const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (isSearchOnClient) {
            return;
        }
        const {scrollTop, scrollHeight, clientHeight} = e.target as HTMLDivElement;

        // Kiểm tra xem đã cuộn đến cuối hay chưa
        if (scrollTop + clientHeight >= scrollHeight - 30) {
            setLoadMore(Number(new Date()));
        }
    };
    const labelRender = (val: any) => {
        const it = data.find(_ => _.value === val);
        return it?.data?.name;
    }

    return (
        <>
            {
                data && <Select ref={firstFocusRef}
                                onFocus={() => {
                                    setFocusReady(true);
                                }}
                                className={'customer-search rounded-l-md border-r-0'}
                                {...rest}
                                style={{width: '100%'}}
                                size={"large"}
                                options={data}
                                labelRender={(v) => {
                                    return labelRender(v.value)
                                }}
                                onChange={handlerChange}
                    // value={value}
                                showSearch
                                allowClear={false}
                                filterOption={false}
                                onSearch={(v) => handlerSearch(v)}
                                placeholder={t('searchInputCustomerPlaceholder')}
                    // dropdownRender={(menu) => (
                    //     <Spin spinning={loading && !isSearchOnClient}>
                    //         {menu}
                    //     </Spin>
                    // )}
                                onPopupScroll={handlePopupScroll}
                />
            }
            {(searchValue || customerId_w) && <label className="f-label">Khách hàng</label>}
        </>
    )
}
