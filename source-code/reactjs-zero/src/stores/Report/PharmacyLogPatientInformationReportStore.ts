import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable} from "mobx";
import {PharmacyLogService} from "@api/PharmacyLogService";
import {
    GENDER,
    IRequestOptions,
    PharmacyLogReportMedicationSalesOutputDto,
    PharmacyLogReportPatientInformationProductOutputDto
} from "@api/index.defs";
import {PagedResultDto} from "@ord-core/service-proxies/dto";

export interface PharmacyLogReportPatientInformationFlatDto extends PharmacyLogReportPatientInformationProductOutputDto {
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
    strAge?: string;

    /**  */
    address?: string;

    /**  */
    gender?: GENDER;

    /**  */
    diagnosis?: string;
    /**  */
    medicalFacility?: string;
    /**  */
    prescriptionName?: string;
    /**  */
    guardian?: string;
    /**  */
    genderStr?: string;
    rowSpan: number,
    order: number
}

class PharmacyLogPatientInformationReportStore extends CommonListStore<PharmacyLogReportPatientInformationFlatDto> {
    constructor() {
        super();
        makeObservable(this, {})
    }

    getNamespaceLocale(): string {
        return "report_pharmacyLogPatientInformation"
    }

    apiService() {
        return {
            getPaged: this.fetchAndTransformDataPaging,
            exportPagedResult: PharmacyLogService.exportDataToExcelPatientInformation
        } as CommonCrudApi<PharmacyLogReportPatientInformationFlatDto>;
    }

    private async fetchAndTransformDataPaging(params: { body: any }, options: IRequestOptions) {
        // Gọi phương thức để lấy dữ liệu
        const response = await PharmacyLogService.getDataPaggingPatientInformation(params, options);
        // Biến đổi dữ liệu
        const items: PharmacyLogReportPatientInformationFlatDto[] = [];
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
            "moveCode","moveDate","prescriptionId","dateIssued",
            "patientInfo","patientName","strAge","genderStr","address","guardian",
             "prescribingDoctorName","diagnosis","medicalFacility","productName","lotNumber",
             "basicUnitName",
            "qty", "note", "strength", "productName", "lotNumber", "expiryDate", "basicUnitName", "qtyImport", "qtyExport",
            "productExtendInfo","manufacturer",
            "registrationNumber"
        ]

    }

    getInitModal(): ICreateOrUpdateModal {
        return {
            width: '70%'
        };
    }

}

export default PharmacyLogPatientInformationReportStore;
