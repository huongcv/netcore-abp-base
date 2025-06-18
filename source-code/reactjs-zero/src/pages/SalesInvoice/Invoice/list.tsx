import {
    ApiOutlined, BlockOutlined,
    CopyOutlined,
    ExportOutlined,
    FileDoneOutlined, LockOutlined,
    PrinterOutlined,
    StopOutlined,
    UndoOutlined
} from "@ant-design/icons";
import { EinvoiceService } from "@api/EinvoiceService";
import { SaleInvoiceDto } from "@api/index.defs";
import { InvoiceHelperService } from "@api/InvoiceHelperService";
import { SaleInvoiceService } from "@api/SaleInvoiceService";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { ArrowRightIcon } from "@ord-components/icon/ArrowRightIcon";
import { ExcelIcon } from "@ord-components/icon/ExcelIcon";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import { ITableAction } from "@ord-components/table/cells/TableActionCell";
import { l } from "@ord-core/language/lang.utils";
import DateUtil from "@ord-core/utils/date.util";
import TableUtil from "@ord-core/utils/table.util";
import { default as UiUtils, default as uiUtils } from "@ord-core/utils/ui.utils";
import { useStore } from "@ord-store/index";
import { CancelInvoiceForm } from "@pages/SalesInvoice/Form/cancelForm";
import { InvoiceSearch } from "@pages/SalesInvoice/Invoice/invoiceSearch";
import { InvoiceStatusSegmented } from "@pages/SalesInvoice/Invoice/invoiceStatusSegmented";
import { SaleInvoiceStatusCell } from "@pages/SalesInvoice/InvoiceReturn/datatable/saleInvoiceStatusCell";
import { useModal } from "@pages/SalesInvoice/Utils/modalContext";
import {SaleInvoiceStatusEnum, SaleUrlParamMode} from "@pages/SalesInvoice/Utils/saleCommon";
import { MoveType } from "@pages/StockManagement/Shared/Const/StockMoveConst";
import { Affix, Button, Dropdown, MenuProps, Modal, Space, Spin, TableColumnsType, Tooltip } from "antd";
import FileSaver from "file-saver";
import * as React from "react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ModalTabImportInvoice from "../ImportData/ModalTabImportInvoice";
import { PrintInvoice } from "../Utils/printInvoice";
import ModalExportEinvice from "@pages/SalesInvoice/Invoice/exportInvoice/ModalExportEinvice";
import ModalExportMergeEinvice from "./exportMergeInvoice/ModalExportMergeEinvice";
import { observer } from "mobx-react-lite";
import { EinvoiceJobService } from "@api/EinvoiceJobService";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";

export const List = () => {
    const navigate = useNavigate();
    const { saleInvoiceStore: mainStore, exportEInvoiceStore, sessionStore } = useStore();
    const { t: tCommon } = useTranslation('common');
    const { t } = useTranslation('sale-invoice');
    const { t: tEnum } = useTranslation('enum');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pdfUrl, setPdfUrl] = React.useState("");


    // @ts-ignore
    const { closeAllModals } = useModal();
    const invoiceSelect = (item: SaleInvoiceDto) => {
        openDetailForm(item);
    }
    const EInvoiceIcon = (props: {
        data: SaleInvoiceDto
    }) => {
        if (props.data.moveType == MoveType.HoaDon) {
            if (props.data.einvoiceStatus == 3 || props.data.einvoiceStatus == 2) {
                return <></>;
            } else {
                return <Tooltip title="Chưa xuất hóa đơn điện tử" color={'var(--main-color)'} key={'green'}>
                    <FileDoneOutlined className='ml-1' />
                </Tooltip>
            }
        } else {
            return <></>;
        }
    }
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = async () => {
        setIsModalVisible(false);
        await mainStore.refreshGridData();
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    useEffect(() => {
    }, [isModalVisible]);

    const currentDate = new Date();
    const formattedDate = currentDate.getDate().toString().padStart(2, '0') + '-' +
        (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-' +
        currentDate.getFullYear();
    const appendDateToFileName = (fileName: string, formattedDate: string): string => {
        if (fileName.endsWith('.xlsx')) {
            const fileNameWithoutExtension = fileName.replace('.xlsx', '');
            return `${fileNameWithoutExtension}_${formattedDate}.xlsx`;
        } else {
            return fileName;
        }
    }
    const printPdf = async (d: SaleInvoiceDto) => {
        UiUtils.setBusy();
        try {
            if (d.id === undefined) return;
            const resultBlob = await InvoiceHelperService.printInvoiceV2({
                body: {
                    id: d.id,
                    deviceTokenId: sessionStore.firebaseToken,
                }
            }, { responseType: 'blob' });
            setPdfUrl(URL.createObjectURL(resultBlob));

        } catch (error) {
            console.error('API call failed:', error);
        } finally {
            UiUtils.clearBusy();
        }
    };

    const exportExcel = async () => {
        UiUtils.setBusy();
        try {
            const body = mainStore.searchFormRef?.getFieldsValue() || {};
            const resultBlob = await SaleInvoiceService.exportSaleInvoiceResult({ body }, { responseType: 'blob' });
            if (resultBlob) {
                const fileName = l.trans('sale-invoice.fileSaleInvoiceExcel.FileName', null);
                const fileNameFormatted = appendDateToFileName(fileName, formattedDate);
                FileSaver.saveAs(resultBlob, fileNameFormatted);
            }
        } catch (error) {
            console.error('API call failed:', error);
        } finally {
            UiUtils.clearBusy();
        }
    };

    const exportExcelDetail = async () => {
        UiUtils.setBusy();
        try {
            const body = mainStore.searchFormRef?.getFieldsValue() || {};
            const resultBlob = await SaleInvoiceService.exportSaleInvoiceDetailResult({ body }, { responseType: 'blob' });
            if (resultBlob) {
                const fileName = l.trans('sale-invoice.fileSaleInvoiceDetailExcel.FileName', null);
                const fileNameFormatted = appendDateToFileName(fileName, formattedDate);
                FileSaver.saveAs(resultBlob, fileNameFormatted);
            }
        } catch (error) {
            console.error('API call failed:', error);
        } finally {
            UiUtils.clearBusy();
        }
    };


    const createEinvoice = (data: SaleInvoiceDto) => {
        uiUtils.setBusy();
        EinvoiceService.create({
            body: {
                listSaleInvoice: [data]
            }
        }).then(result => {
            uiUtils.clearBusy();
            if (result.isSuccessful) {
                uiUtils.showSuccess('Xuất hoá đơn điện tử thành công.');
                mainStore.searchData({});
            } else {
                uiUtils.showError(result?.errorDetail?.message ?? "Xuất hoá đơn điện tử thất bại.");
            }
        }).finally(() => {
            uiUtils.clearBusy();
        });
    }

    const cancelEinvoice = (data: SaleInvoiceDto) => {
        const record = data;
        UiUtils.showConfirm({
            title: t('EInvoice.titleCancelEInvoice'),
            content: (
                <div>
                    {t('EInvoice.cancelEInvoiceConfirm')}:
                    <strong className="mr-4">{' ' + record?.invoiceCode}</strong>
                </div>
            ),
            isDanger: true,
            onOk: () => {
                uiUtils.setBusy();
                EinvoiceService.cancel({
                    body: data
                }).then(result => {
                    uiUtils.clearBusy();
                    if (result.isSuccessful) {
                        uiUtils.showSuccess('Huỷ hoá đơn điện tử thành công.');
                        mainStore.searchData({});
                    } else {
                        uiUtils.showError(result?.errorDetail?.message ?? "Huỷ hoá đơn điện tử thất bại.");
                    }
                }).finally(() => {
                    uiUtils.clearBusy();
                });
            },
        });
    }

    const adjustEinvoice = (data: SaleInvoiceDto) => {
        const record = data;
        uiUtils.setBusy();
        EinvoiceService.adjust({
            body: data
        }).then(result => {
            uiUtils.clearBusy();
            if (result.isSuccessful) {
                uiUtils.showSuccess('Xuất hoá đơn điều chỉnh thành công.');
                mainStore.searchData({});
            } else {
                uiUtils.showError(result?.errorDetail?.message ?? "Xuất hoá đơn điều chỉnh thất bại.");
            }
        }).finally(() => {
            uiUtils.clearBusy();
        });
    }


    const isEnableExportEinvoice = (d: SaleInvoiceDto) => {
        if (d?.status == 4
            && d?.moveType == 107
            && d?.einvoiceStatus != 3
            && d?.einvoiceStatus != 2
        ) {
            return true;
        } else return false;
    }

    const isEnableCancelExportEinvoice = (d: SaleInvoiceDto) => {
        if (d?.status == 4
            && d?.moveType == 107
            && (d?.einvoiceStatus == 3 || d?.einvoiceStatus == 2)
        ) {
            return true;
        } else return false;
    }

    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
            {
                title: 'invoiceCode',
                dataIndex: 'invoiceCode',
                width: 120,
                align: 'left',
                render: (text, dto) => {
                    return (<>
                        <a className="font-semibold underline" onClick={() => invoiceSelect(dto)}>{text}</a>
                    </>)
                }
            },
            {
                dataIndex: 'invoiceDate',
                title: 'invoiceDate',
                width: 140,
                align: 'center',
                render: v => (DateUtil.toFormat(v)),
            },
            {
                title: 'partnerName',
                dataIndex: 'partnerName',
                align: 'left',
                ellipsis: true,
                width: 250,
                render(value, record, index): React.ReactNode {
                    return (
                        <div className="max-w-xl text-ellipsis overflow-hidden">
                            {value}
                        </div>
                    );
                },
            },
            {
                dataIndex: 'totalQty',
                title: 'totalQty',
                align: 'end',
                render: (text, dto) => {
                    return (<PriceCell value={dto.totalQty} />)
                },
                width: 80,
            },
            {
                dataIndex: 'totalAmountRound',
                title: 'productAmount',
                align: 'end',
                render: v => (<PriceCell value={v} />),
                width: 130,
            },
            {
                dataIndex: 'paymentAmount',
                title: 'payment',
                align: 'end',
                render: v => (<PriceCell value={v} />),
                width: 130,
            },
            // {
            //     dataIndex: 'saleChannelTypeName',
            //     title: 'channel',
            //     align: 'center',
            //     render: v => <>{tEnum(v)}</>,
            //     width: 130,
            // },
            {
                dataIndex: 'notes',
                title: 'notes',
                align: 'left',
                render: v => <TextLineClampDisplay content={v}></TextLineClampDisplay>,
                width: 250,
            },
            {
                dataIndex: 'status',
                title: 'status',
                align: 'center',
                render: (v, data: SaleInvoiceDto) => (
                    <SaleInvoiceStatusCell status={v} />
                ),
                width: 130,
            },
            {
                title: '',
                align: 'center',
                render: (v, data: SaleInvoiceDto) => {
                    return (data.einvoiceStatus == 1 || data.einvoiceStatus == null) ? (
                        <Tooltip title="Chưa xuất hóa đơn điện tử">
                            <FileDoneOutlined />
                        </Tooltip>
                    ) : (
                        <Tooltip title="Đã xuất hóa đơn điện tử" color="green" key="green">
                            <FileDoneOutlined style={{ color: "#3BB54A" }} />
                        </Tooltip>
                    );
                },
                width: 80,
            }
        ],
        {
            actions: [

                {
                    title: 'edit',
                    hiddenIf: (d: any) => {
                        return d?.status > 1
                    },
                    onClick: (d) => {
                        closeAllModals();
                        navigate("/sales-invoice/sell?id=" + d.idHash);
                    }
                },
                {
                    title: 'returnInvoice',
                    icon: <UndoOutlined />,
                    hiddenIf: (d: SaleInvoiceDto) => {
                        return d?.moveType == MoveType.PhieuKhachHangTraLai || d?.status == 3
                    },
                    onClick: (d) => {
                        closeAllModals();
                        navigate(`/sales-invoice/sell?return=${d.id}`);
                    }
                },
                {
                    title: 'copyInvoice',
                    icon: <CopyOutlined></CopyOutlined>,
                    hiddenIf: (d: SaleInvoiceDto) => {
                        return d?.moveType == MoveType.PhieuKhachHangTraLai
                    },
                    onClick: (d) => {
                        closeAllModals();
                        navigate(`/sales-invoice/sell?mode=${SaleUrlParamMode.COPY}&id=${d.idHash}`);
                    }
                },
                {
                    title: 'print',
                    icon: (<PrinterOutlined />),
                    onClick: (d) => {
                        printPdf(d);
                    }
                },
                {
                    title: 'exportEinvoice',
                    icon: (<FileDoneOutlined />),
                    hiddenIf: (d: any) => {
                        return !isEnableExportEinvoice(d)
                    },
                    onClick: (d: SaleInvoiceDto) => {
                        createEinvoice(d);
                    }
                },
                {
                    title: 'adjustEinvoice',
                    icon: (<FileDoneOutlined />),
                    hiddenIf: (d: any) => d.moveType != 103,
                    onClick: (d: SaleInvoiceDto) => {
                        adjustEinvoice(d);
                    }
                },
                {
                    title: 'cancelEInvoice',
                    isDanger: true,
                    icon: (<FileDoneOutlined />),
                    hiddenIf: (d: any) => {
                        return !isEnableCancelExportEinvoice(d)
                    },
                    onClick: (d: SaleInvoiceDto) => {
                        cancelEinvoice(d);
                    }
                },
                {
                    title: 'remove',
                    hiddenIf: (d: any) => {
                        return d?.status != SaleInvoiceStatusEnum.DA_HUY &&
                            d?.status != SaleInvoiceStatusEnum.DANG_SOAN
                    },
                    onClick: (d) => {
                        const record = {
                            ...d,
                            id: d.idHash,
                        }
                        mainStore.openRemoveById(record)
                    }
                },
                {
                    title: 'cancelInvoice',
                    hiddenIf: (d: any) => {
                        return d?.status != SaleInvoiceStatusEnum.DA_HOAN_THANH
                    },
                    icon: (<StopOutlined />),
                    isDanger: true,
                    onClick: (d) => {
                        openCancelForm(d)
                    }
                }
            ] as ITableAction<SaleInvoiceDto>[],
            viewAction: (d) => {
                openDetailForm(d);
            },
            ns: mainStore.getNamespaceLocale()
        });

    const exportItems: MenuProps['items'] = [
        {
            label: <a onClick={exportExcel} type={'text'}>
                <Space>
                    <ExportOutlined />
                    {t('actionBtn.exportExcel')}
                </Space>
            </a>,
            key: '1',
        },
        {
            label: <a onClick={exportExcelDetail} type={'text'}>
                <Space>
                    <ExportOutlined />
                    {t('exportExcelDetail')}
                </Space>
            </a>,
            key: '2',
        }
    ];

    const exportEInvoiceItems: MenuProps['items'] = [
        {
            label: <a onClick={() => navigate('/sales-invoice/log-api')} type={'text'}>
                <Space>
                    <ApiOutlined />
                    {t('actionBtn.logApi')}
                </Space>
            </a>,
            key: '1',
        },
        {
            label: <a onClick={() => {
                exportEInvoiceStore.isShowExportModal = true
            }} type={'text'}>
                <Space>
                    <ExportOutlined />
                    {t('Xuất hoá đơn điện tử')}
                </Space>
            </a>,
            key: '2',
        },
        {
            label: <a onClick={() => {
                exportEInvoiceStore.isShowExportMergeModal = true
            }} type={'text'}>
                <Space>
                    <ExportOutlined />
                    {t('Xuất hoá đơn điện tử gộp')}
                </Space>
            </a>,
            key: '3',
        },
        {
            label: <a onClick={async () => {
                UiUtils.showConfirm({
                    title: t('Tự động xuất HĐĐT'),
                    content: (
                        <div>
                            {t('Bạn có chắc chắn muốn xuất HĐĐT không ?')}
                        </div>
                    ),
                    isDanger: true,
                    onOk: () => {
                        UiUtils.setBusy()
                        EinvoiceService.autoMergeEinvoice().then(() => {
                            uiUtils.showSuccess("Xuất HĐĐT thành công");
                            mainStore.searchData({});
                        }).finally(() => {
                            uiUtils.clearBusy();
                        })
                    }
                })
            }} type={'text'}>
                <Space>
                    <ExportOutlined />
                    {t('Xuất HĐĐT tự động')}
                </Space>
            </a>,
            key: '4',
        },
    ];

    const topActions: IActionBtn[] = [
        {
            title: t('Hoá đơn điện tử'),
            content: <Dropdown className={'btn-primary'} menu={{ items: exportEInvoiceItems.filter(x => !(x?.key === '4' && sessionStore.appSession.eInvoiceMethod != "99")) }} trigger={['hover']}>
                <Button>
                    <Space.Compact className="flex gap-2">
                        <FileDoneOutlined />
                        {t('Hoá đơn điện tử')}
                        <ArrowRightIcon className="rotate-90" />
                    </Space.Compact>
                </Button>
            </Dropdown>
        },
        {
            permission: 'SaleInvoice.Invoice.Create',
            content: <Dropdown className={'btn-secondary'} menu={{ items: exportItems }} trigger={['hover']}>
                <Button>
                    <Space.Compact className="flex gap-2">
                        <ExcelIcon />
                        {tCommon('actionBtn.actionExcel')}
                        <ArrowRightIcon className="rotate-90" />
                    </Space.Compact>
                </Button>
            </Dropdown>
        }
    ];

    const cancelInvoiceFormRef = useRef();
    const openCancelForm = (d: SaleInvoiceDto) => {
        // @ts-ignore
        cancelInvoiceFormRef.current.showModal(d);
    }
    const invoiceDetailRef = useRef();
    const openDetailForm = (d: SaleInvoiceDto) => {
        mainStore.openViewInvoiceModal(d, d.moveType == MoveType.PhieuKhachHangTraLai);
    }

    const ObsAreal = observer(() => {
        const LazyInvoiceDetailForm = lazy(() => import('@pages/SalesInvoice/Form/invoiceDetailForm'));
        return <>
            <Suspense fallback={<Spin />}>
                {mainStore.viewInvoiceModal.visible && <LazyInvoiceDetailForm />}
            </Suspense>
        </>
    });
    return (<>
        <OrdCrudPage stored={mainStore}
            topActions={topActions}
            columns={columns}
            searchForm={(f) => <InvoiceSearch />}
            contentTopTable={<InvoiceStatusSegmented getCountApi={SaleInvoiceService.getCount} />}
        ></OrdCrudPage>
        <CancelInvoiceForm ref={cancelInvoiceFormRef} />

        <ObsAreal></ObsAreal>
        <PrintInvoice pdfUrl={pdfUrl} />
        <Modal
            width={1200}
            title={t('fileExcel.importModalTitle')}
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
        >
            <ModalTabImportInvoice closeModal={handleCancel} okModal={handleOk} isModalVisible={isModalVisible} />
        </Modal>

        <ModalExportEinvice />
        <ModalExportMergeEinvice />
    </>)
}
