import React from 'react';
import {CopyableWrapper} from '../utils/copyableWrapper';
import {StyleWrapper} from '../utils/styleWrapper';
import {NumberDisplay} from "@ord-components/common/display/NumberDisplay";
import {NumberColumnOptions} from "@ord-components/paged-table/columns";

export class NumberRender {
    static render(value: any, record: any, config: NumberColumnOptions): React.ReactNode {
        // Handle empty values at render level
        if (value === null || value === undefined || value === '') {
            return StyleWrapper.wrapWithStyle('', value, record, config);
        }

        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(num)) {
            return StyleWrapper.wrapWithStyle('', value, record, config);
        }

        if (config.hideZero && num === 0) {
            return StyleWrapper.wrapWithStyle('', value, record, config);
        }

        // Use NumberDisplay component for formatting
        const numberDisplay = (
            <NumberDisplay
                value={num}
                decimalPlaces={config.decimalPlaces}
                thousandSeparator={config.thousandSeparator}
                decimalSeparator={config.decimalSeparator}
                prefix={config.prefix}
                suffix={config.suffix}
                currency={config.currency}
                hideZero={config.hideZero}
                colorScheme="positive-negative" // Apply color scheme
                showTooltip={false} // We handle tooltip in CopyableWrapper
            />
        );

        // Get formatted text for copying
        const formattedText = numberDisplay.props.children || String(value);

        const content = (
            <CopyableWrapper
                content={numberDisplay}
                copyText={formattedText}
                config={config}
            />
        );

        return StyleWrapper.wrapWithStyle(content, value, record, config);
    }
}