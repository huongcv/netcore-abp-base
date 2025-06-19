// useTableStoreFactory.ts
import {create} from 'zustand';
import {IGetPagedApiService} from "@ord-components/paged-table/types";
import _ from "lodash";
import {v4 as uuidv4} from "uuid";
import {FormInstance} from "antd";


interface TableStoredState {
    data: any[];
    total: number;
    loading: boolean;
    page: number;
    pageSize: number;
    searchParams: Record<string, any>;
    setLoading: (loading: boolean) => void;
    setData: (data: any[], total: number) => void;
    setPagination: (page: number, pageSize: number) => void;
    setSearchParams: (params: Record<string, any>) => void;
    reset: () => void;
    onLoadData: () => Promise<void>;
}

export const createTableStore = (service: IGetPagedApiService) => create<TableStoredState>((set, get) => ({
    data: [],
    total: 0,
    loading: false,
    page: 1,
    pageSize: 10,
    searchParams: {},
    setLoading: (loading) => set({loading}),
    setData: (data, total) => set({data, total}),
    setPagination: (page, pageSize) => set({page, pageSize}),
    setSearchParams: (params) => {
        const {searchParams} = get();
        set({searchParams: {...searchParams, ...params}, page: 1})
    },
    reset: () =>
        set({
            data: [],
            total: 0,
            loading: false,
            page: 1,
            pageSize: 10,
            searchParams: {},
        }),
    onLoadData: async () => {
        const {page, pageSize, searchParams} = get();
        const skipCount = (page - 1) * pageSize;
        const maxResultCount = pageSize;
        const body = _.omit({
            skipCount,
            maxResultCount,
            ...searchParams
        }, 'isShowAdvanceSearch', 'extendResetTick');
        try {
            const resultApi = await service.getPaged({
                body: body
            });
            const result = resultApi.data;
            const items: any[] = result?.items || [];
            if (items.length > 0) {
                items.forEach((it, idx) => {
                    it['view_id'] = uuidv4();
                    it['ordRowIndex'] = skipCount + idx + 1;
                });
            }
            set({
                data: items,
                total: +(result?.totalCount || '0')
            });
        } catch {

        }

    }
}));

