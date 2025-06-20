import {
    axios,
    basePath,
    EmployeeSalaryPaymentBookSummaryDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedEmployeeSalaryResultDto,
    PagingEmployeeSalaryPaymentBookInput
} from './index.defs';

export class EmployeeSalaryPaymentBookService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaging(
    params: {
      /** requestBody */
      body?: PagingEmployeeSalaryPaymentBookInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedEmployeeSalaryResultDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/business-house-hold/employee-salary-payment-book/get-paging';

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
      body?: PagingEmployeeSalaryPaymentBookInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<EmployeeSalaryPaymentBookSummaryDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/business-house-hold/employee-salary-payment-book/summary';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportExcelSalary(
    params: {
      /** requestBody */
      body?: PagingEmployeeSalaryPaymentBookInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/business-house-hold/employee-salary-payment-book/export-excel-salary';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
