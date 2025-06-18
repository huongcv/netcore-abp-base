import {
  PagingBusinessHouseHoldCashBookInput,
  OrdExportPaged,
  OrdColumnFilter,
  DateRangeDto,
  PagedCashBookResultDto,
  BusinessHouseHoldCashBookDetailDto,
  BusinessHouseHoldCashBookDto,
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

export class CashBookBusinessHouseHoldService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaging(
    params: {
      /** requestBody */
      body?: PagingBusinessHouseHoldCashBookInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedCashBookResultDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/business-house-hold/cash-book/get-paging';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static summary(
    params: {
      /** requestBody */
      body?: PagingBusinessHouseHoldCashBookInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<BusinessHouseHoldCashBookDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/business-house-hold/cash-book/summary';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportExcelCashbook(
    params: {
      /** requestBody */
      body?: PagingBusinessHouseHoldCashBookInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/business-house-hold/cash-book/export-excel-cashbook';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
