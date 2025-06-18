import { FileDoneOutlined } from "@ant-design/icons";
import { TableColumnsType, Modal, Button, Form, Row } from "antd";
import { useState } from "react";
import { useStore } from "@ord-store/index";
import { useTranslation } from "react-i18next";
import { SaleInvoiceDto } from "@api/index.defs";
import dateUtil from "@ord-core/utils/date.util";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import { debounce } from "lodash";
import { observer } from "mobx-react-lite";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { EinvoiceService } from "@api/EinvoiceService";
import uiUtils from "@ord-core/utils/ui.utils";
import { InvoiceSearch } from "../invoiceSearch";
import { SaleInvoiceStatusCell } from "@pages/SalesInvoice/InvoiceReturn/datatable/saleInvoiceStatusCell";

const ModalExportEinvoice = () => {
    const { exportEInvoiceStore: mainStore, saleInvoiceStore } = useStore();
    const { t: tCommon } = useTranslation('common');
    const { t } = useTranslation('sale-invoice');
    const { t: tEnum } = useTranslation('enum');

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<SaleInvoiceDto[]>([]);
    const [searchFormRef] = Form.useForm();

    const exportInvoices = async (invoices: SaleInvoiceDto[]) => {
        if (!invoices.length) {
            uiUtils.showError('Bạn chưa chọn hóa đơn nào!');
            return;
        }

        try {
            uiUtils.setBusy();
            const result = await EinvoiceService.create({
                body: {
                    listSaleInvoice: invoices,
                },
            });

            if (result.isSuccessful) {
                const { totalSuccess = 0, totalError = 0 } = result.data || {};

                if (totalSuccess > 0 && totalError === 0) {
                    uiUtils.showSuccess(`${totalSuccess} hóa đơn đã xuất thành công.`);
                } else if (totalSuccess === 0 && totalError > 0) {
                    uiUtils.showError(`${totalError} hóa đơn thất bại khi xuất.`);
                } else if (totalSuccess > 0 && totalError > 0) {
                    uiUtils.showError(`${totalSuccess} hóa đơn thành công, ${totalError} thất bại.`);
                } else {
                    uiUtils.showError(`Không có hóa đơn nào được xử lý.`);
                }

                mainStore.isShowExportModal = false;
                saleInvoiceStore.refreshGridData().then();

            } else {
                uiUtils.showError(t('Xuất hoá đơn điện tử thất bại'));
            }
        } catch (error) {
            console.error('Export EInvoice error:', error);
            uiUtils.showError(t('Đã xảy ra lỗi khi xuất hoá đơn'));
        } finally {
            uiUtils.clearBusy();
        }
    };

    const onExportSelectedClick = () => {
        exportInvoices(selectedRows);
    };

    const columns: TableColumnsType<SaleInvoiceDto> = [
        {
            title: t('invoiceCode'),
            dataIndex: 'invoiceCode',
            width: 120,
            align: 'left',
        },
        {
            dataIndex: 'invoiceDate',
            title: t('invoiceDate'),
            width: 140,
            align: 'center',
            render: v => dateUtil.toFormat(v),
        },
        {
            title: t('partnerName'),
            dataIndex: 'partnerName',
            ellipsis: true,
            align: 'left',
        },
        {
            dataIndex: 'totalQty',
            title: t('totalQty'),
            align: 'end',
            render: v => <PriceCell value={v} />,
            width: 80,
        },
        {
            dataIndex: 'totalAmountRound',
            title: t('productAmount'),
            align: 'end',
            render: v => <PriceCell value={v} />,
            width: 130,
        },
        {
            dataIndex: 'paymentAmount',
            title: t('payment'),
            align: 'end',
            render: v => <PriceCell value={v} />,
            width: 130,
        },
        {
            dataIndex: 'saleChannelTypeName',
            title: t('channel'),
            align: 'center',
            render: v => <>{tEnum(v)}</>,
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

    return (
        <Modal
            open={mainStore.isShowExportModal}
            width={1600}
            destroyOnClose
            title={t('Xuất hóa đơn điện tử')}
            onCancel={() => mainStore.isShowExportModal = false}
            footer={[
                <Button key="cancel" onClick={() => mainStore.isShowExportModal = false}>
                    {tCommon('Đóng')}
                </Button>,
                <Button
                    key="export"
                    type="primary"
                    icon={<FileDoneOutlined />}
                    onClick={onExportSelectedClick}
                    disabled={selectedRows.length === 0}
                >
                    {selectedRows.length === 0
                        ? t('Xuất hóa đơn điện tử')
                        : t(`Xuất hóa đơn điện tử (${selectedRows.length})`)}
                </Button>
            ]}
        >
            <Form
                form={searchFormRef}
                layout="vertical"
                onFinish={debounce((d) => mainStore.searchData(d), 250)}
            >
                <Row gutter={16}>
                    <InvoiceSearch />
                </Row>
            </Form>
            <AntTableWithDataPaged
                getPageResult={(d) => mainStore.apiService().getPaged(d, {})}
                columns={columns}
                searchData={mainStore.searchDataState}
                refreshDatasource={mainStore.refreshDataState}
                rowSelection={{
                    selectedRowKeys,
                    onChange: (keys, rows) => {
                        setSelectedRowKeys(keys);
                        setSelectedRows(rows as SaleInvoiceDto[]);
                    },
                }}
            />
        </Modal>
    );
};

export default observer(ModalExportEinvoice);
