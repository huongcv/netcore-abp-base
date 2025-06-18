import { AppExtendCode } from "@ord-core/AppConst";
import { PERMISSION_APP } from "@ord-core/config/permissions";
import { OrdRouterItem } from "@ord-core/model/ordRouter.model";
import { lazy } from "react";

const prefix = AppExtendCode.golf;
export const GolfHrRouter: OrdRouterItem[] = [
  {
    path: prefix + "/hr/payroll",
    lazyComponent: lazy(() => import("@pages/HumanResource/Payroll/index")),
    //   permission: PERMISSION_APP.human.employeePayroll
  },
  {
    path: prefix + "/hr/allowance",
    lazyComponent: lazy(() => import("@pages/HumanResource/Allowance/index")),
    //   permission: PERMISSION_APP.human.allowance
  },
  {
    path: prefix + "/hr/employee",
    lazyComponent: lazy(() => import("@pages/HumanResource/Employee/Index")),
    //   permission: PERMISSION_APP.human.employee
  },
  {
    path: prefix + "/hr/timekeeping",
    lazyComponent: lazy(
      () => import("@pages/HumanResource/EmployeeTimekeeping/index")
    ),
    //   permission: PERMISSION_APP.human.employeeTimekeeping
  },
  {
    path: prefix + "/hr/payroll/detail/:id",
    lazyComponent: lazy(() => import("@pages/HumanResource/Payroll/edit")),
    //permission: PERMISSION_APP.payroll.employeePayroll
    //isEmptyLayout: true
  },

  {
    path: prefix + "/hr/timesheet",
    lazyComponent: lazy(() => import("@pages/HumanResource/Timesheet/index")),
    //   permission: PERMISSION_APP.human.timesheet
  },
  {
    path: prefix + "/hr/work-calendar",
    lazyComponent: lazy(
      () => import("@pages/HumanResource/ShopWorkCalendar/shopWorkCalendarList")
    ),
    //    permission: PERMISSION_APP.human.workCalendar
  },
  {
    path: prefix + "/hr/caddy",
    lazyComponent: lazy(() => import("@pages/1.Golf/Category/GolfCaddy/index")),
  },
];
