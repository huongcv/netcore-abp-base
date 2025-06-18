import {
  StockDisposalReportPagingInputDto,
  OrdExportPaged,
  OrdColumnFilter,
  DateRangeDto,
  StockDisposalReportPagingOutputDto,
  StockDisposalReportOutputDto,
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

export class StockCancelReportService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaging(
    params: {
      /** requestBody */
      body?: StockDisposalReportPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<StockDisposalReportPagingOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/stock-cancel-report/get-paging';

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
      body?: StockDisposalReportPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/report/stock-cancel-report/export-report';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
