import {
  string,
  CommonResultDtoOfExportStockTicketDto,
  CommonResultExtendDto,
  ValidateInputDto,
  ExportStockTicketDto,
  ProductMoveStockDto,
  ExportStockMoveDto,
  MOVE_TYPE,
  MOVE_STATUS,
  DiscountTypeEnum,
  ExportStockMoveDetailDto,
  ProductStockViewDto,
  StockProductUnitDto,
  StockProductSelectUnitDto,
  CancelMoveStockDto,
  CommonResultDtoOfNullableOfInt64,
  StockMovePagedRequestDto,
  OrdExportPaged,
  OrdColumnFilter,
  DateRangeDto,
  PAYMENT_METHOD,
  PagedResultDtoOfStockMovePagedOutputDto,
  StockMovePagedOutputDto,
  StockMovePagedCountDto,
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

export class ExportStockService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getById(
    params: {
      /**  */
      idHash: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfExportStockTicketDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/export-stock/get-by-id/{idHash}';
      url = url.replace('{idHash}', params['idHash'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cloneById(
    params: {
      /**  */
      idHash: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfExportStockTicketDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/export-stock/clone-by-id/{idHash}';
      url = url.replace('{idHash}', params['idHash'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static create(
    params: {
      /** requestBody */
      body?: ExportStockTicketDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfExportStockTicketDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/export-stock/create';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static update(
    params: {
      /** requestBody */
      body?: ExportStockTicketDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfExportStockTicketDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/export-stock/update';

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
      body?: ExportStockTicketDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfExportStockTicketDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/export-stock/create-or-update-move';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cancel(
    params: {
      /** requestBody */
      body?: CancelMoveStockDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfNullableOfInt64> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/export-stock/cancel';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

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
      let url = basePath + '/api/pos/export-stock/cancel-move';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static remove(
    params: {
      /**  */
      moveHashId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfNullableOfInt64> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/export-stock/remove/{moveHashId}';
      url = url.replace('{moveHashId}', params['moveHashId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static deleteMove(
    params: {
      /**  */
      moveHashId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfNullableOfInt64> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/export-stock/delete-move/{moveHashId}';
      url = url.replace('{moveHashId}', params['moveHashId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static print(
    params: {
      /**  */
      moveHashId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/export-stock/print/{moveHashId}';
      url = url.replace('{moveHashId}', params['moveHashId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: StockMovePagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfStockMovePagedOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/export-stock/get-paged';

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
      let url = basePath + '/api/pos/export-stock/get-count';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getMoveById(
    params: {
      /**  */
      idHash: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfExportStockTicketDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/export-stock/get-move-by-id/{idHash}';
      url = url.replace('{idHash}', params['idHash'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
