import {
    axios,
    basePath,
    getConfigs,
    IEinvoiceService,
    IRequestConfig,
    IRequestOptions,
    SupplierInvoice
} from './index.defs';

export class EinvoiceFactoryService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getService(
    params: {
      /**  */
      supplier?: SupplierInvoice;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<IEinvoiceService> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/einvoice-factory/get-service';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { supplier: params['supplier'] };

      axios(configs, resolve, reject);
    });
  }
}
