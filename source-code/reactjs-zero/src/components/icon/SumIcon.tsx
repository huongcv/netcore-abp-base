import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import * as React from "react";
import Icon from '@ant-design/icons';

const Svg = (data: any) => (
    <>
        <img
            style={{width: "16px"}}
            src="/icon-svg/sum-9.svg"
            alt="image"/>
    </>
);
export const SumIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon width={25} component={Svg} {...props} />
);
