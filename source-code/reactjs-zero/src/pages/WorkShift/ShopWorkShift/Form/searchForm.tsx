import {useTranslation} from "react-i18next";
import {Col, Form} from "antd";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import React from "react";

export const ShopWorkShiftSearchForm = () => {
    const {t} = useTranslation('work-shift');
    return (
        <>
            <Col {...useResponsiveSpan(10)}>
                <FloatLabel label={t('dateRange')}>
                    <Form.Item name='dateRange'>
                        <OrdDateRangeInput />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <SearchFilterText span={8}/>
        </>
    )
}