import {OrdRouterItem} from "@ord-core/model/ordRouter.model";
import {lazy} from "react";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import {AppExtendCode} from "@ord-core/AppConst";

export const HumanResourceRouter: OrdRouterItem[] = [

    {
        path: AppExtendCode.proShop +'/human-resource/payroll',
        lazyComponent: lazy(() => import('@pages/HumanResource/Payroll/index')),
        permission: PERMISSION_APP.human.employeePayroll
    },
    {
        path: AppExtendCode.proShop +'/human-resource/allowance',
        lazyComponent: lazy(() => import('@pages/HumanResource/Allowance/index')),
        permission: PERMISSION_APP.human.allowance
    },
    {
        path: AppExtendCode.proShop +'/human-resource/employee',
        lazyComponent: lazy(() => import('@pages/HumanResource/Employee/Index')),
        permission: PERMISSION_APP.human.employee
    },
    {
        path: AppExtendCode.proShop +'/human-resource/timekeeping',
        lazyComponent: lazy(() => import('@pages/HumanResource/EmployeeTimekeeping/index')),
        permission: PERMISSION_APP.human.employeeTimekeeping
    },
    {
        path: AppExtendCode.proShop +'/human-resource/payroll/detail/:id',
        lazyComponent: lazy(() => import('@pages/HumanResource/Payroll/edit')),
        //permission: PERMISSION_APP.payroll.employeePayroll
        //isEmptyLayout: true
    },

    {
        path: AppExtendCode.proShop +'/human-resource/timesheet',
        lazyComponent: lazy(() => import('@pages/HumanResource/Timesheet/index')),
        permission: PERMISSION_APP.human.timesheet
    },
    {
        path: AppExtendCode.proShop +'/human-resource/timesheet/:id',
        lazyComponent: lazy(() => import('@pages/HumanResource/Timesheet/Form/TimesheetDetailForm')),
        permission: PERMISSION_APP.human.timesheet
    },
    {
        path: AppExtendCode.proShop +'/human-resource/work-calendar',
        lazyComponent: lazy(() => import('@pages/HumanResource/ShopWorkCalendar/shopWorkCalendarList')),
         permission: PERMISSION_APP.human.workCalendar
    }
]
