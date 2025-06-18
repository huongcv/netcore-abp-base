import { EmployeePayrollService } from "@api/EmployeePayrollService";
import { EmployeePayrollDetailDto } from "@api/index.defs";
import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";
import { makeObservable, observable } from "mobx";

class PayrollDetailStore extends CommonListStore<EmployeePayrollDetailDto, EmployeePayrollDetailDto> {
    isOpenPaySalaryModal: boolean;
    constructor() {
        super();
        makeObservable(this, {
            isOpenPaySalaryModal: observable
        })
    }

    getNamespaceLocale(): string {
        return "payroll_detail"
    }

    openPaySalaryModal(d: EmployeePayrollDetailDto) {
        this.isOpenPaySalaryModal = true; 
        this.entityUpdateData = d; 
    }

    closePaySalaryModal() {
        this.isOpenPaySalaryModal = false; 
        this.entityUpdateData = null; 
    }

    apiService() {
        return EmployeePayrollService;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 1200
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt', 'employeeName', 'totalWorkDay', 'actualWorkDay', 'salaryAmount', 'actualSalaryAmount', 'allowanceAmount', 'totalSalaryAmount']
    }
}

export default PayrollDetailStore;