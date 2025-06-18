import {PagedResultDto} from "@ord-core/service-proxies/dto";
import {v4 as uuidv4} from "uuid";

export interface IUiPagedState<T=any> {
    dataSource: T[] | null,
    totalCount: number,
    isLoading: boolean,
    pageInput: {
        currentPage: number,
        pageSize: number,
        sorting?: string,
        filters?: any
    }
    getPagedApiInput: {
        version: number,
        skipCount: number,
        maxResultCount: number,
        sorting?: string,
        filters?: any
    }
}

export const initState: IUiPagedState = {
    dataSource: [],
    totalCount: 0,
    isLoading: false,
    pageInput: {
        currentPage: 1,
        pageSize: 10,
        sorting: ''
    },
    getPagedApiInput: {
        version: 0,
        skipCount: 0,
        maxResultCount: 10,
        sorting: ''
    }

}

export enum ActionType {
    SetPageResult = 'SET_PAGE_RESULT',
    SetLoading = 'SET_LOADING',
    SetUnLoading = 'SET_UN_LOADING',
    OnSearch = 'OnSearch',
    SetPageInfor = 'SetPageInfor',
    SetCurrentPage = 'SetCurrentPage'
}

export interface Action {
    type: ActionType;
    payload?: any;
}

export const dataTableReducer = (state: IUiPagedState, action: Action): IUiPagedState => {


    switch (action.type) {
        case  ActionType.SetPageResult:
            const pageResult: PagedResultDto<any> = action.payload;
            const items = pageResult?.items || [];
            if (items.length > 0) {
                items.forEach((it, idx) => {
                    if (it['id'] == null) {
                        it['id'] = uuidv4();
                    }
                    it['ordRowIndex'] = state.getPagedApiInput.skipCount + idx + 1;
                });
            }

            let dataSource = (pageResult.items || []).map((item, _) => ({
                ...item,
                key:  uuidv4()
            }));

            return {
                ...state,
                dataSource: dataSource || [],
                totalCount: pageResult?.totalCount ? + (pageResult?.totalCount) : 0,
            };
        case ActionType.SetLoading:
            return {
                ...state,
                isLoading: true
            }
        case ActionType.SetUnLoading:
            return {
                ...state,
                isLoading: false
            }
        case ActionType.OnSearch:
            return setPageInput(state, {
                ...state.pageInput,
                currentPage: 1
            });
        case ActionType.SetPageInfor:
            return setPageInput(state, action.payload);
        case ActionType.SetCurrentPage:
            return setPageInput(state, {
                ...state.pageInput,
                currentPage: action.payload
            });
        default:
            return state;
    }
}

const setPageInput = (state: IUiPagedState, payloadData: {
    currentPage: number,
    pageSize: number,
    sorting?: string,
    filters?: any,
}) => {
    const {currentPage, pageSize, sorting, filters} = payloadData;
    const pageInput = {
        ...state.pageInput,
        currentPage: currentPage,
        pageSize: pageSize,
        sorting: sorting,
        filters: filters
    };
    const getPagedApiInput = {
        skipCount: (currentPage - 1) * pageSize,
        maxResultCount: pageSize,
        sorting: sorting,
        filters: filters,
        version: Number(new Date())
    };
    return {
        ...state,
        pageInput: pageInput,
        getPagedApiInput: getPagedApiInput
    };
}
