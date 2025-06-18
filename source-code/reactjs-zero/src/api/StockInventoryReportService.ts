import {
  StockReportImportExportInventoryInputDto,
  OrdExportPaged,
  OrdColumnFilter,
  DateRangeDto,
  StockReportPageListImportExportInventoryOutputDto,
  StockReportImportExportInventoryOutputDto,
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

export class StockInventoryReportService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static transaction(
    params: {
      /** requestBody */
      body?: StockReportImportExportInventoryInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<StockReportPageListImportExportInventoryOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/inventory/transaction';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportTransaction(
    params: {
      /** requestBody */
      body?: StockReportImportExportInventoryInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/inventory/export-transaction';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
