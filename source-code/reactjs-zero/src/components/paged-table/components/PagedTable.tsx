import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Pagination, Table, TableProps} from 'antd';
import {useTranslation} from 'react-i18next';
import {useDebounce} from '@ord-core/hooks/useDebounce';
import {UseBoundStore} from 'zustand/react';
import {StoreApi} from 'zustand/vanilla';
import {TableStoredState} from '@ord-components/paged-table';
import './styles/enhanced-table.css';
import './styles/stick-header.css';

export interface PagedTableProps<T> extends TableProps<T> {
    tableStore: UseBoundStore<StoreApi<TableStoredState>>;
    initialSearchParams?: Record<string, any>;
    isHiddenPagination?: boolean;
}

export const PagedTable = <T extends object>({
                                                 tableStore,
                                                 initialSearchParams,
                                                 isHiddenPagination = false,
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
        reset,
    } = tableStore();
    const {t} = useTranslation();
    const [tick, setTick] = useState(0);

    // Reset store khi khởi tạo
    useEffect(() => {
        reset(initialSearchParams);
        setTick(prev => prev + 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            await onLoadData();
        } finally {
            setLoading(false);
        }
    }, [onLoadData, setLoading]);

    // Gọi load data khi tick thay đổi
    useDebounce(() => {
        loadData();
    }, 100, [tick]);

    // Mỗi khi page, pageSize hoặc searchParams thay đổi thì trigger lại load
    useEffect(() => {
        setTick(prev => prev + 1);
    }, [page, pageSize, searchParams]);

    const renderPagination = useMemo(() => {
        if (isHiddenPagination) return null;

        return (
            <div className="custom-pagination mt-3 flex flex-wrap items-center justify-between">
                <div/>
                <div className="flex items-center">
                    <Pagination
                        pageSizeOptions={['5', '10', '20', '50', '100']}
                        {...{
                            ...tableProps.pagination,
                            current: page,
                            pageSize,
                            total,
                            onChange: setPagination,
                        }}
                        showSizeChanger
                        showTotal={(total, range) =>
                            `${t('Show')} ${range[0]}-${range[1]} / ${total} ${t('record')}`
                        }
                    />
                </div>
            </div>
        );
    }, [isHiddenPagination, page, pageSize, total, tableProps.pagination, t, setPagination]);

    return (
        <div className="enhanced-table">
            <Table
                {...tableProps}
                dataSource={data}
                loading={loading}
                pagination={false}
                rowKey={tableProps.rowKey || 'view_id'}
            />
            {renderPagination}
        </div>
    );
};
