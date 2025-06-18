import {
  string,
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

export class ToolService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static clearAllCacheInRedis(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/plugin-base/tool/clear-all-cache-in-redis';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getEncrypted(
    params: {
      /**  */
      value?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/plugin-base/tool/get-encrypted';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { value: params['value'] };

      axios(configs, resolve, reject);
    });
  }
}
