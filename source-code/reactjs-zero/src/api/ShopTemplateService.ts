import {
  ShopTemplatePagedRequestDto,
  ShopTemplateTypeEnum,
  OrdExportPaged,
  OrdColumnFilter,
  PagedResultDtoOfShopTemplateDto,
  ShopTemplateDto,
  ShopTemplateDetailsDto,
  PagedResultDtoOfShopTemplateWithProductUnitDto,
  ShopTemplateWithProductUnitDto,
  ProductSearchWithUnitAndQtyDto,
  ProductTypeEnum,
  string,
  CommonResultDtoOfShopTemplateDto,
  CommonResultExtendDto,
  ValidateInputDto,
  ExportShopDetailTplInputDto,
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

export class ShopTemplateService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: ShopTemplatePagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfShopTemplateDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-template/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagedWithProductUnit(
    params: {
      /** requestBody */
      body?: ShopTemplatePagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfShopTemplateWithProductUnitDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-template/get-paged-with-product-unit';

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
      hashId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ShopTemplateDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-template/get-by-id/{hashId}';
      url = url.replace('{hashId}', params['hashId'] + '');

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
      body?: ShopTemplateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfShopTemplateDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-template/create-or-update';

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
      removeHashId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfShopTemplateDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-template/remove/{removeHashId}';
      url = url.replace('{removeHashId}', params['removeHashId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static removeByPublishViewId(
    params: {
      /**  */
      removeHashId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfShopTemplateDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-template/removeByPublishViewId/{removeHashId}';
      url = url.replace('{removeHashId}', params['removeHashId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportShopDetails(
    params: {
      /** requestBody */
      body?: ExportShopDetailTplInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-template/export-shop-details';

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
      type?: ShopTemplateTypeEnum;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-template/get-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { type: params['type'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-template/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
