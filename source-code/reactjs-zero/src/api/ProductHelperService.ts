import {
    axios,
    basePath,
    CommonResultDtoOfIEnumerableOfProductLotDto,
    CommonResultDtoOfListOfProductSelectDto,
    getConfigs,
    GetProductInfoFromInventoryAvailableQuery,
    GetProductInventoryAvailableQuery,
    GetProductLotNumberInventoryStockQuery,
    GetProductLotNumberIsStillExpiredSelectQuery,
    GetProductLotSelectQuery,
    GetProductUnitSelectQuery,
    GetProductUnitSelectWithPriceListQuery,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfProductFromInventoryWithUnitDto,
    PagedResultDtoOfProductSearchWithUnitDto,
    ProductGetPagedInputDto,
    ProductLotDto,
    ProductSelectCommand,
    ProductUnitSelectDto
} from './index.defs';

export class ProductHelperService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static searchWithUnit(
    params: {
      /** requestBody */
      body?: ProductGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfProductSearchWithUnitDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-helper/search-with-unit';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getUnits(
    params: {
      /** requestBody */
      body?: GetProductUnitSelectQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ProductUnitSelectDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-helper/get-units';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getUnitsByPriceListId(
    params: {
      /** requestBody */
      body?: GetProductUnitSelectWithPriceListQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ProductUnitSelectDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-helper/get-units-by-price-list-id';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getLotNumbers(
    params: {
      /** requestBody */
      body?: GetProductLotSelectQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ProductLotDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-helper/get-lot-numbers';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getLotNumberIsStillExpired(
    params: {
      /** requestBody */
      body?: GetProductLotNumberIsStillExpiredSelectQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ProductLotDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-helper/get-lot-number-is-still-expired';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getLotNumberWithInventoryStock(
    params: {
      /** requestBody */
      body?: GetProductLotNumberInventoryStockQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfIEnumerableOfProductLotDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-helper/get-lot-number-with-inventory-stock';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getListProductInventoryAvailable(
    params: {
      /** requestBody */
      body?: GetProductInventoryAvailableQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-helper/get-list-product-inventory-available';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getAvailableInventory(
    params: {
      /** requestBody */
      body?: GetProductInventoryAvailableQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-helper/get-available-inventory';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagingProductInfoFromInventoryAvailable(
    params: {
      /** requestBody */
      body?: GetProductInfoFromInventoryAvailableQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfProductFromInventoryWithUnitDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-helper/get-paging-product-info-from-inventory-available';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static handleProductSelect(
    params: {
      /** requestBody */
      body?: ProductSelectCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfListOfProductSelectDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-helper/handle-product-select';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
