import {
  CommonResultDtoOfPasswordConfigDto,
  PasswordConfigDto,
  CommonResultDtoOfBoolean,
  CommonResultDtoOfSmtpMailingDto,
  SmtpMailingDto,
  OrdPagedRequestDto,
  CommonResultDtoOfPagedResultDtoOfBlacklistedDto,
  PagedResultDtoOfBlacklistedDto,
  BlacklistedDto,
  SettingPagedInput,
  CommonResultDtoOfPagedResultDtoOfSettingPagedDto,
  PagedResultDtoOfSettingPagedDto,
  SettingPagedDto,
  EncodedIdDto,
  CommonResultDtoOfSettingDetailDto,
  SettingDetailDto,
  CreateSettingDto,
  UpdateSettingDto,
  SetActiveStatusDto,
  CommonResultDtoOfListOfCounterByStatusItemDto,
  CounterByStatusItemDto,
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

export class HostSystemSettingService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPasswordConfig(options: IRequestOptions = {}): Promise<CommonResultDtoOfPasswordConfigDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/host-system-setting/get-password-config';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updatePasswordConfig(
    params: {
      /** requestBody */
      body?: PasswordConfigDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/host-system-setting/update-password-config';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getMailingSmtp(options: IRequestOptions = {}): Promise<CommonResultDtoOfSmtpMailingDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/host-system-setting/get-mailing-smtp';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateMailingSmtpConfig(
    params: {
      /** requestBody */
      body?: SmtpMailingDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/host-system-setting/update-mailing-smtp-config';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPasswordBlacklisted(
    params: {
      /** requestBody */
      body?: OrdPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPagedResultDtoOfBlacklistedDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/host-system-setting/get-password-blacklisted';

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
      body?: SettingPagedInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPagedResultDtoOfSettingPagedDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/host-system-setting/get-paged';

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
  ): Promise<CommonResultDtoOfSettingDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/host-system-setting/get-by-id';

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
      body?: CreateSettingDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfSettingDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/host-system-setting/create';

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
      body?: UpdateSettingDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfSettingDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/host-system-setting/update';

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
      body?: SettingPagedInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/host-system-setting/export-to-excel';

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
      let url = basePath + '/api/auth/host-system-setting/remove';

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
      let url = basePath + '/api/auth/host-system-setting/set-active-status';

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
      body?: SettingPagedInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfListOfCounterByStatusItemDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth/host-system-setting/get-count-by-active';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
