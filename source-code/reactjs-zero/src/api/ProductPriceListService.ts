import {
  axios,
  basePath,
  ComboOptionDto,
  CommonResultDtoOfProductPriceListDto,
  getConfigs,
  IRequestConfig,
  IRequestOptions,
  PagedResultDtoOfProductPriceListDto,
  PriceListGetPagedInputDto,
  ProductPriceListDto
} from './index.defs';

export class ProductPriceListService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getComboOptions(options: IRequestOptions = {}): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list/get-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: PriceListGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfProductPriceListDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list/get-paged';

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
      findId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ProductPriceListDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list/get-by-id/{findId}';
      url = url.replace('{findId}', params['findId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createOrUpdate(
    params: {
      /** requestBody */
      body?: ProductPriceListDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfProductPriceListDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list/create-or-update';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static addToDetailProductPriceList(
    params: {
      /** requestBody */
      body?: ProductPriceListDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list/add-to-detail-product-price-list';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateStatus(
    params: {
      /**  */
      id: number;
      /**  */
      isActived?: boolean;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfProductPriceListDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list/{id}/update-status';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);
      configs.params = { isActived: params['isActived'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static update(
    params: {
      /** requestBody */
      body?: ProductPriceListDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfProductPriceListDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list/update';

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static create(
    params: {
      /** requestBody */
      body?: ProductPriceListDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfProductPriceListDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list/create';

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
  ): Promise<CommonResultDtoOfProductPriceListDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static removeByIdHash(
    params: {
      /**  */
      idHash?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfProductPriceListDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list/remove-by-id-hash';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { idHash: params['idHash'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static removeByPublishViewId(
    params: {
      /**  */
      publishViewId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfProductPriceListDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list/remove-by-publish-view-id/{publishViewId}';
      url = url.replace('{publishViewId}', params['publishViewId'] + '');

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
      body?: PriceListGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list/export-paged-result';

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
      let url = basePath + '/api/pos/product-price-list/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
