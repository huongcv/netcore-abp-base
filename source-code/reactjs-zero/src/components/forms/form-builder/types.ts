import {CheckboxProps, ColProps, FormItemProps, InputProps} from 'antd';
import {Rule} from 'antd/es/form';
import React from 'react';
import {IOrdSelectProp} from "@ord-components/forms/select/OrdSelect";
import {IOrdDateInputProp} from "@ord-components/forms/model/DateProp";

export type FormFieldType =
    | 'input'
    | 'textarea'
    | 'number'
    | 'password'
    | 'select'
    | 'checkbox'
    | 'date'
    | 'dateTime'
    | 'time'
    | 'switch'
    | 'radio'
    | 'custom';

export interface BaseFormFieldConfig {
    name: string;
    type?: FormFieldType;
    label?: React.ReactNode;
    required?: boolean;
    rules?: Rule[];
    span?: number; // Col span
    colProps?: ColProps;
    formItemProps?: Omit<FormItemProps, 'name' | 'label' | 'rules'>;
    hidden?: boolean;
    disabled?: boolean;
    initialValue?: any;
    autoFocus?: boolean;
    componentProps?: any;
}

export interface InputFieldConfig extends BaseFormFieldConfig {
    maxLength: number;
    componentProps?: InputProps;
}

export interface SelectFieldConfig extends BaseFormFieldConfig {
    componentProps: IOrdSelectProp;
}

export interface CheckboxFieldConfig extends BaseFormFieldConfig {
    componentProps?: CheckboxProps;
    checkboxText?: string;
}

export interface DateFieldConfig extends BaseFormFieldConfig {
    componentProps: IOrdDateInputProp;
}

export interface CustomFieldConfig extends BaseFormFieldConfig {
    render: () => React.ReactNode;
}

export type FormFieldConfig = BaseFormFieldConfig;

export interface FormBuilderConfig {
    fields: BaseFormFieldConfig[];
    gutter?: [number, number];
    layout?: 'horizontal' | 'vertical' | 'inline';
    autoFocusFirst?: boolean;
}