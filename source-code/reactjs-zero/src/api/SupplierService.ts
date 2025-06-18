import {
  number,
  CommonResultDtoOfPartnerDto,
  CommonResultExtendDto,
  ValidateInputDto,
  PartnerDto,
  GENDER,
  PARTNER_TYPE,
  PartnerCategoryEnum,
  PartnerPagingInputDto,
  OrdExportPaged,
  OrdColumnFilter,
  PagedResultDtoOfPartnerDto,
  CounterByIsActivedStatusDto,
  CounterByIsActivedItem,
  string,
  ImportPartnerInputDto,
  ValidateErrorDetail,
  ImportPartnerOutputDto,
  FileUploadDto,
  CommonResultDtoOfImportPartnerOutputDto,
  PartnerDebtRequestDto,
  DateRangeDto,
  PagedResultDtoOfStockInventoryMoveBaseDto,
  StockInventoryMoveBaseDto,
  MOVE_TYPE,
  MOVE_STATUS,
  DiscountTypeEnum,
  ComboOptionDto,
  PayDebtDto,
  AccountMovePartnerTypeEnum,
  PAYMENT_METHOD,
  CommonResultDtoOfBoolean,
  PartnerLoyaltyTierHistoryPagingDto,
  PagedResultDtoOfPartnerLoyaltyTierHistoryDto,
  PartnerLoyaltyTierHistoryDto,
  PartnerLoyaltyTransactionPagingDto,
  PagedResultDtoOfPartnerLoyaltyTransactionDto,
  PartnerLoyaltyTransactionDto,
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

export class SupplierService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static removeByPublishId(
    params: {
      /**  */
      removeId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPartnerDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/POS/supplier/remove-by-publish-id/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: PartnerPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfPartnerDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/supplier/get-paged';

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
      body?: PartnerPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CounterByIsActivedStatusDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/supplier/get-count';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getByHashId(
    params: {
      /**  */
      hashId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PartnerDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/supplier/get-by-hash-id/{hashId}';
      url = url.replace('{hashId}', params['hashId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

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
  ): Promise<PartnerDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/supplier/get-by-id/{findId}';
      url = url.replace('{findId}', params['findId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createOrUpdate(
    params: {
      /** requestBody */
      body?: PartnerDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPartnerDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/supplier/create-or-update';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static removeByIdHash(
    params: {
      /**  */
      hashId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPartnerDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/supplier/remove-by-id-hash/{hashId}';
      url = url.replace('{hashId}', params['hashId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static remove(
    params: {
      /**  */
      removeId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPartnerDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/supplier/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportPagedResult(
    params: {
      /** requestBody */
      body?: PartnerPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/supplier/export-paged-result';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportTemplate(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/supplier/export-template';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static validateImport(
    params: {
      /** requestBody */
      body?: ImportPartnerInputDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ImportPartnerOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/supplier/validate-import';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static import(
    params: {
      /** requestBody */
      body?: ImportPartnerInputDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfImportPartnerOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/supplier/import';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDebtOfPartner(
    params: {
      /** requestBody */
      body?: PartnerDebtRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfStockInventoryMoveBaseDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/supplier/get-debt-of-partner';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getComboOptions(options: IRequestOptions = {}): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/supplier/get-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static payDebt(
    params: {
      /** requestBody */
      body?: PayDebtDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/supplier/pay-debt';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getLoyaltyTierHistroy(
    params: {
      /** requestBody */
      body?: PartnerLoyaltyTierHistoryPagingDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfPartnerLoyaltyTierHistoryDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/supplier/get-loyalty-tier-histroy';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getLoyaltyTransaction(
    params: {
      /** requestBody */
      body?: PartnerLoyaltyTransactionPagingDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfPartnerLoyaltyTransactionDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/supplier/get-loyalty-transaction';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
