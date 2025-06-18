import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";
import * as React from "react";

const Svg = () => {
    return (
        <img
            style={{width: "20px", color: 'white'}}
            src="/icon-svg/transfer-26.svg"
            alt="image"/>
    );
}

export const TransferIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={Svg} {...props} />
);
