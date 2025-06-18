import {Input, InputProps} from "antd";
import * as React from "react";

interface IOrdInputRegexTextProp extends InputProps {
    regex: RegExp;
}

const OrdInputRegexText = (props: IOrdInputRegexTextProp) => {
    const {value, onChange} = props;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value: inputValue} = e.target;
        if (props.regex.test(inputValue) || inputValue === '' || inputValue === '-') {
            // @ts-ignore
            onChange(inputValue);
        }
    };
    return (<>
        <Input {...props}  onChange={handleChange}/>
    </>);
}
export default OrdInputRegexText;
