import {
    axios,
    basePath,
    CommonResultDtoOfBoolean,
    CommonResultDtoOfMemberInfoByCardOutputDto,
    CommonResultDtoOfPlayerInfoByIdOutputDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    MemberInfoByCardInputDto
} from './index.defs';

export class CheckInService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static checkPlayerHaveAccessCard(
    params: {
      /**  */
      bookingPlayerId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/check-in/check-player-have-access-card/{bookingPlayerId}';
      url = url.replace('{bookingPlayerId}', params['bookingPlayerId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getMemberInfoByCard(
    params: {
      /** requestBody */
      body?: MemberInfoByCardInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfMemberInfoByCardOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/check-in/get-member-info-by-card';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getMemberInfoByPlayerId(
    params: {
      /**  */
      bookingPlayerId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPlayerInfoByIdOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/check-in/get-member-info-by-player-id/{bookingPlayerId}';
      url = url.replace('{bookingPlayerId}', params['bookingPlayerId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
