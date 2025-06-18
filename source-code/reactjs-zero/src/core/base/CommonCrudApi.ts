import {IRequestOptions} from "@api/index.defs";
import {CommonResultDto, PagedResultDto} from "@ord-core/service-proxies/dto";

export interface CommonCrudApi<TListItemDto> extends CommonCreateOrUpdate {
    getPaged: (params: { body: any }, options: IRequestOptions) => Promise<PagedResultDto<TListItemDto>>;
    remove: (params: { removeId: any }, options: IRequestOptions) => Promise<CommonResultDto<any>>;
    exportPagedResult?: (params: { body: any }, options: IRequestOptions) => Promise<any>;

}

export interface CommonCreateOrUpdate {
    createOrUpdate: (params: { body: any }, options: IRequestOptions) => Promise<CommonResultDto<any>>;
}
