// useTableStoreFactory.ts
import {create} from 'zustand';
import {IGetPagedApiService} from "@ord-components/paged-table/types";
import _ from "lodash";
import {v4 as uuidv4} from "uuid";
import UiUtils from "@ord-core/utils/ui.utils";
import FileSaver from "file-saver";
import {IRequestOptions} from "@api/index.defs";


interface TableStoredState {
    data: any[];
    total: number;
    loading: boolean;
    page: number;
    pageSize: number;
    searchParams: Record<string, any>;
    reloadStatusCounter: number;
    setLoading: (loading: boolean) => void;
    setData: (data: any[], total: number) => void;
    setPagination: (page: number, pageSize: number) => void;
    setSearchParams: (params: Record<string, any>) => void;
    reset: () => void;
    onLoadData: () => Promise<void>;
    onExportExcel: () => Promise<void>;
    setReloadStatusCounter: () => void;
}

export const createTableStore = (service: IGetPagedApiService) => create<TableStoredState>((set, get) => ({
    data: [],
    total: 0,
    loading: false,
    page: 1,
    pageSize: 10,
    searchParams: {},
    reloadStatusCounter: 0,
    setLoading: (loading) => set({loading}),
    setData: (data, total) => set({data, total}),
    setPagination: (page, pageSize) => set({page, pageSize}),
    setSearchParams: (params) => {
        const {searchParams} = get();
        let newSearchParams = _.omit({...searchParams, ...params}, [
            'isShowAdvanceSearch',
            'extendResetTick',
            'hotKeyScopeId',
            'onSearchBeginning'

        ]);

        set({searchParams: {...newSearchParams}, page: 1})
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
    setReloadStatusCounter: () => {
        const {reloadStatusCounter} = get();
        set({reloadStatusCounter: reloadStatusCounter + 1})
    },
    onLoadData: async () => {
        const {page, pageSize, searchParams} = get();
        const skipCount = (page - 1) * pageSize;
        const maxResultCount = pageSize;
        const body = {
            skipCount,
            maxResultCount,
            ...searchParams
        }
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
    },
    onExportExcel: async () => {
        const {searchParams} = get();
        if (!service?.exportToExcel) {
            return;
        }
        UiUtils.setBusy();
        try {
            let options: IRequestOptions = {
                responseType: "blob",
            }
            const resultBlob = await service.exportToExcel({
                body: searchParams
            }, options);
            const contentDisposition = sessionStorage.getItem('content-disposition');
            let fileName = 'download.xlsx';
            const fileNameMatch = contentDisposition?.match(/filename\*=UTF-8''(.+\.xlsx)/);
            if (fileNameMatch && fileNameMatch[1]) {
                fileName = decodeURIComponent(fileNameMatch[1]);
            }
            FileSaver.saveAs(resultBlob, fileName);
        } catch {

        } finally {
            UiUtils.clearBusy();
        }
    }
}));

