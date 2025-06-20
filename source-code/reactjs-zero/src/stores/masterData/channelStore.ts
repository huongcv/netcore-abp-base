import {ChannelDto, IRequestOptions} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {ChannelService} from "@api/ChannelService";

class ChannelStore extends CommonListStore<ChannelDto> {

    getNamespaceLocale(): string {
        return "channel"
    }

    apiService() {
        return {
            getPaged: ChannelService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                if (this.createOrUpdateModal.mode === 'addNew') {
                    return ChannelService.createOrUpdate(params, options);
                }
                return ChannelService.createOrUpdate(params, options);
            },
            remove: ChannelService.remove
        } as CommonCrudApi<ChannelDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt']
    }

    override async beforeSaveEntity(input: ChannelDto, isAddNew: boolean): Promise<any> {
        return input;
    }
}

export default ChannelStore;
