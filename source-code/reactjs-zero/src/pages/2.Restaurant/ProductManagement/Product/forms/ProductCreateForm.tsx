import {observer} from "mobx-react-lite";
import {Col, Form, Row} from "antd";
import {ProductBaseInformationGroup, ProductTypeEnum} from "@pages/ProductManagement/Product/forms/BaseInforGroup";
import ProductCreateBottomForm from "@pages/ProductManagement/Product/forms/ProductCreateBottomForm";
import {OrdImgCrop} from "../../../../components/forms/croping-img/OrdImgCrop";

const ProductCreateForm = () => {
    const formInstance = Form.useFormInstance();
    const productType_w = Form.useWatch('productTypeId', formInstance);

    return (<>
        <Row gutter={16}>
            <Col flex="0 1 200px">
                <Form.Item noStyle name='productImg'>
                    {/*<ProductImgUpload/>*/}
                    <OrdImgCrop aspect={1}/>
                </Form.Item>
            </Col>
            <Col flex="1 1 200px">
                <ProductBaseInformationGroup mode={'add'}/>
            </Col>
            {
                productType_w !== ProductTypeEnum.DichVu &&
                <ProductCreateBottomForm mode={'create'}/>
            }
        </Row>
    </>)
}
export default observer(ProductCreateForm);
