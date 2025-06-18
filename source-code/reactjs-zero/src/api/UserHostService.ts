import {
  CreateUserHostCommand,
  CommonResultDtoOfUserDto,
  CommonResultExtendDto,
  ValidateInputDto,
  UserDto,
  UpdateUserHostCommand,
  UserAssignRoleCommand,
  CommonResultDtoOfInt32,
  UserAssignOrUnassignOneRoleCommand,
  CommonResultDtoOfBoolean,
  string,
  RemoveUserHostCommand,
  ResetPasswordCommand,
  GetUserByIdQuery,
  UserGetPagedQuery,
  OrdExportPaged,
  OrdColumnFilter,
  DateRangeDto,
  PagedResultDtoOfUserDto,
  CounterByIsActivedDto,
  CounterByIsActivedItemDto,
  LoginPasswordlessQuery,
  CommonResultDtoOfJwtDto,
  JwtDto,
  TreeUserHostAssignDto,
  TreeUserHostAssignNote,
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

export class UserHostService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static create(
    params: {
      /** requestBody */
      body?: CreateUserHostCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfUserDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/user-host/create';

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
      body?: UpdateUserHostCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfUserDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/user-host/update';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static assignRole(
    params: {
      /** requestBody */
      body?: UserAssignRoleCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfInt32> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/user-host/assign-role';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static assignOneRole(
    params: {
      /** requestBody */
      body?: UserAssignOrUnassignOneRoleCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/user-host/assign-one-role';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPermissions(
    params: {
      /**  */
      userId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/user-host/get-permissions/{userId}';
      url = url.replace('{userId}', params['userId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static remove(
    params: {
      /** requestBody */
      body?: RemoveUserHostCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfUserDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/user-host/remove';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static unLock(
    params: {
      /**  */
      userId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/user-host/un-lock/{userId}';
      url = url.replace('{userId}', params['userId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static resetPassword(
    params: {
      /** requestBody */
      body?: ResetPasswordCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/user-host/reset-password';

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
      /** requestBody */
      body?: GetUserByIdQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<UserDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/user-host/get-by-id';

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
      body?: UserGetPagedQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfUserDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/user-host/get-paged';

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
      body?: UserGetPagedQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CounterByIsActivedDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/user-host/get-count';

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
      body?: UserGetPagedQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/user-host/export-paged-result';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static loginPasswordless(
    params: {
      /** requestBody */
      body?: LoginPasswordlessQuery;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfJwtDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/user-host/login-passwordless';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getTreeDataForUserHost(
    params: {
      /**  */
      strUserId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<TreeUserHostAssignDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/user-host/get-tree-data-for-user-host/{strUserId}';
      url = url.replace('{strUserId}', params['strUserId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPermissionUserHost(
    params: {
      /**  */
      strUserId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/user-host/get-permission-user-host/{strUserId}';
      url = url.replace('{strUserId}', params['strUserId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
