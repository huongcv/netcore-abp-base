import {ShopBankAccountDto} from "@api/index.defs";
import {ShopBankAccountService} from "@api/ShopBankAccountService";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";

class BankAccountStore extends CommonListStore<ShopBankAccountDto>{
    getNamespaceLocale(): string {
        return "bankAccount"
    }
    apiService(): CommonCrudApi<ShopBankAccountDto> {
        return ShopBankAccountService
    }
    getInitModal(): ICreateOrUpdateModal<ShopBankAccountDto> {
        return {
            width: "800px",
            style: {
              top: "10px",
            },
          };
    }
    getListColumnNameExcel(): string[] {
        throw new Error("Method not implemented.");
    }
    
}
export default BankAccountStore