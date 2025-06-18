import React from "react";

export const OrdGridRightContent = (props: {
    children?: any,
    rightContent: React.ReactNode
}) => {
    const {children, rightContent} = props;
    return (<div className={'flex flex-wrap items-center justify-between'}>
        <div className={'flex-auto'}>
            {children}
        </div>
        <div className={'flex items-center'}>
            {rightContent}
        </div>
    </div>);
}
