import React, {useCallback} from 'react';
import {Form, FormInstance, TableProps} from 'antd';
import {IGetPagedApiService, StaticCounterByStatusApiFetcher} from "@ord-components/paged-table/types";
import {PagedTable} from "@ord-components/paged-table/components/PagedTable";
import {TableSearchForm} from "@ord-components/paged-table/components/TableSearchForm";
import {OrdCounterByStatusSegmented} from "@ord-components/crud/counter-list/OrdCounterByStatusSegmented";
import {useTableStore} from "@ord-components/paged-table/hooks/useTableStore";

export interface SearchablePagedTableProps<T = any> extends TableProps<T> {
    searchForm?: FormInstance;
    apiService: IGetPagedApiService;
    searchFields?: React.ReactNode;
    initialSearchParams?: Record<string, any>; // Search params để set sau khi reset
    counterByStatus?: {
        statusFieldName: string,
        fetcher: StaticCounterByStatusApiFetcher,
        initialValueStatus?: string | number | null | boolean
    },
    bulkActionToolbar?: React.ReactNode;
    onChangeDataTable?: (valueRowKeys: any[], data: any[]) => void;
}

export const SearchablePagedTable = <T extends object>({
                                                           searchForm,
                                                           apiService,
                                                           searchFields,
                                                           counterByStatus,
                                                           bulkActionToolbar,
                                                           initialSearchParams,
                                                           ...tableProps
                                                       }: SearchablePagedTableProps<T>) => {
    const tableStore = useTableStore(apiService);
    const [internalForm] = Form.useForm();
    const usedForm = searchForm || internalForm;
    return (
        <>
            <TableSearchForm tableStore={tableStore} form={usedForm} initialValues={initialSearchParams}>
                {searchFields}
                <Form.Item noStyle name={['extendUI', 'valueRowKeys']}></Form.Item>
            </TableSearchForm>
            {
                counterByStatus &&
                <div className={'mt-5'}>
                    <OrdCounterByStatusSegmented
                        {...counterByStatus}
                        tableStore={tableStore}
                    />
                </div>
            }
            {bulkActionToolbar}
            <PagedTable tableStore={tableStore}
                        {...tableProps}
                        initialSearchParams={initialSearchParams}
            />
        </>
    );
};

