import {
    axios,
    basePath,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PartnerTransactionEntity,
    SaleInvoiceDto
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
