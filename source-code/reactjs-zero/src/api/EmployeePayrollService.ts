import {
  EmployeePayrollGetPagedInputDto,
  OrdExportPaged,
  OrdColumnFilter,
  PagedResultDtoOfEmployeePayrollDto,
  EmployeePayrollDto,
  PAYROLL_STATUS,
  EmployeePayrollDetailDto,
  PAYROLL_DETAIL_STATUS,
  CommonResultDtoOfEmployeePayrollDto,
  CommonResultExtendDto,
  ValidateInputDto,
  number,
  string,
  CommonResultDtoOfBoolean,
  PayEmployeePayrollInputDto,
  PAYMENT_METHOD,
  PayEmployeeSalaryInputDto,
  InsuranceDetailDto,
  REASON_TYPE,
  EmployeeTimesheetDetailDto,
  TIMEKEEPING_STATUS,
  EmployeePayrollDetailPayslipDto,
  UpdateEmployeePayrollDetailDto,
  CommonResultDtoOfEmployeePayrollDetailDto,
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

export class EmployeePayrollService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: EmployeePayrollGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfEmployeePayrollDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-payroll/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createOrUpdate(
    params: {
      /** requestBody */
      body?: EmployeePayrollDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfEmployeePayrollDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-payroll/create-or-update';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static calculateSalary(
    params: {
      /**  */
      timesheetId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<EmployeePayrollDetailDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-payroll/calculate-salary/{timesheetId}';
      url = url.replace('{timesheetId}', params['timesheetId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static lockPayroll(
    params: {
      /**  */
      idHash?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-payroll/lock-payroll';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { idHash: params['idHash'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cancelPayroll(
    params: {
      /**  */
      idHash?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-payroll/cancel-payroll';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { idHash: params['idHash'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getById(
    params: {
      /**  */
      idHash?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<EmployeePayrollDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-payroll/get-by-id';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { idHash: params['idHash'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static remove(
    params: {
      /**  */
      removeId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfEmployeePayrollDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-payroll/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportPagedResult(
    params: {
      /** requestBody */
      body?: EmployeePayrollGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-payroll/export-paged-result';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportPayrollResult(
    params: {
      /**  */
      payrollId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-payroll/export-payroll-result/{payrollId}';
      url = url.replace('{payrollId}', params['payrollId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportPayrollDetailResult(
    params: {
      /**  */
      payrollDetailId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-payroll/export-payroll-detail-result/{payrollDetailId}';
      url = url.replace('{payrollDetailId}', params['payrollDetailId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportPayrollDetailByEmployeeResult(
    params: {
      /**  */
      payrollDetailId?: number;
      /**  */
      timesheetId?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-payroll/export-payroll-detail-by-employee-result';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { payrollDetailId: params['payrollDetailId'], timesheetId: params['timesheetId'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static payEmployeePayroll(
    params: {
      /** requestBody */
      body?: PayEmployeePayrollInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-payroll/pay-employee-payroll';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getListSalaryDetailForPayment(
    params: {
      /**  */
      payrollId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<EmployeePayrollDetailDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-payroll/get-list-salary-detail-for-payment/{payrollId}';
      url = url.replace('{payrollId}', params['payrollId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getListInsuranceDetailForPayment(
    params: {
      /**  */
      payrollId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<InsuranceDetailDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-payroll/get-list-insurance-detail-for-payment/{payrollId}';
      url = url.replace('{payrollId}', params['payrollId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getTimesheetByEmployee(
    params: {
      /**  */
      timesheetId?: number;
      /**  */
      employeeId?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<EmployeeTimesheetDetailDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-payroll/get-timesheet-by-employee';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { timesheetId: params['timesheetId'], employeeId: params['employeeId'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getAllowanceByEmployee(
    params: {
      /**  */
      payrollDetailId?: number;
      /**  */
      employeeId?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<EmployeePayrollDetailPayslipDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-payroll/get-allowance-by-employee';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { payrollDetailId: params['payrollDetailId'], employeeId: params['employeeId'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updatePayrollDetailByEmployee(
    params: {
      /** requestBody */
      body?: UpdateEmployeePayrollDetailDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfEmployeePayrollDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-payroll/update-payroll-detail-by-employee';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-payroll/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
