import { GolfAreaService } from "@api/GolfAreaService";
import { GolfLockerGroupService } from "@api/GolfLockerGroupService";
import { GolfAreaDto, GolfLockerGroupDto } from "@api/index.defs";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";

class GolfLockerGroupStore extends CommonListStore<GolfLockerGroupDto> {
    getNamespaceLocale(): string {
        return 'golf-locker-group'
    }
    apiService(): CommonCrudApi<GolfLockerGroupDto> {
        return GolfLockerGroupService
    }
    getInitModal(): ICreateOrUpdateModal<any> {
        return {
            width: 600
        }
    }
    getListColumnNameExcel(): string[] {
        throw new Error("Method not implemented.");
    }
}
export default GolfLockerGroupStore