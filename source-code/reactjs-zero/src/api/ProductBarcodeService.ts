import {
    axios,
    basePath,
    CommonResultDtoOfString,
    getConfigs,
    GetPagedProductBarcode,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfBarcodeProductItemDto,
    PrintBarcodeQuery,
    ProductBarCodeLayoutSettingDto
} from './index.defs';

export class ProductBarcodeService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getSetting(options: IRequestOptions = {}): Promise<ProductBarCodeLayoutSettingDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-barcode/get-setting';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static printBarCodeTemplate(
    params: {
      /** requestBody */
      body?: PrintBarcodeQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfString> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-barcode/print-bar-code-template';

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
      id: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-barcode/print/{id}';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static previewBarCode(
    params: {
      /** requestBody */
      body?: ProductBarCodeLayoutSettingDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-barcode/preview-bar-code';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static saveSettingBarcode(
    params: {
      /** requestBody */
      body?: ProductBarCodeLayoutSettingDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-barcode/save-setting-barcode';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: GetPagedProductBarcode;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfBarcodeProductItemDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-barcode/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
