import * as React from "react";
import {useEffect, useState} from "react";
import './index.scss'
import {Space} from "antd";

interface PropType {
    label?: React.ReactNode;
    children: any;
    required?: boolean;
    style?: React.CSSProperties;
}

const FloatLabel = (props: PropType) => {
    const [focus, setFocus] = useState(false);
    const {
        children, label, required, ...otherProps
    } = props;
    useEffect(() => {

    }, []);
    return <div
        className="float-label"
        onBlur={() => setFocus(false)}
        onFocus={() => setFocus(true)}
        style={props.style}
    >
        {children}
        {
            (<>
                <label className='label as-label inline-flex'>
                    {label} {
                    required && <Space><span className='text-red-500'>(*)</span></Space>
                }
                </label>
            </>)
        }
    </div>;
}
export default FloatLabel;
