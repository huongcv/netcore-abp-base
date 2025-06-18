import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import * as React from "react";
import Icon from '@ant-design/icons';

const IconSvg = (data: any) => (
    <>
        <img
            src="/icon-svg/user.svg"
            alt="image"/>
    </>
);
export const UserIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon width={props.width} component={IconSvg} {...props} />
);
