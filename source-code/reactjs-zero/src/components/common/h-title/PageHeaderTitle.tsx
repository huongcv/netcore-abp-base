import React, {useEffect, useState} from "react";

export const PageHeaderTitle = (props: {
    title: any,
    fontSize?: number
}) => {
    const [fs, setFs] = useState('text-[24px]');
    useEffect(() => {
        if (props.fontSize && props.fontSize > 0) {
            setFs("text-[" + props.fontSize + "px]");
        }
    }, [props.fontSize]);
    return <h4 className={"text-dark font-semibold " + fs}>
        {props.title}
    </h4>
}
