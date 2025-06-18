import {
  PagingPharmacyLogReportMedicationSalesReportDto,
  OrdExportPaged,
  OrdColumnFilter,
  DateRangeDto,
  PagedResultDtoOfPharmacyLogReportMedicationSalesOutputDto,
  PharmacyLogReportMedicationSalesOutputDto,
  PharmacyLogReportMedicationSalesProductOutputDto,
  PharmacyLogReportDrugStockInOutInputDto,
  PharmacyLogReportPageListDrugStockInOutOutputDto,
  PharmacyLogReportDrugStockInOutOutputDto,
  PagingPharmacyLogtExpirationDateTrackingReportDto,
  PagedResultDtoOfPharmacyLogReportExpirationDateTrackingOutputDto,
  PharmacyLogReportExpirationDateTrackingOutputDto,
  PagingPharmacyLogReportPatientInformationReportDto,
  PagedResultDtoOfPharmacyLogReportPatientInformationOutputDto,
  PharmacyLogReportPatientInformationOutputDto,
  GENDER,
  PharmacyLogReportPatientInformationProductOutputDto,
  PagingPharmacyLogReportPrescriptionDrugSalesReportDto,
  PagedResultDtoOfPharmacyLogReportPrescriptionDrugSalesOutputDto,
  PharmacyLogReportPrescriptionDrugSalesOutputDto,
  PharmacyLogReportPrescriptionDrugSalesProductOutputDto,
  PagingPharmacyLogReportNonPrescriptionDrugSalesReportDto,
  PagedResultDtoOfPharmacyLogReportNonPrescriptionDrugSalesOutputDto,
  PharmacyLogReportNonPrescriptionDrugSalesOutputDto,
  PharmacyLogReportNonPrescriptionDrugSalesProductOutputDto,
  PagingPharmacyLogReportQualityInspectionReportDto,
  PagedResultDtoOfPharmacyLogReportQualityInspectionOutputDto,
  PharmacyLogReportQualityInspectionOutputDto,
  TimeTypeEnum,
  PharmacyLogReportQualityInspectionProductOutputDto,
  CommonResultDtoOfInt64,
  CommonResultExtendDto,
  ValidateInputDto,
  string,
  CommonResultDtoOfPharmacyLogReportQualityInspectionOutputDto,
  QualityInspectionReportItemInputDto,
  PharmacyLogReportControlledDrugStockInputDto,
  PharmacyLogReportPageListControlledDrugStockOutputDto,
  PharmacyLogReportControlledDrugStockOutputDto,
  PharmacyLogReportControlledDrugLossInputDto,
  PagedResultDtoOfPharmacyLogReportControlledDrugLossOutputDto,
  PharmacyLogReportControlledDrugLossOutputDto,
  IList,
  List,
  IListResult,
  ListResultDto,
  IPagedResult,
  PagedResultDto,
  Dictionary,
  IDictionary,
  IRequestOptions,
  IRequestConfig,
  getConfigs,
  axios,
  basePath
} from './index.defs';

export class PharmacyLogService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getDataPaggingMedicationSales(
    params: {
      /** requestBody */
      body?: PagingPharmacyLogReportMedicationSalesReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfPharmacyLogReportMedicationSalesOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/get-data-pagging-medication-sales';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportDataToExcelMedicationSales(
    params: {
      /** requestBody */
      body?: PagingPharmacyLogReportMedicationSalesReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/export-data-to-excel-medication-sales';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDataPaggingDrugStockInOut(
    params: {
      /** requestBody */
      body?: PharmacyLogReportDrugStockInOutInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PharmacyLogReportPageListDrugStockInOutOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/get-data-pagging-drug-stock-in-out';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportDataToExcelDrugStockInOut(
    params: {
      /** requestBody */
      body?: PharmacyLogReportDrugStockInOutInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/export-data-to-excel-drug-stock-in-out';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDataPaggingExpirationDateTracking(
    params: {
      /** requestBody */
      body?: PagingPharmacyLogtExpirationDateTrackingReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfPharmacyLogReportExpirationDateTrackingOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/get-data-pagging-expiration-date-tracking';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportDataToExcelExpirationDateTracking(
    params: {
      /** requestBody */
      body?: PagingPharmacyLogtExpirationDateTrackingReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/export-data-to-excel-expiration-date-tracking';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDataPaggingPatientInformation(
    params: {
      /** requestBody */
      body?: PagingPharmacyLogReportPatientInformationReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfPharmacyLogReportPatientInformationOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/get-data-pagging-patient-information';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportDataToExcelPatientInformation(
    params: {
      /** requestBody */
      body?: PagingPharmacyLogReportPatientInformationReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/export-data-to-excel-patient-information';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDataPaggingPrescriptionDrugSales(
    params: {
      /** requestBody */
      body?: PagingPharmacyLogReportPrescriptionDrugSalesReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfPharmacyLogReportPrescriptionDrugSalesOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/get-data-pagging-prescription-drug-sales';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportDataToExcelPrescriptionDrugSales(
    params: {
      /** requestBody */
      body?: PagingPharmacyLogReportPrescriptionDrugSalesReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/export-data-to-excel-prescription-drug-sales';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDataPaggingNonPrescriptionDrugSales(
    params: {
      /** requestBody */
      body?: PagingPharmacyLogReportNonPrescriptionDrugSalesReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfPharmacyLogReportNonPrescriptionDrugSalesOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/get-data-pagging-non-prescription-drug-sales';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportDataToExcelNonPrescriptionDrugSales(
    params: {
      /** requestBody */
      body?: PagingPharmacyLogReportNonPrescriptionDrugSalesReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/export-data-to-excel-non-prescription-drug-sales';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDataPaggingQualityInspection(
    params: {
      /** requestBody */
      body?: PagingPharmacyLogReportQualityInspectionReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfPharmacyLogReportQualityInspectionOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/get-data-pagging-quality-inspection';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportDataToExcelQualityInspection(
    params: {
      /** requestBody */
      body?: PagingPharmacyLogReportQualityInspectionReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/export-data-to-excel-quality-inspection';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cruQualityInspection(
    params: {
      /** requestBody */
      body?: PharmacyLogReportQualityInspectionOutputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfInt64> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/cru-quality-inspection';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getQualityInspectionByHashId(
    params: {
      /**  */
      idHash?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPharmacyLogReportQualityInspectionOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/get-quality-inspection-by-hash-id';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { idHash: params['idHash'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static checkDoubleQualityInspection(
    params: {
      /** requestBody */
      body?: PharmacyLogReportQualityInspectionOutputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfInt64> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/check-double-quality-inspection';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static removeQualityInspectionByHashId(
    params: {
      /**  */
      removeId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/remove-quality-inspection-by-hash-id/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportDataToExcelQualityInspectionReportItem(
    params: {
      /** requestBody */
      body?: QualityInspectionReportItemInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/export-data-to-excel-quality-inspection-report-item';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDataPaggingControlledDrugStock(
    params: {
      /** requestBody */
      body?: PharmacyLogReportControlledDrugStockInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PharmacyLogReportPageListControlledDrugStockOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/get-data-pagging-controlled-drug-stock';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportDataToExcelControlledDrugStock(
    params: {
      /** requestBody */
      body?: PharmacyLogReportControlledDrugStockInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/export-data-to-excel-controlled-drug-stock';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDataPaggingControlledDrugLoss(
    params: {
      /** requestBody */
      body?: PharmacyLogReportControlledDrugLossInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfPharmacyLogReportControlledDrugLossOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/get-data-pagging-controlled-drug-loss';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportDataToExcelControlledDrugLoss(
    params: {
      /** requestBody */
      body?: PharmacyLogReportControlledDrugLossInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-log/export-data-to-excel-controlled-drug-loss';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
