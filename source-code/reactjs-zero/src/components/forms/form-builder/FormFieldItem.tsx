import React, {useCallback, useMemo} from 'react';
import {Col} from 'antd';
import {OrdFormField} from "@ord-components/forms/FloatLabel/FormField";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import {ValidationRules} from "@ord-components/forms/form-builder/utils";
import {CustomContentFieldConfig, CustomFieldConfig, FormFieldConfig} from './types';
import {useFormFieldComponent} from './useFormFieldComponent';

interface FormFieldItemProps {
    field: FormFieldConfig;
    disableResponsiveCol?: boolean;
}

/**
 * Component tối ưu để render form field với memo và useMemo
 */
const FormFieldItem: React.FC<FormFieldItemProps> = (props: FormFieldItemProps) => {
    const {field, disableResponsiveCol = false} = props;

    // Destructure field properties với useMemo để tránh re-computation
    const fieldConfig = useMemo(() => {
        const {
            name,
            label,
            type,
            required = false,
            rules = [],
            span = 24,
            formItemProps = {},
            hidden = false,
            disabled,
            initialValue
        } = field;

        return {
            name,
            label,
            type,
            required,
            rules,
            span,
            formItemProps,
            hidden,
            disabled,
            initialValue
        };
    }, [field]);

    // Early return cho hidden fields
    if (fieldConfig.hidden) {
        return null;
    }

    // Memoize responsive span calculation
    const responsiveSpan = useResponsiveSpan(fieldConfig.span, disableResponsiveCol);

    // Memoize validation rules
    const finalRules = useMemo(() => {
        const {required, rules} = fieldConfig;
        let final_rules = rules || [];
        if (required) {
            final_rules = [ValidationRules.required(), ...rules]
        }
        // @ts-ignore
        const maxLength: number = fieldConfig?.maxLength;
        if (maxLength && maxLength > 0) {
            final_rules = [...final_rules, ValidationRules.maxLength(maxLength)];
        }
        return final_rules;
    }, [fieldConfig.required, fieldConfig.rules]);

    // Memoize common field props
    const commonFieldProps = useMemo(() => ({
        label: fieldConfig.label ?? fieldConfig.name,
        name: fieldConfig.name ?? '',
        rules: finalRules,
        required: fieldConfig.required,
        initialValue: fieldConfig.initialValue,
        ...fieldConfig.formItemProps,
        disabled: fieldConfig.disabled,
    }), [
        fieldConfig.label,
        fieldConfig.name,
        fieldConfig.required,
        fieldConfig.initialValue,
        fieldConfig.disabled,
        fieldConfig.formItemProps,
        finalRules
    ]);

    // Get field component với dependency chính xác
    const fieldComponent = useFormFieldComponent(field);

    // Memoize render component function
    const renderComponent = useCallback(() => {
        const {type} = fieldConfig;

        if (!type) {
            return null;
        }

        // Custom field
        if (type === 'custom') {
            // @ts-ignore
            const customConfig = field as CustomFieldConfig;
            return customConfig.render();
        }
        // Checkbox field
        if (type === 'checkbox') {
            return (
                // @ts-ignore
                <OrdFormField {...commonFieldProps} isCheckbox={true}/>
            );
        }
        if (type === 'custom-field-content') {
            const customConfig = field as CustomContentFieldConfig;
            return (
                <OrdFormField {...commonFieldProps}>
                    {customConfig.content}
                </OrdFormField>
            );
        }
        // No field component
        if (!fieldComponent) {
            return null;
        }
        // Search input field (special case)
        if (type === 'search-input') {
            return fieldComponent;
        }

        // Default wrapped field
        return (
            <OrdFormField {...commonFieldProps}>
                {fieldComponent}
            </OrdFormField>
        );
    }, [
        fieldConfig.type,
        field, // For custom field
        commonFieldProps,
        fieldComponent
    ]);

    // Memoize the entire component render
    const componentContent = useMemo(() => {
        return renderComponent();
    }, [renderComponent]);
    if (fieldConfig.type == 'custom') {
        return (
            <>
                {componentContent}
            </>

        );
    }

    return (
        <>
            <Col key={fieldConfig.name || 'field'} {...responsiveSpan}>
                {componentContent}
            </Col>
        </>

    );
};
// ✅ Memo hóa
export default React.memo(FormFieldItem, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.field) === JSON.stringify(nextProps.field)
        && prevProps.disableResponsiveCol === nextProps.disableResponsiveCol;
});