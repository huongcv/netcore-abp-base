import {
  GolfReasonPagedReq,
  OrdExportPaged,
  OrdColumnFilter,
  PagedResultDtoOfGolfReasonDto,
  GolfReasonDto,
  number,
  CommonResultDtoOfGolfReasonDto,
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

export class GolfReasonService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-reason/clear-cache';

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
      body?: GolfReasonPagedReq;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfGolfReasonDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-reason/get-paged';

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
  ): Promise<GolfReasonDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-reason/get-by-id/{findId}';
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
      body?: GolfReasonDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfReasonDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-reason/create-or-update';

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
  ): Promise<CommonResultDtoOfGolfReasonDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-reason/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
