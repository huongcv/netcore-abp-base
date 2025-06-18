import {
  number,
  string,
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

export class EinvoiceJobService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static autoExportMergeInvoiceJob(
    params: {
      /**  */
      currentShopId?: number;
      /**  */
      curentTenantId?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/einvoice-job/auto-export-merge-invoice-job';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { currentShopId: params['currentShopId'], curentTenantId: params['curentTenantId'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static generateMonthlyQuotaStrategyJob(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/einvoice-job/generate-monthly-quota-strategy-job';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateQuotaStrategyAfterChange(
    params: {
      /**  */
      newMonthlyQuota?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/einvoice-job/update-quota-strategy-after-change';

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);
      configs.params = { newMonthlyQuota: params['newMonthlyQuota'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static carryForwardUnusedQuotaJob(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/einvoice-job/carry-forward-unused-quota-job';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cleanUnexportedInvoicesJob(
    params: {
      /**  */
      currentShopId?: number;
      /**  */
      currentTenantId?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/einvoice-job/clean-unexported-invoices-job';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { currentShopId: params['currentShopId'], currentTenantId: params['currentTenantId'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static handleIssueMergeInvoice(options: IRequestOptions = {}): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/einvoice-job/handle-issue-merge-invoice';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static sendEmail(
    params: {
      /**  */
      body?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/einvoice-job/send-email';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { body: params['body'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static sendQuotaEmailJob(
    params: {
      /**  */
      body?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/einvoice-job/send-quota-email-job';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { body: params['body'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static generateQuotaStrategyForMonth(
    params: {
      /**  */
      monthlyQuota?: number;
      /**  */
      year?: number;
      /**  */
      month?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/einvoice-job/generate-quota-strategy-for-month';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { monthlyQuota: params['monthlyQuota'], year: params['year'], month: params['month'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static generateQuotaStrategy(
    params: {
      /**  */
      monthlyQuota?: number;
      /**  */
      year?: number;
      /**  */
      month?: number;
      /**  */
      currentDay?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/einvoice-job/generate-quota-strategy';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = {
        monthlyQuota: params['monthlyQuota'],
        year: params['year'],
        month: params['month'],
        currentDay: params['currentDay']
      };

      axios(configs, resolve, reject);
    });
  }
}
