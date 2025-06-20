import {
    axios,
    basePath,
    DailySummaryIncomeReportOutputDto,
    DailySummaryIncomeReportPagingInput,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfDailySummaryIncomeReportOutputDto,
    ShopWorkShiftDto
} from './index.defs';

export class DailySummaryIncomeReportService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: DailySummaryIncomeReportPagingInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfDailySummaryIncomeReportOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/daily-summary-income-report/get-paged';

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
      body?: DailySummaryIncomeReportPagingInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<DailySummaryIncomeReportOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/daily-summary-income-report/get-paged-summary';

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
      body?: DailySummaryIncomeReportPagingInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/daily-summary-income-report/export-excel';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getHandOverById(
    params: {
      /**  */
      workShiftId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ShopWorkShiftDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/daily-summary-income-report/get-hand-over-by-id/{workShiftId}';
      url = url.replace('{workShiftId}', params['workShiftId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
