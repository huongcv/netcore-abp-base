import {
  PartnerPagingInputDto,
  OrdExportPaged,
  OrdColumnFilter,
  PartnerCategoryEnum,
  PagedResultDtoOfGolfCustomerDto,
  GolfCustomerDto,
  GENDER,
  PARTNER_TYPE,
  AccessCardDto,
  AccessCardStatusEnum,
  AccessCardTypeEnum,
  CounterByIsActivedStatusDto,
  CounterByIsActivedItem,
  string,
  PartnerDto,
  number,
  CommonResultDtoOfBoolean,
  CommonResultExtendDto,
  ValidateInputDto,
  PagedGolfPartnerAccessCardDto,
  PagedResultDtoOfPartnerAccessCardDto,
  PartnerAccessCardDto,
  CommonResultDtoOfGolfCustomerDto,
  boolean,
  PagedResultDtoOfPartnerDto,
  ImportPartnerInputDto,
  ValidateErrorDetail,
  CommonResultDtoOfImportPartnerOutputDto,
  ImportPartnerOutputDto,
  FileUploadDto,
  CommonResultDtoOfPartnerDto,
  ComboOptionDto,
  PayDebtDto,
  AccountMovePartnerTypeEnum,
  PAYMENT_METHOD,
  PartnerLoyaltyTierHistoryPagingDto,
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

export class GolfCustomerService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPagedGolfPartner(
    params: {
      /** requestBody */
      body?: PartnerPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfGolfCustomerDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-customer/get-paged-golf-partner';

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
      let url = basePath + '/api/golf/golf-customer/get-count';

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
      let url = basePath + '/api/golf/golf-customer/get-by-hash-id/{hashId}';
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
  ): Promise<GolfCustomerDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-customer/get-by-id/{findId}';
      url = url.replace('{findId}', params['findId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static removePartnerAccessCard(
    params: {
      /**  */
      partnerAccessCardId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-customer/remove-partner-access-card/{partnerAccessCardId}';
      url = url.replace('{partnerAccessCardId}', params['partnerAccessCardId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static revokerPartnerAccessCard(
    params: {
      /**  */
      partnerAccessCardId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-customer/revoker-partner-access-card/{partnerAccessCardId}';
      url = url.replace('{partnerAccessCardId}', params['partnerAccessCardId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getAccessCardByPartnerId(
    params: {
      /** requestBody */
      body?: PagedGolfPartnerAccessCardDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfPartnerAccessCardDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-customer/get-access-card-by-partner-id';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createOrUpdateGolfPartner(
    params: {
      /** requestBody */
      body?: GolfCustomerDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfCustomerDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-customer/create-or-update-golf-partner';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

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
      let url = basePath + '/api/golf/golf-customer/export-paged-result';

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
      let url = basePath + '/api/golf/golf-customer/export-template';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

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
      let url = basePath + '/api/golf/golf-customer/get-paged';

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
      let url = basePath + '/api/golf/golf-customer/import';

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
      let url = basePath + '/api/golf/golf-customer/validate-import';

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
      let url = basePath + '/api/golf/golf-customer/create-or-update';

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
      let url = basePath + '/api/golf/golf-customer/remove/{removeId}';
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
      let url = basePath + '/api/golf/golf-customer/remove-by-id-hash/{hashId}';
      url = url.replace('{hashId}', params['hashId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getComboOptions(options: IRequestOptions = {}): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-customer/get-combo-options';

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
      let url = basePath + '/api/golf/golf-customer/pay-debt';

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
      let url = basePath + '/api/golf/golf-customer/get-loyalty-tier-histroy';

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
      let url = basePath + '/api/golf/golf-customer/get-loyalty-transaction';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
