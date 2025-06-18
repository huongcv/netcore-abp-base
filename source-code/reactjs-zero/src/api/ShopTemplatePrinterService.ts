import {
  ShopTemplatePrinterPagingInputDto,
  OrdExportPaged,
  OrdColumnFilter,
  PagedResultDtoOfShopTemplatePrinterDto,
  ShopTemplatePrinterDto,
  TEMPLATE_PRINTER,
  TplFileInfo,
  CounterByIsActivedDto,
  CounterByIsActivedItemDto,
  number,
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

export class ShopTemplatePrinterService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getListPaging(
    params: {
      /** requestBody */
      body?: ShopTemplatePrinterPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfShopTemplatePrinterDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-template-printer/get-list-paging';

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
      body?: ShopTemplatePrinterPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CounterByIsActivedDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-template-printer/get-count';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cruShopTemplate(
    params: {
      /** requestBody */
      body?: ShopTemplatePrinterDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ShopTemplatePrinterDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-template-printer/cru-shop-template';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static setDefault(
    params: {
      /**  */
      id: number;
      /**  */
      templatePrintEnumId: TEMPLATE_PRINTER;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-template-printer/{id}/set-default/{templatePrintEnumId}';
      url = url.replace('{id}', params['id'] + '');
      url = url.replace('{templatePrintEnumId}', params['templatePrintEnumId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static changeActive(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-template-printer/{id}/change-active';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static uploadFile(
    params: {
      /**  */
      printerEnum?: TEMPLATE_PRINTER;
      /**  */
      file: any;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<TplFileInfo> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-template-printer/upload-file';

      const configs: IRequestConfig = getConfigs('post', 'multipart/form-data', url, options);
      configs.params = { printerEnum: params['printerEnum'] };

      let data = null;
      data = new FormData();
      if (params['file']) {
        if (Object.prototype.toString.call(params['file']) === '[object Array]') {
          for (const item of params['file']) {
            data.append('file', item as any);
          }
        } else {
          data.append('file', params['file'] as any);
        }
      }

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static delete(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-template-printer/{id}/delete';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static get(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ShopTemplatePrinterDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-template-printer/{id}/get';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
