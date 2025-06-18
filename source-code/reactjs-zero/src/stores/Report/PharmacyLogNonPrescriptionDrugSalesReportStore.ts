import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable} from "mobx";
import {PharmacyLogService} from "@api/PharmacyLogService";
import {
    IRequestOptions,
    PharmacyLogReportMedicationSalesOutputDto, PharmacyLogReportNonPrescriptionDrugSalesProductOutputDto,
} from "@api/index.defs";
import {PagedResultDto} from "@ord-core/service-proxies/dto";

export interface PharmacyLogReportNonPrescriptionDrugSalesFlatDto extends PharmacyLogReportNonPrescriptionDrugSalesProductOutputDto {

    invoiceCode?: string;
    /**  */
    invoiceDate?: Date;
    /**  */
    patientName?: string;

    rowSpan: number,
    order: number
}

class PharmacyLogNonPrescriptionDrugSalesReportStore extends CommonListStore<PharmacyLogReportNonPrescriptionDrugSalesFlatDto> {
    constructor() {
        super();
        makeObservable(this, {})
    }

    getNamespaceLocale(): string {
        return "report_pharmacyLogNonPrescriptionDrugSales"
    }

    apiService() {
        return {
            getPaged: this.fetchAndTransformDataPaging,
            exportPagedResult: PharmacyLogService.exportDataToExcelNonPrescriptionDrugSales
        } as CommonCrudApi<PharmacyLogReportNonPrescriptionDrugSalesFlatDto>;
    }

    private async fetchAndTransformDataPaging(params: { body: any }, options: IRequestOptions) {
        // Gọi phương thức để lấy dữ liệu
        const response = await PharmacyLogService.getDataPaggingNonPrescriptionDrugSales(params, options);
        // Biến đổi dữ liệu
        const items: PharmacyLogReportNonPrescriptionDrugSalesFlatDto[] = [];
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
            "fromDate", "toDate",
            "inventoryId",
            "moveCode", "moveDate",
            "productName",
            "basicUnitName",
            "invoiceCode","invoiceDate",
            "qty", "note", "strength", "activeIngredient"
        ]

    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: '70%'
        };
    }

}

export default PharmacyLogNonPrescriptionDrugSalesReportStore;
