import { AccountMoveService } from "@api/AccountMoveService";
import { CountryStateDto, PartnerDto, StockInventoryMoveBaseDto } from "@api/index.defs";
import { SupplierService } from "@api/SupplierService";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";


class SupplierDebtStore extends CommonListStore<StockInventoryMoveBaseDto> {
    getNamespaceLocale(): string {
        return "partner_debt"
    }

    apiService() {
        return {
            getPaged: SupplierService.getDebtOfPartner,
            createOrUpdate: AccountMoveService.cruDebt,
        } as CommonCrudApi<PartnerDto>;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            entityData: {
                isActive: true,
            } as PartnerDto,
            width: 650
        };
    }


    getListColumnNameExcel(): string[] {
        return ['stt']
    }

    override async beforeSaveEntity(input: CountryStateDto, isAddNew: boolean): Promise<any> {
        return input;
    }
}

export default SupplierDebtStore;
