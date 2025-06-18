import {Tooltip} from "antd";
import React, {useEffect, useRef, useState} from "react";

export const TextLineClampDisplay = React.memo((props: {
    content: string;
    rows?: number;
    className?: string;
    placement?: string;
}) => {
    const {content, rows = 1, className, placement = "top"} = props;
    const textRef = useRef<HTMLDivElement>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const el = textRef.current;
        if (el) {
            setShowTooltip(el.scrollHeight > el.clientHeight);
        }
    }, [content, rows]);

    const clampClass = `line-clamp-${rows}`;

    return (
        <Tooltip title={showTooltip ? content : undefined} placement={placement as any}>
            <div
                ref={textRef}
                className={`break-all text-sm font-normal w-full ${clampClass} ${className}`}
            >
                {content}
            </div>
        </Tooltip>
    );
});
