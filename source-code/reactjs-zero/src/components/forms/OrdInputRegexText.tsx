import {Input, InputProps} from "antd";
import * as React from "react";
import {useRef} from "react";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";

export interface IOrdInputRegexTextProp extends InputProps {
    regex: RegExp;
}

const OrdInputRegexText = (props: IOrdInputRegexTextProp) => {
    const {value, onChange, autoFocus} = props;
    const focusRef = useAutoFocus();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value: inputValue} = e.target;
        if (props.regex.test(inputValue) || inputValue === '' || inputValue === '-') {
            // @ts-ignore
            onChange(inputValue);
        }
    };
    return (<>
        <Input {...props} onChange={handleChange} ref={autoFocus ? focusRef : useRef(null)}/>
    </>);
}
export default OrdInputRegexText;
