import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import React, {useEffect, useState} from "react";
import {Form} from "antd";
import {useTranslation} from "react-i18next";
import {useDebounce} from "use-debounce";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";
import OrdYearInput from "@ord-components/forms/OrdYearInput";
import FloatLabel from "@ord-components/forms/FloatLabel";

export const PayrollSearch = (props: {
    defaultYear?: number
}) => {
    const {t} = useTranslation('payroll');
    const form = Form.useFormInstance();
    const [statusChange, setStatusChange] = useState(0);
    const [debouncedStatus] = useDebounce(statusChange, 300);

    useEffect(() => {
        form.setFieldValue('year', props.defaultYear);
    }, []);

    useEffect(() => {
        if (debouncedStatus > 0) {
            form.submit();
        }
    }, [debouncedStatus]);

    return (
        <>
            <ColSpanResponsive span={4}>
                <FloatLabel label={t('year')}>
                    <Form.Item name='year' >
                        <OrdYearInput/>
                    </Form.Item>
                </FloatLabel>
            </ColSpanResponsive>
            <SearchFilterText span={12}/>
        </>
    )
}
