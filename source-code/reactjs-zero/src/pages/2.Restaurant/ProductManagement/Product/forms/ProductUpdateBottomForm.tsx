import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import {Row, Tabs, TabsProps} from "antd";
import {observer} from "mobx-react-lite";
import {ProductUnitBoxForm} from "@pages/ProductManagement/Product/forms/units/ProductUnitBox";
import ProductInventoryStockList from "@pages/ProductManagement/Product/stock-detail/inventoryStock";
import {ProductDto} from "@api/index.defs";
import ProductInventoryStockMoveList from "@pages/ProductManagement/Product/stock-detail/inventoryStockMove";
import {ModeProps} from "@pages/ProductManagement/Product/forms/units/ProductUnitTableFormList";

const ProductUpdateBottomForm = (props: ModeProps) => {
    const [t] = useTranslation(['product', 'stock']);
    const {productStockDetailStore: detail, productStore: mainStore} = useStore();

    const [items, setItems] = useState<TabsProps['items']>([
        {
            key: '1',
            label: t('ListUnits'),
            children: <>
                <Row gutter={[16, 16]}>
                    <ProductUnitBoxForm mode={props.mode}/>
                </Row>
            </>,
        }
    ]);
    useEffect(() => {
        if (mainStore.createOrUpdateModal.entityData) {
            const product = mainStore.createOrUpdateModal.entityData as ProductDto;
            detail.initData(product);
            if (product.isProductUseInventory) {
                if (items?.findIndex(x => x.key === '2') === -1) {
                    const newItem = {
                        key: '2',
                        label: t('inventoryStock'),
                        children: <ProductInventoryStockList
                            ignoreAutoFocusSearch={true}
                            productDto={product}
                        />,
                    };
                    setItems(prevItems => [...(prevItems ?? []), newItem]);
                }

                if (items?.findIndex(x => x.key === '3') === -1) {
                    const newItem = {
                        key: '3',
                        label: t('inventoryStockMove'),
                        children: <ProductInventoryStockMoveList
                            productDto={product}
                        />,
                    };
                    setItems(prevItems => [...(prevItems ?? []), newItem]);
                }
            }
        } else {
            setItems(prevItems => prevItems?.filter(item => item.key !== '2'));
        }
    }, [mainStore.createOrUpdateModal.entityData]);

    return (<div className={'w-full'}>
        {<>
            <Tabs defaultActiveKey="1"
                  className={"ml-1.5"}
                  tabBarStyle={{
                      background: "#EEEEEE",
                      color: "#45494E",
                      fontSize: "16px",
                      fontWeight: 500,
                      borderRadius: '6px',
                      padding: '0 10px',
                      height: '45px'
                  }}
                  tabBarExtraContent={<>
                  </>}
                  items={items}/>
        </>}
    </div>);
};


export default observer(ProductUpdateBottomForm);