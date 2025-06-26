// src/components/paged-table/columns/utils/columnPresets.ts
import {
    BooleanColumnOptions,
    DateColumnOptions,
    EnhancedColumnConfig,
    ImageColumnOptions,
    NumberColumnOptions
} from '../types';

// Base preset interface
interface BasePreset {
    title?: string;
    dataIndex?: string;
    width?: number;
    fixed?: boolean | 'left' | 'right';
    sortable?: boolean;
    copyable?: boolean;
}

// Column preset configurations
export class ColumnPresets {

    // ======================== DATE PRESETS ========================

    // Standard datetime with seconds
    static creationTime<T>(overrides?: Partial<BasePreset & DateColumnOptions>): EnhancedColumnConfig<T> & DateColumnOptions {
        return {
            title: 'creation_time',
            dataIndex: 'creationTime',
            format: 'DD/MM/YYYY HH:mm:ss',
            width: 150,
            showTime: true,
            ...overrides
        } as EnhancedColumnConfig<T> & DateColumnOptions;
    }

    // Date only (no time)
    static dateOnly<T>(overrides?: Partial<BasePreset & DateColumnOptions>): EnhancedColumnConfig<T> & DateColumnOptions {
        return {
            format: 'DD/MM/YYYY',
            width: 120,
            showTime: false,
            copyable: true,
            sortable: true,
            ...overrides
        } as EnhancedColumnConfig<T> & DateColumnOptions;
    }

    // Birth date
    static birthDate<T>(overrides?: Partial<BasePreset & DateColumnOptions>): EnhancedColumnConfig<T> & DateColumnOptions {
        return {
            title: 'birth_date',
            dataIndex: 'birthDate',
            format: 'DD/MM/YYYY',
            width: 120,
            showTime: false,
            copyable: true,
            sortable: true,
            ...overrides
        } as EnhancedColumnConfig<T> & DateColumnOptions;
    }

    // ======================== NUMBER PRESETS ========================

    // Currency (VND)
    static currency<T>(overrides?: Partial<BasePreset & NumberColumnOptions>): EnhancedColumnConfig<T> & NumberColumnOptions {
        return {
            width: 150,
            currency: true,
            decimalPlaces: 0,
            thousandSeparator: ',',
            suffix: ' VND',
            copyable: true,
            sortable: true,
            color: [
                {
                    condition: (value) => value < 0,
                    color: 'error',
                    fontWeight: 'bold'
                },
                {
                    condition: (value) => value > 1000000,
                    color: 'success'
                }
            ],
            ...overrides
        } as EnhancedColumnConfig<T> & NumberColumnOptions;
    }

    // Percentage
    static percentage<T>(overrides?: Partial<BasePreset & NumberColumnOptions>): EnhancedColumnConfig<T> & NumberColumnOptions {
        return {
            width: 100,
            decimalPlaces: 2,
            suffix: '%',
            copyable: true,
            sortable: true,
            color: [
                {
                    condition: (value) => value >= 100,
                    color: 'success',
                    fontWeight: 'bold'
                },
                {
                    condition: (value) => value >= 50,
                    color: 'info'
                },
                {
                    condition: (value) => value < 10,
                    color: 'error'
                }
            ],
            ...overrides
        } as EnhancedColumnConfig<T> & NumberColumnOptions;
    }

    // Quantity/Count
    static quantity<T>(overrides?: Partial<BasePreset & NumberColumnOptions>): EnhancedColumnConfig<T> & NumberColumnOptions {
        return {
            width: 100,
            decimalPlaces: 0,
            thousandSeparator: ',',
            copyable: true,
            sortable: true,
            color: [
                {
                    condition: (value) => value === 0,
                    color: 'error'
                },
                {
                    condition: (value) => value < 10,
                    color: 'warning'
                }
            ],
            ...overrides
        } as EnhancedColumnConfig<T> & NumberColumnOptions;
    }

    // Order/Index
    static order<T>(overrides?: Partial<BasePreset & NumberColumnOptions>): EnhancedColumnConfig<T> & NumberColumnOptions {
        return {
            title: 'order',
            dataIndex: 'order',
            width: 80,
            decimalPlaces: 0,
            copyable: true,
            sortable: true,
            color: 'secondary',
            ...overrides
        } as EnhancedColumnConfig<T> & NumberColumnOptions;
    }

    // ======================== BOOLEAN PRESETS ========================

    // Active status
    static isActive<T>(overrides?: Partial<BasePreset & BooleanColumnOptions>): EnhancedColumnConfig<T> & BooleanColumnOptions {
        return {
            title: 'status',
            dataIndex: 'isActive',
            width: 100,
            trueText: 'Hoạt động',
            falseText: 'Tạm dừng',
            showIcon: true,
            copyable: true,
            sortable: true,
            ...overrides
        } as EnhancedColumnConfig<T> & BooleanColumnOptions;
    }

    // Published status
    static isPublished<T>(overrides?: Partial<BasePreset & BooleanColumnOptions>): EnhancedColumnConfig<T> & BooleanColumnOptions {
        return {
            title: 'published',
            dataIndex: 'isPublished',
            width: 100,
            trueText: 'Đã xuất bản',
            falseText: 'Nháp',
            showIcon: true,
            copyable: true,
            sortable: true,
            ...overrides
        } as EnhancedColumnConfig<T> & BooleanColumnOptions;
    }

    // Featured status
    static isFeatured<T>(overrides?: Partial<BasePreset & BooleanColumnOptions>): EnhancedColumnConfig<T> & BooleanColumnOptions {
        return {
            title: 'featured',
            dataIndex: 'isFeatured',
            width: 100,
            trueText: 'Nổi bật',
            falseText: 'Thường',
            showIcon: true,
            copyable: true,
            sortable: true,
            color: [
                {
                    condition: (value) => value === true,
                    color: 'warning',
                    fontWeight: 'bold'
                }
            ],
            ...overrides
        } as EnhancedColumnConfig<T> & BooleanColumnOptions;
    }

    // ======================== IMAGE PRESETS ========================

    // Avatar
    static avatar<T>(overrides?: Partial<BasePreset & ImageColumnOptions>): EnhancedColumnConfig<T> & ImageColumnOptions {
        return {
            title: 'avatar',
            dataIndex: 'avatarUrl',
            width: 80,
            imageWidth: 40,
            imageHeight: 40,
            copyable: true,
            fallbackSrc: '/default-avatar.png',
            ...overrides
        } as EnhancedColumnConfig<T> & ImageColumnOptions;
    }

    // Thumbnail
    static thumbnail<T>(overrides?: Partial<BasePreset & ImageColumnOptions>): EnhancedColumnConfig<T> & ImageColumnOptions {
        return {
            title: 'thumbnail',
            dataIndex: 'thumbnailUrl',
            width: 80,
            imageWidth: 50,
            imageHeight: 50,
            copyable: true,
            fallbackSrc: '/default-thumbnail.png',
            ...overrides
        } as EnhancedColumnConfig<T> & ImageColumnOptions;
    }
}