import {RcFile} from "antd/es/upload";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import UiUtils from "@ord-core/utils/ui.utils";
import {CheckOutlined, CloseOutlined, FileDoneOutlined, ImportOutlined, RightOutlined} from "@ant-design/icons";
import {Button, Space, Tabs, TabsProps} from "antd";
import {SaleInvoiceService} from "@api/SaleInvoiceService";
import {ImportSaleInvoiceOutputDto} from "@api/index.defs";
import ImportSourceInvoice from "./ImportSourceInvoice";
import DownloadTemplateExcelInvoice from "./DownloadTemplateExcelInvoice";
import CheckSourceInvoice from "./CheckSourceInvoice";

const ModalTabImportInvoice = ({ closeModal, okModal }: any) => {
    const {t} = useTranslation('common');
    const [activeTab, setActiveTab] = React.useState("1");
    const [fileUpload, setFileUpload] = useState<RcFile>();
    const [resultImport, setResultImport] = useState<ImportSaleInvoiceOutputDto>()
    const handleFileUpload = (result: RcFile) => {
        setFileUpload(result);
    };
    const handleNextTab = () => {
        if (activeTab === "1") {
            startImportFileUpload(fileUpload).then(r => setActiveTab("2"));
        }
    };
    const initModal = () => {
        setFileUpload(undefined); // Reset fileUpload to undefined
        //setResultImport(undefined); // Reset resultImport to undefined
        setActiveTab("1");
    };
    const handleClose = () => {
        initModal();
        closeModal();
    }
    const handleOk = () => {
        initModal();
        okModal();
    }
    const startImportFileUpload = async (file: RcFile | undefined) => {
        try {
            UiUtils.setBusy();
            const response = await SaleInvoiceService.import({
                files: [file] as any
            })
            if (response.isSuccessful) {
                UiUtils.clearBusy();
                setResultImport(response.data);
            } else {
                UiUtils.clearBusy();
                UiUtils.showError(t('excelAlert.error'));
            }
        } catch (error) {
            UiUtils.clearBusy();
            UiUtils.showError(t('excelAlert.error'));
        }
    }
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: <Space><ImportOutlined/>{t('excelAction.importSource')}</Space>,
            children: <div>
                <ImportSourceInvoice onFileUpload={handleFileUpload}/>
                <div style={{marginBottom: 20, display: "flex", justifyContent: 'end'}}>
                    <Button icon={<CloseOutlined/>} type={"default"} onClick={handleClose}>
                        {t('actionBtn.close')}
                    </Button>
                    <div style={{marginLeft: 10}}><DownloadTemplateExcelInvoice/></div>
                    <Button type={"primary"} style={{marginLeft: 10}} onClick={handleNextTab} disabled={fileUpload == null}>
                        {t('actionBtn.next')}<RightOutlined/>
                    </Button>
                </div>
            </div>
        },
        {
            key: '2',
            label: <Space><CheckOutlined/>{t('excelAction.checkSource')}</Space>,
            disabled: activeTab === "1",
            children: <div>
                <CheckSourceInvoice result={resultImport}/>
                <div style={{marginBottom: 20, display: "flex", justifyContent: 'end'}}>
                    <Button icon={<CloseOutlined/>} type={"default"} onClick={handleClose}>
                        {t('actionBtn.close')}
                    </Button>
                    <Button icon={<FileDoneOutlined/>} type={"primary"} style={{marginLeft: 10}} onClick={handleOk}>
                        {t('actionBtn.done')}
                    </Button>
                </div>
            </div>
        },
    ];
    return <>
        <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            items={items}
            type="card"
            centered
        />
    </>
};

export default ModalTabImportInvoice;
