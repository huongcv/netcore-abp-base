import React, {useState} from 'react';
import {message, Tooltip} from 'antd';
import {CheckOutlined, CopyOutlined} from '@ant-design/icons';
import classNames from 'classnames';
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
                                                                    tooltipPlacement = 'top',
                                                                }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(copyText);
            setCopied(true);
            message.success('Đã sao chép!');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            message.error('Không thể sao chép');
        }
    };

    const contentNode = (
        <div
            className={classNames('copyable-wrapper', {
                'is-copyable': config.copyable,
            })}
            onClick={config.copyable ? handleCopy : undefined}
        >
            <div className="copyable-text">{content}</div>
            {config.copyable && (
                <span
                    className={classNames('copy-icon', {copied})}
                >
          {copied ? <CheckOutlined/> : <CopyOutlined/>}
        </span>
            )}
        </div>
    );

    return showTooltip && tooltipTitle ? (
        <Tooltip title={tooltipTitle} placement={tooltipPlacement}>
            {contentNode}
        </Tooltip>
    ) : (
        contentNode
    );
};
