import {
    axios,
    basePath,
    CancelOrderDto,
    CommonResultDtoOfBoolean,
    CommonResultDtoOfIEnumerableOfTableStatusCounterDto,
    CommonResultDtoOfOrderByIdDto,
    CommonResultDtoOfPagedResultDtoOfFoodGridDto,
    CommonResultDtoOfPagedResultDtoOfProductGroupOrderDto,
    CommonResultDtoOfPagedResultDtoOfTableGridDto,
    CreateSaleOrderDto,
    FoodGridPagedDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    OrderGetPagedRequest,
    PagedResultDtoOfOrderGetPagedDto,
    PaymentOrderDto,
    ProductGroupOrderPagedDto,
    TableGridPagedDto,
    TableStatusCounterInputDto,
    UpdateOrderDto
} from './index.defs';

export class OrderRestaurantService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getTableStatusCounter(
    params: {
      /** requestBody */
      body?: TableStatusCounterInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfIEnumerableOfTableStatusCounterDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/restaurant/order-restaurant/get-table-status-counter';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getTableGrid(
    params: {
      /** requestBody */
      body?: TableGridPagedDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPagedResultDtoOfTableGridDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/restaurant/order-restaurant/get-table-grid';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getFoodGrid(
    params: {
      /** requestBody */
      body?: FoodGridPagedDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPagedResultDtoOfFoodGridDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/restaurant/order-restaurant/get-food-grid';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getProductGroup(
    params: {
      /** requestBody */
      body?: ProductGroupOrderPagedDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPagedResultDtoOfProductGroupOrderDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/restaurant/order-restaurant/get-product-group';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createOrder(
    params: {
      /** requestBody */
      body?: CreateSaleOrderDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/restaurant/order-restaurant/create-order';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateOrder(
    params: {
      /** requestBody */
      body?: UpdateOrderDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/restaurant/order-restaurant/update-order';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagedOrder(
    params: {
      /** requestBody */
      body?: OrderGetPagedRequest;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfOrderGetPagedDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/restaurant/order-restaurant/get-paged-order';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getOrderById(
    params: {
      /**  */
      idHash?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfOrderByIdDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/restaurant/order-restaurant/get-order-by-id';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { idHash: params['idHash'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static deleteOrder(
    params: {
      /**  */
      idHash?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/restaurant/order-restaurant/delete-order';

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);
      configs.params = { idHash: params['idHash'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cancelOrder(
    params: {
      /** requestBody */
      body?: CancelOrderDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/restaurant/order-restaurant/cancel-order';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static paymentOrder(
    params: {
      /** requestBody */
      body?: PaymentOrderDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/restaurant/order-restaurant/payment-order';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
