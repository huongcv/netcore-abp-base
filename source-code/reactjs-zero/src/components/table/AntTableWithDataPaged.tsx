import {withDataTableFetching} from "@ord-core/hoc/withDataTableFetching";
import {Button, Pagination, Popconfirm, Segmented, Space, Table} from "antd";
import React, {useEffect, useState} from "react";
import {l} from "@ord-core/language/lang.utils";
import {RedoOutlined} from "@ant-design/icons";
import {PageBreadcrumb} from "@ord-components/common/page/PageBreadcrumb";
import {useTranslation} from "react-i18next";

const DataTable = (props: any) => {
    const [t] = useTranslation();
    const [pageSize, setPageSize] = useState<number>(10);
    const setPageSizeLocal = () => {
        setPageSize(props.summaryPagination.pageSize);
    }

    useEffect(() => {
        setPageSize(props.summaryPagination.pageSize);
    }, [props.summaryPagination.pageSize]);

    return (<div>
        <Table  {...props}
                dataSource={props.dataSource ?? []}
                scroll={{x: 'max-content'}}
                sticky={{offsetHeader: 1}}
                title={props.title}
                pagination={false}/>
        {!props.hiddenPagination &&
        <div className={'custom-pagination mt-3 flex flex-wrap items-center justify-between'}>
            <div>
                {/*<span className={'me-1'}>*/}
                {/*    {t('totalRecord')}:*/}
                {/*</span>*/}
                {/*<span className={'font-semibold'}>*/}
                {/*   {props.totalCount} {t('record')}*/}
                {/*</span>*/}
            </div>
            <div className="flex items-center">
                    <Pagination
                        {...props.pagination}
                        onChange={props.onChangePaginationSummary}
                        showSizeChanger
                        showTotal={null}
                    />

            </div>

        </div>}
    </div>)
}
export const AntTableWithDataPaged = withDataTableFetching<any>(DataTable);
