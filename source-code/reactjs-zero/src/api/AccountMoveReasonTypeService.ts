import {
    ACCOUNT_MOVE_TYPE,
    axios,
    basePath,
    ComboOptionDto,
    CommonResultDtoOfMoveReasonTypeDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    MoveReasonTypeDto,
    MoveReasonTypePagedRequestDto,
    PagedResultDtoOfMoveReasonTypeDto
} from './index.defs';

export class AccountMoveReasonTypeService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: MoveReasonTypePagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfMoveReasonTypeDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move-reason-type/get-paged';

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
  ): Promise<MoveReasonTypeDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move-reason-type/get-by-id/{findId}';
      url = url.replace('{findId}', params['findId'] + '');

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
      body?: MoveReasonTypeDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfMoveReasonTypeDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move-reason-type/create-or-update';

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
  ): Promise<CommonResultDtoOfMoveReasonTypeDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move-reason-type/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportPagedResult(
    params: {
      /** requestBody */
      body?: MoveReasonTypePagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move-reason-type/export-paged-result';

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
      /**  */
      reasonMoveType?: ACCOUNT_MOVE_TYPE;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move-reason-type/get-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { reasonMoveType: params['reasonMoveType'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/account-move-reason-type/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
