import {
  SyncDataRequestInputDto,
  ProductSyncDataDto,
  ProductSyncDto,
  ProductUnitSyncDto,
  ProductTypeEnum,
  string,
  number,
  InventoryLineSyncResponseDto,
  InventoryLineSyncDataDto,
  PartnerSyncDataDto,
  PartnerSyncDto,
  GENDER,
  PARTNER_TYPE,
  ProductPriceListSyncDataDto,
  ProductPriceListSyncDto,
  ProductPriceListDetailSyncDto,
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

export class SyncClientDatabaseService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getSyncProduct(
    params: {
      /** requestBody */
      body?: SyncDataRequestInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ProductSyncDataDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sync-client-database/get-sync-product';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getSyncProductUnit(
    params: {
      /** requestBody */
      body?: SyncDataRequestInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ProductSyncDataDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sync-client-database/get-sync-product-unit';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getSyncProductPrivate(
    params: {
      /**  */
      listId?: any | null[];
      /**  */
      lastModificationTime?: string;
      /**  */
      shopId?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ProductSyncDataDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sync-client-database/get-sync-product-private';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = {
        ListId: params['listId'],
        LastModificationTime: params['lastModificationTime'],
        ShopId: params['shopId']
      };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getSyncInventoryLine(
    params: {
      /** requestBody */
      body?: SyncDataRequestInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<InventoryLineSyncResponseDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sync-client-database/get-sync-inventory-line';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getSyncPartners(
    params: {
      /** requestBody */
      body?: SyncDataRequestInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PartnerSyncDataDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sync-client-database/get-sync-partners';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getSyncProductPrice(
    params: {
      /** requestBody */
      body?: SyncDataRequestInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ProductPriceListSyncDataDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sync-client-database/get-sync-product-price';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPrmQuery(
    params: {
      /**  */
      lastModificationTime?: string;
      /**  */
      listId: any | null[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sync-client-database/get-prm-query/{listId}';
      url = url.replace('{listId}', params['listId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { lastModificationTime: params['lastModificationTime'] };

      axios(configs, resolve, reject);
    });
  }
}
