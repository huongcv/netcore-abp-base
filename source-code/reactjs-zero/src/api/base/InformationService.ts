import {
    axios,
    basePath,
    ChangePasswordUserDto,
    CommonResultDtoOfAppBootstrapDto,
    CommonResultDtoOfBoolean,
    getConfigs,
    IRequestConfig,
    IRequestOptions
} from './index.defs';

export class InformationService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getBootstrap(options: IRequestOptions = {}): Promise<CommonResultDtoOfAppBootstrapDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/information/get-bootstrap';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static changePasswordAsync(
    params: {
      /** requestBody */
      body?: ChangePasswordUserDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/information/change-password-async';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static ping(options: IRequestOptions = {}): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/information/ping';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
