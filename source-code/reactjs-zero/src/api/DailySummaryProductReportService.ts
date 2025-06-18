import {
  DailySummaryProductReportPagingInput,
  OrdExportPaged,
  OrdColumnFilter,
  PagedResultDtoOfDailySummaryProductReportOutputDto,
  DailySummaryProductReportOutputDto,
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

export class DailySummaryProductReportService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: DailySummaryProductReportPagingInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfDailySummaryProductReportOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/daily-summary-product-report/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagedSummary(
    params: {
      /** requestBody */
      body?: DailySummaryProductReportPagingInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<DailySummaryProductReportOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/daily-summary-product-report/get-paged-summary';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportExcel(
    params: {
      /** requestBody */
      body?: DailySummaryProductReportPagingInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/daily-summary-product-report/export-excel';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
