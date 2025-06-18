import { GolfAreaService } from "@api/GolfAreaService";
import { GolfProductService } from "@api/GolfProductService";
import { GolfAreaDto, GolfProductDto } from "@api/index.defs";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";

class GolfServicesStore extends CommonListStore<GolfProductDto> {
    getNamespaceLocale(): string {
        return 'golf-service-product'
    }
    apiService(): CommonCrudApi<GolfProductDto> {
        return GolfProductService as any
    }
    getInitModal(): ICreateOrUpdateModal<any> {
        return {
            width: 900
        }
    }
    getListColumnNameExcel(): string[] {
        throw new Error("Method not implemented.");
    }
}
export default GolfServicesStore