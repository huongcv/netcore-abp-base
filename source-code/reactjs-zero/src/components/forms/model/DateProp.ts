import {Dayjs} from "dayjs";
import {ICommonInputProp} from "@ord-components/forms/model/ICommonInputProp";
import {DisabledDate, FormatType} from "rc-picker/lib/interface";
import type {Variant} from "antd/es/config-provider";

export interface IOrdDateInputProp extends ICommonInputProp<string | Date | null | any> {
    defaultValue?: Dayjs | null;
    onChange?: (date: Date | null) => void;
    onOk?: (date: Dayjs) => void;
    disabledDate?: DisabledDate<Dayjs>;
    disabledTime?: (date: Dayjs | null) => {
        disabledHours?: () => number[];
        disabledMinutes?: (hour: number) => number[];
        disabledSeconds?: (hour: number, minute: number) => number[];
    };
    showTime?: boolean
    format?: FormatType<any | Date> | FormatType<any | Date>[] | {
        format: string;
        type?: 'mask';
    };
    hiddenSuffixIcon?: boolean | undefined;
    classNames?: any;
    allowClear?: boolean;
    autoFocus?: boolean;
    variant?: Variant;
    rootClassName?: string;
}
