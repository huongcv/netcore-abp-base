import {
  OrdGolfTeeTimeConfigPagedRequestDto,
  OrdExportPaged,
  OrdColumnFilter,
  PagedResultDtoOfGolfTeeTimeConfigDto,
  GolfTeeTimeConfigDto,
  TeetimeTypeEnum,
  ApplyDayModeEnum,
  TimeSpan,
  GolfTeeTimeConfigDetailDto,
  number,
  CommonResultDtoOfListOfGolfTeeTimeConfigDetailDto,
  CommonResultExtendDto,
  ValidateInputDto,
  CommonResultDtoOfGolfTeeTimeConfigDto,
  CommonResultDtoOfOrdGolfTeeTimeConfigPagedRequestDto,
  ComboOptionDto,
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

export class TeeTimeConfigService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: OrdGolfTeeTimeConfigPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfGolfTeeTimeConfigDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/tee-time-config/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getTeeTimeDetail(
    params: {
      /**  */
      teeTimeCofigId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfListOfGolfTeeTimeConfigDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/tee-time-config/get-tee-time-detail/{teeTimeCofigId}';
      url = url.replace('{teeTimeCofigId}', params['teeTimeCofigId'] + '');

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
  ): Promise<GolfTeeTimeConfigDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/tee-time-config/{id}/get-by-id';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getById1(
    params: {
      /**  */
      findId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<GolfTeeTimeConfigDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/tee-time-config/get-by-id/{findId}';
      url = url.replace('{findId}', params['findId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createOrUpdate(
    params: {
      /** requestBody */
      body?: GolfTeeTimeConfigDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfTeeTimeConfigDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/tee-time-config/create-or-update';

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
  ): Promise<CommonResultDtoOfOrdGolfTeeTimeConfigPagedRequestDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/tee-time-config/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/tee-time-config/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getGolfCourseComboOptions(options: IRequestOptions = {}): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/tee-time-config/get-golf-course-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
