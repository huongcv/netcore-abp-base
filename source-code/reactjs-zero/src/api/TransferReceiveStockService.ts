import {
    axios,
    basePath,
    CancelMoveStockDto,
    CommonResultDtoOfNullableOfInt64,
    CommonResultDtoOfTransferStockTicketDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfStockMovePagedOutputDto,
    StockMovePagedCountDto,
    StockMovePagedRequestDto,
    TransferStockTicketDto
} from './index.defs';

export class TransferReceiveStockService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static create(
    params: {
      /** requestBody */
      body?: TransferStockTicketDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfTransferStockTicketDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/transfer-receive-stock/create';

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
      body?: TransferStockTicketDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfTransferStockTicketDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/transfer-receive-stock/update';

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
      body?: TransferStockTicketDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfTransferStockTicketDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/transfer-receive-stock/create-or-update-move';

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
      let url = basePath + '/api/pos/transfer-receive-stock/cancel';

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
      let url = basePath + '/api/pos/transfer-receive-stock/cancel-move';

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
      let url = basePath + '/api/pos/transfer-receive-stock/remove/{moveHashId}';
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
      let url = basePath + '/api/pos/transfer-receive-stock/delete-move/{moveHashId}';
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
      let url = basePath + '/api/pos/transfer-receive-stock/print/{moveHashId}';
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
      let url = basePath + '/api/pos/transfer-receive-stock/get-paged';

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
      let url = basePath + '/api/pos/transfer-receive-stock/get-count';

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
  ): Promise<CommonResultDtoOfTransferStockTicketDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/transfer-receive-stock/get-by-id/{idHash}';
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
  ): Promise<CommonResultDtoOfTransferStockTicketDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/transfer-receive-stock/get-move-by-id/{idHash}';
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
  ): Promise<CommonResultDtoOfTransferStockTicketDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/transfer-receive-stock/clone-by-id/{idHash}';
      url = url.replace('{idHash}', params['idHash'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
