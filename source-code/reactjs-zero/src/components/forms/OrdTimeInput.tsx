import {DatePicker, TimePicker} from "antd";
import * as React from "react";
import {useEffect, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {IOrdDateInputProp} from "@ord-components/forms/model/DateProp";
import {DateIcon} from "@ord-components/icon/DateIcon";
import {ICommonInputProp} from "@ord-components/forms/model/ICommonInputProp";
import DateUtil from "@ord-core/utils/date.util";
import Utils from "@ord-core/utils/utils";


const OrdTimeInput = (props: {
    value?:string
    hiddenSuffixIcon?: boolean | undefined;
    classNames?: any;
    disable?:boolean
    format?:string;
    defaultValue?:string
    allowClear?: boolean;
    onChange?: (time: string | null) => void;
    disabledTime?: (current: Dayjs | null) => {
        disabledHours?: () => number[];
        disabledMinutes?: (selectedHour: number) => number[];
        disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
    };
} ) => {
    const [valueTimejs, setValueTimejs] = useState();
    const now = dayjs()


    useEffect(() => {
        if (!!props.value) {
            // @ts-ignore
            setValueTimejs(DateUtil.createDateWithTime(props.value));
            return;
        } else
            if(!!props.defaultValue){
            // @ts-ignore
            setValueTimejs(DateUtil.createDateWithTime(props.defaultValue));
            return;
        }
        else {
            // @ts-ignore
            setValueTimejs(null);

        }
    }, [props.value]);
    const format = "HH:mm"

    const onDateChange = (date: Dayjs, dateString: string | string[]) => {
        if (!date) {
            submitValue(null);
        } else {

            let p_date = date.toDate();
            const userTimezoneOffset = p_date.getTimezoneOffset() * 60000;
            submitValue(p_date)
        }
    }
    const submitValue = (v: Date | null) => {
        if (props.onChange) {
            props.onChange(v?`${ Utils.pad2Number(v.getHours())}:${Utils.pad2Number(v.getMinutes())}`:null);
        }
    }
    return (<TimePicker style={{width: '100%'}}
                        className={props.classNames}
                        suffixIcon={!props.hiddenSuffixIcon && <DateIcon/>}
                        format={{
                            format: "HH:mm",
                            type: 'mask',
                        }}
                        placeholder={'HH:mm'}
                        {...props}
                        value={valueTimejs}
                        disabled={props.disable}
                        defaultValue={valueTimejs}
                        disabledTime={props.disabledTime}
                        onChange={(date, dateString) => {
                            onDateChange(date, dateString);
                        }}/>);
}
export default OrdTimeInput;
