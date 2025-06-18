import {
    axios,
    basePath,
    CommonResultDtoOfDrugRecallDto,
    DrugRecallDto,
    DrugRecallGetPagedInputDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfDrugRecallDto
} from './index.defs';

export class DrugRecallService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: DrugRecallGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfDrugRecallDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/drug-recall/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createOrUpdate(
    params: {
      /** requestBody */
      body?: DrugRecallDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfDrugRecallDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/drug-recall/create-or-update';

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
  ): Promise<DrugRecallDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/drug-recall/{id}/get-by-id';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

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
  ): Promise<CommonResultDtoOfDrugRecallDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/drug-recall/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportDataToExcel(
    params: {
      /** requestBody */
      body?: DrugRecallGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/drug-recall/export-data-to-excel';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
