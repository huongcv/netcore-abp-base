import React from 'react';
import {Col, Input} from 'antd';
import {OrdFormField} from "@ord-components/forms/FloatLabel/FormField";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import {ValidationRules} from "@ord-components/forms/form-builder/utils";
import {FormFieldConfig} from './types';

const {TextArea} = Input;

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
        initialValue,
        autoFocus,
        componentProps
    } = field;

    const focusRef = useAutoFocus();

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

    const componentFieldProps = {
        ...componentProps,
        disabled,
        ref: autoFocus ? focusRef : undefined,
        autoFocus,
    };

    const renderInput = () => {
        switch (type) {
            case 'input':
                return <Input {...componentFieldProps} />;
            case 'textarea':
                return <TextArea {...componentFieldProps} />;
            case 'password':
                return <Input.Password {...componentFieldProps} />;
            default:
                return <Input {...componentFieldProps} />;
        }
    };

    const renderComponent = () => {
        switch (type) {
            case 'input':
            case 'textarea':
            case 'password':
                return <OrdFormField {...commonFieldProps}>{renderInput()}</OrdFormField>;
            case 'select':
                return <OrdFormField {...commonFieldProps}><OrdSelect {...componentFieldProps} /></OrdFormField>;
            case 'date':
                return <OrdFormField {...commonFieldProps}><OrdDateInput {...componentFieldProps} /></OrdFormField>;
            case 'checkbox':
                return <OrdFormField {...commonFieldProps} isCheckbox={true}>
                </OrdFormField>;
            case 'custom':
                const customConfig = field as any;
                return customConfig.render();
            default:
                return null;
        }
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
