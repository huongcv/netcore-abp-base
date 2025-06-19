import {
    AssignRolesToUserDto,
    axios,
    basePath,
    CommonResultDtoOfBoolean,
    CommonResultDtoOfIEnumerableOfGuid,
    CommonResultDtoOfIEnumerableOfString,
    CommonResultDtoOfListOfComboOptionDto,
    CommonResultDtoOfListOfCounterByStatusItemDto,
    CommonResultDtoOfPagedResultDtoOfUserPagedDto,
    CommonResultDtoOfUserDetailDto,
    CreateUserDto,
    EncodedIdDto,
    GetComboOptionInputDto,
    getConfigs,
    GrantPermissionToUserDto,
    IRequestConfig,
    IRequestOptions,
    ResetPasswordUserDto,
    RevokePermissionFromUserDto,
    SetActiveStatusDto,
    UpdateUserDto,
    UserPagedInput
} from './index.defs';

export class UserHostService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

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
      let url = basePath + '/api/auth/user-host/get-combo-options';

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
      /** requestBody */
      body?: EncodedIdDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-host/un-lock';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static resetPassword(
    params: {
      /** requestBody */
      body?: ResetPasswordUserDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-host/reset-password';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getUserRoles(
    params: {
      /** requestBody */
      body?: EncodedIdDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfIEnumerableOfGuid> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-host/get-user-roles';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static assignRoles(
    params: {
      /** requestBody */
      body?: AssignRolesToUserDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-host/assign-roles';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getUserPermissions(
    params: {
      /** requestBody */
      body?: EncodedIdDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfIEnumerableOfString> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-host/get-user-permissions';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static grantPermission(
    params: {
      /** requestBody */
      body?: GrantPermissionToUserDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-host/grant-permission';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static revokePermission(
    params: {
      /** requestBody */
      body?: RevokePermissionFromUserDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-host/revoke-permission';

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
      body?: UserPagedInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-host/export-to-excel';

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
      body?: CreateUserDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfUserDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-host/create';

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
      body?: UpdateUserDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfUserDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-host/update';

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
      let url = basePath + '/api/auth/user-host/remove';

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
      let url = basePath + '/api/auth/user-host/set-active-status';

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
      body?: UserPagedInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPagedResultDtoOfUserPagedDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-host/get-paged';

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
      body?: UserPagedInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfListOfCounterByStatusItemDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-host/get-count-by-active';

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
  ): Promise<CommonResultDtoOfUserDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/user-host/get-by-id';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
