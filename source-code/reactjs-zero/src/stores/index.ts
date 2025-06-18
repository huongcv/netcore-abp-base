import CashbookStore from "@ord-store/Accountant/cashbookStore";
import ReasonTypeStore from "@ord-store/Accountant/reasonTypeStore";
import DashboardStore from "@ord-store/Dashboard/dashboardStore";
import { logApiStorePart } from "@ord-store/LogApi";
import { partnerStorePart } from "@ord-store/Partner";
import { payrollStorePart } from "@ord-store/Payroll";
import { productStorePart } from "@ord-store/Product";
import { reportStorePart } from "@ord-store/Report";
import OrderStore from "@ord-store/Restaurant/orderStore";
import ReservationStore from "@ord-store/Restaurant/reservationStore";
import TableListStore from "@ord-store/Restaurant/tableListStore";
import { stockStorePart } from "@ord-store/Stock";
import { systemPart } from "@ord-store/System";
import TemplatePrinterStore from "@ord-store/TemplatePrinter/templatePrinterStore";
import { workShiftPart } from "@ord-store/WorkShift";
import RoleListStore from "@ord-store/admin/roleListStore";
import SettingListStore from "@ord-store/admin/settingListStore";
import TenantListStore from "@ord-store/admin/tenantListStore";
import UserHostListStore from "@ord-store/admin/userHostListStore";
import EntityModalStore from "@ord-store/entityModalStore";
import CountryStateStore from "@ord-store/masterData/contryStateStore";
import CountryStore from "@ord-store/masterData/contryStore";
import DistrictStore from "@ord-store/masterData/districtStore";
import PackageStore from "@ord-store/masterData/packageStore";
import ShopPackageRegistrationStore from "@ord-store/masterData/shopPackageRegistrationStore";
import ShopListStore from "@ord-store/masterData/shopStore";
import WardStore from "@ord-store/masterData/wardStore";
import NotificationStore from "@ord-store/notification/notificationStore";
import { saleInvoicePart } from "@ord-store/salesInvoice";
import SelectDataSourceStore from "@ord-store/selectDataSourceStore";
import UiStore from "@ord-store/uiStore";
import { createContext, useContext } from "react";
import { integrationStorePart } from "./Integration";
import { commonRestaurantStorePart } from "./Restaurant";
import HostRoleListStore from "./admin/hostRoleListStore";
import TenantRoleTemplateListStore from "./admin/tenantRoleTemplateListStore";
import BankAccountStore from "./masterData/bankAccountStore";
import ChannelStore from "./masterData/channelStore";
import DictionaryStore from "./masterData/dictionaryStore";
import SessionStore from "./sessionStore";
import UserSystemListStore from "./userSystemListStore";
import PaymentCentralBillingStore from "./Restaurant/paymentCentralBillingStore";
import PackageForTenantStore from "@ord-store/masterData/packageForTenantStore";
import { saleOrderPart } from "./saleOrder";

export const rootStore = {
  sessionStore: new SessionStore(),
  useHostListStore: new UserHostListStore(),
  userSystemListStore: new UserSystemListStore(),
  roleListStore: new RoleListStore(),
  hostRoleListStore: new HostRoleListStore(),
  tenantRoleTemplateListStore: new TenantRoleTemplateListStore(),
  settingStore: new SettingListStore(),
  tenantListStore: new TenantListStore(),
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
  reasonTypeStore: new ReasonTypeStore(),
  cashbook: new CashbookStore(),
  reservationStore: new ReservationStore(),
  paymentCentralBillingStore: new PaymentCentralBillingStore(),
  tableListStore: new TableListStore(),
  orderStore: new OrderStore(),
  ...partnerStorePart,
  ...productStorePart,
  ...stockStorePart,
  ...workShiftPart,
  ...systemPart,
  ...saleInvoicePart,
  ...saleOrderPart,
  ...logApiStorePart,
  ...payrollStorePart,
  dashboard: new DashboardStore(),
  templatePrinter: new TemplatePrinterStore(),
  packageStore: new PackageStore(),
  ...reportStorePart,
  notificationStore: new NotificationStore(),
  ...integrationStorePart,
  ...commonRestaurantStorePart,
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
