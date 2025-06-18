import {Button, Form, Result, Spin, Typography} from "antd";
import {ListStyle} from "@pages/SalesInvoice/Utils/saleCommon";
import {EmptyIcon} from "@ord-components/icon/EmptyIcon";
import {PlusOutlined} from "@ant-design/icons";
import {GetFileUrl} from "@ord-core/service-proxies/axios.base";
import * as React from "react";
import {useEffect, useState} from "react";
import {ISellSearchProps} from "@pages/SalesInvoice/Sell/components/search-product/index";
import {useStore} from "@ord-store/index";
import {InventoryProductItem} from "@pages/SalesInvoice/Sell/components/search-product/InventoryProductItem";
import InfiniteScroll from "react-infinite-scroll-component";
import {useTranslation} from "react-i18next";
import {
    useSearchProduct
} from "@pages/StockManagement/Shared/Upsert/grid-product/SearchProduct/select/useSearchProduct";
import {ProductDto} from "@api/index.defs";
import {observer} from "mobx-react-lite";
import {ProductService} from "@api/ProductService";
import uiUtils from "@ord-core/utils/ui.utils";
import {PriceProductApiItem} from "@pages/SalesInvoice/Sell/components/search-product/PriceProductApiItem";
import {SaleInvoiceService} from "@api/SaleInvoiceService";

export const SellProductSearchApiDataTable = observer(
    (props: ISellSearchProps) => {
        const {t} = useTranslation("sale-invoice");
        const listStyle = Form.useWatch("listStyle");
        const [listData, setListData] = useState<ProductDto[]>([]);
        const [hasMore, setHasMore] = useState(true);
        const {productStore: productStore} = useStore();
        const filter_w = Form.useWatch('filter');
        const groupIds_w = Form.useWatch('productGroups');
        const priceListId_w = Form.useWatch('priceListId');
        const onSearchBeginning_w = Form.useWatch('onSearchBeginning');
        const MAX_VIEW = 20;
        const productsApi = useSearchProduct(filter_w, groupIds_w, priceListId_w, onSearchBeginning_w, MAX_VIEW);

        useEffect(() => {
            updateProduct();
        }, [productsApi.data]);

        useEffect(() => {
            const pr = productStore.createOrUpdateEntitySaved;
            if (pr && pr.isActived) {
                console.log("Change here", productStore.createOrUpdateEntitySaved);
                setListData([
                    ...listData,
                    {
                        ...pr,
                        key: pr.id,
                        productUnitName: pr.basicUnitName,
                    },
                ]);
            }
        }, [productStore.createOrUpdateEntitySaved]);

        function updateProduct() {
            let products = productsApi.data || [];
            const listView = products.map((it) => {
                return {
                    ...it,
                    key: it.id,
                    productUnitName: it.basicUnitName,
                };
            });
            setListData(listView);
            setHasMore(listView.length < productsApi.totalRecord);
        }

        const fetchMoreData = () => {
            if (listData.length >= productsApi.totalRecord) {
                return;
            }
            if (!productsApi.isPending) {
                productsApi.setLoadMore(MAX_VIEW + productsApi.loadMore);
            }
        };

        // đoạn này chạy khi thay toán sản phẩm sử dụng lô => chạy vào đây để cập nhật sản phẩm đó
        useEffect(() => {
            const fetchInventoryData = async () => {
                if (productStore.idsProductAfterPaymentSuccess && productStore.idsProductAfterPaymentSuccess.length > 0) {
                    // do SaleInvoiceDto.saleInvoiceDetails ko có trường isProductUseInventory nên tạm thời query từ listData
                    // service chỉ việc lấy dữ liệu => ko cần check sản phẩm có thuộc tồn kho ko => ko cần thiết
                    const productsWithMatchingIds = listData
                        .filter(product =>
                            product.id !== undefined &&
                            productStore.idsProductAfterPaymentSuccess?.includes(product.id) &&
                            product.isProductUseInventory
                        )
                        .map(p => Number(p.id));

                    if (productsWithMatchingIds.length > 0) {
                        try {
                            const inventoryData = await inventoryProductCurrent(productsWithMatchingIds);

                            // Cập nhật `listData` với dữ liệu tồn kho mới
                            setListData(prevList =>
                                prevList.map(product => {
                                    const updatedInventory = inventoryData.find(item => item.productId === product.id);
                                    return updatedInventory
                                        ? {...product, inventoryCurrentQty: updatedInventory.inventoryCurrentQty}
                                        : product;
                                })
                            );
                        } catch (error) {
                            console.log("err: ", error)
                            uiUtils.showError("Lỗi khi lấy dữ liệu tồn kho")
                        }
                    }
                }
            };

            fetchInventoryData();
            console.log(productStore.idsProductAfterPaymentSuccess)
        }, [productStore.idsProductAfterPaymentSuccess]);

        const inventoryProductCurrent = async (ids: number[]) => {
            return await SaleInvoiceService.getInventoryProductCurrentQty({body: ids});
        };


        return (
            <>
                {listData.length < 1 && !productsApi.isPending && (
                    <div className="col-span-2 xl:col-span-3 2xl:col-span-4 4xl:col-span-5 min-h-[200px]">
                        <Result
                            className="mt-[10vh]"
                            icon={<EmptyIcon className="w-[100px]"/>}
                            title={
                                <div className="text-xl">Chưa có sản phẩm để hiển thị</div>
                            }
                            extra={
                                <Button
                                    onClick={() => {
                                        productStore.openCreateModal();
                                    }}
                                    type="primary"
                                >
                                    <PlusOutlined/> {t("addNewProduct")}
                                </Button>
                            }
                        />
                    </div>
                )}

                <InfiniteScroll
                    dataLength={listData.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={
                        <div className={"text-center"}>
                            <Spin></Spin>
                        </div>
                    }
                    endMessage={""}
                    className="h-[calc(100vh-105px-1.5rem)] overflow-auto"
                    height={"calc(100vh - 105px - 1.5rem)"}
                >
                    <div
                        className={
                            "product-content p-3 gap-3 " +
                            (listStyle == ListStyle.GRID
                                ? "grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-5"
                                : "")
                        }
                    >
                        {listData.map((item) => (
                            <div
                                key={item.id}
                                className={
                                    "p-item" + (listStyle == ListStyle.GRID ? "" : " list")
                                }
                            >
                                {/*<Button onClick={() => setListData(FavoriteProduct.Save(item, listData))}*/}
                                {/*        className={`size-[32px] absolute top-2 left-2 shadow-md favorite` + (item.isFavorite ? ' active' : '')}>*/}
                                {/*    {!item.isFavorite ? <StartIcon/> : <StartFillIcon/>}*/}
                                {/*</Button>*/}
                                <div
                                    className="p-item-inner flex flex-col rounded-lg h-[100%] overflow-hidden"
                                    onClick={() => props.onProductSelected(item)}
                                >
                                    <img
                                        className="thumb"
                                        src={
                                            item.imageUrl
                                                ? GetFileUrl(item.imageUrl)
                                                : "/images/product-placeholder.png"
                                        }
                                    />
                                    <div className="pinfo h-50">
                                        <div className="product-name-row leading-4 mt-2 flex-1">
                                            <Typography.Paragraph
                                                ellipsis={{
                                                    tooltip: item.productName,
                                                    rows: 2,
                                                }}
                                            >
                                                {item.productName}
                                            </Typography.Paragraph>
                                        </div>
                                        <div className="price-row">
                                            {item && <PriceProductApiItem product={item}/>}
                                        </div>
                                        <div className="flex justify-start gap-1 items-center text-[12px]">
                                            {item.isProductUseInventory && (
                                                <>
                                                    <InventoryProductItem product={item}/>
                                                    <div className="opacity-50">|</div>
                                                </>
                                            )}
                                            <div>DVT:{item.productUnitName}</div>
                                            { item?.taxPercent! > 0 && (
                                                <>
                                                    <div className="opacity-50">|</div>
                                                    <div>VAT:{item.taxPercent}</div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            </>
        );
    }
);
