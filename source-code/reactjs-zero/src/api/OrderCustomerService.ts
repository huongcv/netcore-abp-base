import {
    axios,
    basePath,
    CommonResultDtoOfSaleOrderDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    SaleOrderDto
} from './index.defs';

export class OrderCustomerService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static createOrUpdate(
    params: {
      /** requestBody */
      body?: SaleOrderDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfSaleOrderDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/order-customer/create-or-update';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static upsertPartner(
    params: {
      /** requestBody */
      body?: SaleOrderDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/order-customer/upsert-partner';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static upsertOrder(
    params: {
      /** requestBody */
      body?: SaleOrderDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/order-customer/upsert-order';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static mappingOrderDetail(
    params: {
      /** requestBody */
      body?: SaleOrderDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/order-customer/mapping-order-detail';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static upsertDelivery(
    params: {
      /** requestBody */
      body?: SaleOrderDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/order-customer/upsert-delivery';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static genAutoCode(
    params: {
      /**  */
      str?: string;
      /** requestBody */
      body?: SaleOrderDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/order-customer/gen-auto-code';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { str: params['str'] };

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
