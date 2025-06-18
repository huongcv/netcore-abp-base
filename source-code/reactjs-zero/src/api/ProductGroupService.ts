import {
  ProductGroupGetPaged,
  OrdExportPaged,
  OrdColumnFilter,
  PagedResultDtoOfProductGroupDto,
  ProductGroupDto,
  ProductGroupEnum,
  number,
  CommonResultDtoOfProductGroupDto,
  CommonResultExtendDto,
  ValidateInputDto,
  ComboOptionDto,
  ProductGroupImportDto,
  ValidateErrorDetail,
  ProductGroupImportOutputDto,
  FileUploadDto,
  CommonResultDtoOfProductGroupImportOutputDto,
  boolean,
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

export class ProductGroupService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: ProductGroupGetPaged;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfProductGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-group/get-paged';

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
  ): Promise<ProductGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-group/get-by-id/{findId}';
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
      body?: ProductGroupDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfProductGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-group/create-or-update';

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
  ): Promise<CommonResultDtoOfProductGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-group/remove/{removeId}';
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
      body?: ProductGroupGetPaged;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-group/export-paged-result';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getComboOptions(options: IRequestOptions = {}): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-group/get-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-group/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static validateImport(
    params: {
      /** requestBody */
      body?: ProductGroupImportDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ProductGroupImportOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-group/validate-import';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static import(
    params: {
      /** requestBody */
      body?: ProductGroupImportDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfProductGroupImportOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-group/import';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportTemplate(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-group/export-template';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static removeByPublishViewId(
    params: {
      /**  */
      publishViewId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfProductGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-group/remove-by-publish-view-id/{publishViewId}';
      url = url.replace('{publishViewId}', params['publishViewId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

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
  ): Promise<CommonResultDtoOfProductGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/product-group/{id}/update-change-is-active';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);
      configs.params = { isActived: params['isActived'] };

      axios(configs, resolve, reject);
    });
  }
}
