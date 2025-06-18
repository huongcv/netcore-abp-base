import React from 'react';
import DoctorProfitReportStore from "@ord-store/Report/doctorProfitReportStore";
import {TableProps} from "antd/es/table/InternalTable";
import {Table, TableColumnsType} from "antd";
import {withDataTableFetching} from "@ord-core/hoc/withDataTableFetching";
import Utils from "@ord-core/utils/utils";
import {useTranslation} from "react-i18next";
import TableUtil from "@ord-core/utils/table.util";
import {DoctorProfitByMoneyReportDto, DoctorProfitByProductReportDto} from "@api/index.defs";
import {observer} from "mobx-react-lite";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import { TextLineClampDisplay } from '@ord-components/common/TextLineClampDisplay';

const TableDoctorProfitByProduct = (props: {
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
            render: (data: string, record: DoctorProfitByProductReportDto) => {
                return <strong>{record.doctorCode}</strong>
            }
        },
        {
            dataIndex: 'doctorName',
            title: 'doctorName',
            width: 120,
            render: (data: string, record: DoctorProfitByProductReportDto) => {
                return <strong>{record.doctorName}</strong>
            }
        },
        {
            dataIndex: 'productCode',
            title: 'productCode',
            align: 'left',
            width: 150,
        },
        {
            dataIndex: 'productName',
            title: 'productName',
            align: 'left',
            width: 150,
            render: (text) => <TextLineClampDisplay content={text}/> 
        },
        {
            dataIndex: 'lotNumber',
            title: 'lotNumber',
            align: 'left',
            width: 90,
        },
        {
            dataIndex: 'unitName',
            title: 'unitName',
            align: 'left',
            width: 70,
        },
        // {
        //     dataIndex: 'qty',
        //     title: 'qty',
        //     align: 'center',
        //     width: 50,
        // },
        // {
        //     dataIndex: 'price',
        //     title: 'price',
        //     align: 'right',
        //     width: 100,
        //     render: (data: string, record: DoctorProfitByProductReportDto) => {
        //         return <>
        //             {formatterNumber(record.price, 0)}
        //         </>
        //     },
        // },


        {

            title: 'subTotalAmount',
            align: 'right',
            width: 150,
            render: (data: string, record: DoctorProfitByProductReportDto) => {
                return <>
                    {formatterNumber(record.subTotalAmount, 0)}
                </>
            },
        },
        {
            title: 'discountAmount',
            align: 'right',
            width: 150,
            render: (data: string, record: DoctorProfitByProductReportDto) => {
                return <>
                    {formatterNumber(record.discountAmount, 0)}
                </>
            },
        },
        {
            title: 'totalVat',
            align: 'right',
            width: 150,
            render: (data: string, record: DoctorProfitByProductReportDto) => {
                return <>
                    {formatterNumber(record.discountAmount, 0)}
                </>
            },
        },
        // {

        //     title: 'returnQty',
        //     align: 'right',
        //     width: 50,
        //     render: (data: string, record: DoctorProfitByProductReportDto) => {
        //         return <>
        //             {formatterNumber(record.returnQty ?? 0, 0)}
        //         </>
        //     },
        // },
        // {

        //     title: 'returnPrice',
        //     align: 'right',
        //     width: 100,
        //     render: (data: string, record: DoctorProfitByProductReportDto) => {
        //         return <>
        //             {formatterNumber(record.returnPrice ?? 0, 0)}
        //         </>
        //     },
        // },
        {

            title: 'returnTotalAmount',
            align: 'right',
            width: 150,
            render: (data: string, record: DoctorProfitByProductReportDto) => {
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
            render: (data: string, record: DoctorProfitByProductReportDto) => {
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
            render: (data: string, record: DoctorProfitByProductReportDto) => {
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
            render: (data: string, record: DoctorProfitByProductReportDto) => {
                return <>
                    {formatterNumber(record.totalProfit, 0)}
                </>
            },
        },
    ], {
        ns: stored.getNamespaceLocale()
    });
    const {summaryData}: { summaryData: DoctorProfitByProductReportDto } = stored;
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
                                    <Table.Summary.Cell index={0} colSpan={7} align='left'>
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
                                    <Table.Summary.Cell index={7} align='right'
                                                        className='font-bold !pr-1.5'>
                                        {formatterNumber(summaryData?.returnTotalAmount, 0)}
                                    </Table.Summary.Cell>                                                              
                                    <Table.Summary.Cell index={7} align='right'
                                                        className='font-bold !pr-1.5'>
                                        {formatterNumber(summaryData?.revenueAmount, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={8} align='right'
                                                        className='font-bold !pr-1.5'>
                                        {formatterNumber(summaryData?.totalCostAmount, 0)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={9} align='right'
                                                        className='font-bold !pr-1.5'>
                                        {formatterNumber(summaryData?.totalProfit, 0)}
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

export default observer(TableDoctorProfitByProduct);