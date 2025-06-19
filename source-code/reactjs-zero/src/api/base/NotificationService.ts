import {
    axios,
    basePath,
    CommonResultDtoOfBoolean,
    CommonResultDtoOfInt32,
    CommonResultDtoOfNotificationSummaryDto,
    CommonResultDtoOfPagedResultDtoOfUserNotificationDto,
    EncodedIdDto,
    getConfigs,
    GetUserNotificationInput,
    IRequestConfig,
    IRequestOptions
} from './index.defs';

export class NotificationService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getUserNotificationsAsync(
    params: {
      /** requestBody */
      body?: GetUserNotificationInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPagedResultDtoOfUserNotificationDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/notification/get-user-notifications-async';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static markAsReadAsync(
    params: {
      /** requestBody */
      body?: EncodedIdDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/notification/mark-as-read-async';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static markAllAsReadAsync(options: IRequestOptions = {}): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/notification/mark-all-as-read-async';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static removeAsync(
    params: {
      /** requestBody */
      body?: EncodedIdDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/notification/remove-async';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getUnreadCountAsync(options: IRequestOptions = {}): Promise<CommonResultDtoOfInt32> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/notification/get-unread-count-async';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getNotificationSummaryAsync(options: IRequestOptions = {}): Promise<CommonResultDtoOfNotificationSummaryDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/notification/get-notification-summary-async';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
