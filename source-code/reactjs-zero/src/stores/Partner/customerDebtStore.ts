import { AccountMoveService } from "@api/AccountMoveService";
import { CustomerService } from "@api/CustomerService";
import { CountryStateDto, PartnerDto, SaleInvoiceDto } from "@api/index.defs";
import { PartnerTransactionService } from "@api/PartnerTransactionService";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";

export interface IChangePartnerDebt {

    partnerId?: string | undefined,
    formPartnerType: "customer" | "supplier",
    partnerCode: string | undefined,
    partnerName: string | undefined,

    transactionId?: string | undefined,
    transactionDate: Date|undefined,
    currentDebtAmount: number | undefined;
    debt: number | undefined; /// Nợ thực tế
}

class CustomerDebtStore extends CommonListStore<SaleInvoiceDto, IChangePartnerDebt> {
    getNamespaceLocale(): string {
        return "partner_debt"
    }

    apiService() {
        return {
            getPaged: CustomerService.getDebtOfPartner,
            createOrUpdate: AccountMoveService.cruDebt,
            remove: PartnerTransactionService.remove,
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

export default CustomerDebtStore;
