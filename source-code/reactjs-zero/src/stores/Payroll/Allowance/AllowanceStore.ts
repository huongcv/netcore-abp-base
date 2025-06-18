import {AllowanceDto, IRequestOptions, } from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {AllowanceService} from "@api/AllowanceService";

class AllowanceStore extends CommonListStore<AllowanceDto> {
    getNamespaceLocale(): string {
        return "allowance"
    }

    apiService() {
        return {
            getPaged: AllowanceService.getPaged,
            exportPagedResult: AllowanceService.exportPagedResult,
            createOrUpdate: (params, options: IRequestOptions) => {

                return AllowanceService.createOrUpdate(params, options);
            },
            remove: (params, options) => {
                return AllowanceService.remove({removeId:params.removeId}, options);
            },
        } as CommonCrudApi<AllowanceService>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: '800px',
            style: {
                top: '10px'
            }
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt', 'code', 'name', 'amount', 'notes']
    }

    async beforeSaveEntity(input: any, isAddNew: boolean): Promise<any> {
        return super.beforeSaveEntity(input, isAddNew);
    }
}

export default AllowanceStore;
