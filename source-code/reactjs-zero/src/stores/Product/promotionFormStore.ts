import {
  ApplyDaysDto,
  CreateSalesPromotionDto,
  DeserializeSalesPromotionDto,
  GiftItemDto,
  ProductInventoryAvailableDto,
  PromotionDetailDto,
  TimeRange,
  VoucherDto,
} from "@api/index.defs";
import { action, makeObservable, observable } from "mobx";
import { ShopSalesPromotionService } from "@api/ShopSalesPromotionService";
import { TYPE_PROMOTION } from "@pages/ProductManagement/SalesPromotion/Enums/TypePromotionDetail";
import { ProductService } from "@api/ProductService";

class PromotionFormStore {
  productInventoryAvailableDto: ProductInventoryAvailableDto[] = [];

  initGiftItemDto: GiftItemDto = {
    code: "",
    name: "",
    quantity: 1,
  };
  initVoucherDto: VoucherDto = {
    code: "",
    name: "",
    quantity: 1,
  };
  initPromotionDetailDto: PromotionDetailDto = {
    condition: {
      totalAmountFrom: 0,
      productId: "",
      quantityFrom: 1,
    },
    type: 1,
    value: {
      amount: 0,
      unit: "VND",
      giftItems: [],
      voucherList: [],
    },
  };
  initHours: TimeRange[] = [
    {
      startTime: "00:01:00",
      endTime: "23:59:00",
    } as TimeRange,
  ];
  initValue: CreateSalesPromotionDto = {
    id: 0,
    name: "",
    code: "",
    description: "",
    isActived: true,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    promotionType: 2,
    details: [this.initPromotionDetailDto] as PromotionDetailDto[],
    applyDaysDto: {
      daysOfWeek: [],
      months: [],
      hours: this.initHours,
      daysOfMonth: [],
      specificDates: [],
    } as ApplyDaysDto,
  };

  formData = this.initValue;
  startDateTemp = this.initValue.startDate;
  endDateTemp = this.initValue.endDate;
  constructor() {
    makeObservable(this, {
      startDateTemp: observable,
      endDateTemp: observable,
      productInventoryAvailableDto: observable,
      getProductInStore: action,
      setStartDate: action,
      setEndDate: action,
    });
  }

  setStartDate(date: Date) {
    this.startDateTemp = date;
  }

  setEndDate(date: Date) {
    this.endDateTemp = date;
  }

  async extendCreateOrUpdateSalesPromotion() {
    try {
      const result = await ShopSalesPromotionService.createOrUpdate({
        body: this.formData,
      });
      return result;
    } catch {
    } finally {
    }
  }
  async getSalesPromotionById(id: number) {
    try {
      const response = await ShopSalesPromotionService.getById({
        id: id,
      });
      this.mapApiDataToFormData(response);
      //console.log(response);
    } catch {
    } finally {
    }
  }
  mapApiDataToFormData(apiData: DeserializeSalesPromotionDto) {
    this.formData = {
      id: apiData.id,
      name: apiData.name,
      code: apiData.code,
      description: apiData.description,
      isActived: apiData.isActived,
      startDate: apiData.startDate,
      endDate: apiData.endDate,
      promotionType:
        apiData.deserializePromotionJson?.promotionType ===
        TYPE_PROMOTION[2].toLowerCase()
          ? 2
          : 1,
      details: apiData.deserializePromotionJson?.details,
      applyDaysDto: {
        ...apiData.deserializeApplyDays,
        // hours: apiData.deserializeApplyDays?.hours?.map((hour: any) => ({
        //   startTime: { ticks: hour.startTime },
        //   endTime: { ticks: hour.endTime },
        // })),
      },
    };
  }
  updateFormData(updatedData: Partial<CreateSalesPromotionDto>) {
    this.formData = {
      ...updatedData,
    };
  }
  clearFormData() {
    this.formData = this.initValue;
  }
  async getProductInventoryAvailableDto() {
    try {
      const res = await ProductService.getProductInventoryAvailable();
      this.productInventoryAvailableDto = [...res];
    } catch {}
  }
  getProductInStore(id: string) {
    if (this.productInventoryAvailableDto.length > 0) {
      return this.productInventoryAvailableDto.find((p) => p.id == id);
    }
    return undefined;
  }
}
export default PromotionFormStore;
