import {
  DictionaryRequestDto,
  OrdExportPaged,
  OrdColumnFilter,
  DictionaryTypeEnum,
  PagedResultDtoOfDictionaryDto,
  DictionaryDto,
  number,
  CommonResultDtoOfDictionaryDto,
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

export class DictionaryService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: DictionaryRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfDictionaryDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/dictionary/get-paged';

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
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<DictionaryDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/dictionary/{id}/get-by-id';
      url = url.replace('{id}', params['id'] + '');

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
      body?: DictionaryDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfDictionaryDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/dictionary/create-or-update';

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
  ): Promise<CommonResultDtoOfDictionaryDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/dictionary/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
