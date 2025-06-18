import React, {lazy, Suspense, useEffect, useRef, useState} from 'react';
import {SaleInvoiceDto} from "@api/index.defs";
import {Spin, Table, TableColumnsType} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import DateUtil from "@ord-core/utils/date.util";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {SaleInvoiceStatusCell} from "@pages/SalesInvoice/InvoiceReturn/datatable/saleInvoiceStatusCell";
import {StopOutlined} from "@ant-design/icons";
import {ITableAction} from "@ord-components/table/cells/TableActionCell";
import {useStore} from "@ord-store/index";
import {Trans, useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import CancelInvoiceForm from "@pages/1.Golf/TeeSheet/Booking/Crud/PrivateBooking/CanceInvoiceForm";
import UiUtils from "@ord-core/utils/ui.utils";

InvoiceOfPlayer.propTypes = {};

function InvoiceOfPlayer(props: {
    viewInvoice: SaleInvoiceDto[]
}) {
    const {
        golfBookingStore: mainStore,
        saleInvoiceStore
    } = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {t: tEnum} = useTranslation('enum');
    const {t: tCommon} = useTranslation('common');

    const [source, setSource] = useState<SaleInvoiceDto[]>([]);
    useEffect(() => {
        setSource(props.viewInvoice);
    }, [props.viewInvoice]);


    function openCancelForm(d: SaleInvoiceDto) {
        saleInvoiceStore.openCancelById(d)
    }


    const openDetailForm = (d: SaleInvoiceDto) => {
        saleInvoiceStore.openViewInvoiceModal(d);
    }

    const columns: TableColumnsType<SaleInvoiceDto> = TableUtil.getColumns(
        [
            {
                title: 'invoiceCode',
                dataIndex: 'invoiceCode',
                width: 120,
                align: 'left',
                render: (text, dto) => {
                    return (<>
                        <a className="font-semibold underline" onClick={() => openDetailForm(dto)}>{text}</a>
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
                dataIndex: 'totalQty',
                title: 'totalQty',
                align: 'end',
                render: (text, dto) => {
                    return (<PriceCell value={dto.totalQty}/>)
                },
                width: 80,
            },
            {
                dataIndex: 'totalAmountRound',
                title: 'productAmount',
                align: 'end',
                render: v => (<PriceCell value={v}/>),
                width: 130,
            },
            {
                dataIndex: 'paymentAmount',
                title: 'payment',
                align: 'end',
                render: v => (<PriceCell value={v}/>),
                width: 130,
            },
            {
                dataIndex: 'status',
                title: 'status',
                align: 'center',
                render: (v, data: SaleInvoiceDto) => (
                    <SaleInvoiceStatusCell status={v}/>
                ),
                width: 130,
            },
        ],
        {
            actions: [

                // {
                //     title: 'print',
                //     icon: (<PrinterOutlined />),
                //     onClick: (d) => {
                //         // printPdf(d);
                //     }
                // },

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
                        saleInvoiceStore.openRemoveById(record)
                    }
                },
                {
                    title: 'cancelInvoice',
                    hiddenIf: (d: any) => {
                        return d?.status != 4
                    },
                    icon: (<StopOutlined/>),
                    isDanger: true,
                    onClick: (d) => {
                        openCancelForm(d)
                    }
                }
            ] as ITableAction<SaleInvoiceDto>[],
            viewAction: (d) => {
                openDetailForm(d);
            },
            ns: saleInvoiceStore.getNamespaceLocale()
        });
    const ObsAreal = observer(() => {
        const [tempIdxRemove, setTempIdxRemove] = useState<number>();
        useEffect(() => {
            if (!!saleInvoiceStore.removeRecord) {
                const { removeRecord } = saleInvoiceStore;
                setTempIdxRemove(source.findIndex(f=>f.idHash == removeRecord.id));
                UiUtils.showConfirm({
                    title: tCommon('confirmDelete'),
                    icon: "remove",
                    content: (<Trans ns={saleInvoiceStore.getNamespaceLocale()}
                                     i18nKey="confirmRemove"
                                     values={removeRecord}
                                     components={{ italic: <i />, bold: <strong /> }}></Trans>),
                    onOk: (d) => {
                        saleInvoiceStore.removeEntity().then(() => {
                            source.splice(tempIdxRemove!, 1);
                            setSource([...source]);
                        });
                    },
                    onCancel: () => {
                        saleInvoiceStore.closeRemoveById();
                    }
                });
            }

        }, [saleInvoiceStore.removeRecord]);

        const LazyCancelInvoiceForm = lazy(() => import('./CanceInvoiceForm'));

        return <>

            <Suspense fallback={<Spin/>}>
                {!!saleInvoiceStore.removeRecord && <LazyCancelInvoiceForm onSuccess={(d) => {
                    const f = source.find(f => f.id == d.id)
                    console.log("deelteSuc",f)
                    if (f){
                        f.status = d.status;
                        setSource([...source])
                    }
                }}/>}
            </Suspense>
        </>
    });
    return (
        <div>
            <Table
                className='w-full'
                tableLayout='auto'
                pagination={false}
                columns={columns}
                dataSource={source}
                rowKey={"id"}
            />
            <ObsAreal></ObsAreal>
        </div>
    );
}

export default InvoiceOfPlayer;
