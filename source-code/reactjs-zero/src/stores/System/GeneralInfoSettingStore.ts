import {action, makeObservable, observable} from "mobx";
import {SETTING_NAME_FOR_USER} from "@pages/System/ShopSetting/user-setting-name.const";
import {ShopSettingService} from "@api/ShopSettingService";
import {ShopSettingDto} from "@api/index.defs";
import {
    IFormSettingShop_General,
    PROP_SETTING_SHOP_General,
    SETTING_NAME_FOR_SHOP
} from "@pages/System/ShopSetting/setting-name.const";

class GeneralInfoSettingStore {
    settings: IFormSettingShop_General;
    loadingSetting : boolean = false;
    visibleSetting: boolean = false;

    constructor() {
        makeObservable(this, {
            visibleSetting: observable,
            loadingSetting: observable,
            settings: observable,
            setSettings: action,
            setVisibleSetting: action
        });
    }

    setVisibleSetting(value: boolean) {
        this.visibleSetting = value;
    }

    setSettings(settings: IFormSettingShop_General) {
        this.settings = settings;
    }

    async getSettingInfo() {
        if(this.settings){
            return;
        }
        this.loadingSetting = true;
        let data = await ShopSettingService.getGeneralInfo();
        if (data != null) {
            let formValue = {} as IFormSettingShop_General;
            Object.entries(SETTING_NAME_FOR_SHOP.general).forEach(
                ([formKey, valueKey]) => {
                    const findValue = data.find(
                        (x: ShopSettingDto) => x.name == valueKey
                    );
                    if (findValue?.value == 'true') {
                        formValue[formKey as PROP_SETTING_SHOP_General] = true;
                    } else if (findValue?.value == 'false') {
                        formValue[formKey as PROP_SETTING_SHOP_General] = false;
                    } else {
                        if (SETTING_NAME_FOR_USER.saleInvoice.shopBankAccountId == valueKey) {
                            formValue[formKey as PROP_SETTING_SHOP_General] = parseInt(findValue?.value ?? "")
                        } else {
                            formValue[formKey as PROP_SETTING_SHOP_General] = findValue?.value;
                        }
                    }
                }
            );
            this.setSettings(formValue);
        }
        this.loadingSetting = false;
    }
}

export default GeneralInfoSettingStore;
