import {TenantDto} from "@api/index.defs";
import {Form, Input} from "antd";
import {SearchIsActived} from "@ord-components/forms/search/SearchIsActived";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import React, {useEffect} from "react";

const ShopFormSearch = (props: {
    tenant?: TenantDto,
    onReset?: () => void;
}) => {
    const form = Form.useFormInstance();
    useEffect(() => {
        if (props.tenant) {
            form.setFieldValue('tenantId', props.tenant.id);
        }
    }, [props.tenant]);

    return (
        <>
            {
                props.tenant && (
                    <Form.Item hidden name='tenantId'>
                        <Input/>
                    </Form.Item>
                )
            }
            <SearchIsActived/>
            <SearchFilterText onReset={props.onReset}/>
        </>
    );
};
export default (ShopFormSearch);
