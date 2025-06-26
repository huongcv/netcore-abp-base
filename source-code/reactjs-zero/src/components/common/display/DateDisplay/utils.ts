import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/vi';
import {DateDisplayConfig} from "@ord-components/common/display/DateDisplay/types";

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(timezone);
dayjs.extend(utc);

export class DateFormatUtils {
    // Set default locale
    static setLocale(locale: string = 'vi') {
        dayjs.locale(locale);
    }

    // Parse date from various formats
    static parseDate(value: string | Date | number): dayjs.Dayjs | null {
        if (!value) return null;

        try {
            return dayjs(value);
        } catch {
            return null;
        }
    }

    // Format date with custom format
    static formatDate(value: string | Date | number, format?: string): string {
        const date = this.parseDate(value);
        if (!date || !date.isValid()) return '';

        return date.format(format || 'DD/MM/YYYY');
    }

    // Format using Intl.DateTimeFormat
    static formatIntl(
        value: string | Date | number,
        config: DateDisplayConfig
    ): string {
        const date = this.parseDate(value);
        if (!date || !date.isValid()) return '';

        const options: Intl.DateTimeFormatOptions = {};

        if (config.dateStyle) options.dateStyle = config.dateStyle;
        if (config.timeStyle) options.timeStyle = config.timeStyle;
        if (config.timeZone) options.timeZone = config.timeZone;

        return new Intl.DateTimeFormat(config.locale || 'vi-VN', options)
            .format(date.toDate());
    }

    // Get relative time (2 hours ago, in 3 days)
    static getRelativeTime(value: string | Date | number): string {
        const date = this.parseDate(value);
        if (!date || !date.isValid()) return '';

        return date.fromNow();
    }

    // Get calendar time (Today, Yesterday, Last Monday)
    static getCalendarTime(value: string | Date | number): string {
        const date = this.parseDate(value);
        if (!date || !date.isValid()) return '';

        return date.calendar();
    }

    // Get duration from now
    static getDurationFromNow(value: string | Date | number): string {
        const date = this.parseDate(value);
        if (!date || !date.isValid()) return '';

        const now = dayjs();
        const diff = now.diff(date);
        const duration = dayjs.duration(diff);

        if (duration.asSeconds() < 60) {
            return 'vừa xong';
        } else if (duration.asMinutes() < 60) {
            return `${Math.floor(duration.asMinutes())} phút trước`;
        } else if (duration.asHours() < 24) {
            return `${Math.floor(duration.asHours())} giờ trước`;
        } else if (duration.asDays() < 7) {
            return `${Math.floor(duration.asDays())} ngày trước`;
        } else if (duration.asWeeks() < 4) {
            return `${Math.floor(duration.asWeeks())} tuần trước`;
        } else if (duration.asMonths() < 12) {
            return `${Math.floor(duration.asMonths())} tháng trước`;
        } else {
            return `${Math.floor(duration.asYears())} năm trước`;
        }
    }

    // Check if date should show as relative
    static shouldShowRelative(
        value: string | Date | number,
        threshold: number = 7
    ): boolean {
        const date = this.parseDate(value);
        if (!date || !date.isValid()) return false;

        const diffDays = Math.abs(dayjs().diff(date, 'day'));
        return diffDays <= threshold;
    }

    // Get color based on date and scheme
    static getDateColor(
        value: string | Date | number,
        scheme: string,
        deadlineDate?: string | Date
    ): string {
        const date = this.parseDate(value);
        if (!date || !date.isValid()) return 'inherit';

        const now = dayjs();
        const diffDays = now.diff(date, 'day');

        switch (scheme) {
            case 'age-based':
                if (diffDays <= 1) return '#52c41a';      // Fresh (green)
                if (diffDays <= 7) return '#1890ff';      // Recent (blue)
                if (diffDays <= 30) return '#faad14';     // Old (orange)
                return '#8c8c8c';                         // Very old (gray)

            case 'deadline':
                if (!deadlineDate) return 'inherit';
                const deadline = this.parseDate(deadlineDate);
                if (!deadline) return 'inherit';

                const daysToDeadline = deadline.diff(now, 'day');
                if (daysToDeadline < 0) return '#ff4d4f';      // Overdue (red)
                if (daysToDeadline <= 1) return '#fa8c16';     // Due soon (orange)
                if (daysToDeadline <= 7) return '#faad14';     // Due this week (yellow)
                return '#52c41a';                              // Safe (green)

            case 'status':
                const hour = date.hour();
                if (hour >= 6 && hour < 12) return '#52c41a';   // Morning (green)
                if (hour >= 12 && hour < 18) return '#1890ff';  // Afternoon (blue)
                if (hour >= 18 && hour < 22) return '#faad14';  // Evening (orange)
                return '#722ed1';                               // Night (purple)

            default:
                return 'inherit';
        }
    }

    // Validate date
    static isValidDate(value: string | Date | number): boolean {
        const date = this.parseDate(value);
        return date ? date.isValid() : false;
    }

    // Get timezone display
    static getTimezoneDisplay(
        value: string | Date | number,
        timeZone?: string
    ): string {
        const date = this.parseDate(value);
        if (!date || !date.isValid()) return '';

        if (timeZone) {
            return date.tz(timeZone).format('z');
        }

        return date.format('Z');
    }
}
