import {
  number,
  ComboOptionDto,
  PayDebtDto,
  AccountMovePartnerTypeEnum,
  PAYMENT_METHOD,
  CommonResultDtoOfBoolean,
  CommonResultExtendDto,
  ValidateInputDto,
  PartnerCategoryEnum,
  string,
  boolean,
  PagedResultDtoOfPartnerDto,
  PartnerDto,
  GENDER,
  PARTNER_TYPE,
  ImportPartnerInputDto,
  ValidateErrorDetail,
  CommonResultDtoOfImportPartnerOutputDto,
  ImportPartnerOutputDto,
  FileUploadDto,
  CommonResultDtoOfPartnerDto,
  PartnerLoyaltyTierHistoryPagingDto,
  OrdExportPaged,
  OrdColumnFilter,
  DateRangeDto,
  PagedResultDtoOfPartnerLoyaltyTierHistoryDto,
  PartnerLoyaltyTierHistoryDto,
  PartnerLoyaltyTransactionPagingDto,
  PagedResultDtoOfPartnerLoyaltyTransactionDto,
  PartnerLoyaltyTransactionDto,
  MOVE_TYPE,
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

export class PartnerService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getComboOptions(
    params: {
      /**  */
      partnerType?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/partner/get-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { partnerType: params['partnerType'] };

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
      let url = basePath + '/api/pos/partner/pay-debt';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPaged(
    params: {
      /**  */
      categoryId?: PartnerCategoryEnum;
      /**  */
      groupId?: number;
      /**  */
      filter?: string;
      /**  */
      textSearch?: string;
      /**  */
      filter2?: string;
      /**  */
      isActived?: boolean;
      /**  */
      type?: number;
      /**  */
      exportTitle?: string;
      /**  */
      exportColumnNames?: any | null[];
      /**  */
      exportOtherFields?: object;
      /**  */
      filtersIsActived?: any | null[];
      /**  */
      maxGetAllSize?: number;
      /**  */
      sorting?: string;
      /**  */
      skipCount?: number;
      /**  */
      maxResultCount?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfPartnerDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/partner/get-paged';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = {
        CategoryId: params['categoryId'],
        GroupId: params['groupId'],
        Filter: params['filter'],
        TextSearch: params['textSearch'],
        Filter2: params['filter2'],
        IsActived: params['isActived'],
        Type: params['type'],
        'Export.Title': params['exportTitle'],
        'Export.ColumnNames': params['exportColumnNames'],
        'Export.OtherFields': params['exportOtherFields'],
        'Filters.IsActived': params['filtersIsActived'],
        MaxGetAllSize: params['maxGetAllSize'],
        Sorting: params['sorting'],
        SkipCount: params['skipCount'],
        MaxResultCount: params['maxResultCount']
      };

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
      let url = basePath + '/api/pos/partner/import';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

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
      let url = basePath + '/api/pos/partner/validate-import';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

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
      let url = basePath + '/api/pos/partner/create-or-update';

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
      removeId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPartnerDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/partner/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

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
      let url = basePath + '/api/pos/partner/remove-by-id-hash/{hashId}';
      url = url.replace('{hashId}', params['hashId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

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
      let url = basePath + '/api/pos/partner/get-loyalty-tier-histroy';

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
      let url = basePath + '/api/pos/partner/get-loyalty-transaction';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
