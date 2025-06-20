import {
  axios,
  BarcodeProductGetInpuDto,
  basePath,
  CommonResultDtoOfProductDto,
  CommonResultDtoOfStockInventoryLineDetailEntity,
  FileUploadDto,
  getConfigs,
  GetProductLotNumberPageRequests,
  IRequestConfig,
  IRequestOptions,
  PagedResultDtoOfProductDto,
  PagedResultDtoOfProductLotDto,
  ProductCounterStatusDto,
  ProductDetailDto,
  ProductDto,
  ProductGetPagedInputDto,
  ProductInventoryAvailableDto,
  ProductUnitDto,
  UpdateImgUrlProductCommand,
  UpdateLotNumberDto
} from './index.defs';

export class ProductService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: ProductGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfProductDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getProductInventoryAvailable(options: IRequestOptions = {}): Promise<ProductInventoryAvailableDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product/get-product-inventory-available';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getCount(
    params: {
      /** requestBody */
      body?: ProductGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ProductCounterStatusDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product/get-count';

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
      body?: ProductDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfProductDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product/create-or-update';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

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
  ): Promise<CommonResultDtoOfProductDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product/{id}/update-change-is-active';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);
      configs.params = { isActived: params['isActived'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDetail(
    params: {
      /**  */
      idHash?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ProductDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product/get-detail';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { idHash: params['idHash'] };

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
  ): Promise<CommonResultDtoOfProductDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product/remove/{removeId}';
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
      body?: ProductGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product/export-paged-result';

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
      let url = basePath + '/api/pos/product/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static uploadProductImg(
    params: {
      /**  */
      files: [];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<FileUploadDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product/upload-product-img';

      const configs: IRequestConfig = getConfigs('post', 'multipart/form-data', url, options);

      let data = null;
      data = new FormData();
      if (params['files']) {
        if (Object.prototype.toString.call(params['files']) === '[object Array]') {
          for (const item of params['files']) {
            data.append('files', item as any);
          }
        } else {
          data.append('files', params['files'] as any);
        }
      }

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateImgUrl(
    params: {
      /** requestBody */
      body?: UpdateImgUrlProductCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product/update-img-url';

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getByBarcode(
    params: {
      /** requestBody */
      body?: BarcodeProductGetInpuDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfProductDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product/get-by-barcode';

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
  ): Promise<ProductDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product/{id}/get-by-id';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getUnits(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ProductUnitDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product/{id}/get-units';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static uploadImgBase64(
    params: {
      /**  */
      files: [];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<FileUploadDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product/upload-img-base64';

      const configs: IRequestConfig = getConfigs('post', 'multipart/form-data', url, options);

      let data = null;
      data = new FormData();
      if (params['files']) {
        if (Object.prototype.toString.call(params['files']) === '[object Array]') {
          for (const item of params['files']) {
            data.append('files', item as any);
          }
        } else {
          data.append('files', params['files'] as any);
        }
      }

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateIsActive(
    params: {
      /**  */
      isActive?: boolean;
      /**  */
      publishViewId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfProductDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product/update-is-active/{publishViewId}';
      url = url.replace('{publishViewId}', params['publishViewId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { isActive: params['isActive'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getLotNumberPaged(
    params: {
      /** requestBody */
      body?: GetProductLotNumberPageRequests;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfProductLotDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product/get-lot-number-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateLotNumber(
    params: {
      /** requestBody */
      body?: UpdateLotNumberDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfStockInventoryLineDetailEntity> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product/update-lot-number';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
