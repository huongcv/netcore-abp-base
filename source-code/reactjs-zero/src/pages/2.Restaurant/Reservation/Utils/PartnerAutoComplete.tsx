import React, { useState } from 'react';
import { AutoComplete } from 'antd';
import useAutoFocus from '@ord-core/hooks/useAutoFocus';

interface PartnerAutoCompleteProps {
    value?: string;
    onChange?: (value: string) => void;
}

const PartnerAutoComplete: React.FC<PartnerAutoCompleteProps> = ({ value, onChange }) => {
    const [options, setOptions] = useState<{ value: string }[]>([]);

    const focusRef = useAutoFocus();

    return (
        <AutoComplete
            className="w-full"
            value={value}
            options={options}
            onChange={onChange}
            placeholder="Nhập tên người đặt bàn"
            popupMatchSelectWidth={500}
            ref={focusRef}
        />
    );
};

export default PartnerAutoComplete;
