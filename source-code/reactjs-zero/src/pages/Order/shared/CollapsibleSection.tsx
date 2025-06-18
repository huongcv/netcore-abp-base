import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Row } from 'antd';
import React, { ReactNode, useState } from 'react';

interface CollapsibleSectionProps {
    title: string;
    children: ReactNode;
    className?: string;
    gutter?: number;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title,
    children,
    className = 'order-right mt-2',
    gutter = 16,
}) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={className}>
            <h4
                className="move-title-header"
                onClick={toggleCollapse}
                style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    margin: 0,
                    
                }}
            >
                <span>{title}</span>
                {isCollapsed ? (
                    <DownOutlined style={{ fontSize: '14px', color: 'var(--main-color)' }} />
                ) : (
                    <UpOutlined style={{ fontSize: '14px', color: 'var(--main-color)' }} />
                )}
            </h4>
            {!isCollapsed && (
                <Row gutter={gutter} style={{ marginTop: '8px' }}>
                    {children}
                </Row>
            )}
        </div>
    );
};

export default CollapsibleSection;