import { IRequestOptions, LogApiDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {LogApiService} from "@api/LogApiService";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";

class  LogApiInvoiceStore extends CommonListStore<LogApiDto> {
    getNamespaceLocale(): string {
        return "logApi";
    }

    apiService() {
        return {
            getPaged: LogApiService.getPagedLogApiOfInvoice,
            createOrUpdate: LogApiService.createOrUpdate,
            remove: LogApiService.remove
        } as CommonCrudApi<LogApiDto>;
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
        return ['stt', 'code', 'name', 'OrderNumber', 'Type']
    }

    async beforeSaveEntity(input: any, isAddNew: boolean): Promise<any> {
        // input.name = "CLV" + input.closingEmployeeId;
        return super.beforeSaveEntity(input, isAddNew);
    }
}

export default LogApiInvoiceStore;
