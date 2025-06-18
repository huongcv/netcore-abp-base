import React from 'react';
import {Button, message} from 'antd';
import {DownloadOutlined} from '@ant-design/icons';
import axios from 'axios';
import FileSaver from 'file-saver';
import {useTranslation} from 'react-i18next';

const DownloadTemplateExcelInvoice: React.FC = () => {
    const { t } = useTranslation('common');

    const handleDownload = async () => {
        try {

            const response = await axios.get('/excels/invoice/mau-phieu-nhap-hoa-don-ban.xlsx', {
                responseType: 'blob',
            });

            if (response && response.data) {
                FileSaver.saveAs(response.data, 'mau-phieu-nhap-hoa-don-ban.xlsx');
            } else {
                throw new Error('Download failed');
            }
        } catch (error) {
            console.error('Error downloading file:', error);
            message.error(t('excelAlert.errorDownload'));
        }
    };

    return (
        <Button onClick={handleDownload} type="default" icon={<DownloadOutlined />}>
            {t('actionBtn.downloadTemplateExcel')}
        </Button>
    );
};

export default DownloadTemplateExcelInvoice;
