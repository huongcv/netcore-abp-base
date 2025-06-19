import {
    AssignPermissionsToRoleDto,
    axios,
    basePath,
    CommonResultDtoOfBoolean,
    CommonResultDtoOfListOfComboOptionDto,
    CommonResultDtoOfListOfCounterByStatusItemDto,
    CommonResultDtoOfListOfString,
    CommonResultDtoOfPagedResultDtoOfRolePagedDto,
    CommonResultDtoOfPagedResultDtoOfUserInRoleDto,
    CommonResultDtoOfRoleDetailDto,
    CreateRoleDto,
    EncodedIdDto,
    GetComboOptionInputDto,
    getConfigs,
    GetUsersInRoleInput,
    IRequestConfig,
    IRequestOptions,
    RolePagedInput,
    SetActiveStatusDto,
    UpdateRoleDto,
    UsersToRoleDto
} from './index.defs';

export class RoleService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static assignPermissions(
    params: {
      /** requestBody */
      body?: AssignPermissionsToRoleDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/role/assign-permissions';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getRolePermissions(
    params: {
      /** requestBody */
      body?: EncodedIdDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfListOfString> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/role/get-role-permissions';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getComboOptions(
    params: {
      /** requestBody */
      body?: GetComboOptionInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfListOfComboOptionDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/role/get-combo-options';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getUsersInRole(
    params: {
      /** requestBody */
      body?: GetUsersInRoleInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPagedResultDtoOfUserInRoleDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/role/get-users-in-role';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static addUsersToRole(
    params: {
      /** requestBody */
      body?: UsersToRoleDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/role/add-users-to-role';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static removeUsersFromRole(
    params: {
      /** requestBody */
      body?: UsersToRoleDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/role/remove-users-from-role';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportToExcel(
    params: {
      /** requestBody */
      body?: RolePagedInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/role/export-to-excel';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static create(
    params: {
      /** requestBody */
      body?: CreateRoleDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfRoleDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/role/create';

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
      body?: UpdateRoleDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfRoleDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/role/update';

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
      /** requestBody */
      body?: EncodedIdDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/role/remove';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static setActiveStatus(
    params: {
      /** requestBody */
      body?: SetActiveStatusDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/role/set-active-status';

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
      body?: RolePagedInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPagedResultDtoOfRolePagedDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/role/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getCountByActive(
    params: {
      /** requestBody */
      body?: RolePagedInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfListOfCounterByStatusItemDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/role/get-count-by-active';

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
      body?: EncodedIdDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfRoleDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/role/get-by-id';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
