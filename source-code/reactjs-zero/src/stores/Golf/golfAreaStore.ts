import { GolfAreaService } from "@api/GolfAreaService";
import { GolfAreaDto } from "@api/index.defs";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";

class GolfAreaStore extends CommonListStore<GolfAreaDto> {
    getNamespaceLocale(): string {
        return 'golf-area'
    }
    apiService(): CommonCrudApi<GolfAreaDto> {
        return GolfAreaService
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
export default GolfAreaStore