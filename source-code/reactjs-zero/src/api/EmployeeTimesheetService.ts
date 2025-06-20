import {
    axios,
    basePath,
    ComboOptionDto,
    CommonResultDtoOfEmployeeTimesheetDetailSummaryDto,
    CommonResultDtoOfEmployeeTimesheetDto,
    EmployeeTimesheetDetailSummaryDto,
    EmployeeTimesheetDto,
    EmployeeTimesheetGetPagedInputDto,
    EmployeeTimesheetStatusDto,
    getConfigs,
    InitEmployeeTimesheetFromTimekeepingInput,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfEmployeeTimesheetDto
} from './index.defs';

export class EmployeeTimesheetService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: EmployeeTimesheetGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfEmployeeTimesheetDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-timesheet/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getCount(
    params: {
      /** requestBody */
      body?: EmployeeTimesheetGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<EmployeeTimesheetStatusDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-timesheet/get-count';

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
      body?: EmployeeTimesheetDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfEmployeeTimesheetDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-timesheet/create-or-update';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateEmployeeTimesheetDetail(
    params: {
      /** requestBody */
      body?: EmployeeTimesheetDetailSummaryDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfEmployeeTimesheetDetailSummaryDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-timesheet/update-employee-timesheet-detail';

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

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
  ): Promise<EmployeeTimesheetDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-timesheet/get-by-id';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { idHash: params['idHash'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static calculateTimesheetFromTimekeeping(
    params: {
      /** requestBody */
      body?: InitEmployeeTimesheetFromTimekeepingInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<EmployeeTimesheetDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-timesheet/calculate-timesheet-from-timekeeping';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static remove(
    params: {
      /**  */
      removeId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfEmployeeTimesheetDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-timesheet/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static approveTimeSheet(
    params: {
      /**  */
      employeeTimeSheetId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfEmployeeTimesheetDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-timesheet/approve-time-sheet/{employeeTimeSheetId}';
      url = url.replace('{employeeTimeSheetId}', params['employeeTimeSheetId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cancelTimeSheet(
    params: {
      /**  */
      employeeTimeSheetId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfEmployeeTimesheetDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-timesheet/cancel-time-sheet/{employeeTimeSheetId}';
      url = url.replace('{employeeTimeSheetId}', params['employeeTimeSheetId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getComboOptions(options: IRequestOptions = {}): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-timesheet/get-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-timesheet/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
