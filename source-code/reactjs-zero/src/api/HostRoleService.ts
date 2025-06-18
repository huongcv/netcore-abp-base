import {
  RoleDto,
  CommonResultDtoOfRoleDto,
  CommonResultExtendDto,
  ValidateInputDto,
  RoleSetPermissionCommand,
  CommonResultDtoOfInt32,
  RolePagedRequestDto,
  OrdExportPaged,
  OrdColumnFilter,
  PagedResultDtoOfRoleDto,
  string,
  GetListUserAssignByRoleQuery,
  PagedResultDtoOfRoleGetUserPagedDto,
  RoleGetUserPagedDto,
  UnassignUserCommand,
  CommonResultDtoOfBoolean,
  GetListPermissionQuery,
  ComboOptionDto,
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

export class HostRoleService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static create(
    params: {
      /** requestBody */
      body?: RoleDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfRoleDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/host-role/create';

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
      body?: RoleDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfRoleDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/host-role/update';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static setPermission(
    params: {
      /** requestBody */
      body?: RoleSetPermissionCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfInt32> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/host-role/set-permission';

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
      body?: RolePagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfRoleDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/host-role/get-paged';

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
  ): Promise<RoleDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/host-role/get-by-id/{findId}';
      url = url.replace('{findId}', params['findId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

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
  ): Promise<CommonResultDtoOfRoleDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/host-role/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getListUserAssignByRole(
    params: {
      /** requestBody */
      body?: GetListUserAssignByRoleQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfRoleGetUserPagedDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/host-role/get-list-user-assign-by-role';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static unassignUser(
    params: {
      /** requestBody */
      body?: UnassignUserCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/host-role/unassign-user';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getListPermission(
    params: {
      /** requestBody */
      body?: GetListPermissionQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/host-role/get-list-permission';

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
      let url = basePath + '/api/auth-plugin/host-role/get-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
