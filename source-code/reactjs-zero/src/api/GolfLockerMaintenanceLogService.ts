import {
  OrdGolfLockerHistoryPagedRequestDto,
  OrdExportPaged,
  OrdColumnFilter,
  PagedResultDtoOfGolfLockerMaintenanceLogDto,
  GolfLockerMaintenanceLogDto,
  CommonResultDtoOfGolfLockerMaintenanceLogDto,
  CommonResultExtendDto,
  ValidateInputDto,
  number,
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

export class GolfLockerMaintenanceLogService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPagedLockerHistory(
    params: {
      /** requestBody */
      body?: OrdGolfLockerHistoryPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfGolfLockerMaintenanceLogDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-locker-maintenance-log/get-paged-locker-history';

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
      body?: GolfLockerMaintenanceLogDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfLockerMaintenanceLogDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-locker-maintenance-log/create-or-update';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getLogByLockerId(
    params: {
      /**  */
      lockerId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<GolfLockerMaintenanceLogDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-locker-maintenance-log/get-log-by-locker-id/{lockerId}';
      url = url.replace('{lockerId}', params['lockerId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static completeMaintenance(
    params: {
      /**  */
      lockerId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfLockerMaintenanceLogDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-locker-maintenance-log/complete-maintenance/{lockerId}';
      url = url.replace('{lockerId}', params['lockerId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
