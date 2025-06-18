import {
    axios,
    basePath,
    CommonResultDtoOfLogApiDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    LogApiDto,
    OrdPagedRequestDto,
    PagedResultDtoOfLogApiDto,
    PagingLogApiOfInvoiceRequest
} from './index.defs';

export class LogApiService {
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
  ): Promise<PagedResultDtoOfLogApiDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/log-api/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagedLogApiOfInvoice(
    params: {
      /** requestBody */
      body?: PagingLogApiOfInvoiceRequest;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfLogApiDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/log-api/get-paged-log-api-of-invoice';

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
  ): Promise<LogApiDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/log-api/get-by-id/{findId}';
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
      body?: LogApiDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfLogApiDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/log-api/create-or-update';

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
  ): Promise<CommonResultDtoOfLogApiDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/log-api/remove/{removeId}';
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
      let url = basePath + '/api/pos/log-api/export-paged-result';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
