import {
  SaleInvoiceGetListDto,
  OrdExportPaged,
  OrdColumnFilter,
  DateRangeDto,
  SaleInvoiceStatus,
  PAYMENT_METHOD,
  CHANNEL_TYPE,
  MOVE_TYPE,
  PagedResultDtoOfInvoiceReturnDto,
  InvoiceReturnDto,
  EinvoiceStatus,
  PrescriptionTypeEnum,
  InvoiceObjectTypeEnum,
  SaleInvoiceDetailDto,
  LotInventoryDto,
  SalesPrescriptionDto,
  PaymentMethodObjDto,
  PARTNER_TYPE,
  InvoiceStatusPagedCountDto,
  number,
  CommonResultDtoOfInvoiceReturnDto,
  CommonResultExtendDto,
  ValidateInputDto,
  string,
  CommonResultDtoOfSaleInvoiceDto,
  SaleInvoiceDto,
  CommonResultDtoOfListOfInvoiceReturnDetailSampleDto,
  InvoiceReturnDetailSampleDto,
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

export class InvoiceReturnService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: SaleInvoiceGetListDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfInvoiceReturnDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/invoice-return/get-paged';

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
      body?: SaleInvoiceGetListDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<InvoiceStatusPagedCountDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/invoice-return/get-count';

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
      findId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<InvoiceReturnDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/invoice-return/get-by-id/{findId}';
      url = url.replace('{findId}', params['findId'] + '');

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
      body?: InvoiceReturnDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfInvoiceReturnDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/invoice-return/create';

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
      removeId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfSaleInvoiceDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/invoice-return/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cancel(
    params: {
      /** requestBody */
      body?: InvoiceReturnDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfInvoiceReturnDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/invoice-return/cancel';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDetailByInvoiceId(
    params: {
      /**  */
      invoiceId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfListOfInvoiceReturnDetailSampleDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/invoice-return/get-detail-by-invoice-id/{invoiceId}';
      url = url.replace('{invoiceId}', params['invoiceId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/invoice-return/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportInvoiceReturnResult(
    params: {
      /** requestBody */
      body?: SaleInvoiceGetListDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/invoice-return/export-invoice-return-result';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportInvoiceReturnDetailResult(
    params: {
      /** requestBody */
      body?: SaleInvoiceGetListDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/invoice-return/export-invoice-return-detail-result';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
