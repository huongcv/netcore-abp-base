import * as React from "react";
import {useEffect, useState} from "react";
import './index.scss'
import {Space} from "antd";
import {useTranslation} from "react-i18next";
import {returnTrue} from "react-number-format/types/utils";

interface PropType {
    label?: React.ReactNode;
    children: any;
    required?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

const FloatLabel = ({children, label, required, style, className}: PropType) => {
    const [focus, setFocus] = useState(false);
    return <div
        className={`float-label ${className || ''}`}
        onBlur={() => setFocus(false)}
        onFocus={() => setFocus(true)}
        style={style}
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


// FloatFieldLabel: dùng cho i18n label tự động
interface FloatFieldLabelProps extends Omit<PropType, 'label'> {
    label: string; // dùng key i18n
}

export const FloatFieldLabel = ({label, children, ...rest}: FloatFieldLabelProps) => {
    const {t} = useTranslation('field');
    return <FloatLabel {...rest} label={t(label)} children={children}/>;
};

export interface IFieldLabelProps {
    label: React.ReactNode;
    translationNamespace?: string | string[];
    params?: Record<string, any>; // Cho phép truyền thêm biến
    style?: React.CSSProperties;
    className?: string;
}

export const FieldLabel = ({label, translationNamespace = 'field', params, style, className}: IFieldLabelProps) => {
    const {t} = useTranslation(translationNamespace);
    return <span style={style} className={className}>{t(label, params)}</span>;
}