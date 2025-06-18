import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";
import * as React from "react";

const SupportSvg = (data: any) => (
    <>
        <img
            src="/icon-svg/support.svg"
            alt="image"
        />
    </>
);
export const SupportIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={SupportSvg} {...props} />
);
