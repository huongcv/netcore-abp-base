import {ResponsiveTextConfig} from "@ord-components/paged-table/columns/types";

export class ResponsiveTextUtils {
    // Default character width in pixels (approximate for most fonts)
    static readonly DEFAULT_CHAR_WIDTH = 8;

    // Default breakpoints (following Ant Design)
    static readonly BREAKPOINTS = {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1600
    };

    /**
     * Get current screen breakpoint
     */
    static getCurrentBreakpoint(): string {
        if (typeof window === 'undefined') return 'md'; // SSR fallback

        const width = window.innerWidth;

        if (width >= this.BREAKPOINTS.xxl) return 'xxl';
        if (width >= this.BREAKPOINTS.xl) return 'xl';
        if (width >= this.BREAKPOINTS.lg) return 'lg';
        if (width >= this.BREAKPOINTS.md) return 'md';
        if (width >= this.BREAKPOINTS.sm) return 'sm';
        return 'xs';
    }

    /**
     * Calculate max characters based on column width
     */
    static calculateMaxLength(
        columnWidth: number,
        config: ResponsiveTextConfig
    ): number {
        const {
            charWidth = this.DEFAULT_CHAR_WIDTH,
            minChars = 10,
            maxChars = 500,
            breakpoints,
            dynamicLength,
            maxLines = 2
        } = config;
        console.log('charWidth', columnWidth, config)

        // Use dynamic calculation if provided
        if (dynamicLength) {
            const containerWidth = window?.innerWidth || 1200;
            return Math.max(
                minChars,
                Math.min(maxChars, dynamicLength(containerWidth, columnWidth))
            );
        }

        // Use breakpoint-specific length if available
        if (breakpoints) {
            const currentBreakpoint = this.getCurrentBreakpoint();
            const breakpointLength = breakpoints[currentBreakpoint as keyof typeof breakpoints];

            if (breakpointLength !== undefined) {
                return Math.max(minChars, Math.min(maxChars, breakpointLength));
            }
        }

        // Calculate based on column width
        // Reserve some space for padding, borders, and copy icon
        const availableWidth = columnWidth - 32; // 16px padding + 16px for copy icon
        const calculatedLength = Math.floor(availableWidth / charWidth);

        const maxChar1Line = Math.max(minChars, Math.min(maxChars, calculatedLength));
        return maxChar1Line * maxLines;
    }

    /**
     * Get responsive length with fallback
     */
    static getResponsiveLength(
        staticMaxLength: number | undefined,
        columnWidth: number | undefined,
        responsiveConfig: ResponsiveTextConfig | undefined
    ): number {
        // Use static maxLength if no responsive config
        if (!responsiveConfig?.responsive || !columnWidth) {
            return staticMaxLength || 50;
        }

        return this.calculateMaxLength(columnWidth, responsiveConfig);
    }
}
