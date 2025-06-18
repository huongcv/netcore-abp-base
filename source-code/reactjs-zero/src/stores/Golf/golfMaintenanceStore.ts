import { GolfAreaService } from "@api/GolfAreaService";
import { GolfCourseMaintenanceLogService } from "@api/GolfCourseMaintenanceLogService";
import { GolfAreaDto, GolfCourseMaintenanceLogDto } from "@api/index.defs";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";

class GolfMaintenanceStore extends CommonListStore<GolfCourseMaintenanceLogDto> {
    getNamespaceLocale(): string {
        return 'golf-course'
    }
    apiService(): CommonCrudApi<GolfCourseMaintenanceLogDto> {
        return GolfCourseMaintenanceLogService as any
    }
    getInitModal(): ICreateOrUpdateModal<any> {
        return {
            width: 800
        }
    }
    getListColumnNameExcel(): string[] {
        throw new Error("Method not implemented.");
    }
}
export default GolfMaintenanceStore