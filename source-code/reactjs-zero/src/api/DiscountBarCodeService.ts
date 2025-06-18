import {
  string,
  DiscountBarCodeLayoutSettingDto,
  BarCodeLayoutType,
  BarcodeDiscountPrintInput,
  BarcodeDiscountItemDto,
  DiscountTypeEnum,
  DISCOUNT_USE_TYPE,
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

export class DiscountBarCodeService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getSetting(
    params: {
      /**  */
      currentShopName?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<DiscountBarCodeLayoutSettingDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/discount-bar-code/get-setting';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { currentShopName: params['currentShopName'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static previewBarCode(
    params: {
      /** requestBody */
      body?: DiscountBarCodeLayoutSettingDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/discount-bar-code/preview-bar-code';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static saveSettingBarCode(
    params: {
      /** requestBody */
      body?: DiscountBarCodeLayoutSettingDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/discount-bar-code/save-setting-bar-code';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static printBarcode(
    params: {
      /** requestBody */
      body?: BarcodeDiscountPrintInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/discount-bar-code/print-barcode';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
