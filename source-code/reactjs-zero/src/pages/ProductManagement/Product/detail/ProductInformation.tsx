import {ProductDto} from "@api/index.defs";
import {Col, Row, Space, Tag} from "antd";
import React from "react";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import {ProductImgDetail} from "@pages/ProductManagement/Product/detail/ProductImgDetail";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import {useSelectProductType} from "@ord-components/forms/select/selectDataSource/useSelectProductType";
import {useSelectProductGroup} from "@ord-components/forms/select/selectDataSource/useSelectProductGroup";
import {BoolStatusIcon} from "@ord-components/common/BoolStatusIcon";
import {ProductUnitList} from "@pages/ProductManagement/Product/detail/ProductUnitList";


interface Props {
    product: ProductDto
}

export const ProductInformation = (props: Props) => {
    const {t} = useTranslation('product');
    const {productStore: mainStore, productDetailStore} = useStore();
    const {product} = props;
    const onSavedSuccess = () => {
        if (product.idHash) {
            productDetailStore.getDetail(product.idHash).then();
        }
    }
    const openEdit = () => {
        let unitItems: any[] = [];
        if (productDetailStore.productDetail) {
            const {listProductUnit} = productDetailStore.productDetail;
            if (listProductUnit && listProductUnit.length > 1) {
                listProductUnit.forEach(it => {
                    if (!it.isBasicUnit) {
                        unitItems.push({
                            ...it,
                            productUnitId: it.id,
                        });
                    }
                })
            }
        }

        mainStore.openUpdateModal(
            {
                ...product,
                unitItems: unitItems
            }
        );
    }
    const productType_ds = useSelectProductType();
    const productGroup_ds = useSelectProductGroup();
    return (<>
        <Row gutter={50}>
            <Col flex="220px">
                <ProductImgDetail value={product.imageUrl}
                                  imgIndex={0}
                                  productId={product.idHash}
                />
            </Col>
            <Col flex="auto">
                <h3 className={'product-name'}>{product.productName}</h3>
                <table className={'product-tbl-information'}>
                    <tbody>
                    <tr>
                        <td style={{width: 180}}>
                            <p className={'price'}>
                                <span className={'italic'}>{t('price')}: </span>
                            </p>
                        </td>
                        <td>
                            <span className={'price me-5'}>
                              <PriceCell value={product.productPrice} fixed={0}></PriceCell>
                            </span>

                            <span className={'tax product-tag'}>
                                {
                                    !product.taxPercent ? <span>{t('notTax')}</span> :
                                        <>
                                            <span>{t('tax')}</span>
                                            <PriceCell value={(product.taxPercent)} fixed={0}></PriceCell>
                                            <span>%</span>
                                        </>
                                }
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>{t('type')}:</td>
                        <td className={'font-bold'}>
                            <DisplayTextFormSelectDataSource value={product.productTypeId}
                                                             datasource={productType_ds}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>{t('code')}:</td>
                        <td className={'font-bold'}>
                            {product.productCode}
                        </td>
                    </tr>
                    <tr>
                        <td>{t('barCode')}:</td>
                        <td className={'font-bold'}>
                            {product.barcode}
                        </td>
                    </tr>
                    <tr>
                        <td>{t('ProductGroup')}:</td>
                        <td className={'font-bold'}>

                            {
                                product.listProductGroupId && product.listProductGroupId.length > 0 &&
                                product.listProductGroupId.map((it, idx) => {
                                    return (<span className={' product-tag me-3'} key={idx}>
                                        <DisplayTextFormSelectDataSource datasource={productGroup_ds}
                                                                         value={it}></DisplayTextFormSelectDataSource>
                                    </span>);
                                })
                            }
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                            <Space wrap className={'pt-2'}>
                                <Tag className={'px-5'}>
                                    <BoolStatusIcon status={product.isActived}/>
                                    <span className={'font-semibold'}>{t('dang_hoat_dong')}</span>
                                </Tag>
                                <Tag className={'px-5'}>
                                    <BoolStatusIcon status={product.isProductUseInventory}/>
                                    <span className={'font-semibold'}>{t('IsProductUseInventory')}</span>
                                </Tag>
                                <Tag className={'px-5'}>
                                    <BoolStatusIcon status={product.isProductUseLotNumber}/>
                                    <span className={'font-semibold'}>{t('IsProductUseLotNumber')}</span>
                                </Tag>
                            </Space>
                        </td>
                    </tr>
                    <tr>
                        <td>{t('Description')}:</td>
                        <td className={'font-bold'}>

                            {
                                product.description &&
                                <p className={'product-description'}>
                                    {product.description}
                                </p>
                            }
                        </td>
                    </tr>
                    </tbody>
                </table>

            </Col>
            <Col span={24}>
                <ProductUnitList units={productDetailStore.units} product={props.product}/>
            </Col>
        </Row>
        {/*<OrdCreateOrUpdateModal stored={mainStore}*/}
        {/*                        onSavedSuccess={onSavedSuccess}*/}
        {/*                        entityForm={() => <ProductUpdateForm/>}/>*/}

        {/*<Form form={form} disabled>*/}
        {/*    <ProductBaseInformationGroup mode={'detail'}/>*/}
        {/*    <ProductPriceAndInventoryGroup mode={'detail'}/>*/}
        {/*</Form>*/}
        {/*{*/}
        {/*    product.isEditable && <Button size={'small'} type='default'*/}
        {/*                                  onClick={openEdit}>*/}
        {/*        <EditOutlined/>{t('EditProductInfor')}</Button>*/}
        {/*}*/}

    </>);
}
