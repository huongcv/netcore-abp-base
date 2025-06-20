import {
    axios,
    basePath,
    getConfigs,
    GolfLatestInformationOfCustomer,
    IRequestConfig,
    IRequestOptions,
    OrdPageRequestGolfHistoryBookingCourse,
    PagedResultDtoOfGolfHistoryBookingCourseOfCustomer,
    PagedResultDtoOfGolfHistoryUsingServicesOfCustomer
} from './index.defs';

export class GolfCustomerHelperService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getLatestGolfInformationOfCustomer(
    params: {
      /**  */
      customerId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<GolfLatestInformationOfCustomer> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-customer-helper/get-latest-golf-information-of-customer/{customerId}';
      url = url.replace('{customerId}', params['customerId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getHistoryBookingCourseOfCustomer(
    params: {
      /** requestBody */
      body?: OrdPageRequestGolfHistoryBookingCourse;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfGolfHistoryBookingCourseOfCustomer> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-customer-helper/get-history-booking-course-of-customer';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getHistoryUsingServicesOfCustomer(
    params: {
      /** requestBody */
      body?: OrdPageRequestGolfHistoryBookingCourse;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfGolfHistoryUsingServicesOfCustomer> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-customer-helper/get-history-using-services-of-customer';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
