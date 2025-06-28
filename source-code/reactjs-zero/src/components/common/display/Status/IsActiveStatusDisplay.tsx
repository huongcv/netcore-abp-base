import React from "react";
import {Tag} from "antd";

interface StatusDisplayProps {
    value?: boolean | null;
    type?: 'tag' | 'badge' | 'text';
    config?: Partial<StatusConfig>;
    className?: string;
}

export interface StatusConfig {
    activeClass: string;
    inactiveClass: string;
    activeText: string;
    inactiveText: string;
    activeColor: string;
    inactiveColor: string;
}

const DEFAULT_STATUS_CONFIG: StatusConfig = {
    activeClass: 'bg-green-100 text-green-800',
    inactiveClass: 'bg-red-100 text-red-800',
    activeText: 'Hoạt động',
    inactiveText: 'Không hoạt động',
    activeColor: 'green',
    inactiveColor: 'red'
};

const getFinalConfig = (config?: Partial<StatusConfig>): StatusConfig => ({
    ...DEFAULT_STATUS_CONFIG,
    ...config
});

export const getStatusColor = (value: boolean, config?: Partial<StatusConfig>) => {
    const finalConfig = getFinalConfig(config);
    return value ? finalConfig.activeClass : finalConfig.inactiveClass;
};

export const getStatusTag = (value: boolean, config?: Partial<StatusConfig>) => {
    const finalConfig = getFinalConfig(config);
    return (
        <Tag color={value ? finalConfig.activeColor : finalConfig.inactiveColor}>
            {value ? finalConfig.activeText : finalConfig.inactiveText}
        </Tag>
    );
};

export const IsActiveStatusDisplay: React.FC<StatusDisplayProps> = ({
                                                                        value,
                                                                        type = 'tag',
                                                                        config,
                                                                        className = ''
                                                                    }) => {
    const finalConfig = getFinalConfig(config);
    const displayText = value ? finalConfig.activeText : finalConfig.inactiveText;

    if (type === 'tag') {
        return getStatusTag(value == true, config);
    }

    if (type === 'badge') {
        return (
            <span
                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value, config)} ${className}`}
            >
        {displayText}
      </span>
        );
    }

    if (type === 'text') {
        return (
            <span
                className={`font-medium ${value ? 'text-green-600' : 'text-red-600'} ${className}`}
            >
        {displayText}
      </span>
        );
    }

    // Fallback
    return getStatusTag(value == true, config);
};
