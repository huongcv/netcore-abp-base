import React from 'react';
import {Checkbox, Input, InputNumber} from 'antd';
import {FormFieldConfig, FormFieldType, InputFieldConfig} from './types';
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import OrdDateRangeInput from "@ord-components/forms/OrdDateRangeInput";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import OrdInputRegexText from "@ord-components/forms/OrdInputRegexText";
import {FieldLabel} from "@ord-components/forms/FloatLabel";

const {TextArea} = Input;

export const useFormFieldComponent = (
    field: FormFieldConfig
): React.ReactNode => {
    const {
        type,
        disabled,
        autoFocus,
        componentProps
    } = field;
    const focusRef = useAutoFocus();
    const baseProps = {
        ...componentProps,
        disabled,
        ref: autoFocus ? focusRef : undefined,
        autoFocus
    };

    if (!type) {
        return null;
    }
    const renderInput = () => {
        const inputOptions = field as InputFieldConfig;
        const inputTextProps = {
            ...baseProps,
            maxLength: inputOptions.maxLength
        };
        switch (type) {
            case 'textarea':
                return <TextArea autoSize={{minRows: 3, maxRows: 5}} {...inputTextProps} />;
            case 'password':
                return <Input.Password {...inputTextProps} />;
            default:
                return <Input {...inputTextProps} />;
        }
    };

    const map: Record<FormFieldType, React.ReactNode> = {
        input: renderInput(),
        textarea: renderInput(),
        password: renderInput(),
        select: <OrdSelect {...baseProps} />,
        date: <OrdDateInput {...baseProps} />,
        'date-range': <OrdDateRangeInput {...baseProps} />,
        'search-input': <SearchFilterText {...baseProps} span={24}/>,
        number: <InputNumber {...baseProps} />,
        checkbox: <Checkbox {...baseProps} ><FieldLabel label={'check_box.'}/></Checkbox>,
        dateTime: undefined,
        time: undefined,
        switch: undefined,
        radio: undefined,
        custom: undefined,
        'input-regex': <OrdInputRegexText {...baseProps} />,
        'custom-field-content': undefined
    };
    return map[type] ?? null;
};
