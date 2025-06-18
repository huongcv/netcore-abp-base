export enum DiscountTypeEnum {
    Value = 1,
    Percent = 2
}

export function isValidDiscountType(value: any): value is DiscountTypeEnum {
    return Object.values(DiscountTypeEnum).includes(value);
}

export  function parseDiscountType(value: any): DiscountTypeEnum | undefined {
    const values = Object.values(DiscountTypeEnum);
    // Nếu enum là number enum thì values sẽ gồm cả số và string
    // nên mình filter lấy kiểu number
    const numericValues = values.filter(v => typeof v === 'number');

    const numValue = Number(value);
    if (numericValues.includes(numValue)) {
        return numValue as DiscountTypeEnum;
    }

    return undefined;
}
