import {
    axios,
    basePath,
    CommonResultDtoOfBoolean,
    CommonResultDtoOfPasswordConfigDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PasswordConfigDto
} from './index.defs';

export class HostSystemSettingService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPasswordConfig(options: IRequestOptions = {}): Promise<CommonResultDtoOfPasswordConfigDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/host-system-setting/get-password-config';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updatePasswordConfig(
    params: {
      /** requestBody */
      body?: PasswordConfigDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/host-system-setting/update-password-config';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
