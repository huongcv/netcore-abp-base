// FooterButtons.tsx
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface FooterButtonsProps {
    handleCancel: () => void;
    handleOk: () => void;
}

const FooterButtons: React.FC<FooterButtonsProps> = ({
    handleCancel, handleOk,
}) => {
    const { t } = useTranslation('sale-invoice');
    return (
        <div className="flex justify-end">
            <div className='main-function'>
                <Button className='footer-button'
                    type='default'
                    onClick={handleCancel}
                >
                    <CloseOutlined />
                    {t('actionBtn.close')}
                </Button>
            </div>
        </div>
    );

}
export default FooterButtons;
