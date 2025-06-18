import {
  OrdPagedRequestDto,
  OrdExportPaged,
  OrdColumnFilter,
  PagedResultDtoOfAllowanceDto,
  AllowanceDto,
  ALOWANCE_TYPE,
  CounterByIsActivedStatusDto,
  CounterByIsActivedItem,
  number,
  boolean,
  CommonResultDtoOfAllowanceDto,
  CommonResultExtendDto,
  ValidateInputDto,
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

export class AllowanceService {
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
  ): Promise<PagedResultDtoOfAllowanceDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/allowance/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getCount(
    params: {
      /** requestBody */
      body?: OrdPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CounterByIsActivedStatusDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/allowance/get-count';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static changeWorkAllowanceStatus(
    params: {
      /**  */
      allowanceId: number;
      /**  */
      isActived?: boolean;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfAllowanceDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/allowance/change-work-allowance-status/{allowanceId}';
      url = url.replace('{allowanceId}', params['allowanceId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { isActived: params['isActived'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createOrUpdate(
    params: {
      /** requestBody */
      body?: AllowanceDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfAllowanceDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/allowance/create-or-update';

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
  ): Promise<CommonResultDtoOfAllowanceDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/allowance/remove/{removeId}';
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
      let url = basePath + '/api/pos/allowance/export-paged-result';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/allowance/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getComboOptions(options: IRequestOptions = {}): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/allowance/get-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
