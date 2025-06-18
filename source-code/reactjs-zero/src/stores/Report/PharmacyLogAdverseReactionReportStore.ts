import {
  InformationMedicineCausingADRModel,
  IRequestOptions,
  PharmacyAdverseReactionDto,
  SuspectedDrug,
} from "@api/index.defs";
import { PharmacyAdverseReactionService } from "@api/PharmacyAdverseReactionService";
import { CommonCrudApi } from "@ord-core/base/CommonCrudApi";
import {
  CommonListStore,
  ICreateOrUpdateModal,
} from "@ord-core/base/CommonListStore";
import { makeObservable } from "mobx";

class PharmacyLogAdverseReactionReportStore extends CommonListStore<PharmacyAdverseReactionDto> {
  constructor() {
    super();
    makeObservable(this, {});
  }
  getNamespaceLocale(): string {
    return "report_adverse_reaction";
  }
  apiService(): CommonCrudApi<PharmacyAdverseReactionDto> {
    return {
      getPaged: PharmacyAdverseReactionService.getPaged,
      createOrUpdate: (params, options: IRequestOptions) => {
        return PharmacyAdverseReactionService.createOrUpdate(params, options);
      },
      remove: PharmacyAdverseReactionService.remove,
      exportPagedResult: PharmacyAdverseReactionService.exportDataToExcel,
    } as CommonCrudApi<PharmacyAdverseReactionDto>;
  }
  apiServiceGetById(id: number) {
    return PharmacyAdverseReactionService.getById({ id });
  }
  apiServiceCreateOrUpdate(body: PharmacyAdverseReactionDto) {
    return PharmacyAdverseReactionService.createOrUpdate({ body });
  }
  getInitModal(): ICreateOrUpdateModal<any> {
    return {
      width: "70%",
    };
  }
  getListColumnNameExcel(): string[] {
    return [];
  }
  protected getOtherFields(): string[] {
    return [
      "order",
      "fromDate",
      "toDate",
      "createdTime",
      "reportName",
      "patientFullName",
      "patientNation",
      "patientAge",
      "patientGender",
      "reporterName",
    ];
  }

  initValueSuspectedDrug: SuspectedDrug = {
    drugName: "",
    concentration: "",
    singleDose: "",
    dosageFrequency: "",
    administrationRoute: "",
    treatmentStartDate: undefined,
    treatmentEndDate: undefined,
    batchNumber: "",
    expiryDate: "",
    manufacturer: "",
  };

  initValue: PharmacyAdverseReactionDto = {
    createdTime: new Date(),
    reportName: "",
    reportCodeUnit: "",
    reportCodeCenter: "",
    patientFullName: "",
    patientNation: "",
    patientWeight: 0,
    patientHeight: 0,
    patientGender: 1,
    patientAge: 1,
    dateStartReaction: undefined,
    descriptionReactAndComment: "",
    //informationMedicineCausingADRJson: "",
    medicineInfoSameTime: "",
    medicalHistory: "",
    handlePauseADR: undefined,
    handleUseOtherADR: undefined,
    resultHandleADR: undefined,
    commentDoctor: "",
    opinionMedicalUnitAppraisalADR: undefined,
    opinionExpertAppraisalADR: undefined,
    reviewBoardADR: "",
    reporterName: "",
    reporterLevel: "",
    reporterPhoneNumber: "",
    reporterNumberFax: "",
    reporterEmail: "",
    reporterSignature: "",
    reportType: 1,
    informationMedicineCausingADRModel: {
      suspectedDrugs: [this.initValueSuspectedDrug] as SuspectedDrug[],
      diagnosisAndTreatmentIndication: "",
      isDrugReused: undefined,
    } as InformationMedicineCausingADRModel,
  };

  formData = this.initValue;

  clearFormData() {
    this.formData = this.initValue;
  }
}
export default PharmacyLogAdverseReactionReportStore;
