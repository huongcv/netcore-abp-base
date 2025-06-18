import {
    axios,
    basePath,
    CaddyWorkSchedulePagedRequestDto,
    ComboOptionDto,
    CommonResultDtoOfBoolean,
    CommonResultDtoOfImportPartnerOutputDto,
    CommonResultDtoOfPartnerDto,
    getConfigs,
    ImportPartnerInputDto,
    ImportPartnerOutputDto,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfCaddyWorkScheduleDto,
    PagedResultDtoOfPartnerDto,
    PagedResultDtoOfPartnerLoyaltyTierHistoryDto,
    PagedResultDtoOfPartnerLoyaltyTransactionDto,
    PartnerDto,
    PartnerLoyaltyTierHistoryPagingDto,
    PartnerLoyaltyTransactionPagingDto,
    PartnerPagingInputDto,
    PayDebtDto
} from './index.defs';

export class GolfCaddyService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

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
      let url = basePath + '/api/golf/golf-caddy/export-paged-result';

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
      let url = basePath + '/api/golf/golf-caddy/export-template';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

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
      let url = basePath + '/api/golf/golf-caddy/create-or-update';

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
      /** requestBody */
      body?: PartnerPagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfPartnerDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-caddy/get-paged';

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
      let url = basePath + '/api/golf/golf-caddy/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

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
      let url = basePath + '/api/golf/golf-caddy/remove-by-id-hash/{hashId}';
      url = url.replace('{hashId}', params['hashId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getCaddyWorkSchedule(
    params: {
      /** requestBody */
      body?: CaddyWorkSchedulePagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfCaddyWorkScheduleDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-caddy/get-caddy-work-schedule';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getCaddyComboOption(options: IRequestOptions = {}): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-caddy/get-caddy-combo-option';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

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
      let url = basePath + '/api/golf/golf-caddy/import';

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
      let url = basePath + '/api/golf/golf-caddy/validate-import';

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
      let url = basePath + '/api/golf/golf-caddy/get-combo-options';

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
      let url = basePath + '/api/golf/golf-caddy/pay-debt';

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
      let url = basePath + '/api/golf/golf-caddy/get-loyalty-tier-histroy';

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
      let url = basePath + '/api/golf/golf-caddy/get-loyalty-transaction';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
