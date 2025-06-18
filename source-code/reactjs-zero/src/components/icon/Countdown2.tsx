import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import * as React from "react";
import Icon from '@ant-design/icons';

const Svg = (data: any) => (
    <>
        <img
            style={{width:"20px"}}
            src="/icon-svg/count-down-2.svg"
            alt="image"/>
    </>
);
export const Countdown2Icon = (props: Partial<CustomIconComponentProps>) => (
    <Icon width={25} component={Svg} {...props} />
);
