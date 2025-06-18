import {
    AppBootstrapDto,
    axios,
    basePath,
    ChangePasswordCommand,
    CommonResultDtoOfBoolean,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    UpdateUserInformationCommand,
    UserInformationDto
} from './index.defs';

export class InformationService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getBoostrap(options: IRequestOptions = {}): Promise<AppBootstrapDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/information/get-boostrap';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getCurrentUser(options: IRequestOptions = {}): Promise<UserInformationDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/information/get-current-user';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static changePassword(
    params: {
      /** requestBody */
      body?: ChangePasswordCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/information/change-password';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearCacheUser(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/information/clear-cache-user';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateInformation(
    params: {
      /** requestBody */
      body?: UpdateUserInformationCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/information/update-information';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
