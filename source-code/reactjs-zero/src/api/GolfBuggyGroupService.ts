import {
  GolfBuggyGroupPageRequestDto,
  OrdExportPaged,
  OrdColumnFilter,
  PagedResultDtoOfGolfBuggyGroupDto,
  GolfBuggyGroupDto,
  number,
  CommonResultDtoOfGolfBuggyGroupDto,
  CommonResultExtendDto,
  ValidateInputDto,
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

export class GolfBuggyGroupService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-buggy-group/clear-cache';

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
      body?: GolfBuggyGroupPageRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfGolfBuggyGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-buggy-group/get-paged';

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
  ): Promise<GolfBuggyGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-buggy-group/get-by-id/{findId}';
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
      body?: GolfBuggyGroupDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfBuggyGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-buggy-group/create-or-update';

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
  ): Promise<CommonResultDtoOfGolfBuggyGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-buggy-group/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getComboOptions(options: IRequestOptions = {}): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-buggy-group/get-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
