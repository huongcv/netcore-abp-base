import {CheckboxProps, ColProps, FormItemProps, InputProps} from 'antd';
import {Rule} from 'antd/es/form';
import React from 'react';
import {IOrdSelectProp} from "@ord-components/forms/select/OrdSelect";
import {IOrdDateInputProp} from "@ord-components/forms/model/DateProp";
import {TextAreaProps} from "antd/es/input";
import {IOrdDateRangeInputProp} from "@ord-components/forms/OrdDateRangeInput";
import {ISearchFilterTextProps} from "@ord-components/forms/search/SearchFilterText";
import {IOrdInputRegexTextProp} from "@ord-components/forms/OrdInputRegexText";
import {InputNumberProps} from "rc-input-number/es/InputNumber";

export type FormFieldType =
    | 'input'
    | 'input-regex'
    | 'textarea'
    | 'search-input'
    | 'number'
    | 'password'
    | 'select'
    | 'checkbox'
    | 'date'
    | 'date-range'
    | 'dateTime'
    | 'time'
    | 'switch'
    | 'radio'
    | 'custom';

export interface BaseFormFieldConfig<IComponentProps = any> {
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
    componentProps?: IComponentProps;
}

export interface InputFieldConfig extends BaseFormFieldConfig<InputProps> {
    maxLength: number;
}

export interface InputRegexFieldConfig extends BaseFormFieldConfig<IOrdInputRegexTextProp> {
    maxLength: number;
}

export interface TextareaFieldConfig extends BaseFormFieldConfig<TextAreaProps> {
    maxLength: number;
}

export interface NumberFieldConfig extends BaseFormFieldConfig<InputNumberProps> {
    maxLength: number;
}

export interface SelectFieldConfig extends BaseFormFieldConfig<IOrdSelectProp> {
}

export interface CheckboxFieldConfig extends BaseFormFieldConfig<CheckboxProps> {
    checkboxText?: string;
}

export interface DateFieldConfig extends BaseFormFieldConfig<IOrdDateInputProp> {
}

export interface DateRangeFieldConfig extends BaseFormFieldConfig<IOrdDateRangeInputProp> {
}

export interface SearchInputFieldConfig extends Partial<BaseFormFieldConfig<ISearchFilterTextProps>> {
}


export interface CustomFieldConfig {
    render: () => React.ReactNode;
    span?: number;
}

export type FormFieldConfig = BaseFormFieldConfig;

export interface FormBuilderConfig {
    fields: BaseFormFieldConfig[];
}