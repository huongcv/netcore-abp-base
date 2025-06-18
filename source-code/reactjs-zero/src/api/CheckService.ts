import {
    axios,
    basePath,
    CancelMoveStockDto,
    CheckStockTicketDto,
    CommonResultDtoOfCheckStockTicketDto,
    CommonResultDtoOfNullableOfInt64,
    GetCheckStockImportExcelTemplateQuery,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfStockMovePagedOutputDto,
    StockMovePagedCountDto,
    StockMovePagedRequestDto
} from './index.defs';

export class CheckService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static create(
    params: {
      /** requestBody */
      body?: CheckStockTicketDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfCheckStockTicketDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/move-stock/check/create';

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
      body?: CheckStockTicketDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfCheckStockTicketDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/move-stock/check/update';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getImportExcelTemplate(
    params: {
      /** requestBody */
      body?: GetCheckStockImportExcelTemplateQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/move-stock/check/get-import-excel-template';

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
      body?: CheckStockTicketDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfCheckStockTicketDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/move-stock/check/create-or-update-move';

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
      let url = basePath + '/api/pos/move-stock/check/cancel';

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
      let url = basePath + '/api/pos/move-stock/check/cancel-move';

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
      let url = basePath + '/api/pos/move-stock/check/remove/{moveHashId}';
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
      let url = basePath + '/api/pos/move-stock/check/delete-move/{moveHashId}';
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
      let url = basePath + '/api/pos/move-stock/check/print/{moveHashId}';
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
      let url = basePath + '/api/pos/move-stock/check/get-paged';

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
      let url = basePath + '/api/pos/move-stock/check/get-count';

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
      idHash: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfCheckStockTicketDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/move-stock/check/get-by-id/{idHash}';
      url = url.replace('{idHash}', params['idHash'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

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
  ): Promise<CommonResultDtoOfCheckStockTicketDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/move-stock/check/get-move-by-id/{idHash}';
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
  ): Promise<CommonResultDtoOfCheckStockTicketDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/move-stock/check/clone-by-id/{idHash}';
      url = url.replace('{idHash}', params['idHash'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
