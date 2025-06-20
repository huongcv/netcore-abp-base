import {
    axios,
    basePath,
    CommonResultDtoOfPharmacyAdverseReactionDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfPharmacyAdverseReactionDto,
    PharmacyAdverseReactionDto,
    PharmacyAdverseReactionGetPageInputDto
} from './index.defs';

export class PharmacyAdverseReactionService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: PharmacyAdverseReactionGetPageInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfPharmacyAdverseReactionDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-adverse-reaction/get-paged';

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
      body?: PharmacyAdverseReactionDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPharmacyAdverseReactionDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-adverse-reaction/create-or-update';

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
  ): Promise<CommonResultDtoOfPharmacyAdverseReactionDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-adverse-reaction/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

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
  ): Promise<PharmacyAdverseReactionDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-adverse-reaction/{id}/get-by-id';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportDataToExcel(
    params: {
      /** requestBody */
      body?: PharmacyAdverseReactionGetPageInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-adverse-reaction/export-data-to-excel';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
