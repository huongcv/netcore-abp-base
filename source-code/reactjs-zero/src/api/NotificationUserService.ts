import {
    axios,
    basePath,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    NotificationUserPageListOutputDto,
    OrdPagedRequestDto
} from './index.defs';

export class NotificationUserService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getByUserId(
    params: {
      /**  */
      userId?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/system/notifications/get-by-user-id';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { userId: params['userId'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static testNotification(
    params: {
      /**  */
      deviceTokenId?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/system/notifications/test-notification';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { deviceTokenId: params['deviceTokenId'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getList(
    params: {
      /** requestBody */
      body?: OrdPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<NotificationUserPageListOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/system/notifications/get-list';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateRead(
    params: {
      /**  */
      notificationUserId?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/system/notifications/update-read';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { notificationUserId: params['notificationUserId'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateReadAll(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/system/notifications/update-read-all';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
