import { DatePicker } from "antd";
import * as React from "react";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { IOrdDateInputProp } from "@ord-components/forms/model/DateProp";
import { DateIcon } from "@ord-components/icon/DateIcon";

const OrdYearInput = (props: IOrdDateInputProp) => {
    const [valueYear, setValueYear] = useState();
    useEffect(() => {
        if (!!props.value) {
            let d = `${props.value}-01-01`;
            // @ts-ignore
            setValueYear(dayjs(d));
        } else {
            // @ts-ignore
            setValueYear(null);
        }
    }, [props.value]);
    const onYearChange = (date: Dayjs, dateString: string | string[]) => {
        if (!dateString) {
            submitValue(null);
        } else {
            submitValue(dateString)
        }
    }
    const submitValue = (v: any | null) => {
        if (props.onChange) {
            props.onChange(v);
        }
    }
    return (
        <DatePicker
            style={{ width: '100%' }}
            className={props.classNames}
            suffixIcon={!props.hiddenSuffixIcon && <DateIcon />}
            picker="year"  // Chọn kiểu "year"
            placeholder={'Năm'}
            {...props}
            value={valueYear ? dayjs(`${valueYear}-01-01`) : null}  // Đảm bảo giá trị năm hợp lệ
            onChange={(date, dateString) => {
                onYearChange(date, dateString);
            }}
        />
    );
};

export default OrdYearInput;
