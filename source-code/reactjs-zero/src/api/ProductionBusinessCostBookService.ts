import {
    axios,
    basePath,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedProductionBusinessCostResultDto,
    PagingProductionBusinessCostBookInputDto,
    ProductBusinessCostSelectedGroupInput,
    ProductionBusinessCostSummaryDto
} from './index.defs';

export class ProductionBusinessCostBookService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaging(
    params: {
      /** requestBody */
      body?: PagingProductionBusinessCostBookInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedProductionBusinessCostResultDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/business-house-hold/production-business-cost-book/get-paging';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static bussinessCostTypeGroup(options: IRequestOptions = {}): Promise<ProductBusinessCostSelectedGroupInput[]> {
    return new Promise((resolve, reject) => {
      let url =
        basePath + '/api/pos/report/business-house-hold/production-business-cost-book/bussiness-cost-type-group';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static summary(
    params: {
      /** requestBody */
      body?: PagingProductionBusinessCostBookInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ProductionBusinessCostSummaryDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/business-house-hold/production-business-cost-book/summary';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportExcelProductionBusiness(
    params: {
      /** requestBody */
      body?: PagingProductionBusinessCostBookInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url =
        basePath + '/api/pos/report/business-house-hold/production-business-cost-book/export-excel-production-business';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
