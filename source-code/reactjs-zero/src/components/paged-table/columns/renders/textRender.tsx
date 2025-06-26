import React from 'react';
import {TextColumnConfig} from '../types';
import {CopyableWrapper} from '../utils/copyableWrapper';
import {StyleWrapper} from '../utils/styleWrapper';
import {Tooltip} from "antd";

export class TextRender {
    static render(
        value: any,
        record: any,
        config: TextColumnConfig,
        columnWidth?: number
    ): React.ReactNode {
        if (value === null || value === undefined) {
            return StyleWrapper.wrapWithStyle('', value, record, config);
        }

        const text = String(value);
        const {maxLength} = config;

        // Use responsive text wrapper if responsive config is provided
        const textContent = (
            // Fallback to original logic
            (() => {
                const effectiveMaxLength = maxLength;
                let shouldShowTooltip = (effectiveMaxLength && text.length > effectiveMaxLength);
                let displayText = text;
                if (shouldShowTooltip) {
                    displayText = `${text.substring(0, effectiveMaxLength)}...`;
                }
                return shouldShowTooltip ? (
                    <Tooltip title={text} placement={'top'}>
                        <span>{displayText}</span>
                    </Tooltip>
                ) : (
                    <span>{displayText}</span>
                );
            })()
        );

        const content = (
            <CopyableWrapper
                content={textContent}
                copyText={text}
                config={config}
            />
        );

        return StyleWrapper.wrapWithStyle(content, value, record, config);
    }
}