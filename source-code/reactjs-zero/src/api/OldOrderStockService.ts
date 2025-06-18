import {
    axios,
    basePath,
    CancelMoveStockDto,
    CommonResultDtoOfNullableOfInt64,
    CommonResultDtoOfOldOrderStockTicketDto,
    getConfigs,
    GetTransStockImportExcelTemplateQuery,
    IRequestConfig,
    IRequestOptions,
    OldOrderStockTicketDto,
    PagedResultDtoOfOldOrderStockMoveDto,
    StockMovePagedCountDto,
    StockMovePagedRequestDto
} from './index.defs';

export class OldOrderStockService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: StockMovePagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfOldOrderStockMoveDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/old-order-stock/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getCount(
    params: {
      /** requestBody */
      body?: StockMovePagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<StockMovePagedCountDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/old-order-stock/get-count';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createOrUpdateMove(
    params: {
      /** requestBody */
      body?: OldOrderStockTicketDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfOldOrderStockTicketDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/old-order-stock/create-or-update-move';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getById(
    params: {
      /**  */
      idHash?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<OldOrderStockTicketDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/old-order-stock/get-by-id';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { idHash: params['idHash'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cancelMove(
    params: {
      /** requestBody */
      body?: CancelMoveStockDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfNullableOfInt64> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/old-order-stock/cancel-move';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static deleteMove(
    params: {
      /**  */
      moveId?: number;
      /**  */
      idHash?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfNullableOfInt64> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/old-order-stock/delete-move';

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);
      configs.params = { MoveId: params['moveId'], IdHash: params['idHash'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getImportExcelTemplate(
    params: {
      /** requestBody */
      body?: GetTransStockImportExcelTemplateQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/old-order-stock/get-import-excel-template';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
