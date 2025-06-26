import {DateDisplayConfig} from './types';

export const DateDisplayPresets = {
    // Basic date formats
    date: {
        format: 'DD/MM/YYYY',
        showTime: false
    } as DateDisplayConfig,

    dateShort: {
        format: 'DD/MM/YY',
        showTime: false
    } as DateDisplayConfig,

    dateLong: {
        format: 'dddd, DD MMMM YYYY',
        showTime: false
    } as DateDisplayConfig,

    // Time formats
    time: {
        format: 'HH:mm',
        showTime: true
    } as DateDisplayConfig,

    timeWithSeconds: {
        format: 'HH:mm:ss',
        showTime: true,
        showSeconds: true
    } as DateDisplayConfig,

    time12Hour: {
        format: 'h:mm A',
        showTime: true
    } as DateDisplayConfig,

    // DateTime formats
    datetime: {
        format: 'DD/MM/YYYY HH:mm',
        showTime: true
    } as DateDisplayConfig,

    datetimeShort: {
        format: 'DD/MM/YY HH:mm',
        showTime: true
    } as DateDisplayConfig,

    datetimeLong: {
        format: 'dddd, DD MMMM YYYY HH:mm:ss',
        showTime: true,
        showSeconds: true
    } as DateDisplayConfig,

    // Relative formats
    relative: {
        relative: true,
        relativeThreshold: 7,
        format: 'DD/MM/YYYY HH:mm'
    } as DateDisplayConfig,

    // International formats
    iso: {
        format: 'YYYY-MM-DD'
    } as DateDisplayConfig,

    isoDateTime: {
        format: 'YYYY-MM-DD HH:mm:ss'
    } as DateDisplayConfig,

    // Localized formats
    localized: {
        dateStyle: 'medium',
        timeStyle: 'short',
        locale: 'vi-VN'
    } as DateDisplayConfig,

    localizedFull: {
        dateStyle: 'full',
        timeStyle: 'medium',
        locale: 'vi-VN'
    } as DateDisplayConfig,

    // Special formats
    monthYear: {
        format: 'MM/YYYY'
    } as DateDisplayConfig,

    quarter: {
        format: '[Q]Q YYYY'
    } as DateDisplayConfig,

    // Birthday format
    birthday: {
        format: 'DD [tháng] MM',
        showTime: false
    } as DateDisplayConfig,

    // Audit formats
    createdAt: {
        format: 'DD/MM/YYYY HH:mm',
        relative: true,
        relativeThreshold: 3
    } as DateDisplayConfig,

    updatedAt: {
        format: 'DD/MM/YYYY HH:mm',
        relative: true,
        relativeThreshold: 1
    } as DateDisplayConfig
};