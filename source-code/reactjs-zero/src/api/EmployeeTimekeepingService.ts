import {
    axios,
    basePath,
    CommonResultDtoOfBoolean,
    CommonResultDtoOfEmployeeTimekeepingDto,
    CommonResultDtoOfShopWorkCalendarDetailDto,
    EmployeeTimekeepingDto,
    getConfigs,
    GetTimekeepingByEmployeeRequest,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfEmployeeTimekeepingDto,
    PagingEmployeeTimekeepingRequest,
    TIMEKEEPING_STATUS
} from './index.defs';

export class EmployeeTimekeepingService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: PagingEmployeeTimekeepingRequest;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfEmployeeTimekeepingDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-timekeeping/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static checkIn(
    params: {
      /**  */
      employeeId?: number;
      /**  */
      workDate?: string;
      /**  */
      checkIn?: string;
      /**  */
      checkOut?: string;
      /**  */
      status?: TIMEKEEPING_STATUS;
      /**  */
      isHalfDayOff?: boolean;
      /**  */
      lateInMinutes?: number;
      /**  */
      earlyOutMinutes?: number;
      /**  */
      authorizedLeave?: boolean;
      /**  */
      unAuthorizedLeave?: boolean;
      /**  */
      totalWorkDay?: number;
      /**  */
      employeeName?: string;
      /**  */
      signatureId?: string;
      /**  */
      listDayOfWeek?: string;
      /**  */
      workCalendarName?: string;
      /**  */
      id?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-timekeeping/check-in';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = {
        EmployeeId: params['employeeId'],
        WorkDate: params['workDate'],
        CheckIn: params['checkIn'],
        CheckOut: params['checkOut'],
        Status: params['status'],
        IsHalfDayOff: params['isHalfDayOff'],
        LateInMinutes: params['lateInMinutes'],
        EarlyOutMinutes: params['earlyOutMinutes'],
        AuthorizedLeave: params['authorizedLeave'],
        UnAuthorizedLeave: params['unAuthorizedLeave'],
        TotalWorkDay: params['totalWorkDay'],
        EmployeeName: params['employeeName'],
        SignatureId: params['signatureId'],
        ListDayOfWeek: params['listDayOfWeek'],
        WorkCalendarName: params['workCalendarName'],
        Id: params['id']
      };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static checkOut(
    params: {
      /**  */
      employeeId?: number;
      /**  */
      workDate?: string;
      /**  */
      checkIn?: string;
      /**  */
      checkOut?: string;
      /**  */
      status?: TIMEKEEPING_STATUS;
      /**  */
      isHalfDayOff?: boolean;
      /**  */
      lateInMinutes?: number;
      /**  */
      earlyOutMinutes?: number;
      /**  */
      authorizedLeave?: boolean;
      /**  */
      unAuthorizedLeave?: boolean;
      /**  */
      totalWorkDay?: number;
      /**  */
      employeeName?: string;
      /**  */
      signatureId?: string;
      /**  */
      listDayOfWeek?: string;
      /**  */
      workCalendarName?: string;
      /**  */
      id?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-timekeeping/check-out';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = {
        EmployeeId: params['employeeId'],
        WorkDate: params['workDate'],
        CheckIn: params['checkIn'],
        CheckOut: params['checkOut'],
        Status: params['status'],
        IsHalfDayOff: params['isHalfDayOff'],
        LateInMinutes: params['lateInMinutes'],
        EarlyOutMinutes: params['earlyOutMinutes'],
        AuthorizedLeave: params['authorizedLeave'],
        UnAuthorizedLeave: params['unAuthorizedLeave'],
        TotalWorkDay: params['totalWorkDay'],
        EmployeeName: params['employeeName'],
        SignatureId: params['signatureId'],
        ListDayOfWeek: params['listDayOfWeek'],
        WorkCalendarName: params['workCalendarName'],
        Id: params['id']
      };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getTimekeepingToday(options: IRequestOptions = {}): Promise<CommonResultDtoOfEmployeeTimekeepingDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-timekeeping/get-timekeeping-today';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getWorkCalendarByEmployeeId(
    params: {
      /** requestBody */
      body?: GetTimekeepingByEmployeeRequest;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfShopWorkCalendarDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-timekeeping/get-work-calendar-by-employee-id';

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
      body?: EmployeeTimekeepingDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfEmployeeTimekeepingDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-timekeeping/create-or-update';

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
  ): Promise<CommonResultDtoOfEmployeeTimekeepingDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-timekeeping/remove/{removeId}';
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
      body?: PagingEmployeeTimekeepingRequest;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/employee-timekeeping/export-paged-result';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
