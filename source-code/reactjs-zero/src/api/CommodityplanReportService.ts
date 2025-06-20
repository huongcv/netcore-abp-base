import {
    axios,
    basePath,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfStockReportCommodityPlanOutputDto,
    StockReportCommodityPlanPagingInputDto
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
