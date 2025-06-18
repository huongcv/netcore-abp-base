import {
    axios,
    basePath,
    CommonResultDtoOfImportDiscountSupplierOutputDto,
    CommonResultDtoOfShopDiscountDto,
    DiscountGetPagedDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfShopDiscountDto,
    ShopDiscountDto,
    VoucherAvailableDto
} from './index.defs';

export class DiscountService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/discount/clear-cache';

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
      body?: DiscountGetPagedDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfShopDiscountDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/discount/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getListVoucherAvailable(
    params: {
      /**  */
      startDateParames?: string;
      /**  */
      endDateParames?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<VoucherAvailableDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/discount/get-list-voucher-available';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { startDateParames: params['startDateParames'], endDateParames: params['endDateParames'] };

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
  ): Promise<ShopDiscountDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/discount/get-by-id/{findId}';
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
      body?: ShopDiscountDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfShopDiscountDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/discount/create-or-update';

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
  ): Promise<CommonResultDtoOfShopDiscountDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/discount/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static import(
    params: {
      /**  */
      files: [];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfImportDiscountSupplierOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/discount/import';

      const configs: IRequestConfig = getConfigs('post', 'multipart/form-data', url, options);

      let data = null;
      data = new FormData();
      if (params['files']) {
        if (Object.prototype.toString.call(params['files']) === '[object Array]') {
          for (const item of params['files']) {
            data.append('files', item as any);
          }
        } else {
          data.append('files', params['files'] as any);
        }
      }

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportPagedResult(
    params: {
      /** requestBody */
      body?: DiscountGetPagedDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/discount/export-paged-result';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
