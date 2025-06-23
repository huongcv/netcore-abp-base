import {
    axios,
    basePath,
    CommonResultDtoOfJwtDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    LoginInputDto
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
      body?: LoginInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfJwtDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/auth/login';

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
      let url = basePath + '/api/auth/auth/logout';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
