import {
    axios,
    basePath,
    CommonResultDtoOfBoolean,
    CommonResultDtoOfProductInventoryMoveReponseDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfProductInventoryStockDto,
    ProductInventoryMovePagedInput,
    ProductInventoryStockPagedInput
} from './index.defs';

export class ProductStockService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getInventoryStockPaged(
    params: {
      /** requestBody */
      body?: ProductInventoryStockPagedInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfProductInventoryStockDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-stock/get-inventory-stock-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getInventoryMovePaged(
    params: {
      /** requestBody */
      body?: ProductInventoryMovePagedInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfProductInventoryMoveReponseDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-stock/get-inventory-move-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static deleteLot(
    params: {
      /**  */
      lotNumberId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-stock/delete-lot/{lotNumberId}';
      url = url.replace('{lotNumberId}', params['lotNumberId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
