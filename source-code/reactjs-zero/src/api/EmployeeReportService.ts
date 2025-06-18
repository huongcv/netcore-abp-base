import {
    axios,
    basePath,
    EmployeeProductReportDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfEmployeeProductReportDto,
    PagedResultDtoOfEmployeeRevenueReportDetailDto,
    PagedResultDtoOfEmployeeRevenueReportDto,
    PagingCustomerRevenueReportDto
} from './index.defs';

export class EmployeeReportService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPagedEmployeeRevenue(
    params: {
      /** requestBody */
      body?: PagingCustomerRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfEmployeeRevenueReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-report/get-paged-employee-revenue';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getSumaryEmployeeRevenue(
    params: {
      /** requestBody */
      body?: PagingCustomerRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<EmployeeProductReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-report/get-sumary-employee-revenue';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportEmployeeReportRevenue(
    params: {
      /** requestBody */
      body?: PagingCustomerRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-report/export-employee-report-revenue';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagedEmployeeRevenueDetail(
    params: {
      /** requestBody */
      body?: PagingCustomerRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfEmployeeRevenueReportDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-report/get-paged-employee-revenue-detail';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportEmployeeReportRevenueDetail(
    params: {
      /** requestBody */
      body?: PagingCustomerRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-report/export-employee-report-revenue-detail';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagedEmployeeProduct(
    params: {
      /** requestBody */
      body?: PagingCustomerRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfEmployeeProductReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-report/get-paged-employee-product';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportCustomerReportProduct(
    params: {
      /** requestBody */
      body?: PagingCustomerRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-report/export-customer-report-product';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getSumaryEmployeeProduct(
    params: {
      /** requestBody */
      body?: PagingCustomerRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<EmployeeProductReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-report/get-sumary-employee-product';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
