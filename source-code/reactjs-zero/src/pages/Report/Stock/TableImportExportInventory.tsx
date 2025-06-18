import React from 'react';
import ReportStockImportExportInventoryStore from "@ord-store/Report/ReportStockImportExportInventoryStore";
import {Table, TableColumnsType} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import {useTranslation} from "react-i18next";
import {StockReportPageListImportExportInventoryOutputDto} from "@api/index.defs";
import Utils from "@ord-core/utils/utils";
import {observer} from "mobx-react-lite";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import { TextLineClampDisplay } from '@ord-components/common/TextLineClampDisplay';

function TableImportExportInventory(props: {
    stored: ReportStockImportExportInventoryStore
}) {
    const {stored} = props;
    const {t} = useTranslation(stored.getNamespaceLocale());
    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            title: 'productCode',
            dataIndex: 'productCode',
            width: 80,
        },
        {
            title: 'productName',
            dataIndex: 'productName',
            width: 200,
            render: (text) => <TextLineClampDisplay content={text}/> 
        },
        {
            title: 'isActived',
            dataIndex: 'isActivedStr',
            width: 100,
        },
        {
            title: 'basicUnitName',
            dataIndex: 'basicUnitName',
            width: 70,
        },
        {
            title: t('qtyCurrent'),
            dataIndex: 'qty',
            width: 100,
            align: "right",
            render: (value) => (
            <>
                {formatterNumber(value, 0)}
            </>)
        },
        {
            title: 'beginningBalance',
            children: [
                {
                    title: <div className='text-center'>{t('qty')}</div>,
                    dataIndex: 'openingQuantity',
                    align: 'right',
                    width: 100,
                },
                {
                    title: <div className='text-center'>{t('value')}</div>,
                    dataIndex: 'openingValue',
                    align: 'right',
                    width: 150,
                    render: (_) => <PriceCell value={_}></PriceCell>
                },
            ],
        },
        {
            title: 'import',
            children: [
                {
                    title: <div className='text-center'>{t('qty')}</div>,
                    dataIndex: 'importQuantity',
                    width: 100,
                    align: 'right',
                },
                {
                    title: <div className='text-center'>{t('value')}</div>,
                    dataIndex: 'importValue',
                    align: 'right',
                    width: 150,
                    render: (_) => <PriceCell value={_}></PriceCell>
                },
            ],
        },
        {
            title: 'customerReturn',
            children: [
                {
                    title: <div className='text-center'>{t('qty')}</div>,
                    dataIndex: 'customerReturnQuantity',
                    width: 100,
                    align: 'right',
                },
                {
                    title: <div className='text-center'>{t('value')}</div>,
                    dataIndex: 'customerReturnValue',
                    align: 'right',
                    width: 150,
                    render: (_) => <PriceCell value={_}></PriceCell>
                },
            ],
        },
        {
            title: 'check',
            children: [
                {
                    title: <div className='text-center'>{t('qty')}</div>,
                    dataIndex: 'checkQuantity',
                    width: 100,
                    align: 'right',
                },
                {
                    title: <div className='text-center'>{t('value')}</div>,
                    dataIndex: 'checkValue',
                    align: 'right',
                    width: 150,
                    render: (_) => <PriceCell value={_}></PriceCell>
                },
            ],
        },
        {
            title: 'export',
            children: [
                {
                    title: <div className='text-center'>{t('qty')}</div>,
                    dataIndex: 'exportQuantity',
                    align: 'right',
                    width: 100,
                },
                {
                    title: <div className='text-center'>{t('value')}</div>,
                    dataIndex: 'exportValue',
                    align: 'right',
                    width: 150,
                    render: (_) => <PriceCell value={_}></PriceCell>
                },
            ],
        },
        {
            title: 'endingBalance',
            children: [
                {
                    title: <div className='text-center'>{t('qty')}</div>,
                    dataIndex: 'closingQuantity',
                    align: 'right',
                    width: 100,
                },
                {
                    title: <div className='text-center'>{t('value')}</div>,
                    dataIndex: 'closingValue',
                    align: 'right',
                    width: 150,
                    render: (_) => <PriceCell value={_}></PriceCell>
                },
            ],
        },
    ], {
        ns: stored.getNamespaceLocale()
    });
    const formatterNumber = Utils.formatterNumber;
    const {currentPageResult: summaryData} = stored as {
        currentPageResult: StockReportPageListImportExportInventoryOutputDto
    };
    return (
        <div className="ord-container-box">
            <AntTableWithDataPaged searchForm={stored.searchFormRef}
                                   getPageResult={(d) => {
                                       return stored.apiService().getPaged({
                                           body: {
                                               ...d.body
                                           }
                                       }, {})
                                   }}
                                   onChangePageResult={(d) => {
                                       if (stored) {
                                           stored.setPageResult(d);
                                       }
                                   }}
                                   columns={columns}
                                   searchData={stored.searchDataState}
                                   refreshDatasource={stored.refreshDataState}
                                   summary={(pageData) => {
                                       return <Table.Summary fixed='top'>
                                           <Table.Summary.Row>
                                               <Table.Summary.Cell index={0} colSpan={5} align='left'>
                                                   <strong className=''>{t('total')}</strong>
                                               </Table.Summary.Cell>
                                               <Table.Summary.Cell index={5} align='right'
                                                                   className='font-bold  !pr-1.5'>
                                                   {formatterNumber(summaryData?.qty, 0)}
                                               </Table.Summary.Cell>
                                               <Table.Summary.Cell index={6} align='right'
                                                                   className='font-bold  !pr-1.5'>
                                                   {formatterNumber(summaryData?.openingQuantity, 0)}
                                               </Table.Summary.Cell>
                                               <Table.Summary.Cell index={7} align='right'
                                                                   className='font-bold  !pr-1.5'>
                                                   {formatterNumber(summaryData?.openingValue, 0)}
                                               </Table.Summary.Cell>
                                               <Table.Summary.Cell index={8} align='right'
                                                                   className='font-bold  !pr-1.5'>
                                                   {formatterNumber(summaryData?.importQuantity, 0)}
                                               </Table.Summary.Cell>
                                               <Table.Summary.Cell index={9} align='right'
                                                                   className='font-bold  !pr-1.5'>
                                                   {formatterNumber(summaryData?.importValue, 0)}
                                               </Table.Summary.Cell>
                                               <Table.Summary.Cell index={10} align='right'
                                                                   className='font-bold  !pr-1.5'>
                                                   {formatterNumber(summaryData?.customerReturnQuantity, 0)}
                                               </Table.Summary.Cell>
                                               <Table.Summary.Cell index={11} align='right'
                                                                   className='font-bold  !pr-1.5'>
                                                   {formatterNumber(summaryData?.customerReturnValue, 0)}
                                               </Table.Summary.Cell>
                                               <Table.Summary.Cell index={12} align='right'
                                                                   className='font-bold  !pr-1.5'>
                                                   {formatterNumber(summaryData?.checkQuantity, 0)}
                                               </Table.Summary.Cell>
                                               <Table.Summary.Cell index={13} align='right'
                                                                   className='font-bold  !pr-1.5'>
                                                   {formatterNumber(summaryData?.checkValue, 0)}
                                               </Table.Summary.Cell>
                                               <Table.Summary.Cell index={14} align='right'
                                                                   className='font-bold  !pr-1.5'>
                                                   {formatterNumber(summaryData?.exportQuantity, 0)}
                                               </Table.Summary.Cell>
                                               <Table.Summary.Cell index={15} align='right'
                                                                   className='font-bold  !pr-1.5'>
                                                   {formatterNumber(summaryData?.exportValue, 0)}
                                               </Table.Summary.Cell>
                                               <Table.Summary.Cell index={16} align='right'
                                                                   className='font-bold  !pr-1.5'>
                                                   {formatterNumber(summaryData?.closingQuantity, 0)}
                                               </Table.Summary.Cell>
                                               <Table.Summary.Cell index={17} align='right'
                                                                   className='font-bold  !pr-1.5'>
                                                   {formatterNumber(summaryData?.closingValue, 0)}
                                               </Table.Summary.Cell>

                                           </Table.Summary.Row>
                                       </Table.Summary>
                                   }}
            ></AntTableWithDataPaged>
        </div>

    );
}

export default observer(TableImportExportInventory);