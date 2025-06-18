import {
  string,
  CommonResultDtoOfProductDetailDto,
  CommonResultExtendDto,
  ValidateInputDto,
  ProductDetailDto,
  ProductDto,
  ProductUnitDto,
  ProductLotNumberInitDto,
  ProductDrugDto,
  ProductStockInventoryStatus,
  StockInventoryLineDetailEntity,
  ProductGetPagedInputDto,
  OrdExportPaged,
  OrdColumnFilter,
  PagedResultDtoOfProductDetailDto,
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

export class TemplateProductService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getTemplateForCreate(
    params: {
      /**  */
      idHash?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfProductDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/template-product/get-template-for-create';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { idHash: params['idHash'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getComboOptionTemplateProduct(
    params: {
      /** requestBody */
      body?: ProductGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfProductDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/template-product/get-combo-option-template-product';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
