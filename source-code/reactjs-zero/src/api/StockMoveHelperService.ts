import {
  string,
  StockMoveItemShortDto,
  GetReturnMoveQuery,
  ReturnMoveStockDto,
  MOVE_TYPE,
  CommonResultDtoOfString,
  CommonResultExtendDto,
  ValidateInputDto,
  number,
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

export class StockMoveHelperService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static stockMoveHelper(
    params: {
      /**  */
      hashMoveId?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<StockMoveItemShortDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/stock-move-helper';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { hashMoveId: params['hashMoveId'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static stockMoveHelper1(
    params: {
      /** requestBody */
      body?: GetReturnMoveQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ReturnMoveStockDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/stock-move-helper';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

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
      let url = basePath + '/api/pos/stock-move-helper/print/{moveHashId}';
      url = url.replace('{moveHashId}', params['moveHashId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createAppPrint(
    params: {
      /**  */
      moveHashId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfString> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/stock-move-helper/create-app-print/{moveHashId}';
      url = url.replace('{moveHashId}', params['moveHashId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static appPrint(
    params: {
      /**  */
      moveId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/stock-move-helper/app-print/{moveId}';
      url = url.replace('{moveId}', params['moveId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
