import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {ProductGroupDto, ShopTemplateWithProductUnitDto} from "@api/index.defs";
import {action, makeObservable, observable} from "mobx";
import {ShopTemplateService} from "@api/ShopTemplateService";

class StockSearchProductFromShopTemplateStore extends CommonListStore<ProductGroupDto> {
    constructor() {
        super();
        makeObservable(this, {
            isModalOpen: observable,
        })
    }

    isModalOpen = false;


    showModal = () => {
        this.isModalOpen = true;
    };

    handleCancel() {
        this.isModalOpen = false;
    }


    getNamespaceLocale(): string {
        return "product"
    }

    apiService() {
        return {
            getPaged: (param: any) => {
                param.body.type = 2;
                param.body.IsActived = true;
                return ShopTemplateService.getPagedWithProductUnit(param);
            }
        } as any;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: 600
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt', 'code', 'name', 'OrderNumber', 'Type']
    }
}

export default StockSearchProductFromShopTemplateStore;
