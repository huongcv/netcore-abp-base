import {
  GolfCartPageRequestDto,
  OrdExportPaged,
  OrdColumnFilter,
  BuggyCurrentStatusEnum,
  BuggyTypeEnum,
  PagedResultDtoOfGolfBuggyOutPutDto,
  GolfBuggyOutPutDto,
  BatteryTypeEnum,
  number,
  GolfBuggyDto,
  CommonResultDtoOfGolfBuggyDto,
  CommonResultExtendDto,
  ValidateInputDto,
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

export class GolfBuggyService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-buggy/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: GolfCartPageRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfGolfBuggyOutPutDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-buggy/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

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
      findId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<GolfBuggyDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-buggy/get-by-id/{findId}';
      url = url.replace('{findId}', params['findId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createOrUpdate(
    params: {
      /** requestBody */
      body?: GolfBuggyDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfBuggyDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-buggy/create-or-update';

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
  ): Promise<CommonResultDtoOfGolfBuggyDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-buggy/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
