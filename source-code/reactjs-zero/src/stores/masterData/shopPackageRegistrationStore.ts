import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {
    IRequestOptions,
    ShopDto,
    ShopPackageRegistrationDto, ShopPackageRegistrationStatus,
    ShopPackageRegistrationType,
    TimeUnit
} from "@api/index.defs";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {ShopPackageRegistrationService} from "@api/ShopPackageRegistrationService";

export interface IShopPackageRegistration {
    id?: number | undefined,
    packageRegistrationId?: number | undefined,
    packageRegistrationStartDate: Date,
    packageRegistrationExpiryDate: Date,
    shopId?: number | undefined;
    tenantId?: string | undefined;
    tenant?: any;

    packageRegistrationDate: Date,
    packageRegistrationCode:string;
    packageRegistrationName: string;
    packageRegistrationType: ShopPackageRegistrationType,

    chargeTime?: number;
    freeTime?: number;
    totalTime?: number;
    timeUnit?: TimeUnit;
    packageAccountNumber?: number;
    packageShopNumber?: number;
    price?: number;
    qty?: number;
    totalAmountBeforeDiscount?: number | 0;
    discountAmount?: number;
    totalAmount?: number;
    notes?: string;
    salePartnerId?: string;
    status?: ShopPackageRegistrationStatus | undefined;
}

class ShopPackageRegistrationStore extends CommonListStore<ShopPackageRegistrationDto> {
    getNamespaceLocale(): string {
        return "packageRegistration"
    }

    apiService() {
        return {
            getPaged: ShopPackageRegistrationService.getPaged,
            createOrUpdate: (params, options: IRequestOptions) => {
                if (this.createOrUpdateModal.mode === 'addNew') {
                    return ShopPackageRegistrationService.createOrUpdate(params, options);
                }
                return ShopPackageRegistrationService.createOrUpdate(params, options);
            },
            remove: ShopPackageRegistrationService.remove
        } as CommonCrudApi<ShopPackageRegistrationDto>;
    }
    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 992
        };
    }
    getListColumnNameExcel(): string[] {
        return ['stt']
    }

}

export default ShopPackageRegistrationStore;
