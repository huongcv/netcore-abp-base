import {CommonListStore, ICreateOrUpdateModal} from "@ord-core/base/CommonListStore";
import {CommonCrudApi} from "@ord-core/base/CommonCrudApi";
import {makeObservable} from "mobx";
import {PharmacyLogService} from "@api/PharmacyLogService";
import {
    IRequestOptions,
    PharmacyLogReportMedicationSalesOutputDto,
    PharmacyLogReportPrescriptionDrugSalesProductOutputDto, PharmacyLogReportQualityInspectionOutputDto
} from "@api/index.defs";
import {PagedResultDto} from "@ord-core/service-proxies/dto";
import {ShopTemplateService} from "@api/ShopTemplateService";
import {l} from "@ord-core/language/lang.utils";
import FileSaver from "file-saver";
import UiUtils from "@ord-core/utils/ui.utils";


class PharmacyLogQualityInspectionReportStore extends CommonListStore<PharmacyLogReportQualityInspectionOutputDto> {
    constructor() {
        super();
        makeObservable(this, {})
    }

    getNamespaceLocale(): string {
        return "report_pharmacyLogQualityInspection"
    }

    apiService() {
        return {
            getPaged: PharmacyLogService.getDataPaggingQualityInspection,
            createOrUpdate: PharmacyLogService.cruQualityInspection,
            exportPagedResult: PharmacyLogService.exportDataToExcelQualityInspection,
            remove: PharmacyLogService.removeQualityInspectionByHashId
        } as CommonCrudApi<PharmacyLogReportQualityInspectionOutputDto>;
    }

    getByHashId(hashId: string) {
        return PharmacyLogService.getQualityInspectionByHashId({
            idHash: hashId
        })
    }

    checkDouble(input: PharmacyLogReportQualityInspectionOutputDto) {
        return PharmacyLogService.checkDoubleQualityInspection({
            body: input
        })
    }

    getListColumnNameExcel(): string[] {
        return [];
    }

    async exportDataItem(reportHashId: string) {
        try {
            UiUtils.setBusy();
            const otherField: string[] = [
                'inventoryId',
                'order', "productName", "unitName", "qty", "lotNumber", "expiryDate", "reason", "remarks", "actionPlan"
            ];
            const otherFieldObj: any = {};
            otherField.forEach((it) => {
                otherFieldObj[it] = l.trans(
                    this.getNamespaceLocale() + "." + it,
                    null
                );
            });

            const resultBlob = await PharmacyLogService.exportDataToExcelQualityInspectionReportItem({
                body: {
                    hashId: reportHashId,
                    export: {
                        title: l.trans(this.getNamespaceLocale() + ".fileExcel.Title", null),
                        otherFields: otherFieldObj
                    }
                }
            }, {
                responseType: "blob"
            })
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

export default PharmacyLogQualityInspectionReportStore;
