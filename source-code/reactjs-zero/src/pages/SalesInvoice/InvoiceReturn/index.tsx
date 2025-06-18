import * as React from "react";
import {lazy, Suspense, useRef, useState} from "react";
import OrdCrudPage, {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {InvoiceSearch} from "@pages/SalesInvoice/Invoice/invoiceSearch";
import {useStore} from "@ord-store/index";
import {Button, Dropdown, MenuProps, Space, Spin, TableColumnsType, Tag} from "antd";
import {DownOutlined, ExportOutlined, FileExcelOutlined, PrinterOutlined, StopOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import TableUtil from "@ord-core/utils/table.util";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {ITableAction} from "@ord-components/table/cells/TableActionCell";
import {InvoiceReturnDto, ProductDto, SaleInvoiceDto} from "@api/index.defs";
import {CancelInvoiceReturnForm} from "@pages/SalesInvoice/Form/cancelInvoiceReturnForm";
import DateUtil from "@ord-core/utils/date.util";
import {InvoiceReturnService} from "@api/InvoiceReturnService";
import FileSaver from "file-saver";
import {l} from "@ord-core/language/lang.utils";
import UiUtils from "@ord-core/utils/ui.utils";
import {InvoiceHelperService} from "@api/InvoiceHelperService";
import {PrintInvoice} from "../Utils/printInvoice";
import {SaleUrlParamMode} from "@pages/SalesInvoice/Utils/saleCommon";
import {ModalProvider} from "../Utils/modalContext";
import {InvoiceStatusSegmented} from "@pages/SalesInvoice/Invoice/invoiceStatusSegmented";
import {SaleInvoiceStatusCell} from "@pages/SalesInvoice/InvoiceReturn/datatable/saleInvoiceStatusCell";
import {ExcelIcon} from "@ord-components/icon/ExcelIcon";
import {ArrowRightIcon} from "@ord-components/icon/ArrowRightIcon";
import {PlusIcon} from "@ord-components/icon/PlusIcon";
import {observer} from "mobx-react-lite";

const InvoiceReturn: React.FC = () => {
    const { invoiceReturnStore: mainStore , saleInvoiceStore} = useStore();
    const { t: tCommon } = useTranslation('common');
    const { t } = useTranslation('sale-invoice');
    const navigate = useNavigate();
    const [pdfUrl, setPdfUrl] = React.useState("");

    const invoiceSelect = (d: any) => {
        openDetailForm(d);
    }

    const openDetailRelatedInvoice = (d: InvoiceReturnDto) => {
        openDetailForm({ idHash: d.relatedInvoiceIdHash })
    }

    const cancelInvoiceFormRef = useRef();
    const openCancelForm = (d: SaleInvoiceDto) => {
        // @ts-ignore
        cancelInvoiceFormRef.current.showModal(d);
    }

    const openDetailForm = (d: SaleInvoiceDto) => {
        saleInvoiceStore.openViewInvoiceModal(d, true);
    }
    
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
            if(d.id === undefined) return;
            const resultBlob = await InvoiceHelperService.printInvoice({
                id: parseInt(d.id)
            } , { responseType: 'blob' });
            setPdfUrl(URL.createObjectURL(resultBlob));
            
        } catch (error) {
            console.error('API call failed:', error);
        } finally {
            UiUtils.clearBusy();
        }
    };
    const exportDetailExcel = async () => {
        UiUtils.setBusy();
        try {
            const body = mainStore.searchFormRef?.getFieldsValue() || {};
            const resultBlob = await InvoiceReturnService.exportInvoiceReturnDetailResult({ body }, { responseType: 'blob' });
            if (resultBlob) {
                const fileName = l.trans('sale-invoice.fileInvoiceReturnDetailExcel.FileName', null);
                const fileNameFormatted = appendDateToFileName(fileName, formattedDate);
                FileSaver.saveAs(resultBlob, fileNameFormatted);
            }
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
            const resultBlob = await InvoiceReturnService.exportInvoiceReturnResult({ body }, { responseType: 'blob' });
            if (resultBlob) {
                const fileName = l.trans('sale-invoice.fileInvoiceReturnExcel.FileName', null);
                const fileNameFormatted = appendDateToFileName(fileName, formattedDate);
                FileSaver.saveAs(resultBlob, fileNameFormatted);
            }
        } catch (error) {
            console.error('API call failed:', error);
        } finally {
            UiUtils.clearBusy();
        }
    };
    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
            {
                title: 'moveCode',
                dataIndex: 'invoiceCode',
                width: 120,
                align: 'left',
                render: (text, dto) => {
                    return (<>
                        <div className="flex gap-3 items-center">
                            <a className="font-semibold underline" onClick={() => invoiceSelect(dto)}>{text}</a>
                        </div>
                        <div>
                        {dto.relatedInvoiceCode &&
                            <Tag onClick={() => openDetailRelatedInvoice(dto)} bordered={false}
                                 className="text-sm cursor-pointer bg-[#EEEEEE] text-[#505050]">
                                {dto.relatedInvoiceCode}
                            </Tag>}
                        </div>
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
            },
            {
                dataIndex: 'inventoryName',
                title: 'stockInventory',
                align: 'left',
                width: 150,
            },
            {
                dataIndex: 'totalAmount',
                title: 'totalPrice',
                align: 'end',
                render: v => (<PriceCell value={v} />),
                width: 140,
            },
            {
                dataIndex: 'paymentAmount',
                title: 'payment',
                align: 'end',
                render: v => (<PriceCell value={v} />),
                width: 130,
            },
            
            {
                dataIndex: 'status',
                title: 'status',
                align: 'center',
                render: v => (<SaleInvoiceStatusCell status={v} />),
                width: 130,
            }
        ],
        {
            actions: [
                {
                    title: 'view',
                    onClick: (d) => {
                        openDetailForm(d)
                    }
                },
                {
                    title: 'edit',
                    hiddenIf: (d: any) => {
                        return d?.status > 1
                    },
                    onClick: (d) => {
                        return navigate(`/sales-invoice/sell?id=${d.idHash}&mode=${SaleUrlParamMode.EDIT_RETURN}`);
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
                    title: 'cancelInvoice',
                    hiddenIf: (d: any) => {
                        return d?.status != 4
                    },
                    icon: (<StopOutlined />),
                    isDanger: true,
                    onClick: (d) => {
                        openCancelForm(d)
                    }
                },
                {
                    title: 'remove',
                    hiddenIf: (d: any) => {
                        return d?.status != 1
                    },
                    onClick: (d) => {
                        const record = {
                            ...d,
                            id: d.idHash,
                        }
                        mainStore.openRemoveById(record)
                    }
                }
            ] as ITableAction<ProductDto>[],
            ns: mainStore.getNamespaceLocale()
        });

    const exportItems: MenuProps['items'] = [
        {
            label: <a onClick={exportExcel} type={'text'}>
                <Space>
                    <ExportOutlined />
                    {tCommon('actionBtn.exportExcel')}
                </Space>
            </a>,
            key: '0',
        },
        {
            label: <a onClick={exportDetailExcel} type={'text'}>
                <Space>
                    <ExportOutlined />
                    {t('exportExcelDetail')}
                </Space>
            </a>,
            key: '1',
        }
    ];

    const topActions: IActionBtn[] = [
        {
            permission: 'SaleInvoice.Invoice.Create',
            content: <Dropdown className={'btn-secondary'} menu={{ items: exportItems }} trigger={['hover']}>
                <Button>
                    <Space.Compact className="flex gap-2">
                        <ExcelIcon />
                        {tCommon('exportExcel')}
                        <ArrowRightIcon className="rotate-90" />
                    </Space.Compact>
                </Button>
            </Dropdown>
        },
        {
            title: 'addNew',
            permission: 'SaleInvoice.Invoice.Create',
            onClick: () => {
                return navigate("/sales-invoice/sell?return=1");
            }
        }
    ];

    const ObsAreal = observer(() => {
        const LazyInvoiceDetailForm = lazy(() => import('@pages/SalesInvoice/Form/invoiceDetailForm'));
        return <>
            <Suspense fallback={<Spin/>}>
                {saleInvoiceStore.viewInvoiceModal.visible && <LazyInvoiceDetailForm/>}
            </Suspense>
        </>
    });
    return (
        <ModalProvider>
            <OrdCrudPage stored={mainStore}
                topActions={topActions}
                columns={columns}
                searchForm={(f) => <InvoiceSearch alowEq={true}/>}
                entityForm={form => null}
                contentTopTable={<InvoiceStatusSegmented getCountApi={InvoiceReturnService.getCount} />}
            />
            <CancelInvoiceReturnForm ref={cancelInvoiceFormRef} />
            <ObsAreal></ObsAreal>
            {/*<InvoiceDetailForm  modalKey={'modalDetailSell'} ref={invoiceDetailRef} isInvoiceReturn={isInvoiceReturn} />*/}
            <PrintInvoice pdfUrl={pdfUrl} />
        </ModalProvider>
    );
    
}

export default InvoiceReturn;
