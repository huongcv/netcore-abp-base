import React, {useEffect, useRef, useState} from 'react';
import {Tooltip} from 'antd';
import {ResponsiveTextConfig} from '../types';
import {ResponsiveTextUtils} from './responsiveTextUtils';
import {debounce} from "lodash";

interface ResponsiveTextWrapperProps {
    text: string;
    columnWidth?: number;
    maxLength?: number;
    showTooltip?: boolean;
    tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
    responsive?: ResponsiveTextConfig;
    className?: string;
}

export const ResponsiveTextWrapper: React.FC<ResponsiveTextWrapperProps> = ({
                                                                                text,
                                                                                columnWidth,
                                                                                maxLength: staticMaxLength,
                                                                                showTooltip = true,
                                                                                tooltipPlacement = 'top',
                                                                                responsive,
                                                                                className,
                                                                            }) => {
    const [currentMaxLength, setCurrentMaxLength] = useState<number>(staticMaxLength || 500);
    const textRef = useRef<HTMLSpanElement>(null);

    const updateMaxLength = () => {
        let effectiveColumnWidth = columnWidth;

        if (responsive?.responsive && !columnWidth && textRef.current) {
            const parentCell = textRef.current.closest('.ant-table-cell');
            if (parentCell) {
                effectiveColumnWidth = parentCell.getBoundingClientRect().width;
            }
        }

        if (responsive?.responsive && effectiveColumnWidth) {
            const newMaxLength = ResponsiveTextUtils.getResponsiveLength(
                staticMaxLength,
                effectiveColumnWidth,
                responsive
            );
            setCurrentMaxLength(newMaxLength);
        } else {
            setCurrentMaxLength(staticMaxLength || 500);
        }
    };

    // debounce resize handler
    useEffect(() => {
        const debouncedResize = debounce(updateMaxLength, 200); // 200ms delay

        updateMaxLength(); // Initial call

        window.addEventListener('resize', debouncedResize);
        return () => {
            window.removeEventListener('resize', debouncedResize);
            debouncedResize.cancel(); // Cleanup debounce
        };
    }, [columnWidth, staticMaxLength, responsive]);

    const displayText =
        text.length <= currentMaxLength ? text : `${text.substring(0, currentMaxLength)}...`;

    const shouldShowTooltip = text.length > currentMaxLength && showTooltip;

    const textElement = (
        <span
            ref={textRef}
            className={`responsive-text ${className || ''}`}
            data-length={currentMaxLength}
            style={{
                display: 'inline-block',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            }}
        >
            {displayText}
        </span>
    );

    return shouldShowTooltip ? (
        <Tooltip title={text} placement={tooltipPlacement}>
            {textElement}
        </Tooltip>
    ) : (
        textElement
    );
};
