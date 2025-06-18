import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";
import * as React from "react";

const OrderSvg = (data: any) => (
    <>
        <img
            src="/icon-svg/order.svg"
            alt="image"
        />
    </>
);
export const OrderIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={OrderSvg} {...props} />
);
