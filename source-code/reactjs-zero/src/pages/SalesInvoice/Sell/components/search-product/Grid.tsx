import {Button, Divider, Form, Result, Spin, Typography} from "antd";
import {ListStyle} from "@pages/SalesInvoice/Utils/saleCommon";
import {EmptyIcon} from "@ord-components/icon/EmptyIcon";
import {PlusOutlined} from "@ant-design/icons";
import {FavoriteProduct} from "@pages/SalesInvoice/Utils/favoriteProduct";
import {StartIcon} from "@ord-components/icon/StartIcon";
import {StartFillIcon} from "@ord-components/icon/StartFillIcon";
import {GetFileUrl} from "@ord-core/service-proxies/axios.base";
import * as React from "react";
import {useEffect, useState} from "react";
import {ProductDto} from "@api/index.defs";
import {useTranslation} from "react-i18next";
import {ISellSearchProps} from "@pages/SalesInvoice/Sell/components/search-product/index";
import {useStore} from "@ord-store/index";
import {useFilterProductByKey} from "@ord-core/db/queries/products/useFilterProductByKey";
import {InventoryProductItem} from "@pages/SalesInvoice/Sell/components/search-product/InventoryProductItem";
import {PriceProductItem} from "@pages/SalesInvoice/Sell/components/search-product/PriceProductItem";
import InfiniteScroll from "react-infinite-scroll-component";

export const SellProductSearchDataTable = (props: ISellSearchProps) => {
    const {t} = useTranslation('sale-invoice');
    const listStyle = Form.useWatch('listStyle');
    const [listFullProducts, setListFullProducts] = useState<ProductDto[]>([]);
    const [listData, setListData] = useState<ProductDto[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const {productStore: productStore} = useStore();
    const form = Form.useFormInstance();
    const filter_w = Form.useWatch('filter');
    const groupIds_w = Form.useWatch('productGroups');
    const filterProductDb = useFilterProductByKey(filter_w, groupIds_w);
    const MAX_VIEW = 60;
    useEffect(() => {
        let products = filterProductDb || [];
        const newItems = products.map(it => {
            return {
                ...it,
                basicUnitName: it.basicUnitName,
                isFavorite: FavoriteProduct.getFavorite(it),
            }
        });
        // @ts-ignore
        setListFullProducts(newItems.sort((a, b) => b.isFavorite - a.isFavorite));
        const listView = [...newItems.slice(0, MAX_VIEW)];
        setListData(listView);
        setHasMore(listView.length < newItems.length);
    }, [filterProductDb, groupIds_w]);
    const fetchMoreData = () => {
        if (listData.length >= listFullProducts.length) {
            setHasMore(false);
            return;
        }
        const listView = [...listData, ...listFullProducts.slice(listData.length, listData.length + MAX_VIEW)];
        setListData([...listView]);
    }

    return (<>
        {
            listData.length < 1 && <div
                className="col-span-2 xl:col-span-3 2xl:col-span-4 4xl:col-span-5 min-h-[200px]">
                <Result
                    className="mt-[10vh]"
                    icon={<EmptyIcon className="w-[100px]"/>}
                    title={<div className="text-xl">Chưa có sản phẩm để hiển thị</div>}
                    extra={<Button onClick={() => {
                        productStore.openCreateModal();
                    }} type="primary"><PlusOutlined/> {t('addNewProduct')}</Button>}
                />
            </div>
        }

        <InfiniteScroll
            dataLength={listData.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<div className={'text-center'}>
                <Spin></Spin>
            </div>}
            endMessage={<>
                {
                    listFullProducts.length > 60 &&
                    <p style={{textAlign: 'center'}}>Đã tải hết dữ liệu</p>
                }
            </>}
            className="h-[calc(100vh-105px-1.5rem)] overflow-auto"
            height={'calc(100vh - 105px - 1.5rem)'}
        >
            <div className={'product-content p-3 gap-3 ' + (listStyle == ListStyle.GRID ?
                'grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-5' : '')}>
                {
                    listData.map(item =>
                        <div key={item.id}
                             className={'p-item' + (listStyle == ListStyle.GRID ? '' : ' list')}>
                            {/*<Button onClick={() => setListData(FavoriteProduct.Save(item, listData))}*/}
                            {/*        className={`size-[32px] absolute top-2 left-2 shadow-md favorite` + (item.isFavorite ? ' active' : '')}>*/}
                            {/*    {!item.isFavorite ? <StartIcon/> : <StartFillIcon/>}*/}
                            {/*</Button>*/}
                            <div className="p-item-inner flex flex-col rounded-lg h-[100%] overflow-hidden"
                                 onClick={() => props.onProductSelected(item)}>
                                <img className="thumb"
                                     src={item.imageUrl ? GetFileUrl(item.imageUrl) : "/images/product-placeholder.png"}/>
                                <div className="pinfo h-100">
                                    <div className="product-name-row leading-4 mt-2 flex-1">
                                        <Typography.Paragraph ellipsis={{
                                            tooltip: item.productName,
                                            rows: 2,
                                        }}>
                                            {item.productName}
                                        </Typography.Paragraph>
                                    </div>
                                    <div className="price-row">
                                        {item && <PriceProductItem product={item}/>}
                                    </div>
                                    <div className="flex justify-start gap-1 items-center text-[12px]">
                                        {
                                            item.isProductUseInventory &&
                                            <>
                                                <InventoryProductItem product={item}/>
                                                <Divider type="vertical"/>
                                            </>
                                        }
                                        <div>
                                            {item.barcode}|
                                            Đơn vị: {item.basicUnitName}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

            </div>
        </InfiniteScroll>

    </>);
}
