import {
  PharmacyComplaintLogGetPageInputDto,
  OrdExportPaged,
  OrdColumnFilter,
  DateRangeDto,
  PagedResultDtoOfPharmacyComplaintLogDto,
  PharmacyComplaintLogDto,
  CommonResultDtoOfPharmacyComplaintLogDto,
  CommonResultExtendDto,
  ValidateInputDto,
  number,
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

export class PharmacyComplaintLogService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: PharmacyComplaintLogGetPageInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfPharmacyComplaintLogDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-complaint-log/get-paged';

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
      body?: PharmacyComplaintLogDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPharmacyComplaintLogDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-complaint-log/create-or-update';

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
  ): Promise<CommonResultDtoOfPharmacyComplaintLogDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-complaint-log/remove/{removeId}';
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
  ): Promise<PharmacyComplaintLogDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-complaint-log/{id}/get-by-id';
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
      body?: PharmacyComplaintLogGetPageInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/pharmacy-complaint-log/export-data-to-excel';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
