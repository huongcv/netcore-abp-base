import DashboardStore from "@ord-store/Dashboard/dashboardStore";
import RoleListStore from "@ord-store/admin/roleListStore";
import SettingListStore from "@ord-store/admin/settingListStore";
import EntityModalStore from "@ord-store/entityModalStore";
import CountryStateStore from "@ord-store/masterData/contryStateStore";
import CountryStore from "@ord-store/masterData/contryStore";
import DistrictStore from "@ord-store/masterData/districtStore";
import PackageStore from "@ord-store/masterData/packageStore";
import ShopPackageRegistrationStore from "@ord-store/masterData/shopPackageRegistrationStore";
import ShopListStore from "@ord-store/masterData/shopStore";
import WardStore from "@ord-store/masterData/wardStore";
import NotificationStore from "@ord-store/notification/notificationStore";
import SelectDataSourceStore from "@ord-store/selectDataSourceStore";
import UiStore from "@ord-store/uiStore";
import {createContext, useContext} from "react";
import HostRoleListStore from "./admin/hostRoleListStore";
import TenantRoleTemplateListStore from "./admin/tenantRoleTemplateListStore";
import BankAccountStore from "./masterData/bankAccountStore";
import ChannelStore from "./masterData/channelStore";
import DictionaryStore from "./masterData/dictionaryStore";
import SessionStore from "./sessionStore";
import UserSystemListStore from "./userSystemListStore";
import PackageForTenantStore from "@ord-store/masterData/packageForTenantStore";

export const rootStore = {
    sessionStore: new SessionStore(),
    userSystemListStore: new UserSystemListStore(),
    roleListStore: new RoleListStore(),
    hostRoleListStore: new HostRoleListStore(),
    tenantRoleTemplateListStore: new TenantRoleTemplateListStore(),
    settingStore: new SettingListStore(),
    countryStore: new CountryStore(),
    dictionaryStore: new DictionaryStore(),
    ChannelStore: new ChannelStore(),
    countryStateStore: new CountryStateStore(),
    districtStore: new DistrictStore(),
    wardStore: new WardStore(),
    bankAccountStore: new BankAccountStore(),

    uiStore: new UiStore(),
    selectDataSourceStore: new SelectDataSourceStore(),
    entityModalStore: new EntityModalStore(),
    shopListStore: new ShopListStore(),
    shopPackageRegistrationStore: new ShopPackageRegistrationStore(),
    packageForTenantStore: new PackageForTenantStore(),
    dashboard: new DashboardStore(),
    packageStore: new PackageStore(),
    notificationStore: new NotificationStore(),
};
export type TRootStore = typeof rootStore;
const RootStoreContext = createContext<null | TRootStore>(null);

// Tạo ra provider để cung cấp store cho toàn bộ app
// dung trong file index.ts.tsx
export const Provider = RootStoreContext.Provider;

/** tra lai store, chi dung o function component */
export function useStore() {
    /** store này sẽ chứa toàn bộ data */
    const store = useContext(RootStoreContext);
    if (store === null) {
        throw new Error("Store cannot be null, please add a context provider");
    }
    return store;
}
