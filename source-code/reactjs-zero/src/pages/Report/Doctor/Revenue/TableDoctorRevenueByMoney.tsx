import React from 'react';
import DoctorRevenueReportStore from "@ord-store/Report/doctorRevenueReportStore";
import {TableProps} from "antd/es/table/InternalTable";
import {Table, TableColumnsType} from "antd";
import {withDataTableFetching} from "@ord-core/hoc/withDataTableFetching";
import Utils from "@ord-core/utils/utils";
import {useTranslation} from "react-i18next";
import TableUtil from "@ord-core/utils/table.util";
import {DoctorRevenueByMoneyReportDto} from "@api/index.defs";
import DateUtil from "@ord-core/utils/date.util";
import {observer} from "mobx-react-lite";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";

const TableDoctorRevenueByBill = (props: {
    stored: DoctorRevenueReportStore
}) => {
    const {stored} = props;
    const {t} = useTranslation(stored.getNamespaceLocale());
    const formatterNumber = Utils.formatterNumber;

    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            dataIndex: 'doctorCode',
            title: 'doctorCode',
            width: 150,
            render: (data: string, record: DoctorRevenueByMoneyReportDto) => {
                return <strong>{record.doctorCode}</strong>
            }
        },
        {
            dataIndex: 'doctorName',
            title: 'doctorName',
            width: 150,
            render: (data: string, record: DoctorRevenueByMoneyReportDto) => {
                return <strong>{record.doctorName}</strong>
            }
        },
        {
            dataIndex: 'invoiceDate',
            title: 'invoiceDate',
            align: 'center',
            width: 150,
            render: (data: string, record: DoctorRevenueByMoneyReportDto) => {
                return <strong> {DateUtil.toFormat(record.invoiceDate, 'DD/MM/YYYY HH:mm')}</strong>
            }
        },

        {

            title: 'totalAmount',
            align: 'right',
            width: 150,
            render: (data: string, record: DoctorRevenueByMoneyReportDto) => {
                return <>
                    {formatterNumber(record.subTotalAmount, 0)}
                </>
            },
        },
        {
            title: 'discountAmount',
            align: 'right',
            width: 150,
            render: (data: string, record: DoctorRevenueByMoneyReportDto) => {
                return <>
                    {formatterNumber(record.discountAmount, 0)}
                </>
            },
        },
        {

            title: 'totalVat',
            align: 'right',
            width: 150,
            render: (data: string, record: DoctorRevenueByMoneyReportDto) => {
                return <>
                    {formatterNumber(record.taxAmount, 0)}
                </>
            },
        },
        {

            title: 'returnTotalAmount',
            align: 'right',
            width: 150,
            render: (data: string, record: DoctorRevenueByMoneyReportDto) => {
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
            render: (data: string, record: DoctorRevenueByMoneyReportDto) => {
                return <>
                    {formatterNumber(record.revenueAmount, 0)}
                </>
            },

        },
    ], {
        ns: stored.getNamespaceLocale()
    });
    const {summaryData} = stored;
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
                                    <Table.Summary.Cell index={3} align='right'
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
                                </Table.Summary.Row>
                            </Table.Summary>
                        );
                    }}

                    columns={columns}
                    searchData={stored.searchDataState}
                    refreshDatasource={stored.refreshDataState}
                />
            </div>
        </div>
    );
};

export default observer(TableDoctorRevenueByBill);