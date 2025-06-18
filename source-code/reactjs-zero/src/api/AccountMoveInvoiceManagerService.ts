import {
  SaleInvoiceDto,
  SaleInvoiceStatus,
  EinvoiceStatus,
  MOVE_TYPE,
  CHANNEL_TYPE,
  PrescriptionTypeEnum,
  InvoiceObjectTypeEnum,
  SaleInvoiceDetailDto,
  LotInventoryDto,
  SalesPrescriptionDto,
  PaymentMethodObjDto,
  PAYMENT_METHOD,
  PARTNER_TYPE,
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

export class AccountMoveInvoiceManagerService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static process(
    params: {
      /** requestBody */
      body?: SaleInvoiceDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move-invoice-manager/process';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createInvoiceSaleTransaction(
    params: {
      /** requestBody */
      body?: SaleInvoiceDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PartnerTransactionEntity> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move-invoice-manager/create-invoice-sale-transaction';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
