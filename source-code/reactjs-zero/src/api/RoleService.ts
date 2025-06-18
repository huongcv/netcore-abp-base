import {
    axios,
    basePath,
    ComboOptionDto,
    CommonResultDtoOfBoolean,
    CommonResultDtoOfInt32,
    CommonResultDtoOfRoleDto,
    CounterByIsActivedDto,
    getConfigs,
    GetListPermissionQuery,
    GetListUserAssignByRoleQuery,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfRoleDto,
    PagedResultDtoOfRoleGetUserPagedDto,
    RoleDto,
    RolePagedRequestDto,
    RoleSetPermissionCommand,
    UnassignUserCommand
} from './index.defs';

export class RoleService {
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
      let url = basePath + '/api/auth-plugin/role/create';

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
      let url = basePath + '/api/auth-plugin/role/update';

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
      let url = basePath + '/api/auth-plugin/role/set-permission';

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
      let url = basePath + '/api/auth-plugin/role/get-paged';

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
      body?: RolePagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CounterByIsActivedDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/role/get-count';

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
      let url = basePath + '/api/auth-plugin/role/get-by-id/{findId}';
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
      let url = basePath + '/api/auth-plugin/role/remove/{removeId}';
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
      let url = basePath + '/api/auth-plugin/role/get-list-user-assign-by-role';

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
      let url = basePath + '/api/auth-plugin/role/unassign-user';

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
      let url = basePath + '/api/auth-plugin/role/get-list-permission';

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
      let url = basePath + '/api/auth-plugin/role/get-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
