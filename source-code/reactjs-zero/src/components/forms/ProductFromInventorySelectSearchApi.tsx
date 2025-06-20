import {Select} from "antd";
import React, {useEffect, useState} from "react";
import {useDebounce} from "use-debounce";
import {SelectProps} from "antd/lib";
import {useTranslation} from "react-i18next";
import {ProductSearchWithUnitDto} from "@api/index.defs";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import {
    useSearchProductInDbClient
} from "@pages/StockManagement/Shared/Upsert/grid-product/SearchProduct/select/useSearchProductInDbClient";
import {
    useSearchProductFromInventoryInDbClient
} from "@pages/StockManagement/Shared/Upsert/grid-product/SearchProduct/select/useSearchProductFromInventoryInDbClient";


interface Props extends SelectProps {
    onProductSelected?: (dto: ProductSearchWithUnitDto) => void;
}

export const ProductFromInventorySelectSearchApi = (props: Props) => {
    const {onProductSelected, ...rest} = props;
    const [t] = useTranslation('stock');
    const [value, setValue] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState<string>('');
    const [delayTimeSearch, setDelayTimeSearch] = useState<number>(666);
    const [debouncedSearchValue] = useDebounce(searchValue, delayTimeSearch);
    const [focusReady, setFocusReady] = useState(false);
    const firstFocusRef = useAutoFocus();

    const [loadMore, setLoadMore] = useState(0);
    const {
        data,
        isPending,
        isSearchOnClient
    } = useSearchProductFromInventoryInDbClient(debouncedSearchValue);

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
    }
    const handlerChange = (v: number, dto: any) => {
        setValue(null);
        if (onProductSelected) {
            onProductSelected(dto?.data);
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
    return (
        <>
            {
                data && <Select ref={firstFocusRef}
                                onFocus={() => {
                                    setFocusReady(true);
                                }}
                                className={'product-search'}
                                {...rest}
                                style={{width: '100%'}}
                                options={data}
                                value={value}
                                onChange={handlerChange}
                                showSearch
                                filterOption={false}
                                onSearch={(v) => handlerSearch(v)}
                                placeholder={t('searchInputPlaceholderHotKey')}
                                onPopupScroll={handlePopupScroll}
                />
            }
        </>
    )
}
