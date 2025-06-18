import {
  OrdPagedRequestDto,
  OrdExportPaged,
  OrdColumnFilter,
  PagedResultDtoOfWardDto,
  WardDto,
  number,
  CommonResultDtoOfWardDto,
  CommonResultExtendDto,
  ValidateInputDto,
  string,
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

export class WardService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: OrdPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfWardDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/ward/get-paged';

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
  ): Promise<WardDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/ward/get-by-id/{findId}';
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
      body?: WardDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfWardDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/ward/create-or-update';

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
  ): Promise<CommonResultDtoOfWardDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/ward/remove/{removeId}';
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
      body?: OrdPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/ward/export-paged-result';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getComboOptions(
    params: {
      /**  */
      districtCode?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/ward/get-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { districtCode: params['districtCode'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/ward/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
