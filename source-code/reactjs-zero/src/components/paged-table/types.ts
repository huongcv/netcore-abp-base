import {IRequestOptions} from "@api/index.defs";
import {CountryPagedDto} from "@api/base/index.defs";

export interface StaticApiFetcher<OutputResult = any> {
    (
        params?: {
            body?: {
                maxResultCount?: number;
                skipCount?: number;
            }
        },
        options?: IRequestOptions
    ): Promise<{
        code?: string;
        isSuccessful?: boolean;
        data?: {
            items?: CountryPagedDto[];
            totalCount?: string;
        };
    }>;
}