import {CountryStateDto, PartnerDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";

class MembershipVoucherStore extends CommonListStore<PartnerDto> {
    getNamespaceLocale(): string {
        return "customer-mbVoucher"
    }

    apiService() {
        return {
            // getPaged: CustomerService.getDebtOfPartner,
        } as CommonCrudApi<PartnerDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            entityData: {
                isActive: true,
                gender: 1
            } as PartnerDto,
            width: '80%'
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt']
    }

    override async beforeSaveEntity(input: CountryStateDto, isAddNew: boolean): Promise<any> {
        return input;
    }
}

export default MembershipVoucherStore;
