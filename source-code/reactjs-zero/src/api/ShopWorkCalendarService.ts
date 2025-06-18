import {
  OrdPagedRequestDto,
  OrdExportPaged,
  OrdColumnFilter,
  PagedResultDtoOfShopWorkCalendarDto,
  ShopWorkCalendarDto,
  DayOfWeek,
  ShopWorkCalendarDetailDto,
  DAY_OF_WEEK,
  CounterByIsActivedStatusDto,
  CounterByIsActivedItem,
  number,
  boolean,
  CommonResultDtoOfShopWorkCalendarDto,
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

export class ShopWorkCalendarService {
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
  ): Promise<PagedResultDtoOfShopWorkCalendarDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-calendar/get-paged';

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
      let url = basePath + '/api/pos/shop-work-calendar/get-count';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static changeWorkCalendarStatus(
    params: {
      /**  */
      calendarId: number;
      /**  */
      isActived?: boolean;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfShopWorkCalendarDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-calendar/change-work-calendar-status/{calendarId}';
      url = url.replace('{calendarId}', params['calendarId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { isActived: params['isActived'] };

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
  ): Promise<ShopWorkCalendarDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-calendar/get-by-id/{findId}';
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
      body?: ShopWorkCalendarDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfShopWorkCalendarDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-calendar/create-or-update';

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
  ): Promise<CommonResultDtoOfShopWorkCalendarDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-calendar/remove/{removeId}';
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
      let url = basePath + '/api/pos/shop-work-calendar/export-paged-result';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getComboOptions(options: IRequestOptions = {}): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-calendar/get-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-calendar/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
