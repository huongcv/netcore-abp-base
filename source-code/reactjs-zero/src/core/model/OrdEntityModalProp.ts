import React, {ReactNode} from "react";
import {FormInstance} from "antd";

export interface OrdEntityModalProp {
    entity: any;
    formContent?: (form: FormInstance) => React.ReactNode;
    modal?: ModalConfig;
    onSave?: (formValues: any) => Promise<boolean>;
}

export interface ModalConfig {
    title?: React.ReactNode;
    style?: React.CSSProperties;
    width?: number | string;
    okBtn?: ReactNode;
    cancelBtn?: ReactNode;
    hiddenOk?: boolean;
    ignoreFormEntity?: boolean;
    otherBtn?: ReactNode;
}
