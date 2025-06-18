import {
    axios,
    basePath,
    CommonResultDtoOfGolfProductDto,
    getConfigs,
    GolfListProductWithCategoryComboOption,
    GolfProductDto,
    GolfProductSimpleDto,
    IRequestConfig,
    IRequestOptions,
    OrdGolfProductPagedInputDto,
    PagedResultDtoOfGolfProductDto
} from './index.defs';

export class GolfProductService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: OrdGolfProductPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfGolfProductDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-product/get-paged';

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
      body?: GolfProductDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfProductDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-product/create-or-update';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static remove(
    params: {
      /**  */
      removeId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfProductDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-product/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateChangeIsActive(
    params: {
      /**  */
      id: number;
      /**  */
      isActived?: boolean;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfProductDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-product/{id}/update-change-is-active';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { isActived: params['isActived'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getListProductWithCategoryComboOption(
    options: IRequestOptions = {}
  ): Promise<GolfListProductWithCategoryComboOption[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-product/get-list-product-with-category-combo-option';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-product/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getProductSimpleDto(options: IRequestOptions = {}): Promise<GolfProductSimpleDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-product/get-product-simple-dto';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
