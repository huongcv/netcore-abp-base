/**
 * String utility class with basic string operations
 * Supports case-insensitive comparisons and operations
 */
export class StringUtil {
    /**
     * Check if two strings are equal (case-insensitive)
     * @param str1 - First string to compare
     * @param str2 - Second string to compare
     * @returns boolean - true if strings are equal (ignoring case)
     */
    static isEqual(str1: string, str2: string): boolean {
        if (str1 == null || str2 == null) {
            return str1 === str2;
        }
        return str1.toLowerCase() === str2.toLowerCase();
    }

    /**
     * Check if a string contains another string (case-insensitive)
     * @param haystack - The string to search in
     * @param needle - The string to search for
     * @returns boolean - true if haystack contains needle (ignoring case)
     */
    static contains(haystack: string, needle: string): boolean {
        if (haystack == null || needle == null) {
            return false;
        }
        return haystack.toLowerCase().includes(needle.toLowerCase());
    }

    /**
     * Check if a string starts with another string (case-insensitive)
     * @param str - The string to check
     * @param prefix - The prefix to check for
     * @returns boolean - true if str starts with prefix (ignoring case)
     */
    static startsWith(str: string, prefix: string): boolean {
        if (str == null || prefix == null) {
            return false;
        }
        return str.toLowerCase().startsWith(prefix.toLowerCase());
    }

    /**
     * Check if a string ends with another string (case-insensitive)
     * @param str - The string to check
     * @param suffix - The suffix to check for
     * @returns boolean - true if str ends with suffix (ignoring case)
     */
    static endsWith(str: string, suffix: string): boolean {
        if (str == null || suffix == null) {
            return false;
        }
        return str.toLowerCase().endsWith(suffix.toLowerCase());
    }

    /**
     * Find the index of a substring in a string (case-insensitive)
     * @param str - The string to search in
     * @param searchStr - The substring to search for
     * @returns number - the index of the first occurrence, or -1 if not found
     */
    static indexOf(str: string, searchStr: string): number {
        if (str == null || searchStr == null) {
            return -1;
        }
        return str.toLowerCase().indexOf(searchStr.toLowerCase());
    }

    /**
     * Replace all occurrences of a substring (case-insensitive)
     * @param str - The original string
     * @param searchStr - The substring to replace
     * @param replaceStr - The replacement string
     * @returns string - the string with all occurrences replaced
     */
    static replaceAll(str: string, searchStr: string, replaceStr: string): string {
        if (str == null || searchStr == null || replaceStr == null) {
            return str || '';
        }
        const regex = new RegExp(searchStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        return str.replace(regex, replaceStr);
    }

    /**
     * Trim whitespace and convert to lowercase
     * @param str - The string to normalize
     * @returns string - normalized string
     */
    static normalize(str: string): string {
        if (str == null) {
            return '';
        }
        return str.trim().toLowerCase();
    }

    /**
     * Check if a string is empty or only contains whitespace
     * @param str - The string to check
     * @returns boolean - true if string is empty or whitespace only
     */
    static isEmpty(str: string): boolean {
        return str == null || str.trim().length === 0;
    }

    /**
     * Check if a string is not empty and contains non-whitespace characters
     * @param str - The string to check
     * @returns boolean - true if string has content
     */
    static isNotEmpty(str: string): boolean {
        return !StringUtil.isEmpty(str);
    }

    /**
     * Capitalize the first letter of each word (case-insensitive input)
     * @param str - The string to capitalize
     * @returns string - string with first letter of each word capitalized
     */
    static toTitleCase(str: string): string {
        if (StringUtil.isEmpty(str)) {
            return '';
        }
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}