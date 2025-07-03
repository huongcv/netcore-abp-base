import {OrdBreadcrumb, PageBreadcrumb} from "@ord-components/common/page/PageBreadcrumb";
import React from "react";
import {TitleAndAction} from "@ord-components/common/page/TitleAndAction";

export const PageTopTitleAndAction = (props: {
    children?: any,
    usingCustom?: boolean
    mainTitle?: string,
    items?: string[]
}) => {
    return (
        <TitleAndAction title={props.usingCustom ?
            <OrdBreadcrumb items={props.items} mainTitle={props.mainTitle ?? ""}></OrdBreadcrumb> :
            <PageBreadcrumb></PageBreadcrumb>}>
            {props?.children}
        </TitleAndAction>
    );
}
