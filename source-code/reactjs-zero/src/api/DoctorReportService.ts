import {
    axios,
    basePath,
    DoctorProfitByBillReportDto,
    DoctorProfitByMoneyReportDto,
    DoctorProfitByProductReportDto,
    DoctorRevenueByBillReportDto,
    DoctorRevenueByMoneyReportDto,
    DoctorRevenueByProductReportDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfDoctorProfitByBillReportDto,
    PagedResultDtoOfDoctorProfitByMoneyReportDto,
    PagedResultDtoOfDoctorProfitByProductReportDto,
    PagedResultDtoOfDoctorRevenueByBillReportDto,
    PagedResultDtoOfDoctorRevenueByMoneyReportDto,
    PagedResultDtoOfDoctorRevenueByProductReportDto,
    PagingDoctorRevenueReportDto
} from './index.defs';

export class DoctorReportService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPagedDoctorRevenueByMoney(
    params: {
      /** requestBody */
      body?: PagingDoctorRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfDoctorRevenueByMoneyReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/doctor-report/get-paged-doctor-revenue-by-money';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDoctorRevenueSummaryByMoney(
    params: {
      /** requestBody */
      body?: PagingDoctorRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<DoctorRevenueByMoneyReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/doctor-report/get-doctor-revenue-summary-by-money';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportDoctorRevenueByMoneyReport(
    params: {
      /** requestBody */
      body?: PagingDoctorRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/doctor-report/export-doctor-revenue-by-money-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagedDoctorRevenueByBill(
    params: {
      /** requestBody */
      body?: PagingDoctorRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfDoctorRevenueByBillReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/doctor-report/get-paged-doctor-revenue-by-bill';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDoctorRevenueSummaryByBill(
    params: {
      /** requestBody */
      body?: PagingDoctorRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<DoctorRevenueByBillReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/doctor-report/get-doctor-revenue-summary-by-bill';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportDoctorRevenueByBillReport(
    params: {
      /** requestBody */
      body?: PagingDoctorRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/doctor-report/export-doctor-revenue-by-bill-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagedDoctorRevenueByProduct(
    params: {
      /** requestBody */
      body?: PagingDoctorRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfDoctorRevenueByProductReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/doctor-report/get-paged-doctor-revenue-by-product';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDoctorRevenueSummaryByProduct(
    params: {
      /** requestBody */
      body?: PagingDoctorRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<DoctorRevenueByProductReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/doctor-report/get-doctor-revenue-summary-by-product';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportDoctorRevenueByProductReport(
    params: {
      /** requestBody */
      body?: PagingDoctorRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/doctor-report/export-doctor-revenue-by-product-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagedDoctorProfitByMoney(
    params: {
      /** requestBody */
      body?: PagingDoctorRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfDoctorProfitByMoneyReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/doctor-report/get-paged-doctor-profit-by-money';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDoctorProfitSummaryByMoney(
    params: {
      /** requestBody */
      body?: PagingDoctorRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<DoctorProfitByMoneyReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/doctor-report/get-doctor-profit-summary-by-money';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportDoctorProfitByMoneyReport(
    params: {
      /** requestBody */
      body?: PagingDoctorRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/doctor-report/export-doctor-profit-by-money-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagedDoctorProfitByBill(
    params: {
      /** requestBody */
      body?: PagingDoctorRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfDoctorProfitByBillReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/doctor-report/get-paged-doctor-profit-by-bill';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDoctorProfitSummaryByBill(
    params: {
      /** requestBody */
      body?: PagingDoctorRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<DoctorProfitByBillReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/doctor-report/get-doctor-profit-summary-by-bill';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportDoctorProfitByBillReport(
    params: {
      /** requestBody */
      body?: PagingDoctorRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/doctor-report/export-doctor-profit-by-bill-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagedDoctorProfitByProduct(
    params: {
      /** requestBody */
      body?: PagingDoctorRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfDoctorProfitByProductReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/doctor-report/get-paged-doctor-profit-by-product';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDoctorProfitSummaryByProduct(
    params: {
      /** requestBody */
      body?: PagingDoctorRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<DoctorProfitByProductReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/doctor-report/get-doctor-profit-summary-by-product';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportDoctorProfitByProductReport(
    params: {
      /** requestBody */
      body?: PagingDoctorRevenueReportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/doctor-report/export-doctor-profit-by-product-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
