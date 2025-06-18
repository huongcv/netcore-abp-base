import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import * as React from "react";
import Icon from '@ant-design/icons';

const VisaSvg = (data: any) => (
    <>
        <img
            style={{width:"25px"}}
            src="/icon-svg/visa.svg"
            alt="image"/>
    </>
);
export const VisaIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon width={25} component={VisaSvg} {...props} />
);
