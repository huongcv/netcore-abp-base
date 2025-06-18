import {ShopWorkCalendarDetailDto} from "@api/index.defs";
import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {ShopWorkCalendarDetailService} from "@api/ShopWorkCalendarDetailService";
import {makeObservable, observable, runInAction} from "mobx";
import {cloneDeep} from "lodash";

class  shopWorkCalendarDetailStore extends CommonListStore<ShopWorkCalendarDetailDto> {
    getNamespaceLocale(): string {
        return "shop-work-calendar";
    }
    isEditItem:boolean=false
    editItem:ShopWorkCalendarDetailDto
    dataList:ShopWorkCalendarDetailDto[]=[]
    constructor() {
        super();
        makeObservable(this, {
            dataList: observable,
            isEditItem:observable,
            editItem:observable
        });
    }

    async setItems  (items:ShopWorkCalendarDetailDto[]=[]) {
        runInAction(() => {

            this.dataList = items;
        })

    }
    async setItemSelected(items:ShopWorkCalendarDetailDto) {

        runInAction(() => {

            this.editItem = items;
        })
    }
    setIsEdit(isEdit:boolean=true){
        this.isEditItem=isEdit

    }


    apiService() {
        return ShopWorkCalendarDetailService;
    }
    changeItemInIndex(item:ShopWorkCalendarDetailDto, idx:number){
        const _data= cloneDeep(this.dataList);
        _data[idx]=item;
        this.dataList=_data;

    }
    async getPagedList(workCalendarId?:string){
        await ShopWorkCalendarDetailService.getPaged({
              body:{
                  workCalendarId:workCalendarId,
                  maxResultCount:999,
                  skipCount:0
              }
        })
                .then(x=>{
                    if(x){
                        this.setItems(x.items)
                    }})
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

export default shopWorkCalendarDetailStore;
