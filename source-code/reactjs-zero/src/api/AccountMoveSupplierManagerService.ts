import {
  number,
  StockInventoryMoveEntity,
  MOVE_TYPE,
  MOVE_STATUS,
  PARTNER_TYPE,
  DiscountTypeEnum,
  PAYMENT_METHOD,
  PartnerTransactionEntity,
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

export class AccountMoveSupplierManagerService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static process(
    params: {
      /**  */
      moveId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move-supplier-manager/process/{moveId}';
      url = url.replace('{moveId}', params['moveId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createMoveTransaction(
    params: {
      /** requestBody */
      body?: StockInventoryMoveEntity;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PartnerTransactionEntity> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move-supplier-manager/create-move-transaction';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateDebt(
    params: {
      /**  */
      partnerId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move-supplier-manager/update-debt/{partnerId}';
      url = url.replace('{partnerId}', params['partnerId'] + '');

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
