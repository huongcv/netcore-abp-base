import {
  CreateEinvoiceInput,
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
  CommonResultDtoOfCreateEinvoiceResultDto,
  CommonResultExtendDto,
  ValidateInputDto,
  CreateEinvoiceResultDto,
  CommonResultDtoOfBoolean,
  GetMisaInvoiceTemplateDataInputDto,
  MisaInvoiceTemplateData,
  number,
  ShopSettingDto,
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

export class EinvoiceService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static create(
    params: {
      /** requestBody */
      body?: CreateEinvoiceInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfCreateEinvoiceResultDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/einvoice/create';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static adjust(
    params: {
      /** requestBody */
      body?: SaleInvoiceDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfCreateEinvoiceResultDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/einvoice/adjust';

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
      body?: SaleInvoiceDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/einvoice/cancel';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createMerge(
    params: {
      /** requestBody */
      body?: CreateEinvoiceInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfCreateEinvoiceResultDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/einvoice/create-merge';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getMisaInvoiceTemplateList(
    params: {
      /** requestBody */
      body?: GetMisaInvoiceTemplateDataInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<MisaInvoiceTemplateData[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/einvoice/get-misa-invoice-template-list';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static autoMergeEinvoice(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/einvoice/auto-merge-einvoice';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static calculateQuotaStrategyPreview(
    params: {
      /**  */
      newMonthlyQuota?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ShopSettingDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/einvoice/calculate-quota-strategy-preview';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { newMonthlyQuota: params['newMonthlyQuota'] };

      axios(configs, resolve, reject);
    });
  }
}
