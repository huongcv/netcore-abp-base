import React from "react";
import {
    CheckboxFieldConfig,
    CustomFieldConfig,
    DateFieldConfig, DateRangeFieldConfig,
    FormBuilderConfig,
    FormFieldConfig,
    InputFieldConfig, SearchInputFieldConfig,
    SelectFieldConfig, TextareaFieldConfig
} from "@ord-components/forms/form-builder/types";
import {OrdFormBuilder} from "@ord-components/forms/form-builder/index";

export class FormBuilder {
    private fields: FormFieldConfig[] = [];

    // Text Input
    addText(options: InputFieldConfig): FormBuilder {
        this.fields.push({
            type: "input",
            ...options,
        });
        return this;
    }

    addTextArea(options: TextareaFieldConfig): FormBuilder {
        this.fields.push({
            type: "textarea",
            ...options,
        });
        return this;
    }

    addPassword(options: TextareaFieldConfig): FormBuilder {
        this.fields.push({
            type: "password",
            ...options,
        });
        return this;
    }


    // Select Dropdown
    addSelect(options: SelectFieldConfig): FormBuilder {
        this.fields.push({
            type: 'select',
            ...options,
        });
        return this;
    }

    // Date Picker
    addDate(options: DateFieldConfig): FormBuilder {
        this.fields.push({
            type: 'date',
            ...options,
        });
        return this;
    }

    addDateRange(options: DateRangeFieldConfig): FormBuilder {
        this.fields.push({
            type: 'date-range',
            ...options,
        });
        return this;
    }

    // Checkbox
    addCheckbox(options: CheckboxFieldConfig): FormBuilder {
        this.fields.push({
            type: 'checkbox',
            ...options,
            label: options?.checkboxText || options?.label
        });
        return this;
    }

    // Custom Field
    addCustom(render: () => React.ReactNode): FormBuilder {
        const customOptions = {
            render: render
        } as CustomFieldConfig;
        this.fields.push({
            type: 'custom',
            ...customOptions
        });
        return this;
    }

    addSearchInput(options: SearchInputFieldConfig) {
        this.fields.push({
            name: '',
            type: 'search-input',
            ...options
        });
        return this;
    }

    // Conditional field adding
    addIf(condition: boolean, callback: (builder: FormBuilder) => FormBuilder): FormBuilder {
        if (condition) {
            return callback(this);
        }
        return this;
    }

    // Build final config
    build(): FormBuilderConfig {
        return {
            fields: this.fields
        };
    }

    // Build and return React component
    buildComponent(): React.FC {
        const config = this.build();
        return () => <OrdFormBuilder config={config}/>;
    }

}