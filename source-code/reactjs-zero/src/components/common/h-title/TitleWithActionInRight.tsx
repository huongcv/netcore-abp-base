import React, {ReactNode} from "react";
import {PageHeaderTitle} from "@ord-components/common/h-title/PageHeaderTitle";

export const TitleWithActionInRight = (props: {
    title: ReactNode,
    children?: any
}) => {
    return (<div
        className="flex flex-wrap items-center justify-between leading-[1.8571428571] mb-[13px] gap-y-[15px] gap-x-[30px] max-sm:flex-col">
        <PageHeaderTitle title= {props.title}/>
        <div className="flex items-center">
            {props.children}
        </div>
    </div>);
}
