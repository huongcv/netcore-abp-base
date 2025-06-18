import {Select, Spin} from "antd";
import React, {useEffect, useState} from "react";
import {useDebounce} from "use-debounce";
import {SelectProps} from "antd/lib";
import {useTranslation} from "react-i18next";
import {ProductUnitViewDto} from "@api/index.defs";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";

interface Props extends SelectProps {
    onProductSelected?: (dto: ProductUnitViewDto) => void;
    useSearchHook: (query: string, focusReady: boolean, loadMore: number, moveType: any, inventoryId: number | undefined) => {
        data: any;
        isPending: boolean;
        isSearchOnClient: boolean;
    };
    moveType: any; // Nhận moveType từ props
    showLoading?: boolean;
    mustClearValueWhenSelect?: boolean;
    allowClear?: boolean;
    inventoryId?:number | undefined;
}

const ProductSelectSearchServerSide = ({
                                           onProductSelected,
                                           useSearchHook,
                                           moveType,
                                           inventoryId,
                                           showLoading = true,
                                           mustClearValueWhenSelect = true,
                                           ...rest
                                       }: Props) => {
    const [t] = useTranslation("stock");
    const [value, setValue] = useState<number | null>(null);
    const [searchValue, setSearchValue] = useState<string>("");
    const [delayTimeSearch, setDelayTimeSearch] = useState<number>(666);
    const [debouncedSearchValue] = useDebounce(searchValue, delayTimeSearch);
    const [focusReady, setFocusReady] = useState(false);
    const firstFocusRef = useAutoFocus();
    const [loadMore, setLoadMore] = useState(0);

    const {data, isPending, isSearchOnClient} = useSearchHook(debouncedSearchValue, focusReady, loadMore, moveType, inventoryId);

    useEffect(() => {
        if (isSearchOnClient) setDelayTimeSearch(100);
    }, [isSearchOnClient]);

    const handlerSearch = (v: string) => {
        setSearchValue(v);
    };

    const handlerChange = (v: number, dto: any) => {
        onProductSelected?.(dto?.data);
        if (mustClearValueWhenSelect) {
            setValue(null);
        } else {
            setValue(v);
        }
        setSearchValue("");
    };

    const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (isSearchOnClient) return;
        const {scrollTop, scrollHeight, clientHeight} = e.target as HTMLDivElement;
        if (scrollTop + clientHeight >= scrollHeight - 30) {
            setLoadMore(Number(new Date()));
        }
    };

    return (
        <Select
            ref={firstFocusRef}
            onFocus={() => setFocusReady(true)}
            className="product-search"
            {...rest}
            style={{width: "100%"}}
            options={data}
            value={value}
            onChange={handlerChange}
            allowClear={true}
            showSearch
            filterOption={false}
            onSearch={handlerSearch}
            dropdownRender={(menu) => (showLoading ?
                <Spin spinning={isPending && !isSearchOnClient}>{menu}</Spin> : menu)}
            onPopupScroll={handlePopupScroll}
        />
    );
};

export default ProductSelectSearchServerSide;
