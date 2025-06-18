import { GolfLockerService } from "@api/GolfLockerService";
import { GolfLockerChangeHistoryDto } from "@api/index.defs";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";

class GolfLockerHistoryStore extends CommonListStore<GolfLockerChangeHistoryDto>{
    getNamespaceLocale(): string {
        return "";
    }
    apiService() {
        return {
            getPaged: GolfLockerService.getPagedLockerHistory
        } as any
    }
    getInitModal(): ICreateOrUpdateModal<GolfLockerChangeHistoryDto> {
         return {
            width: 800
        };
    }
    getListColumnNameExcel(): string[] {
        throw new Error("Method not implemented.");
    }
}
export default GolfLockerHistoryStore