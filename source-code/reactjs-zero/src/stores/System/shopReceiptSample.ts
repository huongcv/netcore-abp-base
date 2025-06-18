import { ShopTemplateDto } from "@api/index.defs";
import { ShopTemplateService } from "@api/ShopTemplateService";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { l } from "@ord-core/language/lang.utils";
import FileSaver from "file-saver";

class ShopReceiptSampleStore extends CommonListStore<ShopTemplateDto> {
  getNamespaceLocale(): string {
    return "shopTemplate";
  }

  apiService() {
    return {
      getPaged: (params, options) => {
        return ShopTemplateService.getPaged(
          {
            ...params,
            body: {
              ...params.body,
              type: 2,
            },
          },
          options
        );
      },
      createOrUpdate: ShopTemplateService.createOrUpdate,
      remove: (params, options) => {
        return ShopTemplateService.remove(
          {
            removeHashId: params.removeId,
          },
          options
        );
      },
    } as CommonCrudApi<ShopTemplateDto>;
  }
  getByHashId(hashId: string) {
    return ShopTemplateService.getById({
      hashId: hashId,
    });
  }
  exportShopTemplateDetails(templateId: string, title: string) {
    ShopTemplateService.exportShopDetails(
      {
        body: {
          templateId: templateId,
          export: {
            title: title,
            columnNames: [
              l.trans(this.getNamespaceLocale() + ".stt", null),
              l.trans(this.getNamespaceLocale() + ".productCode", null),
              l.trans(this.getNamespaceLocale() + ".productName", null),
              l.trans(this.getNamespaceLocale() + ".qty", null),
              l.trans(this.getNamespaceLocale() + ".productUnitName", null),
            ],
          },
        },
      },
      {
        responseType: "blob",
      }
    ).then((res) => {
      const fileName = l.trans(
        this.getNamespaceLocale() + ".fileExcel.FileName",
        null
      );
      FileSaver.saveAs(res, fileName);
    });
  }

  getInitModal(): ICreateOrUpdateModal {
    return {
      width: 800,
    };
  }

  getListColumnNameExcel(): string[] {
    return ["stt", "GroupCode", "GroupName", "GroupType", "Notes", "Status"];
  }
}

export default ShopReceiptSampleStore;
