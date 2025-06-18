import {
  PagedWorkCalenderDetailRequest,
  OrdExportPaged,
  OrdColumnFilter,
  PagedResultDtoOfShopWorkCalendarDetailDto,
  ShopWorkCalendarDetailDto,
  DAY_OF_WEEK,
  number,
  CommonResultDtoOfShopWorkCalendarDetailDto,
  CommonResultExtendDto,
  ValidateInputDto,
  CommonResultDtoOfBoolean,
  string,
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

export class ShopWorkCalendarDetailService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: PagedWorkCalenderDetailRequest;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfShopWorkCalendarDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-calendar-detail/get-paged';

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
  ): Promise<ShopWorkCalendarDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-calendar-detail/get-by-id/{findId}';
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
      body?: ShopWorkCalendarDetailDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfShopWorkCalendarDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-calendar-detail/create-or-update';

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
  ): Promise<CommonResultDtoOfShopWorkCalendarDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-calendar-detail/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateListCalendarDetail(
    params: {
      /** requestBody */
      body?: ShopWorkCalendarDetailDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-calendar-detail/update-list-calendar-detail';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getComboOptions(
    params: {
      /**  */
      districtCode?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-calendar-detail/get-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { districtCode: params['districtCode'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-calendar-detail/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
