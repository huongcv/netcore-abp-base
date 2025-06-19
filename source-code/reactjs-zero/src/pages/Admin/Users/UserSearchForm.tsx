import {Col, Form, FormInstance} from "antd";
import React from "react";
import {useTranslation} from "react-i18next";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {SearchIsActived} from "@ord-components/forms/search/SearchIsActived";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";

export const UserSearchForm = () => {
    const {t} = useTranslation('common');
    return (<>
        <Col {...useResponsiveSpan(10)}>
            <FloatLabel label={t('BirthDay')}>
                <Form.Item name='birthDay'>
                    <OrdDateRangeInput allowEq/>
                </Form.Item>
            </FloatLabel>

        </Col>
        <SearchIsActived span={4}/>
        <SearchFilterText span={8}/>
    </>);
}
