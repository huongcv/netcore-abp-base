import {DatePicker} from "antd";
import * as React from "react";
import {useEffect, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {IOrdDateInputProp} from "@ord-components/forms/model/DateProp";
import {DateIcon} from "@ord-components/icon/DateIcon";


const OrdDateInput = (props: IOrdDateInputProp) => {
    const [valueDayjs, setValueDayjs] = useState();
    useEffect(() => {
        if (!!props.value) {
            // @ts-ignore
            setValueDayjs(dayjs(props.value));
        } else {
            // @ts-ignore
            setValueDayjs(null);
        }
    }, [props.value]);
    const onDateChange = (date: Dayjs, dateString: string | string[]) => {
        if (!date) {
            submitValue(null);
        } else {
            let p_date = date.toDate();
            // const userTimezoneOffset = p_date.getTimezoneOffset() * 60000;
            submitValue(p_date)
        }
    }
    const submitValue = (v: Date | null) => {
        if (props.onChange) {
            props.onChange(v);
        }
    }
    return (<DatePicker style={{width: '100%'}}
                        className={props.classNames}
                        suffixIcon={!props.hiddenSuffixIcon && <DateIcon/>}
                        format={{
                            format: 'DD/MM/YYYY',
                            type: 'mask',
                        }}
                        placeholder={'Ngày/Tháng/Năm'}
                        {...props}
                        value={valueDayjs}
                        onChange={(date, dateString) => {
                            onDateChange(date, dateString);
                        }}/>);
}
export default OrdDateInput;
