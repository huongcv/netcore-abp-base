import React from "react";
import {
    CheckboxFieldConfig,
    CustomFieldConfig,
    DateFieldConfig,
    FormBuilderConfig,
    FormFieldConfig,
    InputFieldConfig,
    SelectFieldConfig
} from "@ord-components/forms/form-builder/types";
import {OrdFormBuilder} from "@ord-components/forms/form-builder/index";

export class FormBuilder {
    private fields: FormFieldConfig[] = [];

    // Text Input
    addText(options: InputFieldConfig): FormBuilder {
        this.fields.push({
            type: "input",
            span: 24,
            ...options,
        });
        return this;
    }


    // Select Dropdown
    addSelect(options: SelectFieldConfig): FormBuilder {
        this.fields.push({
            type: 'select',
            span: 24,
            ...options,
        });
        return this;
    }

    // Date Picker
    addDate(options: DateFieldConfig): FormBuilder {
        this.fields.push({
            type: 'date',
            span: 24,
            ...options,
        });
        return this;
    }

    // Checkbox
    addCheckbox(options: CheckboxFieldConfig): FormBuilder {
        this.fields.push({
            type: 'checkbox',
            span: 24,
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
            span: 24,
            ...customOptions
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