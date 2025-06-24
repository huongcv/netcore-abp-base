import {
    axios,
    basePath,
    CommonResultDtoOfBoolean,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    LoginAsUserInputDto
} from './index.defs';

export class UserImpersonationService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static loginAsUser(
    params: {
      /** requestBody */
      body?: LoginAsUserInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-impersonation/login-as-user';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
