import {
    axios,
    basePath,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfStockReportCommodityExpiryOutputDto,
    PagedResultDtoOfStockReportCommodityPlanOutputDto,
    StockDisposalReportPagingInputDto,
    StockDisposalReportPagingOutputDto,
    StockReportCommodityExpiryPagingInputDto,
    StockReportCommodityPlanPagingInputDto,
    StockReportImportExportInventoryInputDto,
    StockReportPageListImportExportInventoryOutputDto,
    SummaryStockReportCommodityExpiryOutputDto
} from './index.defs';

export class StockReportService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static transaction(
    params: {
      /** requestBody */
      body?: StockReportImportExportInventoryInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<StockReportPageListImportExportInventoryOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/inventory/transaction';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportTransaction(
    params: {
      /** requestBody */
      body?: StockReportImportExportInventoryInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/inventory/export-transaction';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPaging(
    params: {
      /** requestBody */
      body?: StockDisposalReportPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<StockDisposalReportPagingOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/stock-cancel-report/get-paging';

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
      body?: StockDisposalReportPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/stock-cancel-report/export-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPaging1(
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
  static exportReport1(
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
  /**
   *
   */
  static getPaging2(
    params: {
      /** requestBody */
      body?: StockReportCommodityPlanPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfStockReportCommodityPlanOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/commodityplanlist/get-paging';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportReport2(
    params: {
      /** requestBody */
      body?: StockReportCommodityPlanPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/commodityplanlist/export-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
