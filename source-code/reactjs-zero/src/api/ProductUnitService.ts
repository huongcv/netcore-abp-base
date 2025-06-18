import {
  string,
  ProductUnitDto,
  UpdateListUnitCommand,
  CommonResultDtoOfBoolean,
  CommonResultExtendDto,
  ValidateInputDto,
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

export class ProductUnitService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getListByProduct(
    params: {
      /**  */
      productHashId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ProductUnitDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-unit/get-list-by-product/{productHashId}';
      url = url.replace('{productHashId}', params['productHashId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateListUnit(
    params: {
      /** requestBody */
      body?: UpdateListUnitCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-unit/update-list-unit';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
