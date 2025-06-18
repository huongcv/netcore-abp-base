import React, {Suspense, useEffect} from 'react';
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import {useStore} from "@ord-store/index";
import {Card, FormInstance, Modal, Spin, TableColumnsType, Tag} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import {observer} from "mobx-react-lite";
import {useTranslation} from "react-i18next";
import {DeleteOutlined, ExclamationCircleFilled, PhoneOutlined, PrinterOutlined, ScissorOutlined, StopOutlined} from "@ant-design/icons";
import {AccountMoveDto, MOVE_STATUS, SaleInvoiceDto} from "@api/index.defs";
import DateUtil from "@ord-core/utils/date.util";
import {AccountMoveService} from "@api/AccountMoveService";
import UiUtils from "@ord-core/utils/ui.utils";
import TopTableFilter, {ITopTableFilterData} from "@ord-components/table/TopTableFilter";
import Utils from "@ord-core/utils/utils";
import {InvoiceHelperService} from "@api/InvoiceHelperService";
import {PrintInvoice} from "@pages/SalesInvoice/Utils/printInvoice";
import uiUtils from '@ord-core/utils/ui.utils';
import { TextLineClampDisplay } from '@ord-components/common/TextLineClampDisplay';

const LazyModalCruReceipt = React.lazy(() => import('@pages/AccountantManagement/cashbook/ModalCruReceipt'));

export const StatusAccMoveElm = (
    prop: {
        status?: MOVE_STATUS,
        txt: string
    }
) => {
    const {t: tEnum} = useTranslation('enum');
    const text = tEnum(prop.txt);
    switch (prop.status) {
        case 3:
            return <Tag className='me-0 ord-cell-inactived'>
                <span>{tEnum(text)}</span>
            </Tag>
        case 4:
            return <Tag className='me-0 ord-cell-actived'>
                <span>{tEnum(text)}</span>
            </Tag>
        case 6:
            return <Tag className='me-0 ord-cell-inactived'>
                <span>{tEnum(text)}</span>
            </Tag>
        default:
            return <Tag className='me-0'>
                <span>{tEnum(text)}</span>
            </Tag>
    }
}
const TableCashbook = (props: {
    onCruSuccess: () => void;
    // onChangeFilter: (input: AccountMovePagingInputDto) => void;
    searchFormRef: FormInstance
}) => {
    const {cashbook: stored} = useStore();
    const {t} = useTranslation(stored.getNamespaceLocale());
    const {t: tEnum} = useTranslation('enum');
    const {searchFormRef} = props;

    const formatterNumber = Utils.formatterNumber;
    const [pdfUrl, setPdfUrl] = React.useState("");
    const printPdf = async (d: AccountMoveDto) => {
        UiUtils.setBusy();
        try {
            if (d.idHash === undefined) return;
            const resultBlob = await AccountMoveService.printReceiptsOrPayments({
                idHash: d.idHash
            }, {responseType: 'blob'});
            setPdfUrl(URL.createObjectURL(resultBlob));

        } catch (error) {
            console.error('API call failed:', error);
        } finally {
            UiUtils.clearBusy();
        }
    };

    useEffect(() => {
        stored.status = -1
    }, [])
    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: 'accountMoveCode',
            dataIndex: 'accountMoveCode',
            width: 150,
            render: (data: string, record: AccountMoveDto) => {
                return <>
                    <a className="font-semibold underline" onClick={() => stored.openViewDetailModal(record)}>{data}</a><br/>
                    <span> {DateUtil.toFormat(record.accountMoveDate, 'DD/MM/YYYY HH:mm')}</span>
                </>
            },
            sorter: false
        },
        {
            width: 150,
            dataIndex: 'accountMoveReasonName',
            title: 'accountMoveReasonName',
            render: (v) => <TextLineClampDisplay content={v} />
        },
        {

            title: 'partnerInfo',
            width: 150,
            render: (data: string, record: AccountMoveDto) => {
                return <>
                    <span>{record.partnerName}</span> <br/>
                    {
                        record.partnerPhone &&
                        <span>SĐT: {Utils.transformPhoneNumber(record.partnerPhone)}</span>
                    }
                </>
            },
        },
        {
            dataIndex: 'amount',
            title: 'amount',
            align: 'right',
            width: 120,
            render: (data: string, record: AccountMoveDto) => {
                return <>
                    <span style={{color: record.accountMoveType == 2 ? 'red' : ''}}>
                    {formatterNumber(record.amount, 0)}
                    </span>
                </>
            },
        },

        {
            dataIndex: 'strPaymentMethod',
            title: 'strPaymentMethod',
            width: 120,
            render: (data: string, record: AccountMoveDto) => {
                return <>
                    {tEnum(record.strPaymentMethod ?? '')}
                </>
            },
        },
        {
            width: 150,
            dataIndex: 'notes',
            title: 'notes',
        },
        {
            dataIndex: 'status',
            title: 'status',
            align: 'center',
            width: 100,
            render: (data: MOVE_STATUS, record: AccountMoveDto) => {
                return <StatusAccMoveElm status={data} txt={record.strStatus ?? ''}></StatusAccMoveElm>
            },
        },
    ], {
        actions: [
            // {
            //     title: 'view',
            //     onClick: (d: AccountMoveDto) => {
            //         stored.openViewDetailModal(d);
            //     }
            // },
            {
                title: 'printer',
                icon: <PrinterOutlined style={{fontSize: 20}}/>,
                onClick: (d: AccountMoveDto) => {
                    printPdf(d);
                }
            },
            {
                title: 'destroy',
                icon: <StopOutlined className={'text-red'} style={{fontSize: 20}}/>,
                onClick: (d) => {
                    if (d.relatedMoveId) {
                        if (d.relatedMoveType == 107) {
                            UiUtils.showError(t('relatedSaleInvoceCannotDelete'));
                        } else if (d.relatedMoveType == 103) {
                            UiUtils.showError(t('relatedInvoiceReturnCannotDelete'));
                        } else if (d.relatedMoveType == 101) {
                            UiUtils.showError(t('relatedSupplierCannotDelete'));
                        } else if (d.relatedMoveType == 104) {
                            UiUtils.showError(t('relatedSupplierReturnCannotDelete'));
                        }
                    } else {
                        const {confirm} = Modal;
                        const showConfirm = () => {
                            confirm({
                                title: t('confirm.destroyAccMove'),
                                icon: <ExclamationCircleFilled/>,
                                content: t('confirm.destroyAccMoveDes', {
                                    Code: `[${d.accountMoveCode}]`
                                }),
                                onOk() {
                                    uiUtils.setBusy();
                                    AccountMoveService.destroyAcountMove({
                                        idHash: d.idHash 
                                    }).then(res => {
                                        uiUtils.clearBusy();
                                        if (res.isSuccessful) {
                                            UiUtils.showSuccess(t('destroyAccMoveSuc'));
                                            searchFormRef.submit();
                                        } else {
                                            UiUtils.showError(res.message);
                                        }
                                    }).finally(() => {
                                        uiUtils.clearBusy();
                                    })
                                    
                                }
                            });
                        };
                        showConfirm();
                    }
                },
                hiddenIf: (d: AccountMoveDto) => {
                    return d.status == 3 || d.status == 6
                }
            },
            {
                title: 'remove',
                icon: <DeleteOutlined style={{fontSize: 20}}/>,
                onClick: (d) => {
                    if (d.relatedMoveId) {
                        if (d.relatedMoveType == 107) {
                            UiUtils.showError(t('relatedSaleInvoceCannotDelete'));
                        } else if (d.relatedMoveType == 103) {
                            UiUtils.showError(t('relatedInvoiceReturnCannotDelete'));
                        } else if (d.relatedMoveType == 101) {
                            UiUtils.showError(t('relatedSupplierCannotDelete'));
                        } else if (d.relatedMoveType == 104) {
                            UiUtils.showError(t('relatedSupplierReturnCannotDelete'));
                        }
                    } else {
                        const {confirm} = Modal;
                        const showConfirm = () => {
                            confirm({
                                title: t('confirm.removeAccMove'),
                                icon: <ExclamationCircleFilled/>,
                                content: t('confirm.removeAccMoveDes', {
                                    Code: `[${d.accountMoveCode}]`
                                }),
                                onOk() {
                                    AccountMoveService.deleteAcountMove({
                                        id: d.id ? parseInt(d.id) : 0
                                    }).then(res => {
                                        if (res.isSuccessful) {
                                            UiUtils.showSuccess(t('removeAccMoveSuc'));
                                            searchFormRef.submit();
                                        }
                                    })
                                }
                            });
                        };
                        showConfirm();
                    }

                },
                hiddenIf: (d: AccountMoveDto) => {
                    return !(d.status == 3 || d.status == 6)
                }
            }
        ],
        viewAction: (d)=>{
            stored.openViewDetailModal(d);
        },
        ns: stored.getNamespaceLocale()
    });


    return (
        <>
            <Card className='card-table-cashbook'>
                <AntTableWithDataPaged searchForm={searchFormRef}
                                       className={'table-padding'}
                                       title={() => {
                                           return <TopTableFilter
                                               onClickItem={(data) => {
                                                   stored.setMoveStatus(data);
                                                   stored.refreshGridData(true)
                                               }}
                                               data={stored.summaryCashBook?.map(x => ({
                                                   label: tEnum(x.strStatus ?? ""),
                                                   key: x.status,
                                                   count: x?.count
                                               }) as ITopTableFilterData)}></TopTableFilter>
                                       }}

                                       getPageResult={(d) => {
                                           return stored.apiService().getPaged({
                                               body: {
                                                   ...d.body,
                                                   status: stored.status == -1 ? undefined : stored.status
                                               }
                                           }, {})
                                       }}
                                       columns={columns}
                                       searchData={stored.searchDataState}
                                       refreshDatasource={stored.refreshDataState}
                />
            </Card>

            <Suspense fallback={<Spin/>}>
                {stored.createOrUpdateModal.visible && <LazyModalCruReceipt stored={stored}
                                                                            onSaveSuccess={() => {
                                                                                stored.refreshGridData();
                                                                                props.onCruSuccess();
                                                                            }}
                ></LazyModalCruReceipt>}
            </Suspense>
            <PrintInvoice pdfUrl={pdfUrl}/>
        </>
    );
};


export default observer(TableCashbook);
