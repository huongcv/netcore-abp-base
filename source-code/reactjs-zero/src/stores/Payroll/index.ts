import PayrollStore from "@ord-store/Payroll/payrollStore";
import AllowanceStore from "@ord-store/Payroll/Allowance/AllowanceStore";
import PayrollDetailStore from "@ord-store/Payroll/payrollDetailStore";
import TimesheetStore from "@ord-store/Payroll/timesheetStore";
import EmployeeTimekeepingStore from "@ord-store/Payroll/employeeTimekeeping/employeeTimekeepingStore";
export const payrollStorePart = {
    payrollStore: new PayrollStore(),
    payrollDetailStore: new PayrollDetailStore(),
    AllowanceStore: new AllowanceStore(),
    EmployeeTimekeepingStore: new EmployeeTimekeepingStore(),
    timesheetStore: new TimesheetStore(),
}
