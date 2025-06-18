import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";
import * as React from "react";

const BookSvg = (data: any) => (
    <>
        <img
            src="/icon-svg/book.svg"
            alt="image"
        />
    </>
);
export const BookIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={BookSvg} {...props} />
);
