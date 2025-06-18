import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable} from "mobx";
import {PharmacyLogService} from "@api/PharmacyLogService";
import {
    IRequestOptions,
    PharmacyLogReportMedicationSalesOutputDto,
    PharmacyLogReportPrescriptionDrugSalesProductOutputDto
} from "@api/index.defs";
import {PagedResultDto} from "@ord-core/service-proxies/dto";

export interface PharmacyLogReportPrescriptionDrugSalesFlatDto extends PharmacyLogReportPrescriptionDrugSalesProductOutputDto {

    moveCode?: string;

    /**  */
    moveDate?: Date;

    /**  */
    prescriptionId?: string;

    /**  */
    prescribingDoctorName?: string;

    /**  */
    patientName?: string;

    /**  */
    dateIssued?: Date;

    /**  */
    address?: string;

    /**  */
    diagnosis?: string;

    /**  */
    medicalFacility?: string;


    rowSpan: number,
    order: number
}

class PharmacyLogPrescriptionDrugSalesReportStore extends CommonListStore<PharmacyLogReportPrescriptionDrugSalesFlatDto> {
    constructor() {
        super();
        makeObservable(this, {})
    }

    getNamespaceLocale(): string {
        return "report_pharmacyLogPrescriptionDrugSales"
    }

    apiService() {
        return {
            getPaged: this.fetchAndTransformDataPaging,
            exportPagedResult: PharmacyLogService.exportDataToExcelPrescriptionDrugSales
        } as CommonCrudApi<PharmacyLogReportPrescriptionDrugSalesFlatDto>;
    }

    private async fetchAndTransformDataPaging(params: { body: any }, options: IRequestOptions) {
        // Gọi phương thức để lấy dữ liệu
        const response = await PharmacyLogService.getDataPaggingPrescriptionDrugSales(params, options);
        // Biến đổi dữ liệu
        const items: PharmacyLogReportPrescriptionDrugSalesFlatDto[] = [];
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
            "moveCode", "moveDate", "dateIssued",
            "patientName",
            "prescribingDoctorName", "medicalFacility", "productName",
            "basicUnitName",
            "qty", "note", "strength", "activeIngredient"
        ]

    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: '70%'
        };
    }

}

export default PharmacyLogPrescriptionDrugSalesReportStore;
