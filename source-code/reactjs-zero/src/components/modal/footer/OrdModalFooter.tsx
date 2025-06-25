import React from 'react';
import {Space} from 'antd';
import {OrdModalCloseButton} from "@ord-components/modal/footer/OrdModalCloseButton";

export interface ModalFooterProps {
    left?: React.ReactNode;
    right?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    onClose: () => void;
}

export const OrdModalFooter: React.FC<ModalFooterProps> = ({left, right, style, className, onClose}) => {
    const hasLeft = !!left;
    return (
        <div
            className={className}
            style={{
                display: 'flex',
                justifyContent: hasLeft ? 'space-between' : 'flex-end',
                alignItems: 'center',
                ...style,
            }}
        >
            <Space>
                {left}
            </Space>
            <Space>
                {right}
                <OrdModalCloseButton onClick={onClose}/>
            </Space>
        </div>
    );
};
