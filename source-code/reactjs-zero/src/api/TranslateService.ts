import {
  CommonResultDtoOfString,
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

export class TranslateService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static testTranFailed(options: IRequestOptions = {}): Promise<CommonResultDtoOfString> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/translate/test-tran-failed';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static testTranFailed2(options: IRequestOptions = {}): Promise<CommonResultDtoOfString> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/translate/test-tran-failed2';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static testSuccess(options: IRequestOptions = {}): Promise<CommonResultDtoOfString> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/translate/test-success';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static testSuccessThamSo(options: IRequestOptions = {}): Promise<CommonResultDtoOfString> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/translate/test-success-tham-so';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static testTranFailed3(options: IRequestOptions = {}): Promise<CommonResultDtoOfString> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/translate/test-tran-failed3';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
