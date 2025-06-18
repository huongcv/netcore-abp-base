import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";
import * as React from "react";

const RestaurantSvg = (data: any) => (
    <>
        <img
            src="/icon-svg/restaurant.svg"
            alt="image"
        />
    </>
);
export const RestaurantIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={RestaurantSvg} {...props} />
);
