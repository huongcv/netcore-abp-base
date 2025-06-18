import {IRequestOptions, RoleDto, UserDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {RoleService} from "@api/RoleService";
import OrdPermissionArrayUtil from "@ord-core/utils/array/ord.permission.array.util";

class RoleListStore extends CommonListStore<UserDto> {
    getNamespaceLocale(): string {
        return "role-list"
    }

    apiService() {
        return {
            getPaged: RoleService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                if (this.createOrUpdateModal.mode === 'addNew') {
                    return RoleService.create(params, options);
                }
                return RoleService.update(params, options);
            },
            remove: RoleService.remove
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

export default RoleListStore;
