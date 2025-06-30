import {
  RefreshTokenRequest,
  CommonResultDtoOfJwtDto,
  JwtDto,
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

export class RefreshTokenService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static refreshToken(
    params: {
      /** requestBody */
      body?: RefreshTokenRequest;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfJwtDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/refresh-token';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static refreshTokenCookie(options: IRequestOptions = {}): Promise<CommonResultDtoOfJwtDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/refresh-token-cookie';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
