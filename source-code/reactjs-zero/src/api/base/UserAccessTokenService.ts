import {
    axios,
    basePath,
    CommonResultDtoOfBoolean,
    CommonResultDtoOfListOfCounterByStatusItemDto,
    CommonResultDtoOfListOfUserAccessTokenDto,
    CommonResultDtoOfPagedResultDtoOfUserAccessTokenDto,
    EncodedIdDto,
    getConfigs,
    GetUserAccessTokenPagedInput,
    IRequestConfig,
    IRequestOptions,
    RevokeMultipleTokensDto
} from './index.defs';

export class UserAccessTokenService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: GetUserAccessTokenPagedInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPagedResultDtoOfUserAccessTokenDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-access-token/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getCountByStatus(
    params: {
      /** requestBody */
      body?: GetUserAccessTokenPagedInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfListOfCounterByStatusItemDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-access-token/get-count-by-status';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getMyTokens(options: IRequestOptions = {}): Promise<CommonResultDtoOfListOfUserAccessTokenDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-access-token/get-my-tokens';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static revokeAllTokens(
    params: {
      /** requestBody */
      body?: EncodedIdDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-access-token/revoke-all-tokens';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static revokeTokens(
    params: {
      /** requestBody */
      body?: RevokeMultipleTokensDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-access-token/revoke-tokens';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static revokeAllOtherTokens(options: IRequestOptions = {}): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-access-token/revoke-all-other-tokens';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
