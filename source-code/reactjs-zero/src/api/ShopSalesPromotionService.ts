import {
    axios,
    basePath,
    CommonResultDtoOfSalesPromotionDto,
    CreateSalesPromotionDto,
    DeserializeSalesPromotionDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    OrdPagedRequestDto,
    PagedResultDtoOfSalesPromotionDto
} from './index.defs';

export class ShopSalesPromotionService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: OrdPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfSalesPromotionDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-sales-promotion/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createOrUpdate(
    params: {
      /** requestBody */
      body?: CreateSalesPromotionDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfSalesPromotionDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-sales-promotion/create-or-update';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getById(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<DeserializeSalesPromotionDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-sales-promotion/{id}/get-by-id';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
