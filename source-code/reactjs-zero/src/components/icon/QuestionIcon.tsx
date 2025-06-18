import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";
import * as React from "react";

const QuestionSvg = (data: any) => (
    <>
        <img
            src="/icon-svg/question.svg"
            alt="image"/>
    </>
);
export const QuestionIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={QuestionSvg} {...props} />
);
