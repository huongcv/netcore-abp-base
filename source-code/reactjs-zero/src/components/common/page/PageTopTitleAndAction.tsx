import {OrdBreadcrumb, PageBreadcrumb} from "@ord-components/common/page/PageBreadcrumb";
import React from "react";

export const PageTopTitleAndAction = (props: {
    children?: any,
    usingCustom?: boolean
    mainTitle?: string,
    items?: string[]
}) => {
    return (<div
        className="flex flex-wrap items-center justify-between leading-[1.8571428571] mb-[13px] gap-y-[15px] gap-x-[30px] max-sm:flex-col">
        {props.usingCustom ? <OrdBreadcrumb items={props.items} mainTitle={props.mainTitle ?? ""}></OrdBreadcrumb> :
            <PageBreadcrumb></PageBreadcrumb>}
        <div className="flex items-center">
            {props?.children}
        </div>
    </div>);
}
