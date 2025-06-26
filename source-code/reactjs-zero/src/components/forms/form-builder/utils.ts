import ValidateUtils from "@ord-core/utils/validate.utils";

export class ValidationRules {
    static required = (message?: string) => ValidateUtils.required;
    static email = ValidateUtils.email;
    static phone = ValidateUtils.phoneNumberVietNam;
    //static url = ValidateUtils.url;
    static minLength = (min: number, message?: string) => ValidateUtils.minLength(min);
    static maxLength = (max: number, message?: string) => ValidateUtils.maxLength(max, message);
    static pattern = (pattern: RegExp, message: string) => ({pattern, message});
    static custom = (validator: (rule: any, value: any) => Promise<void>) => ({validator});
}