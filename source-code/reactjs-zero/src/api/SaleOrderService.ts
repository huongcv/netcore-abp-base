import {
  SaleOrderGetPagedInputDto,
  OrdExportPaged,
  OrdColumnFilter,
  PagedResultDtoOfSaleOrderDto,
  SaleOrderDto,
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  SaleOrderDetailDto,
  ComboOptionDto,
  SaleOrderDeliveryDto,
  DELIVERY_TYPE,
  PARTNER_TYPE,
  SaleOrderStatusDto,
  string,
  CommonResultDtoOfSaleOrderDto,
  CommonResultExtendDto,
  ValidateInputDto,
  boolean,
  ProductOrderDto,
  ProductUnitDto,
  ProductLotNumberInitDto,
  ProductDrugDto,
  ProductStockInventoryStatus,
  number,
  CommonResultDtoOfPagedResultDtoOfSaleOrderDetailDto,
  PagedResultDtoOfSaleOrderDetailDto,
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

export class SaleOrderService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: SaleOrderGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfSaleOrderDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-order/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getCount(
    params: {
      /** requestBody */
      body?: SaleOrderGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SaleOrderStatusDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-order/get-count';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getSaleOrderById(
    params: {
      /**  */
      idHash?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfSaleOrderDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-order/get-sale-order-by-id';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { idHash: params['idHash'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createOrUpdate(
    params: {
      /**  */
      isDraft?: boolean;
      /** requestBody */
      body?: SaleOrderDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfSaleOrderDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-order/create-or-update';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { isDraft: params['isDraft'] };

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
      /**  */
      isDraft?: boolean;
      /** requestBody */
      body?: SaleOrderDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-order/upsert-order';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { isDraft: params['isDraft'] };

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getProductInventoryAvailable(options: IRequestOptions = {}): Promise<ProductOrderDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-order/get-product-inventory-available';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getProductOrderGrid(
    params: {
      /**  */
      productGroupId?: number;
      /**  */
      priceListId?: number;
      /**  */
      filter?: string;
      /**  */
      textSearch?: string;
      /**  */
      filter2?: string;
      /**  */
      isActived?: boolean;
      /**  */
      type?: number;
      /**  */
      exportTitle?: string;
      /**  */
      exportColumnNames?: any | null[];
      /**  */
      exportOtherFields?: object;
      /**  */
      filtersIsActived?: any | null[];
      /**  */
      maxGetAllSize?: number;
      /**  */
      sorting?: string;
      /**  */
      skipCount?: number;
      /**  */
      maxResultCount?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPagedResultDtoOfSaleOrderDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-order/get-product-order-grid';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = {
        ProductGroupId: params['productGroupId'],
        PriceListId: params['priceListId'],
        Filter: params['filter'],
        TextSearch: params['textSearch'],
        Filter2: params['filter2'],
        IsActived: params['isActived'],
        Type: params['type'],
        'Export.Title': params['exportTitle'],
        'Export.ColumnNames': params['exportColumnNames'],
        'Export.OtherFields': params['exportOtherFields'],
        'Filters.IsActived': params['filtersIsActived'],
        MaxGetAllSize: params['maxGetAllSize'],
        Sorting: params['sorting'],
        SkipCount: params['skipCount'],
        MaxResultCount: params['maxResultCount']
      };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static genOrderDetail(
    params: {
      /** requestBody */
      body?: SaleOrderDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-order/gen-order-detail';

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
      body?: SaleOrderDeliveryDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-order/upsert-delivery';

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
      let url = basePath + '/api/pos/sale-order/gen-auto-code';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { str: params['str'] };

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
