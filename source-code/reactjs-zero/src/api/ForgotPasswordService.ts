import {
    axios,
    basePath,
    CheckCodeForgotPasswordQuery,
    CommonResultDtoOfBoolean,
    CommonResultDtoOfUserBaseDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    SendEmailForgotPasswordQuery
} from './index.defs';

export class ForgotPasswordService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static sendEmailForgotPassword(
    params: {
      /** requestBody */
      body?: SendEmailForgotPasswordQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/forgot-password/send-email-forgot-password';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static checkCode(
    params: {
      /** requestBody */
      body?: CheckCodeForgotPasswordQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfUserBaseDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/forgot-password/check-code';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static changePassword(
    params: {
      /**  */
      newPassword: string;
      /**  */
      resetCode: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/forgot-password/change-password';

      const configs: IRequestConfig = getConfigs('post', 'multipart/form-data', url, options);

      let data = null;
      data = new FormData();
      if (params['newPassword']) {
        if (Object.prototype.toString.call(params['newPassword']) === '[object Array]') {
          for (const item of params['newPassword']) {
            data.append('NewPassword', item as any);
          }
        } else {
          data.append('NewPassword', params['newPassword'] as any);
        }
      }

      if (params['resetCode']) {
        if (Object.prototype.toString.call(params['resetCode']) === '[object Array]') {
          for (const item of params['resetCode']) {
            data.append('ResetCode', item as any);
          }
        } else {
          data.append('ResetCode', params['resetCode'] as any);
        }
      }

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
