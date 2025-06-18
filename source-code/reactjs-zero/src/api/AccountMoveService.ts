import {
  AccountMovePagingInputDto,
  OrdExportPaged,
  OrdColumnFilter,
  DateRangeDto,
  ACCOUNT_MOVE_TYPE,
  PAYMENT_METHOD,
  MOVE_STATUS,
  PagedResultDtoOfAccountMoveDto,
  AccountMoveDto,
  REASON_TYPE,
  AccountMovePartnerTypeEnum,
  MOVE_TYPE,
  DebtInfo_DetailsDto,
  number,
  SummaryPaggingAcountMove,
  CommonResultDtoOfBoolean,
  CommonResultExtendDto,
  ValidateInputDto,
  string,
  CommonResultDtoOfCashbookStatisticsOutputDto,
  CashbookStatisticsOutputDto,
  DebtInfoDto,
  CruCustomerDebtCommand,
  CommonResultDtoOfString,
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

export class AccountMoveService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: AccountMovePagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfAccountMoveDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move/get-paged';

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
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<AccountMoveDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move/{id}/get-by-id';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static summaryAcountMove(
    params: {
      /** requestBody */
      body?: AccountMovePagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SummaryPaggingAcountMove[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move/summary-acount-move';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cruAcountMove(
    params: {
      /** requestBody */
      body?: AccountMoveDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move/cru-acount-move';

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
      body?: AccountMoveDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move/create-or-update';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDebtDetailsInAccMove(
    params: {
      /**  */
      accountMoveId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<DebtInfo_DetailsDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move/get-debt-details-in-acc-move/{accountMoveId}';
      url = url.replace('{accountMoveId}', params['accountMoveId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static destroyAcountMove(
    params: {
      /**  */
      idHash?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move/destroy-acount-move';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { idHash: params['idHash'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static removeByPublishViewId(
    params: {
      /**  */
      idHash: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move/removeByPublishViewId/{idHash}';
      url = url.replace('{idHash}', params['idHash'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static deleteAcountMove(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move/{id}/delete-acount-move';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cashbookStatistics(
    params: {
      /** requestBody */
      body?: AccountMovePagingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfCashbookStatisticsOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move/cashbook-statistics';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPartnerDebtInfo(
    params: {
      /**  */
      partnerId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<DebtInfoDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move/get-partner-debt-info/{partnerId}';
      url = url.replace('{partnerId}', params['partnerId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cruDebt(
    params: {
      /** requestBody */
      body?: CruCustomerDebtCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move/cru-debt';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static removeDebtByPartnerTransId(
    params: {
      /**  */
      removeId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move/remove-debt-by-partner-trans-id/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static printReceiptsOrPayments(
    params: {
      /**  */
      idHash: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move/print-receipts-or-payments/{idHash}';
      url = url.replace('{idHash}', params['idHash'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createPrintReceiptsOrPayments(
    params: {
      /**  */
      idHash: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfString> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move/create-print-receipts-or-payments/{idHash}';
      url = url.replace('{idHash}', params['idHash'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static viewReceiptsOrPayments(
    params: {
      /**  */
      idHash: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move/view-receipts-or-payments/{idHash}';
      url = url.replace('{idHash}', params['idHash'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
