import React from "react";
import {
    CheckboxFieldConfig, CustomContentFieldConfig,
    CustomFieldConfig,
    DateFieldConfig,
    DateRangeFieldConfig,
    FormBuilderConfig,
    FormFieldConfig,
    InputFieldConfig,
    InputRegexFieldConfig,
    NumberFieldConfig,
    SearchInputFieldConfig,
    SelectFieldConfig,
    TextareaFieldConfig
} from "@ord-components/forms/form-builder/types";
import {OrdFormBuilder} from "@ord-components/forms/form-builder/index";

export class FormBuilder {
    private fields: FormFieldConfig[] = [];

    private addField<T extends FormFieldConfig>(type: FormFieldConfig["type"], options: Omit<T, "type">): FormBuilder {
        this.fields.push({type, ...options} as FormFieldConfig);
        return this;
    }

    addText(options: InputFieldConfig) {
        return this.addField("input", options);
    }

    addRegexText(options: InputRegexFieldConfig) {
        return this.addField("input-regex", options);
    }

    addTextArea(options: TextareaFieldConfig) {
        return this.addField("textarea", options);
    }

    addPassword(options: TextareaFieldConfig) {
        return this.addField("password", options);
    }

    addNumber(options: NumberFieldConfig) {
        return this.addField("number", options);
    }

    addSelect(options: SelectFieldConfig) {
        return this.addField("select", options);
    }

    addDate(options: DateFieldConfig) {
        return this.addField("date", options);
    }

    addDateRange(options: DateRangeFieldConfig) {
        return this.addField("date-range", options);
    }

    addCheckbox(options: CheckboxFieldConfig) {
        return this.addField("checkbox", {
            ...options,
            label: options.checkboxText || options.label
        });
    }

    addCustom(options: CustomFieldConfig) {
        // @ts-ignore
        return this.addField("custom", options);
    }

    addCustomFieldContent(options: CustomContentFieldConfig) {
        // @ts-ignore
        return this.addField("custom-field-content", options);
    }

    addSearchInput(options: SearchInputFieldConfig) {
        // @ts-ignore
        return this.addField("search-input", options);
    }

    addIf(condition: boolean, callback: (builder: FormBuilder) => FormBuilder) {
        return condition ? callback(this) : this;
    }

    build(): FormBuilderConfig {
        return {fields: this.fields};
    }

    buildComponent(): React.FC {
        const config = this.build();
        return () => <OrdFormBuilder config={config}/>;
    }
}
