import {
  PagingTaxLiabilityBookInputDto,
  OrdExportPaged,
  OrdColumnFilter,
  DateRangeDto,
  PagedTaxLiabilityBookResultDto,
  TaxLiabilityBookDetailDto,
  TaxLiabilityBookSummaryDto,
  TaxLiabilityGroupTypeDto,
  TaxLiabilitySubGroupTypeDto,
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

export class TaxLiabilityBookService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaging(
    params: {
      /** requestBody */
      body?: PagingTaxLiabilityBookInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedTaxLiabilityBookResultDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/business-house-hold/tax-liability/get-paging';

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
      body?: PagingTaxLiabilityBookInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<TaxLiabilityBookSummaryDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/business-house-hold/tax-liability/summary';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static taxLiabilityTypeGroup(options: IRequestOptions = {}): Promise<TaxLiabilityGroupTypeDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/business-house-hold/tax-liability/tax-liability-type-group';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportExcelTaxLiability(
    params: {
      /** requestBody */
      body?: PagingTaxLiabilityBookInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/business-house-hold/tax-liability/export-excel-tax-liability';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
