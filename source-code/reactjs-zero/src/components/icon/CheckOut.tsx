import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";
import * as React from "react";

const AddSvg = (data: any) => (
    <>
        <img width={'16px'}
             src="/icon-svg/check-out.svg"
            alt="image"/>
    </>
);
export const CheckOut = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={AddSvg} {...props} />
);
