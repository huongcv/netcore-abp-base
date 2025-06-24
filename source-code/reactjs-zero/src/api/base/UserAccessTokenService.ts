import {
  GetUserAccessTokenPagedInput,
  CommonResultDtoOfPagedResultDtoOfUserAccessTokenDto,
  PagedResultDtoOfUserAccessTokenDto,
  UserAccessTokenDto,
  CommonResultDtoOfListOfUserAccessTokenDto,
  EncodedIdDto,
  CommonResultDtoOfBoolean,
  RevokeMultipleTokensDto,
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

export class UserAccessTokenService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPagedAsync(
    params: {
      /** requestBody */
      body?: GetUserAccessTokenPagedInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPagedResultDtoOfUserAccessTokenDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-access-token/get-paged-async';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getMyTokensAsync(options: IRequestOptions = {}): Promise<CommonResultDtoOfListOfUserAccessTokenDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-access-token/get-my-tokens-async';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static revokeAllTokensAsync(
    params: {
      /** requestBody */
      body?: EncodedIdDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-access-token/revoke-all-tokens-async';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static revokeTokensAsync(
    params: {
      /** requestBody */
      body?: RevokeMultipleTokensDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-access-token/revoke-tokens-async';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static revokeAllOtherTokensAsync(options: IRequestOptions = {}): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-access-token/revoke-all-other-tokens-async';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
