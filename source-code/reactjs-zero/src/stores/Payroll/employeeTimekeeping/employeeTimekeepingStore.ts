import { EmployeeTimekeepingDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {EmployeeTimekeepingService} from "@api/EmployeeTimekeepingService";
import {makeObservable, observable, runInAction} from "mobx";

class EmployeeTimekeepingStore extends CommonListStore<EmployeeTimekeepingDto> {
    getNamespaceLocale(): string {
        return "employeeTimekeeping"
    }

    summaryData:EmployeeTimekeepingDto
    constructor() {
        super();
        makeObservable(this, {
            summaryData: observable
        })
    }
    apiService() {
        return EmployeeTimekeepingService ;
    }
    //
    // async getTimekeeping(){
    //     EmployeeTimekeepingService.getTimekeepingToday().then(res => {
    //         runInAction(()=>{
    //             this.summaryData = res.data ?? {};
    //         })
    //
    //     })
    // }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: '700px',
            style: {
                top: '10px'
            }
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt', 'employeeName', 'workDate', 'checkIn', 'late', 'checkOut', 'early', 'status']
    }

    async beforeSaveEntity(input: any, isAddNew: boolean): Promise<any> {
        return super.beforeSaveEntity(input, isAddNew);
    }
}

export default EmployeeTimekeepingStore;
