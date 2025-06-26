import React from 'react';
import {BaseColumnConfig, ColorType} from '../types';

export class StyleWrapper {
    // Color mapping
    static readonly COLOR_MAP: Record<ColorType, string> = {
        success: '#52c41a',
        error: '#ff4d4f',
        warning: '#faad14',
        primary: '#1890ff',
        secondary: '#8c8c8c',
        info: '#13c2c2',
        default: '#000000'
    };

    static readonly BACKGROUND_COLOR_MAP: Record<ColorType, string> = {
        success: '#f6ffed',
        error: '#fff2f0',
        warning: '#fffbe6',
        primary: '#e6f7ff',
        secondary: '#f5f5f5',
        info: '#e6fffb',
        default: 'transparent'
    };

    // Get color based on condition
    static getColorStyle(value: any, record: any, config: BaseColumnConfig): React.CSSProperties {
        let style: React.CSSProperties = {};

        // Handle color conditions
        if (Array.isArray(config.color)) {
            for (const condition of config.color) {
                if (condition.condition(value, record)) {
                    style.color = this.COLOR_MAP[condition.color];
                    if (condition.backgroundColor) {
                        style.backgroundColor = this.BACKGROUND_COLOR_MAP[condition.backgroundColor];
                    }
                    if (condition.fontWeight) {
                        style.fontWeight = condition.fontWeight;
                    }
                    break;
                }
            }
        } else if (config.color) {
            style.color = this.COLOR_MAP[config.color];
        }

        // Handle single background color
        if (config.backgroundColor) {
            style.backgroundColor = this.BACKGROUND_COLOR_MAP[config.backgroundColor];
        }

        // Handle font weight
        if (config.fontWeight) {
            style.fontWeight = config.fontWeight;
        }

        // Handle custom style
        if (config.customStyle) {
            style = {...style, ...config.customStyle(value, record)};
        }

        return style;
    }

    // Wrap content with styling
    static wrapWithStyle(
        content: React.ReactNode,
        value: any,
        record: any,
        config: BaseColumnConfig
    ): React.ReactNode {
        const style = this.getColorStyle(value, record, config);

        if (Object.keys(style).length === 0) {
            return content;
        }

        return (
            <div style={style}>
                {content}
            </div>
        );
    }
}