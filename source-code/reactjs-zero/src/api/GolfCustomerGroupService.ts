import {
  number,
  boolean,
  CommonResultDtoOfPartnerGroupDto,
  CommonResultExtendDto,
  ValidateInputDto,
  PartnerGroupDto,
  PARTNER_TYPE,
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

export class GolfCustomerGroupService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static changePartnerGroupStatus(
    params: {
      /**  */
      groupId: number;
      /**  */
      isActived?: boolean;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPartnerGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-customer-group/change-partner-group-status/{groupId}';
      url = url.replace('{groupId}', params['groupId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { isActived: params['isActived'] };

      axios(configs, resolve, reject);
    });
  }
}
