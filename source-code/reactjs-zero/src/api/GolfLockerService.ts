import {
  OrdGolfLockerPagedRequestDto,
  OrdExportPaged,
  OrdColumnFilter,
  GolfLockerStatusEnum,
  PagedResultDtoOfGolfLockerPageDto,
  GolfLockerPageDto,
  OrdPagedRequestDto,
  OrdGolfLockerHistoryPagedRequestDto,
  PagedResultDtoOfGolfLockerChangeHistoryDto,
  GolfLockerChangeHistoryDto,
  CommonResultDtoOfGolfLockerDto,
  CommonResultExtendDto,
  ValidateInputDto,
  GolfLockerDto,
  CommonResultDtoOfBoolean,
  number,
  CommonResultDtoOfGolfLockerBlockCodeDto,
  GolfLockerBlockCodeDto,
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

export class GolfLockerService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: OrdGolfLockerPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfGolfLockerPageDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-locker/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getListLockerByLockerGroupPublic(
    params: {
      /** requestBody */
      body?: OrdPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfGolfLockerPageDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-locker/get-list-locker-by-locker-group-public';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagedLockerHistory(
    params: {
      /** requestBody */
      body?: OrdGolfLockerHistoryPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfGolfLockerChangeHistoryDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-locker/get-paged-locker-history';

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
      body?: GolfLockerPageDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfLockerDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-locker/create-or-update';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static provideLockerForCustomer(
    params: {
      /** requestBody */
      body?: GolfLockerChangeHistoryDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-locker/provide-locker-for-customer';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static checkedOutLocker(
    params: {
      /**  */
      lockerId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-locker/checked-out-locker/{lockerId}';
      url = url.replace('{lockerId}', params['lockerId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static checkedOutLockerAssBooking(
    params: {
      /**  */
      lockerId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-locker/checked-out-locker-ass-booking/{lockerId}';
      url = url.replace('{lockerId}', params['lockerId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static checkedOutListLocker(
    params: {
      /** requestBody */
      body?: any | null[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-locker/checked-out-list-locker';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getInfoLockerBlockCode(
    params: {
      /**  */
      lockerId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfLockerBlockCodeDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-locker/get-info-locker-block-code/{lockerId}';
      url = url.replace('{lockerId}', params['lockerId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

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
  ): Promise<CommonResultDtoOfGolfLockerDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-locker/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getById(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<GolfLockerPageDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-locker/{id}/get-by-id';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getInfoLockerByBookingPlayerId(
    params: {
      /** requestBody */
      body?: any | null[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<GolfLockerChangeHistoryDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-locker/get-info-locker-by-booking-player-id';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
