import {IRequestOptions, SettingDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {SettingService} from "@api/SettingService";
import {UploadFileService} from "@api/UploadFileService";

class SettingListStore extends CommonListStore<SettingDto> {
    getNamespaceLocale(): string {
        return "setting-list"
    }

    apiService() {
        return {
            getPaged: SettingService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                return SettingService.setValue(params, options);
                // if (this.createOrUpdateModal.mode === 'addNew') {
                //     return SettingService.setValue(params, options);
                // }
                // return SettingService.update(params, options);
            }
        } as CommonCrudApi<SettingDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 600
        };
    }


    getListColumnNameExcel(): string[] {
        return ['stt']
    }

    override async beforeSaveEntity(input: SettingDto, isAddNew: boolean): Promise<any> {
        return input;
    }
}

export default SettingListStore;
