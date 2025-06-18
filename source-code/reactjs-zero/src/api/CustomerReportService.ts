import {
  PagingCustomerRevenueReportDto,
  OrdExportPaged,
  OrdColumnFilter,
  DateRangeDto,
  PagedResultDtoOfCustomerRevenueReportDto,
  CustomerRevenueReportDto,
  PagedResultDtoOfCustomerRevenueReportDetailDto,
  CustomerRevenueReportDetailDto,
  PagedResultDtoOfCustomerDebtReportDto,
  CustomerDebtReportDto,
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

export class CustomerReportService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPagingCustomerRevenueReport(
    params: {
      /** requestBody */
      body?: PagingCustomerRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfCustomerRevenueReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/customer/get-paging-customer-revenue-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportCustomerRevenueReport(
    params: {
      /** requestBody */
      body?: PagingCustomerRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/customer/export-customer-revenue-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagingCustomerRevenueReportDetail(
    params: {
      /** requestBody */
      body?: PagingCustomerRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfCustomerRevenueReportDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/customer/get-paging-customer-revenue-report-detail';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportCustomerRevenueReportDetail(
    params: {
      /** requestBody */
      body?: PagingCustomerRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/customer/export-customer-revenue-report-detail';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getSummaryCustomerRevenue(
    params: {
      /** requestBody */
      body?: PagingCustomerRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CustomerRevenueReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/customer/get-summary-customer-revenue';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagingCustomerDebtReport(
    params: {
      /** requestBody */
      body?: PagingCustomerRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfCustomerDebtReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/customer/get-paging-customer-debt-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportCustomerDebtReport(
    params: {
      /** requestBody */
      body?: PagingCustomerRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/customer/export-customer-debt-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getSummaryCustomerDebt(
    params: {
      /** requestBody */
      body?: PagingCustomerRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CustomerDebtReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/customer/get-summary-customer-debt';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
