import React, {useState} from 'react';
import {message, Tooltip} from 'antd';
import {CheckOutlined, CopyOutlined} from '@ant-design/icons';
import {BaseColumnConfig} from '../types';

interface CopyableWrapperProps {
    content: React.ReactNode;
    copyText: string;
    config: BaseColumnConfig;
    showTooltip?: boolean;
    tooltipTitle?: string;
    tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
}

export const CopyableWrapper: React.FC<CopyableWrapperProps> = ({
                                                                    content,
                                                                    copyText,
                                                                    config,
                                                                    showTooltip = false,
                                                                    tooltipTitle,
                                                                    tooltipPlacement = 'top'
                                                                }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(copyText);
            setCopied(true);
            message.success('Đã sao chép!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            message.error('Không thể sao chép');
        }
    };

    const copyableContent = (
        <span
            className="copyable-content"
            style={{
                position: 'relative',
                cursor: config.copyable ? 'pointer' : 'default',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: config.copyable ? '2px 4px' : 0,
                borderRadius: '4px',
                transition: 'all 0.2s ease'
            }}
            onClick={config.copyable ? handleCopy : undefined}
            onMouseEnter={(e) => {
                if (config.copyable) {
                    e.currentTarget.style.backgroundColor = 'rgba(24, 144, 255, 0.05)';
                    const icon = e.currentTarget.querySelector('.copy-icon') as HTMLElement;
                    if (icon) icon.style.opacity = '1';
                }
            }}
            onMouseLeave={(e) => {
                if (config.copyable) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    const icon = e.currentTarget.querySelector('.copy-icon') as HTMLElement;
                    if (icon) icon.style.opacity = '0';
                }
            }}
        >
      <span>{content}</span>
            {config.copyable && (
                <span
                    className="copy-icon"
                    style={{
                        opacity: 0,
                        transition: 'opacity 0.2s ease, transform 0.2s ease',
                        fontSize: '12px',
                        color: copied ? '#52c41a' : '#1890ff',
                        display: 'inline-flex',
                        alignItems: 'center',
                        transform: 'scale(0.9)'
                    }}
                >
          {copied ? <CheckOutlined/> : <CopyOutlined/>}
        </span>
            )}
    </span>
    );

    if (showTooltip && tooltipTitle) {
        return (
            <Tooltip title={tooltipTitle} placement={tooltipPlacement}>
                {copyableContent}
            </Tooltip>
        );
    }

    return copyableContent;
};