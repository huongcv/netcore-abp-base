import {ICommonInputAnyProp, RenderNode} from "@ord-components/forms/model/ICommonInputProp";

export interface ICommonSelectInputProp extends ICommonInputAnyProp {
    allowClear?: boolean | {
        clearIcon?: RenderNode;
    };
}
