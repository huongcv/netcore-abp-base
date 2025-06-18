import {ShopWorkCalendarDto} from "@api/index.defs";
import {ShopWorkShiftService} from "@api/ShopWorkShiftService";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {ShopWorkCalendarService} from "@api/ShopWorkCalendarService";
import {makeObservable, observable} from "mobx";

class  shopWorkCalendarStore extends CommonListStore<ShopWorkCalendarDto> {
    getNamespaceLocale(): string {
        return "shop-work-calendar";
    }

    isShowCreateModal: boolean = false;
    itemSelected:ShopWorkCalendarDto|undefined=undefined;
    isShowDetailModal: boolean = false;
    constructor() {
        super();
        makeObservable(this, {
            isShowCreateModal: observable
        });
      
        makeObservable(this, {
            itemSelected: observable
        }) ;
        makeObservable(this, {
            isShowDetailModal: observable
        })
    }

    setIsShowCreateModal(isShow: boolean) {
        this.isShowCreateModal = isShow;
        this.createOrUpdateModal.mode = "addNew";
    }

    setIsShowUpdateModal(entityData: any) {
        this.isShowCreateModal = true;
        this.entityUpdateData = entityData;
        this.createOrUpdateModal.mode = "update";
    }

    setIsShowDetailModal(isShow: boolean) {
        this.isShowDetailModal = isShow;
    }
    setItemSelected(item?: ShopWorkCalendarDto) {
        if(item){
            this.itemSelected = item;
        }
        else{
            this.itemSelected=undefined
        }

    }

    apiService() {
        return ShopWorkCalendarService;
    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: '800px',
            style: {
                top: '10px'
            }
        };
    }

    getListColumnNameExcel(): string[] {
        return ['stt', 'code', 'name', 'OrderNumber', 'Type']
    }

    async beforeSaveEntity(input: any, isAddNew: boolean): Promise<any> {
        // input.name = "CLV" + input.closingEmployeeId;
        return super.beforeSaveEntity(input, isAddNew);
    }
}

export default shopWorkCalendarStore;
