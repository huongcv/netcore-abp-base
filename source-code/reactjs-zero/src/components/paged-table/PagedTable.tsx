import React, {useEffect} from 'react';
import {Pagination, Table, TableProps} from 'antd';
import {useTranslation} from "react-i18next";
import {StaticApiFetcher} from "@ord-components/paged-table/types";

interface PagedTableProps<T> extends TableProps<T> {
    fetcher: StaticApiFetcher<T>;
    tableStore: ReturnType<typeof import('./useTableStoreFactory').createTableStore>;
}

export const PagedTable = <T extends object>({
                                                 fetcher,
                                                 tableStore,
                                                 ...tableProps
                                             }: PagedTableProps<T>) => {
    const {
        data,
        total,
        loading,
        page,
        pageSize,
        searchParams,
        setLoading,
        setData,
        setPagination
    } = tableStore();
    const {t} = useTranslation();
    const loadData = async () => {
        setLoading(true);
        try {
            const skipCount = (page - 1) * pageSize;
            const maxResultCount = pageSize;
            const resultApi = await fetcher({
                body: {skipCount, maxResultCount, ...searchParams}
            });
            const result = resultApi.data;
            setData(result?.items || [], +(result?.totalCount || '0'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData().then();
    }, [page, pageSize, searchParams]);

    return (
        <>
            <div>
                <Table  {...tableProps}
                        dataSource={data}
                        loading={loading}
                        pagination={false}
                        rowKey={tableProps.rowKey || 'id'}/>
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
                            pageSizeOptions={[5, 10, 20, 50, 100]}
                            {...{
                                ...tableProps.pagination,
                                current: page,
                                pageSize,
                                total,
                                onChange: setPagination
                            }}
                            showSizeChanger
                            showTotal={(total, range) => t('Show') + ` ${range[0]}-${range[1]} / ${total} ` + t('record')}
                        />

                    </div>

                </div>
            </div>
        </>
    );
};
