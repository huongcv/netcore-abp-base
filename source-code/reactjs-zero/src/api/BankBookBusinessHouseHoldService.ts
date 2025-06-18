import {
  PagingBusinessHouseHoldBankBookInput,
  OrdExportPaged,
  OrdColumnFilter,
  DateRangeDto,
  PagedBankBookResultDto,
  BusinessHouseHoldBankBookDetailDto,
  BusinessHouseHoldBankBookDto,
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

export class BankBookBusinessHouseHoldService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaging(
    params: {
      /** requestBody */
      body?: PagingBusinessHouseHoldBankBookInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedBankBookResultDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/business-house-hold/bank-book/get-paging';

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
      body?: PagingBusinessHouseHoldBankBookInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<BusinessHouseHoldBankBookDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/business-house-hold/bank-book/summary';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportExcelBankbook(
    params: {
      /** requestBody */
      body?: PagingBusinessHouseHoldBankBookInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/business-house-hold/bank-book/export-excel-bankbook';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
