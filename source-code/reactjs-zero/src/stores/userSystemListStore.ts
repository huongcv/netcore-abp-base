import {IRequestOptions, UserDto} from "@api/index.defs";
import {UserService} from "@api/UserService";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";

class UserSystemListStore extends CommonListStore<UserDto> {
    getNamespaceLocale(): string {
        return "user-list"
    }

    apiService() {
        return {
            getPaged: UserService.getPaged,
            exportPagedResult: UserService.exportPagedResult,
            createOrUpdate: (params, options: IRequestOptions) => {
                if (this.createOrUpdateModal.mode === 'addNew') {
                    return UserService.create(params, options);
                }
                return UserService.update(params, options);
            },
            remove: (params, options) => {
                return UserService.remove({
                    body: {
                        id: params.removeId
                    }
                }, options);
            },
        } as CommonCrudApi<UserDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 600
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt', 'UserName', 'Name', 'PhoneNumber', 'Email', 'status']
    }
}

export default UserSystemListStore;
