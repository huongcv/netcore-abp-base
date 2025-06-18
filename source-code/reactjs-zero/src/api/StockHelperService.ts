import {
    axios,
    basePath,
    CommonResultDtoOfIEnumerableOfBarcodeProductItemDto,
    CommonResultDtoOfListOfStockProductSelectDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfProductUnitViewDto,
    RetryCloseStockProductCommand,
    RetryCostPriceCommand,
    StockProductSelectCommand,
    StockSearchWithUnitCommand
} from './index.defs';

export class StockHelperService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static retryCloseStockProduct(
    params: {
      /** requestBody */
      body?: RetryCloseStockProductCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/stock-helper/retry-close-stock-product';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static retryCostPrice(
    params: {
      /** requestBody */
      body?: RetryCostPriceCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/stock-helper/retry-cost-price';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getProductBarcode(
    params: {
      /**  */
      moveIdHash?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfIEnumerableOfBarcodeProductItemDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/stock-helper/get-product-barcode';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { moveIdHash: params['moveIdHash'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static searchWithUnit(
    params: {
      /** requestBody */
      body?: StockSearchWithUnitCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfProductUnitViewDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/stock-helper/search-with-unit';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static stockProductSelect(
    params: {
      /** requestBody */
      body?: StockProductSelectCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfListOfStockProductSelectDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/stock-helper/stock-product-select';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
