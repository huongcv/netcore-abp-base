import { EmployeePayrollService } from "@api/EmployeePayrollService";
import { EmployeePayrollDto } from "@api/index.defs";
import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";
import { makeObservable, observable } from "mobx";

class PayrollStore extends CommonListStore<EmployeePayrollDto, EmployeePayrollDto> {
    isOpenEmployeePayrollModal: boolean;
    constructor() {
        super();
        makeObservable(this, {
            isOpenEmployeePayrollModal: observable
        })
    }

    getNamespaceLocale(): string {
        return "payroll"
    }

    apiService() {
        return EmployeePayrollService;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: '30%'
        };
    }

    openEmployeePayrollModal(d: EmployeePayrollDto) {
        this.isOpenEmployeePayrollModal = true; 
        this.entityUpdateData = d;
    }

    closeEmployeePayrollModal() {
        this.isOpenEmployeePayrollModal = false; 
        this.entityUpdateData = false; 
    }

    getListColumnNameExcel(): string[] {
        return ['stt', 'employeeName', 'totalWorkDay', 'actualWorkDay', 'salaryAmount', 'actualSalaryAmount', 'allowanceAmount', 'totalSalaryAmount']
    }
}

export default PayrollStore;