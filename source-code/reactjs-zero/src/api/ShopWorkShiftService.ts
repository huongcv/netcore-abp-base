import {
  ShopWorkShiftGetPagedInputDto,
  OrdExportPaged,
  OrdColumnFilter,
  DateRangeDto,
  SHOP_WORKSHIFT_STATUS,
  PagedResultDtoOfShopWorkShiftDto,
  ShopWorkShiftDto,
  SaleWorkShiftDetailDto,
  number,
  string,
  CommonResultDtoOfSummaryTotalClosingShiftDto,
  CommonResultExtendDto,
  ValidateInputDto,
  SummaryTotalClosingShiftDto,
  CommonResultDtoOfShopWorkShiftDto,
  SummaryTotalClosingShiftQuery,
  IList,
  List,
  IListResult,
  ListResultDto,
  IPagedResult,
  PagedResultDto,
  Dictionary,
  IDictionary,
  IRequestOptions,
  IRequestConfig,
  getConfigs,
  axios,
  basePath
} from './index.defs';

export class ShopWorkShiftService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: ShopWorkShiftGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfShopWorkShiftDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-shift/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getSummary(
    params: {
      /**  */
      shopWorkShiftId?: number;
      /**  */
      endDate?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfSummaryTotalClosingShiftDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-shift/get-summary';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { ShopWorkShiftId: params['shopWorkShiftId'], EndDate: params['endDate'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static checkAvairableWorkShift(options: IRequestOptions = {}): Promise<CommonResultDtoOfShopWorkShiftDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-shift/check-avairable-work-shift';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getCurrentSaleWorkShift(
    params: {
      /** requestBody */
      body?: SummaryTotalClosingShiftQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfSummaryTotalClosingShiftDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-shift/get-current-sale-work-shift';

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
      findId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ShopWorkShiftDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-shift/get-by-id/{findId}';
      url = url.replace('{findId}', params['findId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createOrUpdate(
    params: {
      /** requestBody */
      body?: ShopWorkShiftDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfShopWorkShiftDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-shift/create-or-update';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static closing(
    params: {
      /** requestBody */
      body?: ShopWorkShiftDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfShopWorkShiftDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-shift/closing';

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
      removeId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfShopWorkShiftDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-shift/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportPagedResult(
    params: {
      /** requestBody */
      body?: ShopWorkShiftGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-shift/export-paged-result';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-shift/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static printPdfById(
    params: {
      /**  */
      findId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/shop-work-shift/print-pdf-by-id/{findId}';
      url = url.replace('{findId}', params['findId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
