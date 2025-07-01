import React, {useMemo} from 'react';
import {Row} from 'antd';
import {FormBuilderConfig} from './types';
import FormFieldItem from "@ord-components/forms/form-builder/FormFieldItem";

interface FormBuilderComponentProps {
    config: FormBuilderConfig;
    disableResponsiveCol?: boolean;
    ignoreRowWrapper?: boolean;
}

export const OrdFormBuilder: React.FC<FormBuilderComponentProps> = ({
                                                                        config,
                                                                        disableResponsiveCol,
                                                                        ignoreRowWrapper = false,
                                                                    }) => {
    const visibleFields = useMemo(() => config.fields.filter(field => !field.hidden), [config.fields]);
    const FormContent = <>
        {visibleFields.map((field, index) => (
            <FormFieldItem
                key={`field-${field?.name}-${index}`}
                field={field}
                disableResponsiveCol={disableResponsiveCol}
            />
        ))}
    </>;
    if (ignoreRowWrapper) {
        return FormContent
    }
    return (
        <Row gutter={18}>
            {FormContent}
        </Row>
    );
};