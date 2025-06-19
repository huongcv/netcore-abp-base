// useTableStoreFactory.ts
import {create} from 'zustand';

export const createTableStore = () =>
    create<{
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
    }>((set) => ({
        data: [],
        total: 0,
        loading: false,
        page: 1,
        pageSize: 10,
        searchParams: {},
        setLoading: (loading) => set({loading}),
        setData: (data, total) => set({data, total}),
        setPagination: (page, pageSize) => set({page, pageSize}),
        setSearchParams: (params) => set({searchParams: params, page: 1}),
        reset: () =>
            set({
                data: [],
                total: 0,
                loading: false,
                page: 1,
                pageSize: 10,
                searchParams: {},
            }),
    }));
