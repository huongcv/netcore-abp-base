import {observer} from "mobx-react-lite";
import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useStore} from "@ord-store/index";
import {Button, Card, Space} from "antd";
import {useTranslation} from "react-i18next";
import {ProductInformation} from "@pages/ProductManagement/Product/detail/ProductInformation";
import '../index.scss';
import {ProductDto} from "@api/index.defs";
import './detail.scss';
import {OrdBreadcrumb} from "@ord-components/common/page/PageBreadcrumb";
import {ArrowLeftOutlined, EditOutlined} from "@ant-design/icons";
import ProductDetail_StockInformation from "@pages/ProductManagement/Product/detail/ProductStockDetail";
import OrdCreateOrUpdateModal from "@ord-components/crud/OrdCreateOrUpdateModal";
import ProductUpdateForm from "@pages/ProductManagement/Product/forms/ProductUpdateForm";

const ProductDetail = () => {
    const {t} = useTranslation('product');
    const navigate = useNavigate();
    let {id} = useParams();
    const {productDetailStore: mainStore, productStore, productStockDetailStore, productDetailStore} = useStore();
    const [productDto, setProductDto] = useState<ProductDto | null>();
    
    useEffect(() => {
        if (id) {
            mainStore.getDetail(id).then();
        }
    }, [id]);
    const gotoList = () => {
        mainStore.productDetail = null;
        navigate('/product');
    }
    useEffect(() => {
        setProductDto(mainStore.productDto);
        if (mainStore.productDto) {
            productStockDetailStore.openModal(mainStore.productDto);
        }
    }, [mainStore.productDto]);
    useEffect(() => {
        return () => {
            productStockDetailStore.closeModal();
        };
    }, []);

    const onSavedSuccess = () => {
        if (productDto && productDto.idHash) {
            productDetailStore.getDetail(productDto.idHash).then();
        }
    }

    return (<>
        <div
            className="flex flex-wrap items-center justify-between mb-3">
            <OrdBreadcrumb mainTitle={'menu.productDetail'} items={['menu.product']}></OrdBreadcrumb>
            <div className="flex items-center">
                <Space wrap>
                    <Link to={'/product'}>
                        <Button><ArrowLeftOutlined></ArrowLeftOutlined>{t('returnList')}</Button>
                    </Link>
                    <Button type={'primary'} icon={<EditOutlined/>} onClick={() => {
                        productStore.openUpdateModal(productDto);
                    }}>
                        {t('EditBtn')}
                    </Button>
                </Space>
            </div>
        </div>
        <div className={'product-detail'}>
            <Card title={t('DetailTitleBase')}>
                {
                    productDto && <>
                        <ProductInformation product={productDto}/>
                    </>
                }

            </Card>
            {
                (productDto && productDto.isProductUseInventory == true) &&
                <ProductDetail_StockInformation></ProductDetail_StockInformation>
            }

        </div>
        <OrdCreateOrUpdateModal stored={productStore}
                                onSavedSuccess={onSavedSuccess}
                                entityForm={() => <ProductUpdateForm/>}/>
    </>);
}
export default observer(ProductDetail);
