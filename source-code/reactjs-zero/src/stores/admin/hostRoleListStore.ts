import {IRequestOptions, RoleDto, UserDto} from "@api/index.defs";
import {RoleHostService} from "@api/RoleHostService";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import OrdPermissionArrayUtil from "@ord-core/utils/array/ord.permission.array.util";

class HostRoleListStore extends CommonListStore<UserDto> {
    getNamespaceLocale(): string {
        return "role-list"
    }

    apiService() {
        return {
            getPaged: RoleHostService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                if (this.createOrUpdateModal.mode === 'addNew') {
                    return RoleHostService.create(params, options);
                }
                return RoleHostService.update(params, options);
            },
            remove: RoleHostService.remove
        } as CommonCrudApi<RoleDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt']
    }

    override async beforeSaveEntity(input: RoleDto, isAddNew: boolean): Promise<any> {
        if (input.listPermissionName) {
            console.log('ok', input.listPermissionName);
            OrdPermissionArrayUtil.includePermissionBase(input.listPermissionName);
        }
        return input;
    }
}

export default HostRoleListStore;
