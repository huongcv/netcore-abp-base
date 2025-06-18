import {
  StockReportCommodityPlanPagingInputDto,
  OrdExportPaged,
  OrdColumnFilter,
  ProductTypeEnum,
  PagedResultDtoOfStockReportCommodityPlanOutputDto,
  StockReportCommodityPlanOutputDto,
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

export class CommodityplanReportService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaging(
    params: {
      /** requestBody */
      body?: StockReportCommodityPlanPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfStockReportCommodityPlanOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/commodityplanlist/get-paging';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportReport(
    params: {
      /** requestBody */
      body?: StockReportCommodityPlanPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/commodityplanlist/export-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
