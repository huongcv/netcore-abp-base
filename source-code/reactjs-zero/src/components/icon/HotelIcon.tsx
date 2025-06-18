import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";
import * as React from "react";

const HotelSvg = (data: any) => (
    <>
        <img
            src="/icon-svg/hotel.svg"
            alt="image"
        />
    </>
);
export const HotelIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={HotelSvg} {...props} />
);
