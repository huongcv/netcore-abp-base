import React, {useEffect, useState} from 'react';
import {Pagination, Table, TableProps} from 'antd';
import {useTranslation} from "react-i18next";
import {useDebounce} from "@ord-core/hooks/useDebounce";
import {UseBoundStore} from "zustand/react";
import {StoreApi} from "zustand/vanilla";
import {TableStoredState} from '../hooks/useTableStoreFactory';
import './styles/enhanced-table.css';
import './styles/stick-header.css';

export interface PagedTableProps<T> extends TableProps<T> {
    tableStore: UseBoundStore<StoreApi<TableStoredState>>,
    initialSearchParams?: Record<string, any>; // Search params để set sau khi reset
}

export const PagedTable = <T extends object>({
                                                 tableStore,
                                                 initialSearchParams,
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
        setPagination,
        onLoadData,
        reset
    } = tableStore();
    const {t} = useTranslation();
    const [tick, setTick] = useState<number>(0);
    useEffect(() => {
        reset(initialSearchParams);
        setTick(tick + 1);
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            await onLoadData();
        } finally {
            setLoading(false);
        }
    };
    useDebounce(() => {
        loadData().then();
    }, 100, [tick]);

    useEffect(() => {
        setTick(tick + 1);
    }, [page, pageSize, searchParams]);

    return (
        <>
            <div className={'enhanced-table'}>
                <Table
                    {...tableProps}
                    dataSource={data}
                    loading={loading}
                    pagination={false}
                    rowKey={tableProps.rowKey || 'view_id'}/>
                <div className={'custom-pagination mt-3 flex flex-wrap items-center justify-between'}>
                    <div>
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
