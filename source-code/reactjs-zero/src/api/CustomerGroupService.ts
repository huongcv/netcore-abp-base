import {
  axios,
  basePath,
  ComboOptionDto,
  CommonResultDtoOfImportExcelPartnerGroupOutputDto,
  CommonResultDtoOfPartnerGroupDto,
  CounterByIsActivedStatusDto,
  getConfigs,
  ImportExcelPartnerGroupInputDto,
  ImportExcelPartnerGroupOutputDto,
  IRequestConfig,
  IRequestOptions,
  PagedResultDtoOfPartnerGroupDto,
  PartnerGroupDto,
  PartnerGroupPagedRequestDto
} from './index.defs';

export class CustomerGroupService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPagedInPriceListDetailToAdd(
    params: {
      /** requestBody */
      body?: PartnerGroupPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfPartnerGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/customer-group/get-paged-in-price-list-detail-to-add';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getCountInPriceListDetailToAdd(
    params: {
      /** requestBody */
      body?: PartnerGroupPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CounterByIsActivedStatusDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/customer-group/get-count-in-price-list-detail-to-add';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagedInPriceListDetail(
    params: {
      /** requestBody */
      body?: PartnerGroupPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfPartnerGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/customer-group/get-paged-in-price-list-detail';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: PartnerGroupPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfPartnerGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/customer-group/get-paged';

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
      body?: PartnerGroupPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CounterByIsActivedStatusDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/customer-group/get-count';

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
  ): Promise<PartnerGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/customer-group/get-by-id/{findId}';
      url = url.replace('{findId}', params['findId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getComboOptions(options: IRequestOptions = {}): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/customer-group/get-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportPagedResult(
    params: {
      /** requestBody */
      body?: PartnerGroupPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/customer-group/export-paged-result';

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
      body?: ImportExcelPartnerGroupInputDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfImportExcelPartnerGroupOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/customer-group/import';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static validateImport(
    params: {
      /** requestBody */
      body?: ImportExcelPartnerGroupInputDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ImportExcelPartnerGroupOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/customer-group/validate-import';

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
      let url = basePath + '/api/pos/customer-group/export-template';

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
      body?: PartnerGroupDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPartnerGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/customer-group/create-or-update';

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
  ): Promise<CommonResultDtoOfPartnerGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/customer-group/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static removeByHashId(
    params: {
      /**  */
      hashId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPartnerGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/customer-group/remove-by-hash-id/{hashId}';
      url = url.replace('{hashId}', params['hashId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/customer-group/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
