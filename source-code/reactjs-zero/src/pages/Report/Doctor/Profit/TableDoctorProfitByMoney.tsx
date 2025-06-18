import React from 'react';
import DoctorProfitReportStore from "@ord-store/Report/doctorProfitReportStore";
import {TableProps} from "antd/es/table/InternalTable";
import {Table, TableColumnsType} from "antd";
import {withDataTableFetching} from "@ord-core/hoc/withDataTableFetching";
import Utils from "@ord-core/utils/utils";
import {useTranslation} from "react-i18next";
import TableUtil from "@ord-core/utils/table.util";
import {DoctorProfitByBillReportDto, DoctorProfitByMoneyReportDto} from "@api/index.defs";
import DateUtil from "@ord-core/utils/date.util";
import {observer} from "mobx-react-lite";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";

const TableDoctorProfitByBill = (props: {
    stored: DoctorProfitReportStore
}) => {
    const {stored} = props;
    const {t} = useTranslation(stored.getNamespaceLocale());
    const formatterNumber = Utils.formatterNumber;

    const columns: TableColumnsType<any> = TableUtil.getColumns([
         {
            dataIndex: 'doctorCode',
            title: 'doctorCode',
            width: 120,
            render: (data: string, record: DoctorProfitByBillReportDto) => {
                return <strong>{record.doctorCode}</strong>
            }
        },
        {
            dataIndex: 'doctorName',
            title: 'doctorName',
            width: 150,
            render: (data: string, record: DoctorProfitByMoneyReportDto) => {
                return <strong>{record.doctorName}</strong>
            }
        },
        {
            dataIndex: 'invoiceDate',
            title: 'invoiceDate',
            align: 'center',
            width: 150,
            render: (data: string, record: DoctorProfitByMoneyReportDto) => {
                return <strong> {DateUtil.toFormat(record.invoiceDate, 'DD/MM/YYYY HH:mm')}</strong>
            }
        },

        {

            title: 'subTotalAmount',
            align: 'right',
            width: 150,
            render: (data: string, record: DoctorProfitByMoneyReportDto) => {
                return <>
                    {formatterNumber(record.subTotalAmount, 0)}
                </>
            },
        },
        {
            title: 'discountAmount',
            align: 'right',
            width: 150,
            render: (data: string, record: DoctorProfitByMoneyReportDto) => {
                return <>
                    {formatterNumber(record.discountAmount, 0)}
                </>
            },
        },
        {

            title: 'totalVat',
            align: 'right',
            width: 150,
            render: (data: string, record: DoctorProfitByMoneyReportDto) => {
                return <>
                    {formatterNumber(record.taxAmount, 0)}
                </>
            },
        },
        {

            title: 'returnTotalAmount',
            align: 'right',
            width: 150,
            render: (data: string, record: DoctorProfitByMoneyReportDto) => {
                return <>
                    {formatterNumber(record.returnTotalAmount, 0)}
                </>
            },
        },
        {
            dataIndex: 'revenueAmount',
            title: 'revenueAmount',
            align: 'right',
            width: 150,
            render: (data: string, record: DoctorProfitByMoneyReportDto) => {
                return <>
                    {formatterNumber(record.revenueAmount, 0)}
                </>
            },
        },
        {
            dataIndex: 'totalCostAmount',
            title: 'totalCostAmount',
            align: 'right',
            width: 150,
            render: (data: string, record: DoctorProfitByMoneyReportDto) => {
                return <>
                    {formatterNumber(record.totalCostAmount, 0)}
                </>
            },
        },
        {
            dataIndex: 'totalProfit',
            title: 'totalProfit',
            align: 'right',
            width: 150,
            render: (data: string, record: DoctorProfitByMoneyReportDto) => {
                return <>
                    {formatterNumber(record.totalProfit, 0)}
                </>
            },
        },
    ], {
        ns: stored.getNamespaceLocale()
    });
    const {summaryData}: {summaryData: DoctorProfitByMoneyReportDto} = stored;


    return (
        <div>
            <div className="ord-container-box">
                <AntTableWithDataPaged
                    searchForm={stored.searchFormRef}
                    getPageResult={(d) => {
                        return stored.apiService().getPaged({
                            body: {
                                ...d.body
                            }
                        }, {})
                    }}
                    columns={columns}
                    summary={(pageData) => {
                        return (
                            <Table.Summary fixed='top'>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={4} align='left'>
                                        <strong className=''>{t('total')}</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} align='right'
                                                        className='font-bold !pr-1.5'>
                                        {formatterNumber(summaryData?.subTotalAmount, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={2} align='right'
                                                        className='font-bold !pr-1.5'>
                                        {formatterNumber(summaryData?.discountAmount, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={2} align='right'
                                                        className='font-bold !pr-1.5'>
                                        {formatterNumber(summaryData?.taxAmount, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={3} align='right'
                                                        className='font-bold !pr-1.5'>
                                        {formatterNumber(summaryData?.returnTotalAmount, 0)}
                                    </Table.Summary.Cell>

                                    <Table.Summary.Cell index={5} align='right'
                                                        className='font-bold !pr-1.5'>
                                        {formatterNumber(summaryData?.revenueAmount, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={6} align='right'
                                                        className='font-bold !pr-1.5'>
                                        {formatterNumber(summaryData?.totalCostAmount, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={7} align='right'
                                                        className='font-bold !pr-1.5'>
                                        {formatterNumber(summaryData?.totalProfit, 0)}
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            </Table.Summary>
                        );
                    }}
                    searchData={stored.searchDataState}
                    refreshDatasource={stored.refreshDataState}
                />
            </div>
        </div>
    );
};

export default observer(TableDoctorProfitByBill);