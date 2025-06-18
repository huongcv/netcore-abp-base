import {observer} from "mobx-react-lite";
import '../Shared/Upsert/index.scss';
import {ProductSearchWithUnitDto} from "@api/index.defs";
import {Button, Card, Form, FormInstance, Input, Tabs, TabsProps} from "antd";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {ProductShopItemFormProps} from "@pages/StockManagement/Shared/Upsert/Props";
import UpsertFormUtil, {IFormProductShopOrder} from "@pages/StockManagement/Shared/utils/UpsertForm.util";
import OrderProductItemForm from "@pages/StockManagement/OrderStock/FormUpsert/OrderProductItemForm";
import OrderHeaderProduct from "@pages/StockManagement/OrderStock/FormUpsert/HeaderProduct";
import SearchProductTenantTableModal
    from "@pages/StockManagement/OrderStock/search-table-modal/SearchProductTenantTableModal";
import {useSelectShopUsingIsStock} from "@ord-components/forms/select/selectDataSource/useSelectShopUsingIsStock";
import {fetchSyncDataProducts} from "@ord-core/db/services/syncDataProducts";
import * as _ from 'lodash'
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import {PlusOutlined} from "@ant-design/icons";

const GridOrderProductItems = (props: {
    formMoveTicket: FormInstance<any>,
}) => {
    const {formMoveTicket} = props;
    const [itemCount, setItemCount] = useState(0);
    const [productLoad, setProductLoad] = useState<Map<string, boolean>>(new Map());

    const {t} = useTranslation('orderStock');
    const {
        stockMoveStore,
        stockSearchProductStore
    } = useStore();
    const dataSupplier = useSelectShopUsingIsStock();

    const form = Form.useFormInstance();

    const handlerMultiProductSelect = async (selectedProducts: ProductSearchWithUnitDto[]) => {
        UpsertFormUtil.addMultiProductShopIntoForm(form, selectedProducts, dataSupplier?.data || []);
    }

    const items_w: IFormProductShopOrder[] = Form.useWatch(StockMoveFormName.ProductItemsFromShop);
    useEffect(() => {
        if (items_w as IFormProductShopOrder[]) {
            setItemCount(items_w.length || 0);
            items_w.forEach(item => {
                if (!productLoad.has(item.shopId.toString())) {
                    productLoad.set(item.shopId.toString(), true)
                    setProductLoad(productLoad);
                    fetchSyncDataProducts(false, item.shopId).then()
                }
            })
        }
    }, [items_w]);

    useEffect(() => {
            stockSearchProductStore.extraParams = null;
    }, [])

    const ViewShopName = (
        props: { index: number }
    ) => {
        const fValue = form.getFieldValue([StockMoveFormName.ProductItemsFromShop, props.index, "shopId"]);
        const data = dataSupplier.data.find(x => x.value == fValue)?.label
        return <>{data}</>;
        // return <>
        //     <DisplayTextFormSelectDataSource
        //         value={Form.useWatch([StockMoveFormName.ProductItemsFromShop, props.index, "shopId"])}
        //         datasource={dataSupplier}></DisplayTextFormSelectDataSource>
        // </>
    }
    const showSelectProductModal = () => {
        const result = _.flatMap(items_w, x => x[StockMoveFormName.ProductItems])
        stockSearchProductStore.setNewSelectedRows(result);
        stockSearchProductStore.showModal();
    }
    return (<div className='grid-product-item-container'>
        <SearchProductTenantTableModal
            supplierListData={dataSupplier}
            moveType={stockMoveStore.moveDto?.moveType}
            onItemsSelected={handlerMultiProductSelect}/>
        <Form.List name={[StockMoveFormName.ProductItemsFromShop]}>
            {(productTenantField, {add: addUser, remove: removeUser}) => {

                const itemTabs: TabsProps["items"] = productTenantField.map(tenantField => ({
                    key: tenantField.key.toString(), // Đảm bảo key là string và duy nhất
                    label: <ViewShopName index={tenantField.name}></ViewShopName>,
                    children: (
                        <>
                            <Form.Item hidden noStyle label="shopId" name={[tenantField.name, "shopId"]}>
                                <Input placeholder="Enter shopId"/>
                            </Form.Item>
                            <Form.Item hidden noStyle label="shopName" name={[tenantField.name, "shopName"]}>
                                <Input placeholder="Enter shopName"/>
                            </Form.Item>

                            <table className="min-w-full bg-white border border-gray-200 min-h-[100px]">
                                <thead className="product-table-h">
                                <tr>
                                    <OrderHeaderProduct/>
                                </tr>
                                </thead>
                                <tbody>
                                <Form.List name={[tenantField.name, StockMoveFormName.ProductItems]}>
                                    {(productFields, {add: addProduct, remove: removeEmail}) => (
                                        <>
                                            {productFields.map((field) => {
                                                const propsProduct: ProductShopItemFormProps = {
                                                    field,
                                                    fieldShop: tenantField,
                                                    remove: removeEmail,
                                                    formMoveTicket,
                                                };
                                                return (
                                                    <tr className="even:bg-gray-50 grid-form" key={field.key}>
                                                        <OrderProductItemForm key={field.key} {...propsProduct}/>
                                                    </tr>
                                                );
                                            })}
                                        </>
                                    )}
                                </Form.List>
                                </tbody>
                            </table>
                        </>
                    ),
                }));

                const OperationsSlot: Record<"left" | "right", React.ReactNode> = {
                    left: itemCount == 0 ? <strong className='uppercase'>{t("productInfo")}</strong> : "", //<Button className="tabs-extra-demo-button">Left Extra Action</Button>,
                    right: (
                        <Button
                            className='mb-1'
                            onClick={showSelectProductModal}>
                            <PlusOutlined></PlusOutlined>
                            {t('selectProductButton')}
                        </Button>
                    ),
                };

                return <Tabs size='small' items={itemTabs} type="card" tabBarExtraContent={OperationsSlot}/>

            }}
        </Form.List>

        {
            itemCount <= 0 &&
            <div onClick={showSelectProductModal}
                 className=" min-h-96 container mx-auto flex flex-col items-center justify-center cursor-pointer">
                <div className="flex items-center justify-center">
                    <span className="font-bold text-green-500 text-6xl">+</span>
                </div>
                <p className=" mt-4 text-green-500 text-lg">{t('selectProductButton')}</p>
            </div>
        }
    </div>)
}
export default observer(GridOrderProductItems);
