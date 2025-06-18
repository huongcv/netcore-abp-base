import {
  LoginQuery,
  CommonResultDtoOfJwtDto,
  CommonResultExtendDto,
  ValidateInputDto,
  JwtDto,
  ChangeShopQuery,
  string,
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

export class AuthService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static login(
    params: {
      /** requestBody */
      body?: LoginQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfJwtDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/auth/login';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static changeShop(
    params: {
      /** requestBody */
      body?: ChangeShopQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfJwtDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/auth/change-shop';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static logout(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/auth/logout';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static refreshToken(options: IRequestOptions = {}): Promise<CommonResultDtoOfJwtDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/auth/refresh-token';

      const configs: IRequestConfig = getConfigs('post', 'application/x-www-form-urlencoded', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPasswordHash(
    params: {
      /**  */
      raw?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/auth/get-password-hash';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { raw: params['raw'] };

      axios(configs, resolve, reject);
    });
  }
}
