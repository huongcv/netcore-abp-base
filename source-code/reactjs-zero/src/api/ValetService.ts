import {
  ValetGetCustomerInforReq,
  CommonResultDtoOfMemberInfoByCardOutputDto,
  CommonResultExtendDto,
  ValidateInputDto,
  MemberInfoByCardOutputDto,
  MemberInfoByCardMemberOutputDto,
  GENDER,
  AccessCardStatusEnum,
  MemberInfoByCardBookingOutputDto,
  BookingSourceEnum,
  BookingStatusEnum,
  GameTypeEnum,
  TimeSpan,
  CheckinStatusEnum,
  ReleaseCardHistoryPageReq,
  OrdExportPaged,
  OrdColumnFilter,
  PagedResultDtoOfReleaseCardHistoryOutput,
  ReleaseCardHistoryOutput,
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

export class ValetService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static valetGetCheckInInfoByCustomer(
    params: {
      /** requestBody */
      body?: ValetGetCustomerInforReq;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfMemberInfoByCardOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/valet/valet-get-check-in-info-by-customer';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getReleaseCardHistory(
    params: {
      /** requestBody */
      body?: ReleaseCardHistoryPageReq;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfReleaseCardHistoryOutput> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/valet/get-release-card-history';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
