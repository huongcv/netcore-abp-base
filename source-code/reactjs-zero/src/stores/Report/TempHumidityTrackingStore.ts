import { IRequestOptions, ShopWeatherDataDto } from "@api/index.defs";
import { WeatherDataService } from "@api/WeatherDataService";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import SelectDataSourceStore from "@ord-store/selectDataSourceStore";
import { action, makeObservable, observable } from "mobx";
import UiUtils from "@ord-core/utils/ui.utils";
import { l } from "@ord-core/language/lang.utils";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";

class TempHumidityTrackingStore extends CommonListStore<ShopWeatherDataDto> {
  responseItemsByMeasureDate: ShopWeatherDataDto[] = [];

  constructor() {
    super();
    makeObservable(this, {
      responseItemsByMeasureDate: observable,
      measureDateParamsDto: observable,
      // openRemoveByDate: action,
      removeEntityByMeasureDate: action,
    });
  }

  measureDateParamsDto: any = null;

  apiService() {
    return WeatherDataService;
  }
  getNamespaceLocale(): string {
    return "tracking";
  }
  getInitModal(): ICreateOrUpdateModal<any> {
    return {
      width: "1500px",
      style: {
        top: "10px",
      },
    };
  }
  getListColumnNameExcel(): string[] {
    throw new Error("Method not implemented.");
  }

  // removeByDate(dto: any) {
  //   return WeatherDataService.removeByDate({ body: dto });
  // }
  // openRemoveByDate(measureDateDto: any) {
  //   this.measureDateParamsDto = { ...measureDateDto };
  //   console.log("Bên store: ", measureDateDto);
  // }

  async removeEntityByMeasureDate(dto: any) {
    UiUtils.setBusy();
    try {
      const result = await this.apiService().removeByDate(
        {
          body: dto,
        },
        {}
      );

      if (result.isSuccessful) {
        UiUtils.showSuccess(
          l.trans(
            this.getNamespaceLocale() + ".removeSuccess",
            this.measureDateParamsDto
          )
        );
        await this.refreshGridData(true);
      } else {
        ServiceProxyUtils.notifyErrorResultApi(
          result,
          this.getNamespaceLocale(),
          this.measureDateParamsDto
        );
      }
    } catch {
    } finally {
      this.closeRemoveById();
      UiUtils.clearBusy();
    }
  }

  listItems: ShopWeatherDataDto;
  selectDataSourceStore: SelectDataSourceStore;
}
export default TempHumidityTrackingStore;
