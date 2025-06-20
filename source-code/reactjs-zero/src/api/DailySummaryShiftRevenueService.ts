import {
    axios,
    basePath,
    DailySummaryShiftRevenueOutputDto,
    DailySummaryShiftRevenuePagingInput,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfDailySummaryShiftRevenueOutputDto
} from './index.defs';

export class DailySummaryShiftRevenueService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: DailySummaryShiftRevenuePagingInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfDailySummaryShiftRevenueOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/daily-summary-shift-revenue/get-paged';

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
      body?: DailySummaryShiftRevenuePagingInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<DailySummaryShiftRevenueOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/daily-summary-shift-revenue/get-paged-summary';

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
      body?: DailySummaryShiftRevenuePagingInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/daily-summary-shift-revenue/export-excel';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
