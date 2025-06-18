import {Checkbox, CheckboxProps, Form} from "antd";
import * as React from "react";
import {useEffect, useState} from "react";
import {CheckboxChangeEvent} from "antd/lib/checkbox";

// @ts-ignore
interface IOrdCheckBoxTextProps extends CheckboxProps {
    label?: React.ReactNode;
    onChange?: (e: string) => void;
    children?: React.ReactNode;
}


const OrdCheckBoxText = (props: IOrdCheckBoxTextProps) => {
    const [valueCheck, setValueCheck] = useState<boolean>();
    useEffect(() => {

    }, [props.checked]);
    useEffect(() => {
        if (props?.value?.toLowerCase() == 'true') {
            setValueCheck(true);
        } else {
            setValueCheck(false);
        }
    }, [props?.value]);


    const onChangeValue = (data: CheckboxChangeEvent) => {
        props.onChange?.(data.target.checked ? 'true' : 'false');
    };
    return (<>
        <Checkbox {...props} checked={valueCheck} onChange={(data) => {
            onChangeValue(data)
        }}>
            {props.label}
            {props.children}
        </Checkbox>
    </>);
}
export default OrdCheckBoxText;
