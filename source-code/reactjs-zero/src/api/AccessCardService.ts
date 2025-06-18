import {
  AccessCardPageRequest,
  OrdExportPaged,
  OrdColumnFilter,
  AccessCardStatusEnum,
  AccessCardTypeEnum,
  PagedResultDtoOfAccessCardDto,
  AccessCardDto,
  OrdPagedRequestAccessCardHistory,
  PagedResultDtoOfAccessCardHistoryDto,
  AccessCardHistoryDto,
  number,
  AccessCardUseByBookingPlayerDto,
  ConfirmAccessCardLoseAndIssueDto,
  CommonResultDtoOfAccessCardUseByBookingPlayerDto,
  CommonResultExtendDto,
  ValidateInputDto,
  RevokeCardByAccessCardIdCommand,
  CommonResultDtoOfBoolean,
  CommonResultDtoOfAccessCardDto,
  ComboOptionDto,
  AccessCardAvairableInputDto,
  CommonResultDtoOfListOfComboOptionDto,
  string,
  AssignPartnerAccessCardDto,
  CommonResultDtoOfAssignPartnerAccessCardDto,
  GetMemberCardInfoQuerry,
  CommonResultDtoOfMemberInfoByCardMemberOutputDto,
  MemberInfoByCardMemberOutputDto,
  GENDER,
  ImportExcelAccessCardInputDto,
  ValidateErrorDetail,
  ImportExcelAccessCardOutputDto,
  FileUploadDto,
  CommonResultDtoOfImportExcelAccessCardOutputDto,
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

export class AccessCardService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: AccessCardPageRequest;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfAccessCardDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/access-card/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getAccessCardHistoryPaged(
    params: {
      /** requestBody */
      body?: OrdPagedRequestAccessCardHistory;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfAccessCardHistoryDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/access-card/get-access-card-history-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getListAccessCardHistoryByBookingPlayerId(
    params: {
      /**  */
      bookingPlayerId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<AccessCardUseByBookingPlayerDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/access-card/get-list-access-card-history-by-booking-player-id/{bookingPlayerId}';
      url = url.replace('{bookingPlayerId}', params['bookingPlayerId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static confirmAccessCardLoseAndIssue(
    params: {
      /** requestBody */
      body?: ConfirmAccessCardLoseAndIssueDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfAccessCardUseByBookingPlayerDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/access-card/confirm-access-card-lose-and-issue';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static revokeCardByAccessCardId(
    params: {
      /** requestBody */
      body?: RevokeCardByAccessCardIdCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/access-card/revoke-card-by-access-card-id';

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
      body?: AccessCardDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfAccessCardDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/access-card/create-or-update';

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
  ): Promise<CommonResultDtoOfAccessCardDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/access-card/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getById(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<AccessCardDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/access-card/{id}/get-by-id';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getComboOptions(options: IRequestOptions = {}): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/access-card/get-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/access-card/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getAccessCardAvairable(
    params: {
      /** requestBody */
      body?: AccessCardAvairableInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfListOfComboOptionDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/access-card/get-access-card-avairable';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static checkCardAvairable(
    params: {
      /**  */
      accessCardId: number;
      /**  */
      timeCheck?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/access-card/check-card-avairable/{accessCardId}';
      url = url.replace('{accessCardId}', params['accessCardId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { timeCheck: params['timeCheck'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updatePartnerAccessCard(
    params: {
      /** requestBody */
      body?: AssignPartnerAccessCardDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfAssignPartnerAccessCardDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/access-card/update-partner-access-card';

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getAccessCardInfoByCodeCheck(
    params: {
      /** requestBody */
      body?: GetMemberCardInfoQuerry;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfMemberInfoByCardMemberOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/access-card/get-access-card-info-by-code-check';

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
      let url = basePath + '/api/golf/access-card/export-template';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static validateImport(
    params: {
      /** requestBody */
      body?: ImportExcelAccessCardInputDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ImportExcelAccessCardOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/access-card/validate-import';

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
      body?: ImportExcelAccessCardInputDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfImportExcelAccessCardOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/access-card/import';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static checkCardByCodeCheck(
    params: {
      /**  */
      code?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfAccessCardDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/access-card/check-card-by-code-check';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { code: params['code'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportPagedResult(
    params: {
      /** requestBody */
      body?: AccessCardPageRequest;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/access-card/export-paged-result';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
