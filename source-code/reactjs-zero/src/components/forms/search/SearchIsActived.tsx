import {useTranslation} from "react-i18next";
import {Col, Form} from "antd";
import React from "react";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectIsActived} from "@ord-components/forms/select/selectDataSource/useSelectIsActived";
import {ISearchProp} from "@ord-components/forms/search/ISearchProp";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import FloatLabel from "@ord-components/forms/FloatLabel";

export const SearchIsActived = (props: ISearchProp) => {
    const {t} = useTranslation('common');
    // @ts-ignore
    return (<>
        <Col {...props} {...useResponsiveSpan(props?.span || 4)}>
            <FloatLabel label={t('filterIsActived')}>
                <Form.Item name='isActived'>
                    <OrdSelect datasource={useSelectIsActived()} allowClear
                               placeholder={t('filterSelectCommonPlaceholder')}/>
                </Form.Item>
            </FloatLabel>

        </Col>
    </>);
}
