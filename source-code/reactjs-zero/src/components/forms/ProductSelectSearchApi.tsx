import { ProductSearchWithUnitDto } from "@api/index.defs";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import { useSearchProductSaleServerSide } from "@pages/StockManagement/Shared/Upsert/grid-product/SearchProduct/server/useSearchProductSaleServerSide";
import { Select } from "antd";
import { SelectProps } from "antd/lib";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";


interface Props extends SelectProps {
    onProductSelected?: (dto: ProductSearchWithUnitDto) => void;
    onlyGetProductUsingInventory: boolean, 
    priceListId?: number,
    placeholder?: string,
}

export const ProductSelectSearchApi = (props: Props) => {
    const {onProductSelected, placeholder,  ...rest} = props;
    const [t] = useTranslation('stock');
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
    } = useSearchProductSaleServerSide(debouncedSearchValue, focusReady, loadMore, undefined, undefined, true, props.priceListId);

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
        if (onProductSelected) {
            onProductSelected(dto?.data);
        }
        if(props.onChange){
            props.onChange(v, dto);
        }
    }
    const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (isSearchOnClient) {
            return;
        }
        const {scrollTop, scrollHeight, clientHeight} = e.target as HTMLDivElement;
        if (scrollTop + clientHeight >= scrollHeight - 30) {
            setLoadMore(Number(new Date()));
        }
    };

    const labelRender = (option: any) => {
        const it = data.find(_ => _.value === option.value);
        return (
            <>
                {it?.data?.unitName ? (
                    <>
                        <b>{it?.data?.productName}</b> - {it?.data?.unitName}
                    </>
                ) : (
                    <b>{it?.data?.productName}</b>
                )}
            </>
        );
        
    }

    return (
        <>
            {
                data && <Select ref={firstFocusRef}
                                onFocus={() => {
                                    setFocusReady(true);
                                }}
                                allowClear={props.allowClear}
                                className={'product-search'}
                                {...rest}
                                labelRender={(v) => labelRender(v)}
                                style={{width: '100%'}}
                                options={data}
                                onChange={handlerChange}
                                showSearch
                                filterOption={false}
                                onSearch={(v) => handlerSearch(v)}
                                placeholder={placeholder ? t(placeholder) : t('searchInputPlaceholderHotKey')}
                                onPopupScroll={handlePopupScroll}
                />
            }
        </>
    )
}
