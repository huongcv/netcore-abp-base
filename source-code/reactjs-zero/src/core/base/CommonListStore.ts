import { action, computed, makeObservable, observable } from "mobx";
import { FormInstance } from "antd";
import UiUtils from "@ord-core/utils/ui.utils";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";
import { l, LWithNs } from "@ord-core/language/lang.utils";
import FileSaver from "file-saver";
import type React from "react";
import { PagedResultDto } from "@ord-core/service-proxies/dto";

export interface ICreateOrUpdateModal<T = any> {
  visible?: boolean;
  entityData?: T | undefined | null;
  mode?: "addNew" | "update" | "viewDetail" |"copy";
  width: number | string;
  style?: React.CSSProperties;
}

export abstract class CommonListStore<TListItemDto = any, TCruDto = any> {
  constructor() {
    makeObservable(this, {
      searchFormRef: observable,
      searchDataState: observable,
      refreshDataState: observable,
      isAddNewEntity: observable,
      entityUpdateData: observable,
      createOrUpdateModal: observable,
      createOrUpdateEntitySaved: observable,
      removeRecord: observable,
      currentPageResult: observable,
      entityFormDisable: computed,
      setSearchFormRef: action,
      searchData: action,
      refreshGridData: action,
      openUpdateModal: action,
      openCreateModal: action,
      openViewDetailModal: action,
      closeModal: action,
      openRemoveById: action,
      closeRemoveById: action,
      exportExcelPagedResult: action,
      removeEntity: action,
      setPageResult: action,
    });
  }

  searchFormRef: FormInstance | undefined;
  searchDataState: any = {};
  refreshDataState = 0;
  createOrUpdateModal: ICreateOrUpdateModal<TCruDto> = {
    ...this.getInitModal(),
  };
  removeRecord: any = null;
  isAddNewEntity: boolean = true;
  entityUpdateData: any = null;
  createOrUpdateEntitySaved: any = null;
  currentPageResult: PagedResultDto<any> = {
    totalCount: 0,
    items: [],
  };
  disableFormSearch?: boolean;

  get entityFormDisable() {
    return this.createOrUpdateModal.mode === "viewDetail";
  }

  setSearchFormRef(searchFormRef: FormInstance) {
    this.searchFormRef = searchFormRef;
  }

  setPageResult(result: PagedResultDto<any>) {
    this.currentPageResult = {
      ...result,
    };
  }

  searchData(data: any) {
    this.searchDataState = { ...data };
  }

  async refreshGridData(mustPrePage = false) {
    this.refreshDataState = this.refreshDataState + 1;
    // đoạn này refresh lại top table nếu có contentTopTable active all unactive
    if (
      this.searchFormRef &&
      this.searchFormRef.getFieldValue("onSearchBeginning")
    ) {
      this.searchFormRef.setFieldsValue({
        onSearchBeginning:
          (this.searchFormRef.getFieldValue("onSearchBeginning") || 0) + 1,
      });
    }
  }

  openCreateModal(initData?: TCruDto) {
    this.isAddNewEntity = true;
    this.entityUpdateData = null;
    this.createOrUpdateModal.visible = true;
    this.createOrUpdateModal.entityData = initData;
    this.createOrUpdateModal.mode = "addNew";
  }

  openUpdateModal(entityData: any) {
    this.isAddNewEntity = false;
    this.entityUpdateData = entityData;
    this.createOrUpdateModal.visible = true;
    this.createOrUpdateModal.entityData = entityData;
    this.createOrUpdateModal.mode = "update";
  }
  openCopyModal(initData?: TCruDto) {
    this.isAddNewEntity = true;
    this.entityUpdateData = null;
    this.createOrUpdateModal.visible = true;
    this.createOrUpdateModal.entityData = initData;
    this.createOrUpdateModal.mode = "copy";
  }

  openViewDetailModal(entityData: any) {
    this.isAddNewEntity = false;
    this.entityUpdateData = entityData;
    this.createOrUpdateModal.visible = true;
    this.createOrUpdateModal.entityData = entityData;
    this.createOrUpdateModal.mode = "viewDetail";
  }

  closeModal(mustRefreshGridData: boolean = false) {
    this.createOrUpdateModal.visible = false;
    this.createOrUpdateModal.entityData = null;
    if (mustRefreshGridData) {
      this.refreshGridData().then();
    }
  }

  openRemoveByHashId(removeRecord: any, hashFieldName = "idHash") {
    this.removeRecord = {
      ...removeRecord,
      id: removeRecord[hashFieldName],
    };
  }
  openRemoveById(removeRecord: any) {
    this.removeRecord = {
      ...removeRecord,
    };
  }

  closeRemoveById() {
    this.removeRecord = null;
  }

  initFormValueWhenOpenModal(): any {
    return null;
  }

  async exportExcelPagedResult(param?: any) {
    UiUtils.setBusy();
    try {
      const prm = param || this.searchFormRef?.getFieldsValue() || {};
      const otherFieldArr = this.getOtherFields();
      const otherFieldObj: any = {};
      if (otherFieldArr) {
        otherFieldArr.forEach((it) => {
          otherFieldObj[it] = l.trans(
            this.getNamespaceLocale() + "." + it,
            null
          );
        });
      }
      const body = {
        ...prm,
        export: {
          title: l.trans(this.getNamespaceLocale() + ".fileExcel.Title", null),
          columnNames: this.getListColumnNameExcel().map((it) => {
            if (it.toLowerCase() === "stt") {
              return l.transCommon(it, null);
            }
            return l.trans(this.getNamespaceLocale() + "." + it, null);
          }),
          otherFields: otherFieldObj,
        },
      };
      const resultBlob = await this.exportPaged(body);
      const fileName = l.trans(
        this.getNamespaceLocale() + ".fileExcel.FileName",
        null
      );
      FileSaver.saveAs(resultBlob, fileName);
    } catch {
    } finally {
      UiUtils.clearBusy();
    }
  }

  async beforeSaveEntity(input: any, isAddNew: boolean) {
    return input;
  }

  afterSaveSuccessEntity() {}

  async createEntity(input: any) {
    return await this.createUpdateEntity(input, true);
  }

  async updateEntity(input: any) {
    return await this.createUpdateEntity(input, false);
  }

  private async createUpdateEntity(input: any, isAddNew: boolean) {
    const body = await this.beforeSaveEntity(input, isAddNew);
    const result = await this.apiService().createOrUpdate(
      {
        body: body,
      },
      {}
    );
    this.createOrUpdateEntitySaved = {
      ...body,
      ...result.data,
    };
    ServiceProxyUtils.notifyErrorResultApi(
      result,
      this.getNamespaceLocale(),
      input
    );
    if (result.isSuccessful) {
      this.afterSaveSuccessEntity();
    }
    return result.isSuccessful;
  }

  exportPaged(body: any): Promise<any> {
    if (!!this.apiService().exportPagedResult) {
      // @ts-ignore
      return this.apiService().exportPagedResult(
        {
          body: body,
        },
        {
          responseType: "blob",
        }
      );
    }
    return new Promise(() => {});
  }

  async removeEntity() {
    UiUtils.setBusy();
    try {
      const result = await this.apiService().remove(
        {
          removeId: this.removeRecord["id"] || null,
        },
        {}
      );
      if (result.isSuccessful) {
        UiUtils.showSuccess(
          l.trans(
            this.getNamespaceLocale() + ".removeSuccess",
            this.removeRecord
          )
        );
        await this.refreshGridData(true);
      } else {
        ServiceProxyUtils.notifyErrorResultApi(
          result,
          this.getNamespaceLocale(),
          this.removeRecord
        );
      }
    } catch {
    } finally {
      this.closeRemoveById();
      UiUtils.clearBusy();
    }
  }

  protected getOtherFields(): string[] {
    return [];
  }

  tran = new LWithNs(this.getNamespaceLocale());

  abstract getNamespaceLocale(): string;

  abstract apiService(): CommonCrudApi<TListItemDto>;

  abstract getInitModal(): ICreateOrUpdateModal<TCruDto>;

  abstract getListColumnNameExcel(): string[];
}
