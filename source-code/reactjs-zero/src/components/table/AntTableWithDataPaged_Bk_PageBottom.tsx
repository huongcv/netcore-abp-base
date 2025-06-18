import {withDataTableFetching} from "@ord-core/hoc/withDataTableFetching";
import {Button, Pagination, Popconfirm, Segmented, Space, Table} from "antd";
import React, {useEffect, useState} from "react";
import {l} from "@ord-core/language/lang.utils";
import {RedoOutlined} from "@ant-design/icons";

const DataTable = (props: any) => {
    const [pageSize, setPageSize] = useState<number>(10);
    const setPageSizeLocal = () => {
        setPageSize(props.summaryPagination.pageSize);
    }

    useEffect(() => {
        setPageSize(props.summaryPagination.pageSize);
    }, [props.summaryPagination.pageSize]);

    return (<Table  {...props}
                    bordered={false}
                    scroll={{x: 'max-content'}}
                    sticky={{offsetHeader: 1}}
                    title={props.title}
                    pagination={{...props.pagination, position: ['none']}}
                    summary={() => (
                        props.totalCount > 0 &&
                        <Table.Summary fixed={'bottom'}>
                            <Table.Summary.Row>
                                <Table.Summary.Cell align={'end'} index={0}
                                                    colSpan={1000}
                                                    className='summary-cell-pagination'>
                                    <Space className='justify-end'>
                                        <Pagination
                                            {...props.pagination}
                                            onChange={props.onChangePaginationSummary}
                                            showSizeChanger={false}
                                        />
                                        <Popconfirm
                                            className='ordChangePageSizePop'
                                            placement="topLeft"
                                            title={l.transCommon('pageSizeTableTitle')}
                                            description={(<>
                                                <Segmented<number>
                                                    value={pageSize}
                                                    options={[5, 10, 20, 30, 50, 100]}
                                                    onChange={(value) => {
                                                        setPageSize(+value);
                                                    }}
                                                />
                                            </>)}
                                            okText={l.transCommon('apply')}
                                            cancelText={l.transCommon('close')}
                                            onConfirm={() => {
                                                props.onChangePaginationSummary(1, pageSize);
                                            }}
                                            onCancel={() => {
                                                setPageSizeLocal()
                                            }}
                                            onOpenChange={() => {
                                                setPageSizeLocal()
                                            }}
                                        >
                                            <Button>{l.transCommon('pageSizeTable', {...props.summaryPagination})}</Button>
                                        </Popconfirm>
                                        <a onClick={props.onRefreshDatasource}
                                           title={l.transCommon('refreshDataTable')}>
                                            <RedoOutlined className='cursor-pointer text-xl ms-1'/>
                                        </a>
                                    </Space>


                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}/>)
}
export const AntTableWithDataPaged_Bk_PageBottom = withDataTableFetching<any>(DataTable);
