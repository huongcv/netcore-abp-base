import {Form} from "antd";
import React from "react";
import './index.scss';
import {
    ModeProps,
    ProductUnitTableFormList
} from "@pages/ProductManagement/Product/forms/units/ProductUnitTableFormList";

export const ProductUnitBoxForm = (props: ModeProps) => {
    const [form] = Form.useForm();
    const add = () => {
        const unitItems = form.getFieldValue('unitItems') || [];
        form.setFieldValue('unitItems', [...unitItems, {}]);
    }
    return (<>
           <ProductUnitTableFormList mode={props.mode}/>
    </>);
}
