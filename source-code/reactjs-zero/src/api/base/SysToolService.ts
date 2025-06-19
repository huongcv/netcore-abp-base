import {axios, basePath, getConfigs, IRequestConfig, IRequestOptions} from './index.defs';

export class SysToolService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static syncTemplatesToMinioAsync(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/plugin-base/sys-tool/sync-templates-to-minio-async';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearAllCacheInRedis(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/plugin-base/sys-tool/clear-all-cache-in-redis';

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
      let url = basePath + '/api/plugin-base/sys-tool/get-encrypted';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { value: params['value'] };

      axios(configs, resolve, reject);
    });
  }
}
