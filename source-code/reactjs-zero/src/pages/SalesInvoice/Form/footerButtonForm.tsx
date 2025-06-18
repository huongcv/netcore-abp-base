// FooterButtons.tsx
import { Button } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SaleInvoiceStatusEnum } from '../Utils/saleCommon';
import { CloseOutlined, CopyOutlined, EditOutlined, FileDoneOutlined, PrinterOutlined } from '@ant-design/icons';
import UiUtils from "@ord-core/utils/ui.utils";
import { EinvoiceService } from "@api/EinvoiceService";
import { MoveType } from "@pages/StockManagement/Shared/Const/StockMoveConst";
import { FormInstance } from 'antd/lib';

interface FooterButtonsProps {
    saleInvoice: any;
    handleCopy: (saleInvoice: any) => void;
    handleEdit: (saleInvoice: any) => void;
    handleCancel: () => void;
    handleOk: () => void;
    onSuccess?: () => void;
    isEnableExportEInvoice?: boolean,
    formExportEInvoice?: FormInstance,
}

const FooterButtons: React.FC<FooterButtonsProps> = ({
    saleInvoice, handleCopy, handleCancel, handleOk, handleEdit, onSuccess, isEnableExportEInvoice, formExportEInvoice
}) => {
    const { t } = useTranslation('sale-invoice');
    let isEdit = false;
    let isShowCancelEInvoice = false;
    if (saleInvoice?.status === SaleInvoiceStatusEnum.DANG_SOAN) isEdit = true
    else isEdit = false;


    const handleCreateEInvoice = async () => {
        const data = await formExportEInvoice?.validateFields();

        UiUtils.setBusy();
        EinvoiceService.create({
            body: {
                listSaleInvoice: [{ ...saleInvoice, ...data },],
            }
        }).then((result) => {
            UiUtils.clearBusy();
            if (result.isSuccessful) {
                if (result.data?.totalError) {
                    UiUtils.showError(t('Xuất hoá đơn điện tử thất bại'));
                } else {
                    UiUtils.showSuccess(t('EInvoice.createSuccess'));
                }
                onSuccess && onSuccess();
                handleCancel();
            } else UiUtils.showError(t('Xuất hoá đơn điện tử thất bại'));
        }).finally(() => {
            UiUtils.clearBusy();
        })
    }
    const handleCancelEInvoice = () => {
        UiUtils.setBusy();
        EinvoiceService.cancel({ body: saleInvoice }).then((result) => {
            if (result.isSuccessful) {
                UiUtils.showSuccess(t('EInvoice.cancelSuccess'));
            } else UiUtils.showError(result.notification?.message);
        })
        UiUtils.clearBusy();
    }

    const showConfirmExportEInvoice = async () => {
        await formExportEInvoice?.validateFields();

        handleCancel();
        UiUtils.showConfirm({
            title: t('EInvoice.titleCreateEInvoice'),
            content: (
                <div>
                    {t('EInvoice.createEInvoiceConfirm')}:
                    <strong className="mr-4">{saleInvoice?.invoiceCode}</strong>
                </div>
            ),
            isDanger: true,
            onOk: () => {
                handleCreateEInvoice();
            },
        });
    }
    return (
        <div className="flex justify-between">

            <div className='sub-function'>
                <Button className='footer-button fixed-left'
                    type='default'
                    onClick={() => handleCopy(saleInvoice)}>
                    <CopyOutlined />
                    {t('actionBtn.copyInvoice')}

                </Button>
                {isEdit && <Button className='footer-button'
                    type='default'
                    onClick={() => handleEdit(saleInvoice)}>
                    <EditOutlined />
                    {t('actionBtn.edit')}
                </Button>}

                <Button className='footer-button fixed-right'
                    onClick={handleOk}
                >
                    <PrinterOutlined />
                    {t('actionBtn.print')}
                </Button>
            </div>
            <div className='main-function'>
                <Button className='footer-button'
                    type='default'
                    onClick={handleCancel}
                >
                    <CloseOutlined />
                    {t('actionBtn.close')}
                </Button>
                {isEnableExportEInvoice && (
                    <Button
                        className="footer-button"
                        type="primary"
                        onClick={handleCreateEInvoice}>
                        <FileDoneOutlined />
                        {t('actionBtn.createEInvoice')}
                    </Button>
                )}
                {/* {isShowCancelEInvoice && (
                    <Button
                        className="footer-button"
                        type="default"
                        onClick={() => {
                            UiUtils.showConfirm({
                                title: t('EInvoice.titleCancelEInvoice'),
                                content: (
                                    <div>
                                        {t('EInvoice.createEInvoiceConfirm')}:
                                        <strong className="mr-4">{saleInvoice?.invoiceCode}</strong>
                                    </div>
                                ),
                                onOk: () => {
                                    handleCancelEInvoice();
                                },
                            });
                        }}
                    >
                        <FileDoneOutlined/>
                        {t('actionBtn.cancelEInvoice')}
                    </Button>
                )} */}
            </div>
        </div>
    );

}
export default FooterButtons;
