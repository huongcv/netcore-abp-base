import React from 'react';
import {Space} from 'antd';
import {OrdModalCloseButton} from "@ord-components/modal/footer/buttons/OrdModalCloseButton";

export interface ModalFooterProps {
    left?: React.ReactNode;
    leftClose?: React.ReactNode;
    right?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    onClose: () => void;
}

export const OrdModalFooter: React.FC<ModalFooterProps> = ({left, leftClose, right, style, className, onClose}) => {
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
                {leftClose}
                <OrdModalCloseButton onClick={onClose}/>
                {right}
            </Space>
        </div>
    );
};
