import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import React from "react";
import {Col} from "antd";

export const ColSpanResponsive = (props: {
    span: number,
    children: any,
    className?: string | undefined;
}) => {
    const {span, children, ...rest} = props;
    const spanRep = useResponsiveSpan(span);
    return <Col {...rest} {...spanRep}  >
        {children}
    </Col>
}
