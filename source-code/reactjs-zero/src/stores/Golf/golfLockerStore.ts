import { GolfCourseService } from "@api/GolfCourseService";
import { GolfLockerMaintenanceLogService } from "@api/GolfLockerMaintenanceLogService";
import { GolfLockerService } from "@api/GolfLockerService";
import { GolfLockerDto, GolfLockerPageDto } from "@api/index.defs";
import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";

class GolfLockerStore extends CommonListStore<GolfLockerDto> {
    getNamespaceLocale(): string {
        return 'golf-locker'
    }
    apiService() {
        return {
            getPaged: GolfLockerService.getPaged,
            remove: GolfLockerService.remove,
            createOrUpdate: GolfLockerService.createOrUpdate,
        };
    }
    apiCheckOutLocker(lockerId: number) {
        return GolfLockerService.checkedOutLocker({lockerId: lockerId})
    }
    apiCompleteMaintenanceLocker(lockerId: number) {
        return GolfLockerMaintenanceLogService.completeMaintenance({lockerId: lockerId})
    }
    getInitModal(): ICreateOrUpdateModal<any> {
        return {
            width: 600
        };
    }
    // async beforeSaveEntity(input: any, isAddNew: boolean): Promise<any> {
    //     return super.beforeSaveEntity(input, isAddNew);
    // }
    getListColumnNameExcel(): string[] {
        throw new Error("Method not implemented.");
    }
}
export default GolfLockerStore