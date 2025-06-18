import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";
import * as React from "react";

const TopSaleSvg = (data: any) => (
    <>
        <img
            width={'35px'}
            src="/icon-svg/top-sale.svg"
            alt="image"
        />
    </>
);
export const TopSaleIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={TopSaleSvg} {...props} />
);
