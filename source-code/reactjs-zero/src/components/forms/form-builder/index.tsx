import React, {useMemo} from 'react';
import {Row} from 'antd';
import {FormBuilderConfig} from './types';
import FormFieldItem from "@ord-components/forms/form-builder/FormFieldItem";

interface FormBuilderComponentProps {
    config: FormBuilderConfig;
    disableResponsiveCol?: boolean;
}

export const OrdFormBuilder: React.FC<FormBuilderComponentProps> = ({config, disableResponsiveCol}) => {
    const visibleFields = useMemo(() => config.fields.filter(field => !field.hidden), [config.fields]);
    return (
        <Row gutter={18}>
            {visibleFields.map((field, index) => (
                <FormFieldItem
                    key={field.name || `field-${index}`}
                    field={field}
                    disableResponsiveCol={disableResponsiveCol}
                />
            ))}
        </Row>
    );
};