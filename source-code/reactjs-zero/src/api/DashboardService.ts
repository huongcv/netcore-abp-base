import {
  CommonResultDtoOfRevenueComparisonDto,
  CommonResultExtendDto,
  ValidateInputDto,
  RevenueComparisonDto,
  CommonResultDtoOfRevenueComparisonByMonthDto,
  RevenueComparisonByMonthDto,
  CommonResultDtoOfSaleInvoiceComparisonDto,
  SaleInvoiceComparisonDto,
  CommonResultDtoOfCustomerComparisonDto,
  CustomerComparisonDto,
  CommonResultDtoOfRevenueDataInMonthDto,
  RevenueDataInMonthDto,
  DataRevenueByDaysDto,
  CommonResultDtoOfSellReportDashboardDto,
  SellReportDashboardDto,
  ComparisonRevenueMonthDto,
  CommonResultDtoOfProductReportDashboard,
  ProductReportDashboard,
  GetTopSellByChanelRequest,
  TimeUnit,
  DateRangeDto,
  CommonResultDtoOfIEnumerableOfRevenueDataByChanelDto,
  RevenueDataByChanelDto,
  CHANNEL_TYPE,
  number,
  CommonResultDtoOfListOfProductHotSaleDto,
  ProductHotSaleDto,
  CommonResultDtoOfWarningExpiryProductDto,
  WarningExpiryProductDto,
  ListStatusProductInInventoryPaggingInputDto,
  OrdExportPaged,
  OrdColumnFilter,
  ProductInventoryStatus,
  PagedResultDtoOfDataWarningProductStatusDto,
  DataWarningProductStatusDto,
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

export class DashboardService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getRevenueByDays(options: IRequestOptions = {}): Promise<CommonResultDtoOfRevenueComparisonDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/dashboard/get-revenue-by-days';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getRevenueByMonths(options: IRequestOptions = {}): Promise<CommonResultDtoOfRevenueComparisonByMonthDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/dashboard/get-revenue-by-months';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getSaleInvoiceByDays(options: IRequestOptions = {}): Promise<CommonResultDtoOfSaleInvoiceComparisonDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/dashboard/get-sale-invoice-by-days';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getCustomerTotalPurchase(options: IRequestOptions = {}): Promise<CommonResultDtoOfCustomerComparisonDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/dashboard/get-customer-total-purchase';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDataRevenueInMonth(options: IRequestOptions = {}): Promise<CommonResultDtoOfRevenueDataInMonthDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/dashboard/get-data-revenue-in-month';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getSellReportDashboard(options: IRequestOptions = {}): Promise<CommonResultDtoOfSellReportDashboardDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/dashboard/get-sell-report-dashboard';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getProductReportDashboard(options: IRequestOptions = {}): Promise<CommonResultDtoOfProductReportDashboard> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/dashboard/get-product-report-dashboard';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDataRevenueByChanel(
    params: {
      /** requestBody */
      body?: GetTopSellByChanelRequest;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfIEnumerableOfRevenueDataByChanelDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/dashboard/get-data-revenue-by-chanel';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDataRevenueByChanelGroup(
    params: {
      /** requestBody */
      body?: GetTopSellByChanelRequest;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfIEnumerableOfRevenueDataByChanelDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/dashboard/get-data-revenue-by-chanel-group';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getListTopProductsHotSale(
    params: {
      /**  */
      limit?: number;
      /**  */
      timeUnitFilter?: TimeUnitFilterEnum;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfListOfProductHotSaleDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/dashboard/get-list-top-products-hot-sale';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { Limit: params['limit'], TimeUnitFilter: params['timeUnitFilter'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getWarningExpiryProduct(options: IRequestOptions = {}): Promise<CommonResultDtoOfWarningExpiryProductDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/dashboard/get-warning-expiry-product';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getListStatusProductInInventory(
    params: {
      /** requestBody */
      body?: ListStatusProductInInventoryPaggingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfDataWarningProductStatusDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/dashboard/get-list-status-product-in-inventory';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportProductOutOfStock(
    params: {
      /** requestBody */
      body?: ListStatusProductInInventoryPaggingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/dashboard/export-product-out-of-stock';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
