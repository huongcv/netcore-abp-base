import {IRequestOptions, ShopInfoDto, TenantDto, UserDto} from "@api/index.defs";
import {UserService} from "@api/UserService";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {TenantService} from "@api/TenantService";
import {action, makeObservable, observable} from "mobx";
import UiUtils from "@ord-core/utils/ui.utils";

class TenantListStore extends CommonListStore<TenantDto> {
    tenantDetail: TenantDto | null;
    shopDetail: ShopInfoDto | null;

    constructor() {
        super();
        makeObservable(this, {
            tenantDetail: observable,
            shopDetail: observable,
            getTenantDetail: action
        })
    }

    getNamespaceLocale(): string {
        return "tenant-list"
    }

    apiService() {
        return {
            getPaged: TenantService.getShopPaged,
            exportPagedResult: UserService.exportPagedResult,
            createOrUpdate: (params, options: IRequestOptions) => {
                if (this.createOrUpdateModal.mode === 'addNew') {
                    return TenantService.create(params, options);
                }
                return TenantService.update(params, options);
            },
            remove: (params, options) => {
                try {
                    UiUtils.setBusy();
                    TenantService.deleteShop({guidId: params.removeId}).then(result => {
                        if (!result.isSuccessful) {
                            UiUtils.showError(result.message);
                            return;
                        }

                        UiUtils.showSuccess('Xoá thành công cửa hàng');
                        this.refreshGridData().then();
                    }).catch(ex => {
                        console.error(ex)
                    }).finally(() => {
                        UiUtils.clearBusy();
                    });
                } catch (ex) {
                    console.error(ex)
                } finally {
                    UiUtils.clearBusy();
                }
            },

        } as CommonCrudApi<UserDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 1000
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt', 'code', 'Name', 'PhoneNumber', 'Email', 'address', 'status']
    }

    async getTenantDetail(id: string) {
        try {
            const tenant = await TenantService.getById({
                findId: id
            });
            this.tenantDetail = {...tenant};
        } catch {

        }
    }

    async getShopDetail(id: string) {
        try {
            UiUtils.setBusy();
            const result = await TenantService.getShopById({
                guidId: id
            });

            if (!result.isSuccessful) {
                UiUtils.showError(result.message);
                return;
            }

            this.shopDetail = {...result.data};
            this.tenantDetail = {...result.data?.tenant};
        } catch (ex: any) {
            console.error(ex);
        } finally {
            UiUtils.clearBusy();
        }
    }
}

export default TenantListStore;
