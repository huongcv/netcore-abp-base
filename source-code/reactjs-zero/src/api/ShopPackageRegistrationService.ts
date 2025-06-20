import {
    axios,
    basePath,
    ComboOptionDto,
    CommonResultDtoOfShopPackageRegistrationDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfShopPackageRegistrationDto,
    ShopPackageRegistrationDto,
    ShopPackageRegistrationGetPagedDto
} from './index.defs';

export class ShopPackageRegistrationService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: ShopPackageRegistrationGetPagedDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfShopPackageRegistrationDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-package-registration/get-paged';

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
  ): Promise<ShopPackageRegistrationDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-package-registration/get-by-id/{findId}';
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
      body?: ShopPackageRegistrationDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfShopPackageRegistrationDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-package-registration/create-or-update';

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
  ): Promise<CommonResultDtoOfShopPackageRegistrationDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-package-registration/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getComboOptions(options: IRequestOptions = {}): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-package-registration/get-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static stopPackageTrial(
    params: {
      /**  */
      shopId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-package-registration/stop-package-trial/{shopId}';
      url = url.replace('{shopId}', params['shopId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static checkExitsUsingPackageMain(
    params: {
      /**  */
      shopId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-package-registration/check-exits-using-package-main/{shopId}';
      url = url.replace('{shopId}', params['shopId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-package-registration/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
