import { OrdRouterItem } from "@ord-core/model/ordRouter.model";
import { lazy } from "react";
import { PERMISSION_APP } from "@ord-core/config/permissions";
import {AppExtendCode} from "@ord-core/AppConst";
const prefix = AppExtendCode.proShop;
export const PartnerRouter: OrdRouterItem[] = [
  {
    path: prefix+ "/partner/customer",
    lazyComponent: lazy(() => import("@pages/Customer/Index")),
    permission: PERMISSION_APP.customer.viewCustomerList,
  },
  {
    path: prefix +"/partner/customer/details/:partnerHashId",
    lazyComponent: lazy(() => import("@pages/Customer/CusDetails")),
    permission: PERMISSION_APP.customer.viewCustomerList,
  },
  {
    path: prefix +"/partner/customer/import-excel",
    lazyComponent: lazy(() => import("@pages/Customer/ImportExcel")),
    permission: PERMISSION_APP.customer.viewCustomerList,
  },

  {
    path: prefix + "/partner/customer-supplier",
    lazyComponent: lazy(() => import("@pages/Partner/CustomerSupplier/Index")),
    permission: PERMISSION_APP.stock.supplier,
  },
  {
    path: prefix +"/partner/customer-supplier/import-excel",
    lazyComponent: lazy(
      () => import("@pages/Partner/CustomerSupplier/ImportExcel/index")
    ),
    permission: PERMISSION_APP.stock.supplier,
  },
  {
    path: prefix +"/partner/customer-supplier/details/:partnerHashId",
    lazyComponent: lazy(
      () => import("@pages/Partner/CustomerSupplier/CusSupplierDetails")
    ),
    permission: PERMISSION_APP.stock.supplier,
  },

  {
    path: prefix +"/partner/doctor",
    lazyComponent: lazy(() => import("@pages/Partner/Doctor/Index")),
    permission: PERMISSION_APP.system.doctor,
  },
  {
    path: prefix +"/partner/doctor/import-excel",
    lazyComponent: lazy(
      () => import("@pages/Partner/Doctor/ImportExcel/index")
    ),
    permission: PERMISSION_APP.system.doctor,
  },
  {
    path: prefix +"/partner/doctor/details/:partnerHashId",
    lazyComponent: lazy(
      () => import("@pages/Partner/Doctor/ViewDoctorDetails")
    ),
    permission: PERMISSION_APP.system.doctor,
  },
  // excel
  {
    path: prefix +"/customer-group/import-excel",
    lazyComponent: lazy(
      () => import("@pages/Partner/CustomerGroup/ImportData")
    ),
  },
  {
    path: prefix +"/supplier-group/import-excel",
    lazyComponent: lazy(
      () => import("@pages/Partner/CustomerSupplierGroup/ImportData")
    ),
  },
  {
    path: prefix +"/doctor-group/import-excel",
    lazyComponent: lazy(
      () => import("@pages/Partner/DoctorGroup/ImportData")
    ),
  },
];
