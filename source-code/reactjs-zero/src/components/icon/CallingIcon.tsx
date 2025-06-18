import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";
import * as React from "react";

const CallingSvg = (data: any) => (
    <>
        <img
            src="/icon-svg/calling.svg"
            alt="image"/>
    </>
);
export const CallingIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={CallingSvg} {...props} />
);
