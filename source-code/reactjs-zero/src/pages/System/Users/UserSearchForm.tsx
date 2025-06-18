import {Col, Form, FormInstance} from "antd";
import React from "react";
import {useTranslation} from "react-i18next";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {SearchIsActived} from "@ord-components/forms/search/SearchIsActived";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";

export const UserSearchForm = (props: {
    searchFormRef: FormInstance
}) => {
    const {t: tCommon} = useTranslation('common');
    const {t} = useTranslation('user-list');
    return (<>
        <Col {...useResponsiveSpan(10)}>
            <FloatLabel label={tCommon('BirthDay')}>
                <Form.Item name='birthDay'>
                    <OrdDateRangeInput allowEq/>
                </Form.Item>
            </FloatLabel>

        </Col>
        <SearchFilterText span={8} placeHolder={t('placeholder')}/>
    </>);
}
