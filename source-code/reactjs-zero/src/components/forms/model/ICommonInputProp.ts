import * as React from "react";

export type RenderNode = React.ReactNode | ((props: any) => React.ReactNode);

export interface ICommonInputProp<TValue> {
    id?: string;
    value?: TValue;
    onChange?: (v?: any) => void;
    placeholder?: string;
    disabled?: boolean;
    allowClear?: boolean;
}

export interface ICommonInputAnyProp extends ICommonInputProp<any> {

}


