import React from 'react';
import {BooleanColumnConfig} from '../types';
import {CopyableWrapper} from '../utils/copyableWrapper';
import {StyleWrapper} from '../utils/styleWrapper';

export class BooleanRender {
    static render(value: any, record: any, config: BooleanColumnConfig): React.ReactNode {
        const {
            trueText = 'Có',
            falseText = 'Không',
            showIcon = true
        } = config;

        const isTrue = value === true || value === 'true' || value === 1;
        const text = isTrue ? trueText : falseText;
        const copyText = text;

        let displayContent: React.ReactNode;
        if (!showIcon) {
            displayContent = text;
        } else {
            // If no custom color config, use default boolean colors
            const defaultColor = isTrue ? 'success' : 'error';
            const colorConfig = config.color ? config : { ...config, color: defaultColor };

            displayContent = (
                <span>
          {showIcon && (isTrue ? '✓' : '✗')} {text}
        </span>
            );

            const content = (
                <CopyableWrapper
                    content={displayContent}
                    copyText={copyText}
                    config={config}
                />
            );

            return StyleWrapper.wrapWithStyle(content, value, record, colorConfig);
        }

        const content = (
            <CopyableWrapper
                content={displayContent}
                copyText={copyText}
                config={config}
            />
        );

        return StyleWrapper.wrapWithStyle(content, value, record, config);
    }
}