import {
    axios,
    basePath,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfSupplierDebtReportDto,
    PagedResultDtoOfSupplierProductReportDto,
    PagingCustomerRevenueReportDto,
    PagingReportDto,
    SupplierDebtReportDto,
    SupplierProductReportDto
} from './index.defs';

export class SupplierReportService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPagingSupplierRevenueReport(
    params: {
      /** requestBody */
      body?: PagingReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfSupplierProductReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/supplier/get-paging-supplier-revenue-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportSupplierRevenueReport(
    params: {
      /** requestBody */
      body?: PagingReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/supplier/export-supplier-revenue-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getSummarySupplierRevenueReport(
    params: {
      /** requestBody */
      body?: PagingReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SupplierProductReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/supplier/get-summary-supplier-revenue-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagingSupplierProductReport(
    params: {
      /** requestBody */
      body?: PagingReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfSupplierProductReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/supplier/get-paging-supplier-product-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportSupplierProductReport(
    params: {
      /** requestBody */
      body?: PagingReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/supplier/export-supplier-product-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagingSupplierDebtReport(
    params: {
      /** requestBody */
      body?: PagingReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfSupplierDebtReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/supplier/get-paging-supplier-debt-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportSupplierDebtReport(
    params: {
      /** requestBody */
      body?: PagingReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/supplier/export-supplier-debt-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getSummarySupplierDebtReport(
    params: {
      /** requestBody */
      body?: PagingCustomerRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SupplierDebtReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/supplier/get-summary-supplier-debt-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
