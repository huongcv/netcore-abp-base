import {NumberDisplayConfig} from './types';

export const NumberDisplayPresets = {
    // Currency presets
    currency: {
        currency: true,
        decimalPlaces: 0,
        thousandSeparator: ',',
        suffix: ' VND'
    } as NumberDisplayConfig,

    currencyDetailed: {
        currency: true,
        decimalPlaces: 2,
        thousandSeparator: ',',
        suffix: ' VND'
    } as NumberDisplayConfig,

    usd: {
        currency: true,
        decimalPlaces: 2,
        prefix: '$',
        thousandSeparator: ','
    } as NumberDisplayConfig,

    // Percentage presets
    percentage: {
        decimalPlaces: 1,
        suffix: '%'
    } as NumberDisplayConfig,

    percentageDetailed: {
        decimalPlaces: 2,
        suffix: '%'
    } as NumberDisplayConfig,

    // Number presets
    integer: {
        decimalPlaces: 0,
        thousandSeparator: ','
    } as NumberDisplayConfig,

    decimal: {
        decimalPlaces: 2,
        thousandSeparator: ','
    } as NumberDisplayConfig,

    // Scientific notation
    scientific: {
        notation: 'scientific',
        maximumFractionDigits: 3
    } as NumberDisplayConfig,

    // Compact notation (1K, 1M, etc.)
    compact: {
        notation: 'compact',
        maximumFractionDigits: 1
    } as NumberDisplayConfig,

    // File size
    fileSize: {
        decimalPlaces: 1,
        suffix: ' B'
    } as NumberDisplayConfig,

    // Rating
    rating: {
        decimalPlaces: 1,
        suffix: '/5',
        maximumFractionDigits: 1
    } as NumberDisplayConfig,

    // Score with color
    score: {
        decimalPlaces: 0,
        suffix: '%'
    } as NumberDisplayConfig
};