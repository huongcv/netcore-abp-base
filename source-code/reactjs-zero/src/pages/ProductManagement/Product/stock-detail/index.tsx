import {observer} from "mobx-react-lite";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import {Modal, Row, Tabs, TabsProps, Tag} from "antd";
import React, {useEffect, useState} from "react";
import ProductInventoryStockList from "@pages/ProductManagement/Product/stock-detail/inventoryStock";
import ProductInventoryStockMoveList from "@pages/ProductManagement/Product/stock-detail/inventoryStockMove";
import './index.scss';
import {CheckOutlined, StopOutlined} from "@ant-design/icons";

const ProductStockDetail = (props: {
    ignoreModal?: boolean
}) => {
    const [t] = useTranslation('product');
    const {productStockDetailStore: mainStore} = useStore();
    const [tabIdx, setTabIdx] = useState('1');
    const {isModalOpen, productDto} = mainStore;
    const items: TabsProps['items'] = [
        ...productDto?.isProductUseInventory == true ? [
            {
                key: '1',
                label: t('inventoryStock'),
                children: <ProductInventoryStockList productDto={productDto}/>
            }
        ] : []
        ,
        {
            key: '2',
            label: t('inventoryStockMove'),
            children: <ProductInventoryStockMoveList productDto={productDto}/>
        }
    ];
    useEffect(() => {

        if (productDto?.isProductUseInventory == true) {
            setTabIdx('1');
        } else {
            setTabIdx('2');
        }
    }, [isModalOpen]);
    const modalTitle = (<>
        {t('stockDetail', productDto as any) as any}
        {
            productDto?.isProductUseLotNumber == true ?
                <Tag className={'ms-1 text-primary'}>
                    <CheckOutlined/> {t('isProductUseLotNumber')}
                </Tag> :
                <Tag className={'ms-1 text-red-500'}>
                    <StopOutlined/> {
                    productDto?.isProductUseInventory == true ?
                        t('productNotLot') : t('productNotInvetory')
                }
                </Tag>
        }
    </>);
    const ContentTab = (<Row gutter={16}>
        <Tabs activeKey={tabIdx} items={items} onChange={(curr) => setTabIdx(curr)}/>
    </Row>);
    return (<>
        {
            productDto &&
            <>
                {
                    props.ignoreModal == true ?
                        <>
                            {ContentTab}
                        </> :
                        <Modal title={modalTitle}
                               width={mainStore.widthModal}
                               style={{top: 5}}
                               open={isModalOpen}
                               onCancel={mainStore.closeModal}
                               className={'product-detail-stock'}
                               footer={null}
                        >
                            {ContentTab}

                        </Modal>

                }
            </>

        }


    </>);
}
export default observer(ProductStockDetail);
