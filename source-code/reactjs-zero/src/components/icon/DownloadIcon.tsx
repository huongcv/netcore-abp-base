import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";
import * as React from "react";

const DownloadSvg = (data: any) => (
    <>
        <img
            src="/icon-svg/download.svg"
            alt="image"/>
    </>
);
export const DownloadIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={DownloadSvg} {...props} />
);
