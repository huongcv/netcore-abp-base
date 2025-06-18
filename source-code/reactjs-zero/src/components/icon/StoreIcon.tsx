import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";
import * as React from "react";

const StoreSvg = (data: any) => (
    <>
        <img
            src="/icon-svg/store.svg"
            alt="image"
        />
    </>
);
export const StoreIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={StoreSvg} {...props} />
);
