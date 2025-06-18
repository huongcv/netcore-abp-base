import React, { useState, useEffect } from 'react';
import { Popover, Button } from 'antd';
import { UserOutlined, TeamOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

export interface GuestSelectorValue {
    adults: number;
    children: number;
}

interface GuestSelectorProps {
    value?: GuestSelectorValue;
    onChange?: (value: GuestSelectorValue) => void;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({ value, onChange }) => {
    const [visible, setVisible] = useState(false);
    const [localAdults, setLocalAdults] = useState<number>(1);
    const [localChildren, setLocalChildren] = useState<number>(0);

    // Khi mở popover, copy từ value form ra local state để chỉnh sửa
    useEffect(() => {
        if (visible) {
            setLocalAdults(value?.adults ?? 1);
            setLocalChildren(value?.children ?? 0);
        }
    }, [visible, value]);

    const handleConfirm = () => {
        setVisible(false);
        onChange?.({ adults: localAdults, children: localChildren });
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const summary = `${value?.adults ?? 1} người lớn | ${value?.children ?? 0} trẻ em`;

    const content = (
        <div className="w-64 p-2">
            {/* Người lớn */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <UserOutlined />
                    <span>Người lớn</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="small"
                        disabled={localAdults === 1}
                        style={{ backgroundColor: localAdults === 1 ? '#e5e7eb' : '#EBF9F4' }}
                        className="w-8 h-8 flex items-center justify-center rounded"
                        onClick={() => setLocalAdults(Math.max(1, localAdults - 1))}
                    >
                        –
                    </Button>
                    <span className="w-6 text-center">{localAdults}</span>
                    <Button
                        size="small"
                        style={{ backgroundColor: '#EBF9F4' }}
                        className="w-8 h-8 flex items-center justify-center rounded"
                        onClick={() => setLocalAdults(localAdults + 1)}
                    >
                        +
                    </Button>
                </div>
            </div>

            {/* Trẻ em */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <TeamOutlined />
                    <span>Trẻ em</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="small"
                        disabled={localChildren === 0}
                        style={{ backgroundColor: localChildren === 0 ? '#e5e7eb' : '#EBF9F4' }}
                        className="w-8 h-8 flex items-center justify-center rounded"
                        onClick={() => setLocalChildren(Math.max(0, localChildren - 1))}
                    >
                        –
                    </Button>
                    <span className="w-6 text-center">{localChildren}</span>
                    <Button
                        size="small"
                        style={{ backgroundColor: '#EBF9F4' }}
                        className="w-8 h-8 flex items-center justify-center rounded"
                        onClick={() => setLocalChildren(localChildren + 1)}
                    >
                        +
                    </Button>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-4">
                <Button icon={<CloseOutlined />} onClick={handleCancel}>
                    Hủy
                </Button>
                <Button type="primary" icon={<CheckOutlined />} onClick={handleConfirm}>
                    Xác nhận
                </Button>
            </div>
        </div>
    );

    return (
        <Popover
            content={content}
            title="Số lượng"
            trigger="click"
            open={visible}
            onOpenChange={(v) => setVisible(v)}
        >
            <Button block className="justify-start truncate">
                {summary}
            </Button>
        </Popover>
    );
};

export default GuestSelector;
