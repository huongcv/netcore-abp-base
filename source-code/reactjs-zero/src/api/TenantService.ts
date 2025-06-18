import {
    axios,
    basePath,
    ComboOptionDto,
    CommonResultDtoOfBoolean,
    CommonResultDtoOfShopInfoDto,
    CommonResultDtoOfTenantDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    OrdPagedRequestDto,
    PagedResultDtoOfShopInfoDto,
    PagedResultDtoOfTenantDto,
    PagedResultDtoOfUserDto,
    ResetPasswordCommand,
    ResetRoleAdminTenantCommand,
    ShopInfoDto,
    TenantCreateCommand,
    TenantDto,
    UserGetPagedQuery
} from './index.defs';

export class TenantService {
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
  ): Promise<PagedResultDtoOfTenantDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/tenant/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportPagedResult(
    params: {
      /** requestBody */
      body?: OrdPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/tenant/export-paged-result';

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
      findId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<TenantDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/tenant/get-by-id/{findId}';
      url = url.replace('{findId}', params['findId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static create(
    params: {
      /** requestBody */
      body?: TenantCreateCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfTenantDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/tenant/create';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static update(
    params: {
      /** requestBody */
      body?: TenantDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfTenantDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/tenant/update';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static resetRoleAdminTenant(
    params: {
      /** requestBody */
      body?: ResetRoleAdminTenantCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/tenant/reset-role-admin-tenant';

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
      tenantId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfTenantDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/tenant/remove/{tenantId}';
      url = url.replace('{tenantId}', params['tenantId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getUserList(
    params: {
      /**  */
      tenantId: string;
      /** requestBody */
      body?: UserGetPagedQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfUserDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/tenant/get-user-list/{tenantId}';
      url = url.replace('{tenantId}', params['tenantId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static resetPasswordUserTenant(
    params: {
      /**  */
      tenantId: string;
      /** requestBody */
      body?: ResetPasswordCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/tenant/reset-password-user-tenant/{tenantId}';
      url = url.replace('{tenantId}', params['tenantId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getTenantUsingIsStock(options: IRequestOptions = {}): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/tenant/get-tenant-using-is-stock';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getShopPaged(
    params: {
      /** requestBody */
      body?: OrdPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfShopInfoDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/tenant/get-shop-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getShopById(
    params: {
      /**  */
      guidId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfShopInfoDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/tenant/get-shop-by-id/{guidId}';
      url = url.replace('{guidId}', params['guidId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateShop(
    params: {
      /** requestBody */
      body?: ShopInfoDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/tenant/update-shop';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static deleteShop(
    params: {
      /**  */
      guidId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/tenant/delete-shop/{guidId}';
      url = url.replace('{guidId}', params['guidId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
