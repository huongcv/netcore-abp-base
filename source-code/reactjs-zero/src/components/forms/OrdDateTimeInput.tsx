import {DatePicker} from "antd";
import * as React from "react";
import {useEffect, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {IOrdDateInputProp} from "@ord-components/forms/model/DateProp";
import {DateIcon} from "@ord-components/icon/DateIcon";


const OrdDateTimeInput = (props: IOrdDateInputProp) => {
    const [valueDayjs, setValueDayjs] = useState();
    const {disabledDate, disabledTime, ...rest} = props; 
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
    // @ts-ignore
    return (<DatePicker style={{width: '100%'}} suffixIcon={<DateIcon/>}
                        format={{
                            format: 'DD/MM/YYYY HH:mm',
                            type: 'mask',
                        }}
                        disabledDate={props.disabledDate}
                        disabledTime={props.disabledTime}
                        {...rest}
                        showTime={true}
                        onChange={onDateChange}
                        value={valueDayjs}/>);
}
export default OrdDateTimeInput;
