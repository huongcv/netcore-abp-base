import {GolfProductGroupDto, ProductGroupDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {ProductGroupService} from "@api/ProductGroupService";
import { GolfProductGroupService } from "@api/GolfProductGroupService";

class GolfProductGroupStore extends CommonListStore<GolfProductGroupDto> {
    getNamespaceLocale(): string {
        return "golf-product-group"
    }

    apiService() {
        return GolfProductGroupService;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 600
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt', 'code', 'name', 'Notes', 'isActived']
    }

}

export default GolfProductGroupStore;
