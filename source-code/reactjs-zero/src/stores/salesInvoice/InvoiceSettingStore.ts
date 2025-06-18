import {ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {action, makeObservable, observable} from "mobx";
import {
    IFormSettingShop_SaleInvoice,
    PROP_SETTING_SHOP_SALE_INVOICE,
    SETTING_NAME_FOR_USER
} from "@pages/System/ShopSetting/user-setting-name.const";
import {ShopSettingService} from "@api/ShopSettingService";
import {ShopSettingDto} from "@api/index.defs";

class InvoiceSettingStore {
    settings: IFormSettingShop_SaleInvoice;
    visibleSetting: boolean = false;
    getNamespaceLocale(): string {
        return "sale-invoice"
    }

    constructor() {
        makeObservable(this, {
            visibleSetting: observable,
            settings: observable,
            setSettings: action,
            setVisibleSetting: action
        });
    }

    setVisibleSetting(value: boolean) {
        this.visibleSetting = value;
    }
    setSettings(settings: IFormSettingShop_SaleInvoice) {
        this.settings = settings;
    }
    async getSettingInfo() {
        let data = await ShopSettingService.getAllUserSetting();
        if (data != null) {
            let formValue = {} as IFormSettingShop_SaleInvoice;
            Object.entries(SETTING_NAME_FOR_USER.saleInvoice).forEach(
                ([formKey, valueKey]) => {
                    const findValue = data.find(
                        (x: ShopSettingDto) => x.name == valueKey
                    );
                    if (findValue?.value == 'true') {
                        formValue[formKey as PROP_SETTING_SHOP_SALE_INVOICE] = true;
                    } else if (findValue?.value == 'false') {
                        formValue[formKey as PROP_SETTING_SHOP_SALE_INVOICE] = false;
                    } else {
                        if (SETTING_NAME_FOR_USER.saleInvoice.shopBankAccountId == valueKey) {
                            formValue[formKey as PROP_SETTING_SHOP_SALE_INVOICE] = parseInt(findValue?.value ?? "")
                        } else {
                            formValue[formKey as PROP_SETTING_SHOP_SALE_INVOICE] = findValue?.value;
                        }
                    }
                }
            );
            this.setSettings(formValue);
        }
    }
}

export default InvoiceSettingStore;
