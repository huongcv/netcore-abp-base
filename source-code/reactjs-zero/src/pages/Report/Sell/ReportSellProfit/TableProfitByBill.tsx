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

function TableProfitByBill(props: {
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
            title: 'invoiceCode',
            dataIndex: 'invoiceCode',
            width: 150,
            align: 'center',
        },
        {
            title: 'partnerName',
            dataIndex: 'partnerName',
        },
        {
            title: 'invoiceDate',
            dataIndex: 'invoiceDate',
            width: 160,
            align: 'center',
            render: v => (DateUtil.toFormat(v, 'DD/MM/YYYY HH:mm'))
        },
        {
            title: 'totalAmount',
            dataIndex: 'totalAmount',
            align: 'right',
            width: 200,
            render: v => (Utils.formatterNumber(v))
        },
        {
            dataIndex: 'totalCostAmount',
            title: 'totalCostAmount',
            align: 'right',
            width: 200,
            render: v => (Utils.formatterNumber(v))
        },
        {

            title: 'totalProfit',
            dataIndex: 'totalProfit',
            width: 200,
            align: 'right',
            render: v => (Utils.formatterNumber(v))
        }
    ], {
        ns: stored.getNamespaceLocale()
    });
    const {summaryData} = stored;
    return (
        <>
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
                    searchData={stored.searchDataState}
                    refreshDatasource={stored.refreshDataState}
                    summary={(pageData) => {
                        return (
                            <Table.Summary fixed='top'>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0} colSpan={4} align='left'>
                                        <strong className=''>{t('total')}</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={9} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {Utils.formatterNumber((summaryData?.extraProperties as any)?.totalAmount)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={10} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {Utils.formatterNumber((summaryData?.extraProperties as any)?.totalCostAmount)}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={11} align='right'
                                                        className='font-bold  !pr-1.5'>
                                        {Utils.formatterNumber((summaryData?.extraProperties as any)?.totalProfit)}
                                    </Table.Summary.Cell>

                                </Table.Summary.Row>
                            </Table.Summary>
                        );
                    }}
                />
        </>
    );
}

export default observer(TableProfitByBill);
