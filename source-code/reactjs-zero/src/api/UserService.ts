import {
  CreateUserCommand,
  CommonResultDtoOfUserDto,
  CommonResultExtendDto,
  ValidateInputDto,
  UserDto,
  UpdateCommand,
  UserAssignRoleCommand,
  CommonResultDtoOfInt32,
  UserAssignOrUnassignOneRoleCommand,
  CommonResultDtoOfBoolean,
  string,
  RemoveUserCommand,
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

export class UserService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static create(
    params: {
      /** requestBody */
      body?: CreateUserCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfUserDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/user/create';

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
      body?: UpdateCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfUserDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/user/update';

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
      let url = basePath + '/api/auth-plugin/user/assign-role';

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
      let url = basePath + '/api/auth-plugin/user/assign-one-role';

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
      let url = basePath + '/api/auth-plugin/user/get-permissions/{userId}';
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
      body?: RemoveUserCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfUserDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/user/remove';

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
      let url = basePath + '/api/auth-plugin/user/un-lock/{userId}';
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
      let url = basePath + '/api/auth-plugin/user/reset-password';

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
      let url = basePath + '/api/auth-plugin/user/get-by-id';

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
      let url = basePath + '/api/auth-plugin/user/get-paged';

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
      let url = basePath + '/api/auth-plugin/user/get-count';

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
      let url = basePath + '/api/auth-plugin/user/export-paged-result';

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
      let url = basePath + '/api/auth-plugin/user/login-passwordless';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
