import {
  axios,
  basePath,
  CommonResultDtoOfProductCreateImportResponseDtoOfProductImportDto,
  CommonResultDtoOfProductCreateImportResponseDtoOfProductImportKiotVietDto,
  CommonResultDtoOfValidateProductImportResultOfProductImportDto,
  CommonResultDtoOfValidateProductImportResultOfProductImportKiotVietDto,
  getConfigs,
  InsertProductCommand,
  InsertProductKiotVietCommand,
  IRequestConfig,
  IRequestOptions
} from './index.defs';

export class ProductImportExcelService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getImportExcelTemplate(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-import-excel/get-import-excel-template';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getImportExcelKiotVietTemplate(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-import-excel/get-import-excel-kiot-viet-template';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static validateData(
    params: {
      /**  */
      uploadFile: any;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfValidateProductImportResultOfProductImportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-import-excel/validate-data';

      const configs: IRequestConfig = getConfigs('post', 'multipart/form-data', url, options);

      let data = null;
      data = new FormData();
      if (params['uploadFile']) {
        if (Object.prototype.toString.call(params['uploadFile']) === '[object Array]') {
          for (const item of params['uploadFile']) {
            data.append('UploadFile', item as any);
          }
        } else {
          data.append('UploadFile', params['uploadFile'] as any);
        }
      }

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static insert(
    params: {
      /** requestBody */
      body?: InsertProductCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfProductCreateImportResponseDtoOfProductImportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-import-excel/insert';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static validateDataKiotViet(
    params: {
      /**  */
      uploadFile: any;
      /**  */
      isProductChain: boolean;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfValidateProductImportResultOfProductImportKiotVietDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-import-excel/validate-data-kiot-viet';

      const configs: IRequestConfig = getConfigs('post', 'multipart/form-data', url, options);

      let data = null;
      data = new FormData();
      if (params['uploadFile']) {
        if (Object.prototype.toString.call(params['uploadFile']) === '[object Array]') {
          for (const item of params['uploadFile']) {
            data.append('UploadFile', item as any);
          }
        } else {
          data.append('UploadFile', params['uploadFile'] as any);
        }
      }

      if (params['isProductChain']) {
        if (Object.prototype.toString.call(params['isProductChain']) === '[object Array]') {
          for (const item of params['isProductChain']) {
            data.append('IsProductChain', item as any);
          }
        } else {
          data.append('IsProductChain', params['isProductChain'] as any);
        }
      }

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static insertKiotViet(
    params: {
      /** requestBody */
      body?: InsertProductKiotVietCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfProductCreateImportResponseDtoOfProductImportKiotVietDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-import-excel/insert-kiot-viet';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
