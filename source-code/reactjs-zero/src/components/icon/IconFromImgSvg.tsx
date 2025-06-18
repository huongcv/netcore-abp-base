import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import * as React from "react";
import Icon from '@ant-design/icons';

export const SelectIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon width={25} component={(data: any) => (
        <>
            <img
                style={{width: "25px"}}
                src="/icon-svg/select-17.svg"
                alt="image"/>
        </>
    )} {...props} />
);
