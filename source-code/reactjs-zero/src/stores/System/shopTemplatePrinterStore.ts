import { ShopTemplateDto } from "@api/index.defs";
import { ShopTemplatePrinterService } from "@api/ShopTemplatePrinterService";
import { ShopTemplateService } from "@api/ShopTemplateService";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import { CommonListStore, ICreateOrUpdateModal } from "@ord-core/base/CommonListStore";

class ShopTemplatePrinterStore extends CommonListStore<ShopTemplateDto, ShopTemplateDto> {
    getNamespaceLocale(): string {
        return "shop-template-printer"
    }

    apiService() {
        return {
            getPaged: ShopTemplatePrinterService.getListPaging,
            createOrUpdate: ShopTemplatePrinterService.cruShopTemplate,
            remove: (params, options) => {
                return ShopTemplateService.remove({
                    removeHashId: params.removeId
                }, options);
            },
        } as CommonCrudApi<ShopTemplateDto>;
    }

    getByHashId(hashId: string) {
        return ShopTemplateService.getById({
            hashId: hashId
        })
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 800
        };
    }

    getListColumnNameExcel(): string[] {
        return []
    }
}

export default ShopTemplatePrinterStore;
