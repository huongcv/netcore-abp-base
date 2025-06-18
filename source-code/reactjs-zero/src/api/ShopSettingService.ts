import {
    axios,
    basePath,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfShopSettingDto,
    ShopSettingDto,
    ShopSettingPagingInputDto
} from './index.defs';

export class ShopSettingService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: ShopSettingPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfShopSettingDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-setting/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getGeneralInfo(options: IRequestOptions = {}): Promise<ShopSettingDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-setting/get-general-info';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getConfigDefaulGolfInfo(options: IRequestOptions = {}): Promise<ShopSettingDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-setting/get-config-defaul-golf-info';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getAllInvoiceSetting(options: IRequestOptions = {}): Promise<ShopSettingDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-setting/get-all-invoice-setting';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getAllConnectSetting(options: IRequestOptions = {}): Promise<ShopSettingDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-setting/get-all-connect-setting';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getAllUserSetting(options: IRequestOptions = {}): Promise<ShopSettingDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-setting/get-all-user-setting';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static setListValue(
    params: {
      /** requestBody */
      body?: ShopSettingDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-setting/set-list-value';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getValue(
    params: {
      /**  */
      name?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ShopSettingDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-setting/get-value';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { name: params['name'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static setValue(
    params: {
      /** requestBody */
      body?: ShopSettingDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-setting/set-value';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getMontlyRatePlan(options: IRequestOptions = {}): Promise<ShopSettingDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-setting/get-montly-rate-plan';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
