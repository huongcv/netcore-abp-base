import {
  StockReportCommodityExpiryPagingInputDto,
  OrdExportPaged,
  OrdColumnFilter,
  PagedResultDtoOfStockReportCommodityExpiryOutputDto,
  StockReportCommodityExpiryOutputDto,
  SummaryStockReportCommodityExpiryOutputDto,
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

export class StockExpiryReportService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaging(
    params: {
      /** requestBody */
      body?: StockReportCommodityExpiryPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfStockReportCommodityExpiryOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/stock-expiry/get-paging';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static summaryStockExpiry(
    params: {
      /** requestBody */
      body?: StockReportCommodityExpiryPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SummaryStockReportCommodityExpiryOutputDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/stock-expiry/summary-stock-expiry';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportReport(
    params: {
      /** requestBody */
      body?: StockReportCommodityExpiryPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/stock-expiry/export-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
