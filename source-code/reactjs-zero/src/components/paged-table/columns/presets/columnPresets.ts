import {BooleanColumnOptions, DateColumnOptions, ImageColumnOptions, NumberColumnOptions} from '../types';

// Column preset configurations
export class ColumnPresets {

    // ======================== DATE PRESETS ========================

    // Standard datetime with seconds
    static creationTime<T>(overrides?: Partial<DateColumnOptions>): DateColumnOptions {
        return {
            title: 'creation_time',
            dataIndex: 'creationTime',
            format: 'DD/MM/YYYY HH:mm:ss',
            width: 150,
            showTime: true,
            ...overrides
        } as DateColumnOptions;
    }

    // Date only (no time)
    static dateOnly<T>(overrides?: Partial<DateColumnOptions>): DateColumnOptions {
        return {
            format: 'DD/MM/YYYY',
            width: 120,
            showTime: false,
            copyable: true,
            sortable: true,
            ...overrides
        } as DateColumnOptions;
    }

    // Birth date
    static birthDate<T>(overrides?: Partial<DateColumnOptions>): DateColumnOptions {
        return {
            title: 'birth_date',
            dataIndex: 'birthDate',
            format: 'DD/MM/YYYY',
            width: 120,
            showTime: false,
            copyable: true,
            sortable: true,
            ...overrides
        } as DateColumnOptions;
    }

    // ======================== NUMBER PRESETS ========================

    // Currency (VND)
    static currency<T>(overrides?: Partial<NumberColumnOptions>): NumberColumnOptions {
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
        } as NumberColumnOptions;
    }

    // Percentage
    static percentage<T>(overrides?: Partial<NumberColumnOptions>): NumberColumnOptions {
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
        } as NumberColumnOptions;
    }

    // Quantity/Count
    static quantity<T>(overrides?: Partial<NumberColumnOptions>): NumberColumnOptions {
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
        } as NumberColumnOptions;
    }

    // Order/Index
    static order<T>(overrides?: Partial<NumberColumnOptions>): NumberColumnOptions {
        return {
            title: 'order',
            dataIndex: 'order',
            width: 80,
            decimalPlaces: 0,
            copyable: true,
            sortable: true,
            color: 'secondary',
            ...overrides
        } as NumberColumnOptions;
    }

    // ======================== BOOLEAN PRESETS ========================

    // Active status
    static isActive<T>(overrides?: Partial<BooleanColumnOptions>): BooleanColumnOptions {
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
        } as BooleanColumnOptions;
    }

    // Published status
    static isPublished<T>(overrides?: Partial<BooleanColumnOptions>): BooleanColumnOptions {
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
        } as BooleanColumnOptions;
    }

    // Featured status
    static isFeatured<T>(overrides?: Partial<BooleanColumnOptions>): BooleanColumnOptions {
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
        } as BooleanColumnOptions;
    }

    // ======================== IMAGE PRESETS ========================

    // Avatar
    static avatar<T>(overrides?: Partial<ImageColumnOptions>): ImageColumnOptions {
        return {
            title: 'avatar',
            dataIndex: 'avatarUrl',
            width: 80,
            imageWidth: 40,
            imageHeight: 40,
            copyable: true,
            fallbackSrc: '/default-avatar.png',
            ...overrides
        } as ImageColumnOptions;
    }

    // Thumbnail
    static thumbnail<T>(overrides?: Partial<ImageColumnOptions>): ImageColumnOptions {
        return {
            title: 'thumbnail',
            dataIndex: 'thumbnailUrl',
            width: 80,
            imageWidth: 50,
            imageHeight: 50,
            copyable: true,
            fallbackSrc: '/default-thumbnail.png',
            ...overrides
        } as ImageColumnOptions;
    }
}