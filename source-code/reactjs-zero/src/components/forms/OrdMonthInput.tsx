import {DatePicker, DatePickerProps} from "antd";
import * as React from "react";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { IOrdDateInputProp } from "@ord-components/forms/model/DateProp";
import { DateIcon } from "@ord-components/icon/DateIcon";

const OrdMonthInput = (props: IOrdDateInputProp) => {
    const [valueDayjs, setValueDayjs] = useState<dayjs.Dayjs | null>(null);
    useEffect(() => {
        if (!!props.value) {
            setValueDayjs(dayjs(props.value));
        } else {
            setValueDayjs(null);
        }
    }, [props.value]);

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        // setValueDayjs(date);
        props.onChange?.(date?.toDate());
    };

    return (
        <DatePicker
            style={{ width: '100%' }}
            className={props.classNames}
            suffixIcon={!props.hiddenSuffixIcon && <DateIcon />}
            picker="month"
            placeholder={'MM/YYYY'}
            {...props}
            value={valueDayjs}
            onChange={onChange}
        />
    );
};

export default OrdMonthInput;
