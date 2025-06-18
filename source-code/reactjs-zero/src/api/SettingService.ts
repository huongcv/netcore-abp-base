import {
  SettingPagedRequestDto,
  SettingType,
  OrdExportPaged,
  OrdColumnFilter,
  PagedResultDtoOfSettingDto,
  SettingDto,
  SetValueSettingCommand,
  CommonResultDtoOfSettingDto,
  CommonResultExtendDto,
  ValidateInputDto,
  string,
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

export class SettingService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: SettingPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfSettingDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/setting/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static setValue(
    params: {
      /** requestBody */
      body?: SetValueSettingCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfSettingDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/setting/set-value';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getSettingForApp(
    params: {
      /**  */
      name?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/setting/get-setting-for-app';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { name: params['name'] };

      axios(configs, resolve, reject);
    });
  }
}
