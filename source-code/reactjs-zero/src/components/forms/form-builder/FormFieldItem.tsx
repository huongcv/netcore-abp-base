import React from 'react';
import {Col, Input} from 'antd';
import {OrdFormField} from "@ord-components/forms/FloatLabel/FormField";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import {ValidationRules} from "@ord-components/forms/form-builder/utils";
import {FormFieldConfig} from './types';
import {useFormFieldComponent} from './useFormFieldComponent';

interface FormFieldItemProps {
    field: FormFieldConfig;
    disableResponsiveCol?: boolean;
}

const FormFieldItem: React.FC<FormFieldItemProps> = ({field, disableResponsiveCol}) => {
    const {
        name,
        label,
        type,
        required,
        rules = [],
        span = 24,
        formItemProps,
        hidden,
        disabled,
        initialValue
    } = field;
    if (hidden) return null;

    const finalRules = required && !rules.some(rule => 'required' in rule && rule.required)
        ? [ValidationRules.required(), ...rules]
        : rules;

    const commonFieldProps = {
        label: label ?? name,
        name: name ?? '',
        rules: finalRules,
        required,
        initialValue,
        disabled,
        ...formItemProps,
    };


    const fieldComponent = useFormFieldComponent(field);
    const renderComponent = () => {
        if (!type) {
            return null;
        }
        if (type === 'custom' && typeof (field as any).render === 'function') {
            const customConfig = field as any;
            return customConfig.render();
        }
        if (type === 'checkbox') {
            return <OrdFormField {...commonFieldProps} isCheckbox={true}>
            </OrdFormField>;
        }
        if (!fieldComponent) return null;
        if (type === 'search-input') {
            return fieldComponent;
        }
        return <OrdFormField {...commonFieldProps}>{fieldComponent}</OrdFormField>;
    };

    return (
        <Col key={name || 'field'} {...useResponsiveSpan(span, disableResponsiveCol)}>
            {renderComponent()}
        </Col>
    );
};

// ✅ Memo hóa
export default React.memo(FormFieldItem, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.field) === JSON.stringify(nextProps.field)
        && prevProps.disableResponsiveCol === nextProps.disableResponsiveCol;
});
