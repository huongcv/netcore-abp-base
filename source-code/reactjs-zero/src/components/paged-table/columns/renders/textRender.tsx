import React from 'react';
import {TextColumnConfig} from '../types';
import {CopyableWrapper} from '../utils/copyableWrapper';
import {StyleWrapper} from '../utils/styleWrapper';
import {Tooltip} from "antd";

export class TextRender {
    static render(
        value: any,
        record: any,
        config: TextColumnConfig
    ): React.ReactNode {
        if (value === null || value === undefined) {
            return StyleWrapper.wrapWithStyle('', value, record, config);
        }

        const text = String(value);
        const {maxLength} = config;

        // Simple maxLength handling
        let displayText = text;
        let shouldShowTooltip = false;

        if (maxLength && text.length > maxLength) {
            displayText = `${text.substring(0, maxLength)}...`;
            shouldShowTooltip = true;
        }

        const textContent = shouldShowTooltip ? (
            <Tooltip title={text} placement={'top'}>
                <span>{displayText}</span>
            </Tooltip>
        ) : (
            <span>{displayText}</span>
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