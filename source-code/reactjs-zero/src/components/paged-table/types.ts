import {IRequestOptions} from "@api/index.defs";

export interface ICommonResultDtoApi<T> {
    code?: string;
    isSuccessful?: boolean;
    message?: string;
    extend?: any | null;
    data?: T
}

export interface StaticApiFetcher {
    (
        params?: {
            body?: {
                maxResultCount?: number;
                skipCount?: number;
            }
        },
        options?: IRequestOptions
    ): Promise<ICommonResultDtoApi<{
        items?: any[];
        totalCount?: string;
    }>>;
}

export interface StaticCounterByStatusApiFetcher {
    (
        params?: {
            body?: {
                maxResultCount?: number;
                skipCount?: number;
            }
        },
        options?: IRequestOptions
    ): Promise<ICommonResultDtoApi<CounterByStatusItemDto[]>>;
}

export interface CounterByStatusItemDto {
    statusValue?: any | null;
    statusDescription?: string;
    totalCount?: number;
    isTotalItem?: boolean;
}


export interface IModifyApiService {
    create: (params: { body?: any; }, options?: IRequestOptions) => Promise<ICommonResultDtoApi<any>>;
    update: (params: {
        body?: {
            encodedId?: string
        }
    }, options?: IRequestOptions) => Promise<ICommonResultDtoApi<any>>;
}

export interface IGetPagedApiService {
    getPaged: StaticApiFetcher;
}