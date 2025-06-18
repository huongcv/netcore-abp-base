import { FileDoneOutlined } from "@ant-design/icons";
import { BarcodeProductItemDto, SaleInvoiceDto } from "@api/index.defs";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import dateUtil from "@ord-core/utils/date.util";
import { useStore } from "@ord-store/index";
import { Button, Col, Form, Modal, Row, TableColumnsType, TableProps } from "antd";
import { observer } from "mobx-react-lite";
import React, { memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SaleInvoiceStatusCell } from "../../InvoiceReturn/datatable/saleInvoiceStatusCell";
import ExportMergeInvoiceRightBox from "./ExportMergeInvoiceRightBox";
import uiUtils from "@ord-core/utils/ui.utils";
import { EinvoiceService } from "@api/EinvoiceService";
import { InvoiceSearch } from "../invoiceSearch";
import { InvoiceSearchForMerge } from "../invoiceSearchForMerge";

const SearchBox = memo(() => {
    return <>
        <SearchFilterText placeHolder='Nhập mã hoá đơn để tìm kiếm' span={24} />
    </>
});

const ModalExportMergeEinvice = () => {
    const { exportEInvoiceStore: mainStore, saleInvoiceStore } = useStore();
    const { t: tCommon } = useTranslation('common');
    const { t } = useTranslation('sale-invoice');
    const { t: tEnum } = useTranslation('enum');

    const [form] = Form.useForm();


    const columns: TableColumnsType<SaleInvoiceDto> = [
        {
            title: t('invoiceCode'),
            dataIndex: 'invoiceCode',
            width: 240,
            align: 'left',
            render: (v, record: SaleInvoiceDto) => {
                return (
                    <>
                        <p>{record.invoiceCode}</p>
                        <i>{dateUtil.toFormat(record.invoiceDate)}</i>
                    </>
                )
            }
        },

        {
            title: t('partnerName'),
            dataIndex: 'partnerName',
            ellipsis: true,
            align: 'left',
        },
        {
            dataIndex: 'totalAmountRound',
            title: t('productAmount'),
            align: 'end',
            render: v => <PriceCell value={v} />,
            width: 130,
        },
        {
            dataIndex: 'status',
            title: t('status'),
            align: 'center',
            render: (v) => <SaleInvoiceStatusCell status={v} />,
            width: 130,
        },
    ];

    const rowSelection: TableProps<SaleInvoiceDto>['rowSelection'] = {
        selectedRowKeys: mainStore.selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: BarcodeProductItemDto[]) => {
            mainStore.setSelectedRows(selectedRows);
        },
        getCheckboxProps: (record: SaleInvoiceDto) => ({
            name: record.id,
        }),
    };

    const handleClose = () => {
        mainStore.isShowExportMergeModal = false;
        mainStore.selectedRowKeys = [];
        mainStore.selectedRows = []
    }

    const handleOk = async () => {
        const data = await form.validateFields();
        if (!mainStore.selectedRowKeys.length) {
            uiUtils.showError('Bạn chưa chọn hóa đơn nào!');
            return;
        }

        try {
            uiUtils.setBusy();
            const result = await EinvoiceService.createMerge({
                body: {
                    ...data, 
                    listSaleInvoice: mainStore.selectedRows,
                },
            });

            if (result.isSuccessful) {
                const { totalSuccess = 0, totalError = 0 } = result.data || {};

                if (totalSuccess > 0) {
                    uiUtils.showSuccess(`Xuất hoá đơn điện tử gộp thành công.`);
                } else {
                    uiUtils.showError(`Xuất hoá đơn điện tử gộp thất bại.`);
                }

                handleClose();

            } else {
                uiUtils.showError(t('Xuất hoá đơn điện tử gộp thất bại'));
            }
        } catch (error) {
            console.error('Export EInvoice error:', error);
            uiUtils.showError(t('Đã xảy ra lỗi khi xuất hoá đơn gộp'));
        } finally {
            uiUtils.clearBusy();
        }
    }

    return <>
        <Modal title={t('Xuất hoá đơn điện tử gộp')}
            width={'90%'}
            style={{ top: 5 }}
            open={mainStore.isShowExportMergeModal}
            onCancel={() => handleClose()}
            onClose={() => handleClose()}
            destroyOnClose
            footer={[
                <Button key="cancel" onClick={() => mainStore.isShowExportMergeModal = false}>
                    {tCommon('Đóng')}
                </Button>,
                <Button
                    key="export"
                    type="primary"
                    icon={<FileDoneOutlined />}
                    onClick={() => handleOk()}
                    disabled={mainStore.selectedRowKeys.length === 0}
                >
                    {t('Xuất hóa đơn điện tử gộp')}
                </Button>
            ]}>
            <Row gutter={[12, 12]}>
                <Col span={12}>
                    <h3 className={'font-bold text-xl mb-3'}>{t('Danh sách hoá đơn')}</h3>
                    <OrdCrudPage stored={mainStore}
                        hiddenTopAction={true}
                        columns={columns}
                        searchForm={(f) => <InvoiceSearchForMerge />}
                        rowSelection={{ type: 'checkbox', ...rowSelection }}
                    ></OrdCrudPage>

                </Col>
                <Col span={12}>
                    <Form form={form} onFinish={print}>
                        <ExportMergeInvoiceRightBox ></ExportMergeInvoiceRightBox>
                    </Form>
                </Col>
            </Row>
        </Modal>
    </>
}
export default observer(ModalExportMergeEinvice);


