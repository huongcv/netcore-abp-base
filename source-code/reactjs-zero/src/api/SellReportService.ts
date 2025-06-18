import {
  SellReportRevenuePagingInputDto,
  OrdExportPaged,
  OrdColumnFilter,
  DateRangeDto,
  ExtensiblePagedResultDtoOfSellReportProfitByBillOutputDto,
  SellReportProfitByBillOutputDto,
  ExtensiblePagedResultDtoOfSellReportProfitByMoneyOutputDto,
  SellReportProfitByMoneyOutputDto,
  ExtensiblePagedResultDtoOfSellReportProfitByProductOutputDto,
  SellReportProfitByProductOutputDto,
  PagedResultDtoOfSellReportRevenueOutputDto,
  SellReportRevenueOutputDto,
  SellReportRevenueDetailtPagingInputDto,
  PagedResultDtoOfSellReportRevenueDetailOutputDto,
  SellReportRevenueDetailOutputDto,
  SellReportRevenueDetailProductOutputDto,
  SellReportProductPagingInputDto,
  SellReportProductOutputDto,
  PagedResultDtoOfSellReportProductOutputDto,
  AccountMovePagingInputDto,
  ACCOUNT_MOVE_TYPE,
  PAYMENT_METHOD,
  MOVE_STATUS,
  PagedResultDtoOfAccountMoveDto,
  AccountMoveDto,
  REASON_TYPE,
  AccountMovePartnerTypeEnum,
  MOVE_TYPE,
  DebtInfo_DetailsDto,
  CommonResultDtoOfCashbookStatisticsOutputDto,
  CommonResultExtendDto,
  ValidateInputDto,
  CashbookStatisticsOutputDto,
  GetSaleInvoiceReportRequest,
  ExtensiblePagedResultDtoOfSaleInvoiceReportDto,
  SaleInvoiceReportDto,
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

export class SellReportService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPagingSellProfitInvoiceReport(
    params: {
      /** requestBody */
      body?: SellReportRevenuePagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ExtensiblePagedResultDtoOfSellReportProfitByBillOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/sale/get-paging-sell-profit-invoice-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportSellProfitByInvoiceReport(
    params: {
      /** requestBody */
      body?: SellReportRevenuePagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/sale/export-sell-profit-by-invoice-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagingProfitByTime(
    params: {
      /** requestBody */
      body?: SellReportRevenuePagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ExtensiblePagedResultDtoOfSellReportProfitByMoneyOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/sale/get-paging-profit-by-time';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportProfitByTime(
    params: {
      /** requestBody */
      body?: SellReportRevenuePagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/sale/export-profit-by-time';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagingSellProfitProductReport(
    params: {
      /** requestBody */
      body?: SellReportRevenuePagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ExtensiblePagedResultDtoOfSellReportProfitByProductOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/sale/get-paging-sell-profit-product-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportSellProfitProductReport(
    params: {
      /** requestBody */
      body?: SellReportRevenuePagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/sale/export-sell-profit-product-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagingSellRevenueReport(
    params: {
      /** requestBody */
      body?: SellReportRevenuePagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfSellReportRevenueOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/sale/get-paging-sell-revenue-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportSellRevenueReport(
    params: {
      /** requestBody */
      body?: SellReportRevenuePagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/sale/export-sell-revenue-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getSaleSummary(
    params: {
      /** requestBody */
      body?: SellReportRevenuePagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SellReportRevenueOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/sale/get-sale-summary';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagingSellRevenueReportDetail(
    params: {
      /** requestBody */
      body?: SellReportRevenueDetailtPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfSellReportRevenueDetailOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/sale/get-paging-sell-revenue-report-detail';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportSellRevenueReportDetail(
    params: {
      /** requestBody */
      body?: SellReportRevenueDetailtPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/sale/export-sell-revenue-report-detail';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getSummaryProductReport(
    params: {
      /** requestBody */
      body?: SellReportProductPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SellReportProductOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/sale/get-summary-product-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagingSellProductReport(
    params: {
      /** requestBody */
      body?: SellReportProductPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfSellReportProductOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/sale/get-paging-sell-product-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportSellProductReport(
    params: {
      /** requestBody */
      body?: SellReportProductPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/sale/export-sell-product-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagingSellIncomeReport(
    params: {
      /** requestBody */
      body?: AccountMovePagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfAccountMoveDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/sale/get-paging-sell-income-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getSummarySellIncomeReport(
    params: {
      /** requestBody */
      body?: AccountMovePagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfCashbookStatisticsOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/sale/get-summary-sell-income-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportSellIncomeReport(
    params: {
      /** requestBody */
      body?: AccountMovePagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/sale/export-sell-income-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getReportSaleInvoice(
    params: {
      /** requestBody */
      body?: GetSaleInvoiceReportRequest;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ExtensiblePagedResultDtoOfSaleInvoiceReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/sale/get-report-sale-invoice';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportExcelReportSaleInvoice(
    params: {
      /** requestBody */
      body?: GetSaleInvoiceReportRequest;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/sale/export-excel-report-sale-invoice';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
