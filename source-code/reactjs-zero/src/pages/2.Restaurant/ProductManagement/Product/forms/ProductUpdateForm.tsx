import {observer} from "mobx-react-lite";
import React, {useEffect, useState} from "react";
import {ProductBaseInformationGroup, ProductTypeEnum} from "@pages/ProductManagement/Product/forms/BaseInforGroup";
import {Col, Form, Row} from "antd";
import {ProductImgDetail} from "@pages/ProductManagement/Product/detail/ProductImgDetail";
import {useStore} from "@ord-store/index";
import {ProductDto} from "@api/index.defs";
import ProductUpdateBottomForm from "@pages/ProductManagement/Product/forms/ProductUpdateBottomForm";
import { useTranslation } from "react-i18next";

const ProductUpdateForm = () => {
    const {productStore: mainStore} = useStore();
    const [productDto, setProductDto] = useState<ProductDto | null>(null);
    const formInstance = Form.useFormInstance();
    const productType_w = Form.useWatch('productTypeId', formInstance);
    const {t} = useTranslation("product");

    useEffect(() => {
        if (mainStore.entityUpdateData) {
            setProductDto(mainStore.entityUpdateData);
            formInstance.setFieldValue("productImg", mainStore.entityUpdateData.imageUrl)
        }
    }, [mainStore.entityUpdateData]);

    return (<>
        {
            productDto &&
            <Row gutter={16}>
                <Col flex="0 1 200px">
                    <ProductImgDetail fileId={productDto.imageUrl}
                                      productIdHash={productDto.idHash}
                    />
                    {/* <Form.Item noStyle name='productImg'>
                        <OrdImgCrop removeImgInDb={removeImgInDb} aspect={1}/>
                    </Form.Item> */}
                    {/* 
                       + Muốn sử dụng OrdImgCrop cần mở comment removeImgInDb bên trên
                       + Mở comment else ở trong store productStore
                       + // productDto.ImageUrl = productEntity.ImageUrl; phía back end
                    */}
                </Col>
                <Col flex="1 1 200px">
                    <ProductBaseInformationGroup mode={'edit'}/>
                </Col>

                {
                    productType_w !== ProductTypeEnum.DichVu &&
                    <ProductUpdateBottomForm mode={'update'}/>
                }
            </Row>
        }
    </>)
}
export default observer(ProductUpdateForm);
