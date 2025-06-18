import {ShopWorkShiftDto} from "@api/index.defs";
import {ShopWorkShiftService} from "@api/ShopWorkShiftService";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";

class ShopWorkShiftStore extends CommonListStore<ShopWorkShiftDto, ShopWorkShiftDto> {
    getNamespaceLocale(): string {
        return "work-shift";
    }

    apiService() {
        return ShopWorkShiftService;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: '800px',
            style: {
                top: '10px'
            }
        };
    }
    checkAndOpenModal() {
        ShopWorkShiftService.checkAvairableWorkShift().then((res) => {
            if (res.isSuccessful) {
                this.openCreateModal(res.data);
            }else{
                ServiceProxyUtils.notifyErrorResultApi(res, this.getNamespaceLocale(), res.data);
                // this.openCreateModal();
            }
        })
    }

    getListColumnNameExcel(): string[] {
        return ['stt', 'code', 'name', 'OrderNumber', 'Type']
    }

    async beforeSaveEntity(input: any, isAddNew: boolean): Promise<any> {
        input.name = "CLV" + input.closingEmployeeId;
        return super.beforeSaveEntity(input, isAddNew);
    }
}

export default ShopWorkShiftStore;
