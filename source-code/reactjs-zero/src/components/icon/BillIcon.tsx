import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";
import * as React from "react";

const BillSvg = (data: any) => (
    <>
        <img  width= {56}
              height={56}
            src="/icon-svg/sale-invoice.svg"
            alt="image"/>
    </>
);
export const BillIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon width={56} height={56} component={BillSvg} {...props} />
);
