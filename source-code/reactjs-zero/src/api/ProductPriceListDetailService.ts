import {
    axios,
    basePath,
    CommonResultDtoOfBoolean,
    CommonResultDtoOfProductPriceListDetailDto,
    CommonResultDtoOfProductPriceListDto,
    CommonResultDtoOfString,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfProductPriceListDetailDto,
    PagedResultDtoOfProductSearchWithUnitDto,
    PriceListDetailGetPagedInputDto,
    ProductGetPagedInputDto,
    ProductPriceListDetailDto,
    ProductPriceListDetailPartnerGroupRelDto,
    ProductPriceListDto
} from './index.defs';

export class ProductPriceListDetailService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: PriceListDetailGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfProductPriceListDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list-detail/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getProductForAddPaged(
    params: {
      /** requestBody */
      body?: ProductGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfProductSearchWithUnitDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list-detail/get-product-for-add-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getProductPriceListDetail(
    params: {
      /**  */
      priceListId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ProductPriceListDetailDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list-detail/get-product-price-list-detail/{priceListId}';
      url = url.replace('{priceListId}', params['priceListId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPartnerGroupByDetailId(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ProductPriceListDetailPartnerGroupRelDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list-detail/{id}/get-partner-group-by-detail-id';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static addDetail(
    params: {
      /** requestBody */
      body?: ProductPriceListDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfProductPriceListDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list-detail/add-detail';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateDetail(
    params: {
      /** requestBody */
      body?: ProductPriceListDetailDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfProductPriceListDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list-detail/update-detail';

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

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
      removeId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfProductPriceListDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list-detail/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static removeMany(
    params: {
      /** requestBody */
      body?: any | null[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list-detail/remove-many';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static print(
    params: {
      /**  */
      publishViewId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfString> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list-detail/print/{publishViewId}';
      url = url.replace('{publishViewId}', params['publishViewId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static addPartnerGroupApplyToDetail(
    params: {
      /** requestBody */
      body?: ProductPriceListDetailPartnerGroupRelDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list-detail/add-partner-group-apply-to-detail';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static removePartnerGroupApplyToDetail(
    params: {
      /** requestBody */
      body?: ProductPriceListDetailPartnerGroupRelDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list-detail/remove-partner-group-apply-to-detail';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static viewPdf(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-price-list-detail/view-pdf/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
