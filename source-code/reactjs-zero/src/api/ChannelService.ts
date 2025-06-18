import {
  OrdPagedRequestDto,
  OrdExportPaged,
  OrdColumnFilter,
  PagedResultDtoOfChannelDto,
  ChannelDto,
  CHANNEL_TYPE,
  CommonResultDtoOfChannelDto,
  CommonResultExtendDto,
  ValidateInputDto,
  ComboOptionDto,
  CommonResultDtoOfInt64,
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

export class ChannelService {
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
  ): Promise<PagedResultDtoOfChannelDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/channel/get-paged';

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
  ): Promise<ChannelDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/channel/get-by-id/{findId}';
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
      body?: ChannelDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfChannelDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/channel/create-or-update';

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
  ): Promise<CommonResultDtoOfChannelDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/channel/remove/{removeId}';
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
      let url = basePath + '/api/pos/channel/export-paged-result';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getComboOptions(options: IRequestOptions = {}): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/channel/get-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getChannelDefault(options: IRequestOptions = {}): Promise<CommonResultDtoOfInt64> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/channel/get-channel-default';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/channel/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
