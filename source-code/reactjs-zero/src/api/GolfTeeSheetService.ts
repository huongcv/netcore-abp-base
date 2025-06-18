import {
    AddProductForPlayerInputDto,
    axios,
    basePath,
    CommonResultDtoOfBoolean,
    CommonResultDtoOfGolfCheckoutOutputDto,
    getConfigs,
    GetInfoBeforeCheckoutQuerry,
    GolfCheckNeedReturnItemCommand,
    GolfCheckoutCommand,
    GolfInfoBeforeCheckoutOutputDto,
    IRequestConfig,
    IRequestOptions,
    ReturnItemAndLockerInputDto
} from './index.defs';

export class GolfTeeSheetService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static addProductForPlayer(
    params: {
      /** requestBody */
      body?: AddProductForPlayerInputDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-tee-sheet/add-product-for-player';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static checkNeedReturnItem(
    params: {
      /** requestBody */
      body?: GolfCheckNeedReturnItemCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-tee-sheet/check-need-return-item';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getInfoBeforeCheckout(
    params: {
      /** requestBody */
      body?: GetInfoBeforeCheckoutQuerry;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<GolfInfoBeforeCheckoutOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-tee-sheet/get-info-before-checkout';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static returnItemAndLocker(
    params: {
      /** requestBody */
      body?: ReturnItemAndLockerInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-tee-sheet/return-item-and-locker';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static checkout(
    params: {
      /** requestBody */
      body?: GolfCheckoutCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfCheckoutOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-tee-sheet/checkout';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static paymentAndCheckout(
    params: {
      /** requestBody */
      body?: GolfCheckoutCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfCheckoutOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-tee-sheet/payment-and-checkout';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cancelCheckout(
    params: {
      /**  */
      bookingPlayerId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-tee-sheet/cancel-checkout/{bookingPlayerId}';
      url = url.replace('{bookingPlayerId}', params['bookingPlayerId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
