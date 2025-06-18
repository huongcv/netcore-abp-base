import React from 'react';
import PropTypes from 'prop-types';
import {ProductImgUpload} from "@pages/ProductManagement/Product/forms/upload-img/ProductImgUpload";
import {Form} from "antd";

const ProductLeftForm = (props:{

}) => {
    return (
        <div>
            <Form.Item noStyle name='productImg'>
                <ProductImgUpload/>
            </Form.Item>
        </div>
    );
};

ProductLeftForm.propTypes = {

};

export default ProductLeftForm;