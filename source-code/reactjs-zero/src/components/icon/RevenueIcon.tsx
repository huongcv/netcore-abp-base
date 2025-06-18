import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";
import * as React from "react";

const RevenueSvg = (data: any) => (
    <>
        <img
            src="/icon-svg/revenue.svg"
            alt="image"/>
    </>
);
export const RevenueIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={RevenueSvg} {...props} />
);
