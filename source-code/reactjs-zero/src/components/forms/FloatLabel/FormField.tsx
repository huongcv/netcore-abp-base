// components/forms/FormField.tsx
import React from "react";
import {Form, Input, Checkbox} from "antd";
import {FloatFieldLabel} from "@ord-components/forms/FloatLabel";
import {FieldLabel} from "@ord-components/forms/FloatLabel";
import {Rule} from "antd/es/form";

export interface FormFieldProps {
    label: React.ReactNode;
    name: string;
    required?: boolean;
    children?: React.ReactNode;
    rules?: Rule[];
    disabled?: boolean;
    isCheckbox?: boolean;
    placeholder?: string;
    valuePropName?: string;
    maxLength?: number | undefined;
    initialValue?: any;

}

export const OrdFormField = ({
                                 label,
                                 name,
                                 required,
                                 rules = [],
                                 children,
                                 disabled,
                                 isCheckbox,
                                 placeholder,
                                 valuePropName,
                                 maxLength,
                                 initialValue
                             }: FormFieldProps) => {
    if (isCheckbox) {
        return (
            <Form.Item name={name} valuePropName={valuePropName || "checked"} initialValue={initialValue}>
                <Checkbox disabled={disabled}><FieldLabel label={'check_box.' + label}/></Checkbox>
            </Form.Item>
        );
    }

    return (
        <FloatFieldLabel label={label} required={required}>
            <Form.Item name={name} rules={rules} initialValue={initialValue}>
                {children || <Input disabled={disabled} placeholder={placeholder} maxLength={maxLength}/>}
            </Form.Item>
        </FloatFieldLabel>
    );
};
