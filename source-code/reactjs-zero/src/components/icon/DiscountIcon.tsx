import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import * as React from "react";
import Icon from '@ant-design/icons';

const Svg = (data: any) => (
    <>
        <img
            style={{width:"25px"}}
            src="/icon-svg/discount-28.svg"
            alt="image"/>
    </>
);
export const DiscountIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon width={25} component={Svg} {...props} />
);
