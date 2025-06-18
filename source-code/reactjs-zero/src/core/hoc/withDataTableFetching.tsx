import {ComponentType, useEffect, useReducer} from "react";
import {FormInstance, TableColumnsType} from "antd";
import {PagedRequestDto, PagedResultDto} from "@ord-core/service-proxies/dto";
import i18next from "i18next";
import {TableRowSelection} from "antd/es/table/interface";
import {ActionType, dataTableReducer, initState} from "@ord-core/hoc/dataTableReducer";
import {PanelRender} from "rc-table/lib/interface";

interface DataTableFetchingProps {
    title?: PanelRender<any>,
    getPageResult: (params: {
        body: PagedRequestDto;
    }) => Promise<PagedResultDto<any>>,
    columns: TableColumnsType<any>,
    searchForm?: FormInstance,
    tableSetting?: {
        pageSizeOptions: string[] | number[];
    }
    rowSelection?: TableRowSelection<any>;
    searchData?: any;
    refreshDatasource?: number;
    onChangePageResult?: (result: PagedResultDto<any>) => void;
    rowKey?: string;
    className?:string;
    summary?: (data: any) => React.ReactNode;
    bordered?: boolean;
    hiddenPagination?:boolean;
    onRow?:(record:any, rowIndex:any)=>void, 
    dataSource?: any[]
}


export function     withDataTableFetching<T>(WrappedComponent: ComponentType<any>) {
    return function DataTableFetchingComponent(props: DataTableFetchingProps) {
        const [state, dispatch] = useReducer(dataTableReducer, initState);
        useEffect(() => {
            dispatch({
                type: ActionType.SetCurrentPage,
                payload: 1
            });
            if (props.searchForm) {
                props.searchForm.setFieldValue('onSearchBeginning', Number(new Date()));
            }
        }, [props.searchData]);
        useEffect(() => {
            if (state.getPagedApiInput.version > 0) {
                loadData().then();
            }
        }, [state.getPagedApiInput]);
        useEffect(() => {
            if (props.refreshDatasource && props.refreshDatasource > 0) {
                onRefreshDatasource();
            }
        }, [props.refreshDatasource]);
        const onChange = (pagination: any, filters: any, sorter: any) => {
            const current = pagination.current || 1;
            const pageSize = pagination!.pageSize || 10;
            let sorting = '';
            if (sorter?.order) {
                sorting = sorter?.order ? sorter?.field + (sorter.order === 'descend' ? "" : " desc") : '';
            }
            dispatch({
                type: ActionType.SetPageInfor,
                payload: {
                    currentPage: current,
                    pageSize: pageSize,
                    sorting: sorting,
                    filters: filters
                }
            });
        }
        const loadData = async () => {
            dispatch({
                type: ActionType.SetLoading
            });
            try {
                let prm = {...props?.searchData} || {};
                if (props.searchForm) {
                    prm = {
                        ...prm,
                        ...props.searchForm.getFieldsValue()
                    };
                }

                const pageResult = await props.getPageResult({
                    body: {
                        ...prm,
                        ...state.getPagedApiInput
                    }
                });
                if (props?.onChangePageResult) {
                    props.onChangePageResult(pageResult as any);
                }
                const items = props.dataSource ?? (pageResult?.items || []);
                if (items.length === 0 && state.getPagedApiInput.skipCount > 0) {
                    const totalCount = pageResult.totalCount ? +(pageResult.totalCount) : 0;
                    if (totalCount > 0) {
                        const {maxResultCount} = state.getPagedApiInput;
                        const floor = Math.floor(totalCount / maxResultCount);
                        let lastPageIndex = floor + 1;
                        if (totalCount % maxResultCount === 0) {
                            lastPageIndex = floor;
                        }
                        dispatch({
                            type: ActionType.SetCurrentPage,
                            payload: lastPageIndex
                        });
                    } else {
                        dispatch({
                            type: ActionType.SetCurrentPage,
                            payload: 1
                        });
                    }

                    return;
                }
                dispatch({
                    type: ActionType.SetPageResult,
                    payload: {
                        totalCount: pageResult.totalCount,
                        items: items

                    }
                });
            } catch {

            } finally {
                dispatch({
                    type: ActionType.SetUnLoading
                });
            }
        }
        const onChangePaginationSummary = (currentPage: number, pageSize: number) => {
            dispatch({
                type: ActionType.SetPageInfor,
                payload: {
                    currentPage: currentPage,
                    pageSize: pageSize,
                    sorting: state.pageInput.sorting
                }
            });
        }
        const onRefreshDatasource = () => {
            loadData().then();
        }

        return (
            <WrappedComponent {...props}
                              bordered={props.bordered??true}
                              dataSource={state.dataSource}
                              totalCount={state.totalCount}
                              onChange={onChange}
                              isLoading={state.isLoading}
                              skipCount={state.getPagedApiInput.skipCount}
                              rowKey={props.rowKey || 'id'}
                              loading={state.isLoading}
                              pagination={!props.hiddenPagination?{
                                  defaultCurrent: 1,
                                  pageSizeOptions: props?.tableSetting?.pageSizeOptions || [5, 10, 20, 50, 100],
                                  showQuickJumper: false,
                                  responsive: true,
                                  current: state.pageInput.currentPage,
                                  pageSize: state.pageInput.pageSize,
                                  total: state.totalCount,
                                  showTotal: () => state.totalCount > 0 ? i18next.t('paginationTotal', {
                                      start: (state.getPagedApiInput.skipCount) + 1,
                                      end: (state.getPagedApiInput.skipCount) + (state.dataSource?.length || 0),
                                      total: state.totalCount,
                                  }) : null
                              }:false}
                              summaryPagination={{
                                  defaultCurrent: 1,
                                  responsive: true,
                                  current: state.pageInput.currentPage,
                                  pageSize: state.pageInput.pageSize,
                                  total: state.totalCount,
                                  showTotal: () => state.totalCount > 0 ? i18next.t('paginationTotal', {
                                      start: (state.getPagedApiInput.skipCount) + 1,
                                      end: (state.getPagedApiInput.skipCount) + (state.dataSource?.length || 0),
                                      total: state.totalCount,
                                  }) : null
                              }}
                              columns={props.columns}
                              onChangePaginationSummary={onChangePaginationSummary}
                              onRefreshDatasource={onRefreshDatasource}
            />

        );
    }
}
