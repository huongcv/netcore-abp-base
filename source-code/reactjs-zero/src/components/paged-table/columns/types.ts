import React from 'react';
import {CellEllipsisType} from "rc-table/lib/interface";

export type ColorType = 'success' | 'error' | 'warning' | 'primary' | 'secondary' | 'info' | 'default';

export interface ColorCondition {
    condition: (value: any, record?: any) => boolean;
    color: ColorType;
    backgroundColor?: ColorType;
    fontWeight?: 'normal' | 'bold' | 'bolder' | number;
}

export interface BaseColumnConfig {
    // Color styling
    color?: ColorType | ColorCondition[];
    backgroundColor?: ColorType;
    fontWeight?: 'normal' | 'bold' | 'bolder' | number;
    // Custom styling
    customStyle?: (value: any, record?: any) => React.CSSProperties;
    className?: string | ((value: any, record?: any) => string);
    ellipsis?: CellEllipsisType;
    // Copyable for all types
    copyable?: boolean;
}

// Enhanced column config
export interface EnhancedColumnConfig<T = any> {
    title?: string;
    dataIndex?: keyof T;
    key?: string;
    width?: number;
    fixed?: boolean | 'left' | 'right';
    sortable?: boolean;
    filterable?: boolean;
    align?: 'left' | 'center' | 'right';
    // Custom render function
    render?: (value: any, record: T, index: number) => React.ReactNode;
}

// Specific options for each type
export interface NumberColumnOptions extends BaseColumnConfig {
    decimalPlaces?: number;
    thousandSeparator?: string;
    decimalSeparator?: string;
    prefix?: string;
    suffix?: string;
    hideZero?: boolean;
    currency?: boolean;
}

export interface DateColumnOptions extends BaseColumnConfig {
    format?: string;
    showTime?: boolean;
    emptyText?: string;
    showTooltip?: boolean;
    tooltipContent?: string | React.ReactNode;
    tooltipFormat?: string;
    colorScheme?: 'default' | 'age-based' | 'deadline' | 'status';
}

export interface TextColumnOptions extends BaseColumnConfig {
    maxLength?: number;
}

export interface BooleanColumnOptions extends BaseColumnConfig {
    trueText?: string;
    falseText?: string;
    showIcon?: boolean;
}

export interface ImageColumnOptions extends BaseColumnConfig {
    imageWidth?: number;
    imageHeight?: number;
    fallbackSrc?: string;
}

// Internal types with type field for formatter
export interface NumberColumnConfig extends NumberColumnOptions {
    type: 'number';
}

export interface DateColumnConfig extends DateColumnOptions {
    type: 'date';
}

export interface TextColumnConfig extends TextColumnOptions {
    type: 'text';
}

export interface BooleanColumnConfig extends BooleanColumnOptions {
    type: 'boolean';
}

export interface ImageColumnConfig extends ImageColumnOptions {
    type: 'image';
}

export type ColumnConfig =
    NumberColumnConfig
    | DateColumnConfig
    | TextColumnConfig
    | BooleanColumnConfig
    | ImageColumnConfig;
