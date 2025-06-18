import {
  ProductBookReportGetPagedInputDto,
  OrdExportPaged,
  OrdColumnFilter,
  DateRangeDto,
  PagedResultDtoOfProductBookReportDto,
  ProductBookReportDto,
  ProductBookReportDetailDto,
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

export class ProductBookService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: ProductBookReportGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfProductBookReportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-book/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportPagedResult(
    params: {
      /** requestBody */
      body?: ProductBookReportGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-book/export-paged-result';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
