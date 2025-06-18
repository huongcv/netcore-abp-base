import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import * as React from "react";
import Icon from '@ant-design/icons';

const WordSvg = (data: any) => (
    <>
        <img
            style={{width:"25px"}}
            src="/icon-svg/word.svg"
            alt="image"/>
    </>
);
export const WordIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon width={25} component={WordSvg} {...props} />
);
