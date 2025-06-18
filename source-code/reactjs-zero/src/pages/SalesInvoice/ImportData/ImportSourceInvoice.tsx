import {useTranslation} from "react-i18next";
import React, {useState} from "react";
import {Button, Card, Col, Input, Row, Upload, UploadProps} from "antd";
import UiUtils from "@ord-core/utils/ui.utils";
import {ImportOutlined} from "@ant-design/icons";

const ImportSourceInvoice = ({onFileUpload} : any) => {
    const {t} = useTranslation('sale-invoice');
    const {t: tCommon} = useTranslation('common');
    const [fileName, setFileName] = useState("");

    const uploadProps: UploadProps = {
        name: 'file',
        accept: '.xlsx, .xls', // Chỉ chấp nhận file Excel
        onChange(info) {
            // Khi file được upload thành công hoặc chọn file
            if (info.file.status === 'done' || info.file.status === 'uploading') {
                setFileName(info.file.name); // Lưu tên file vào state
            }
        },
        beforeUpload: (file) => {
            const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                || file.type === 'application/vnd.ms-excel';
            if (!isExcel) {
                UiUtils.showError(tCommon('excelAlert.validatorExcel'));
            }
            onFileUpload(file);
            return isExcel || Upload.LIST_IGNORE;
        },
    };

    return (<>
        <Card style={{marginBottom: 10}}>
            <h3 style={{color: 'gray', fontWeight: 'bold'}}>{t('fileExcel.requireImport')}</h3>
            <div style={{marginBottom: 10}}>
                <ul>
                    <li style={{color: 'gray'}}>{t('fileExcel.importSystem')}</li>
                    <li style={{color: 'red'}}>{t('fileExcel.noteImport')}</li>
                </ul>
            </div>
            <Row style={{marginTop: 10}}>
                <Col>
                    <Upload {...uploadProps} maxCount={1} showUploadList={false}>
                        <Button icon={<ImportOutlined/>} type={"primary"}>{t('actionBtn.importExcel')}</Button>
                    </Upload>
                </Col>
                <Col span={18} style={{marginLeft: 10}}>
                    <Input
                        value={fileName}
                        disabled
                        placeholder={tCommon('excelAlert.noFileSelected')}
                    />
                </Col>
            </Row>
        </Card>
    </>);
};

export default ImportSourceInvoice;
