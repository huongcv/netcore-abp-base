import {
    axios,
    basePath,
    CommonResultDtoOfFinancialReportOutputDto,
    ExportFinancialReportInputDto,
    FinancialReportInputDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions
} from './index.defs';

export class FinancialReportService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getDebtFinance(
    params: {
      /** requestBody */
      body?: FinancialReportInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfFinancialReportOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/financial/get-debt-finance';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportExcelFinancial(
    params: {
      /** requestBody */
      body?: ExportFinancialReportInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/financial/export-excel-financial';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
