import React from 'react';
import {Button} from 'antd';
import {CloseOutlined} from '@ant-design/icons';
import type {SizeType} from "antd/es/config-provider/SizeContext";
import {useTranslation} from "react-i18next";

export interface CloseButtonProps {
    onClick?: () => void;
    size?: SizeType;
    style?: React.CSSProperties;
    className?: string;
}

export const OrdModalCloseButton: React.FC<CloseButtonProps> = ({
                                                                    onClick,
                                                                    size,
                                                                    style,
                                                                    className,
                                                                }) => {
    const {t} = useTranslation(['action']);
    return (
        <Button
            icon={<CloseOutlined/>}
            onClick={onClick}
            size={size}
            style={style}
            className={className}
        >
            {t('modal.cancel')} (F10)
        </Button>
    );
};
