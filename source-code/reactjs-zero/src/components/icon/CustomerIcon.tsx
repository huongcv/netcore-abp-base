import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";
import * as React from "react";

const CustomerSvg = (data: any) => (
    <>
        <img  width= {56}
              height={56}
              src="/icon-svg/customer.svg"
              alt="image"/>
    </>
);
export const CustomerIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon width={56} height={56} component={CustomerSvg} {...props} />
);
