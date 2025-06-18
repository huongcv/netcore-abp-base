import {
    axios,
    basePath,
    CommonResultDtoOfListOfShopWeatherDataDto,
    CommonResultDtoOfShopWeatherDataDto,
    getConfigs,
    GroupByDateDto,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfGroupByDateDto,
    ShopWeatherDataDto,
    TrackingItemsInput,
    WeatherGetPagedDto
} from './index.defs';

export class WeatherDataService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/weather-data/clear-cache';

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
      measureDate?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ShopWeatherDataDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/weather-data/get-by-id';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { MeasureDate: params['measureDate'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createOrUpdate(
    params: {
      /** requestBody */
      body?: TrackingItemsInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfListOfShopWeatherDataDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/weather-data/create-or-update';

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
  ): Promise<CommonResultDtoOfShopWeatherDataDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/weather-data/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: WeatherGetPagedDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfGroupByDateDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/weather-data/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static removeByDate(
    params: {
      /** requestBody */
      body?: GroupByDateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfShopWeatherDataDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/weather-data/remove-by-date';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
