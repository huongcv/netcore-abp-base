import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable} from "mobx";
import {PharmacyLogService} from "@api/PharmacyLogService";
import {
    IRequestOptions,
    PharmacyLogReportMedicationSalesOutputDto,
    PharmacyLogReportMedicationSalesProductOutputDto
} from "@api/index.defs";
import {PagedResultDto} from "@ord-core/service-proxies/dto";

export interface PharmacyLogReportMedicationSalesFlatDto extends PharmacyLogReportMedicationSalesProductOutputDto {
    moveDate?: Date;
    moveCode?: string;
    partnerName?: string;
    rowSpan: number,
    order: number
}

class PharmacyLogMedicationSalesReportStore extends CommonListStore<PharmacyLogReportMedicationSalesFlatDto> {
    constructor() {
        super();
        makeObservable(this, {})
    }

    getNamespaceLocale(): string {
        return "report_pharmacyLogMedicationSales"
    }

    apiService() {
        return {
            getPaged: this.fetchAndTransformDataPaging,
            exportPagedResult: PharmacyLogService.exportDataToExcelMedicationSales
        } as CommonCrudApi<PharmacyLogReportMedicationSalesFlatDto>;
    }

    private async fetchAndTransformDataPaging(params: { body: any }, options: IRequestOptions) {
        console.log("params", params)
        // Gọi phương thức để lấy dữ liệu
        const response = await PharmacyLogService.getDataPaggingMedicationSales(params, options);
        // Biến đổi dữ liệu
        const items: PharmacyLogReportMedicationSalesFlatDto[] = [];
        response.items?.forEach((item, index) => {
            item.items?.forEach((item2, idx) => {
                const tp = {
                    ...item,
                    ...item2,
                    order: (params.body.skipCount ?? 0) + index + 1,
                    rowSpan: idx == 0 ? (item.items?.length ?? 1) : 0,
                };
                delete tp['items'];
                items.push(tp)
            })

        })
        return {
            totalCount: response.totalCount,
            items: items
        } as PagedResultDto<PharmacyLogReportMedicationSalesOutputDto>
    }


    getListColumnNameExcel(): string[] {
        return [];
    }

    protected getOtherFields(): string[] {
        return [
            'order',
            "fromDate","toDate",
            "inventoryId",
            "productName", "basicUnitName",
            "moveDate","moveCode","partnerName","productName","lotNumber","expiryDate","basicUnitName","qtyImport","qtyExport",
            "productExtendInfo",
            "registrationNumber", "activeIngredient","strength","packagingSpecifications","manufacturer","countryOfOrigin"
        ]

    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: '70%'
        };
    }

}

export default PharmacyLogMedicationSalesReportStore;
