import React, {useEffect} from 'react';
import {TableProps} from "antd/es/table/InternalTable";
import {Table, TableColumnsType} from "antd";
import {withDataTableFetching} from "@ord-core/hoc/withDataTableFetching";
import TableUtil from "@ord-core/utils/table.util";
import DateUtil from "@ord-core/utils/date.util";
import {useTranslation} from "react-i18next";
import ReportSellProfitStore from "@ord-store/Report/ReportSellProfitStore";
import {observer} from "mobx-react-lite";
import Utils from "@ord-core/utils/utils";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";

function TableProfitByMoney(props: {
    stored: ReportSellProfitStore
}) {
    const {stored: stored} = props;
    const {t} = useTranslation(stored.getNamespaceLocale());
    useEffect(() => {
        if (stored) {
            stored.loadSummary();
        }
    }, []);
    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: 'invoiceDate',
            dataIndex: 'invoiceDate',
            width: 150,
            align: 'center',
            render: v => (DateUtil.toFormat(v, 'DD/MM/YYYY HH:mm'))
        },
        {
            dataIndex: 'totalAmount',
            title: 'totalAmount',
            align: 'right',
            width: 150,
            render: v => (Utils.formatterNumber(v))
        },
        {
            title: 'totalRefund',
            dataIndex: 'totalRefund',
            width: 150,
            align: 'right',
            render: v => (Utils.formatterNumber(v))
        },
        {
            title: 'totalRevenue',
            dataIndex: 'totalRevenue',
            width: 150,
            align: 'right',
            render: v => (Utils.formatterNumber(v))
        },
        {
            title: 'totalCostAmount',
            dataIndex: 'totalCostAmount',
            width: 150,
            align: 'right',
            render: v => (Utils.formatterNumber(v))
        },
        {
            title: 'totalProfit',
            dataIndex: 'totalProfit',
            align: 'right',
            width: 150,
            render: v => (Utils.formatterNumber(v))
        },

    ], {
        ns: stored.getNamespaceLocale()
    });
    const {summaryData} = stored;
    return (
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
                                <Table.Summary.Cell index={0} colSpan={2} align='left'>
                                    <strong className=''>{t('total')}</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={2} align='right'
                                                    className='font-bold  !pr-1.5'>
                                    {Utils.formatterNumber((summaryData?.extraProperties as any)?.totalTotalAmount)}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={3} align='right'
                                                    className='font-bold  !pr-1.5'>
                                    {Utils.formatterNumber((summaryData?.extraProperties as any)?.totalRefund)}
                                </Table.Summary.Cell>

                                <Table.Summary.Cell index={4} align='right'
                                                    className='font-bold  !pr-1.5'>
                                    {Utils.formatterNumber((summaryData?.extraProperties as any)?.totalRevenue)}
                                </Table.Summary.Cell>

                                <Table.Summary.Cell index={5} align='right'
                                                    className='font-bold  !pr-1.5'>
                                    {Utils.formatterNumber((summaryData?.extraProperties as any)?.totalCostAmount)}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={6} align='right'
                                                    className='font-bold  !pr-1.5'>
                                    {Utils.formatterNumber((summaryData?.extraProperties as any)?.totalProfit)}
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    );
                }}
                searchData={stored.searchDataState}
                refreshDatasource={stored.refreshDataState}
            />

)
    ;
}

export default observer(TableProfitByMoney);
