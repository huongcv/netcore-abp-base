import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";
import * as React from "react";

const AddSvg = (data: any) => (
    <>
        <img
            src="/icon-svg/add.svg"
            alt="image"/>
    </>
);
export const AddIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={AddSvg} {...props} />
);
