import {
  string,
  UserFireBaseTokenDto,
  number,
  GetUserFireBaseTokenForViewDto,
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

export class UserFireBaseTokensService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static notify(
    params: {
      /**  */
      to?: string;
      /**  */
      title?: string;
      /**  */
      body?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/user-fire-base-tokens/notify';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { to: params['to'], title: params['title'], body: params['body'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cruFirebaseTokenFromCurrentUser(
    params: {
      /** requestBody */
      body?: UserFireBaseTokenDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/user-fire-base-tokens/cru-firebase-token-from-current-user';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getUserFireBaseTokenForView(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<GetUserFireBaseTokenForViewDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/user-fire-base-tokens/{id}/get-user-fire-base-token-for-view';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createOrEdit(
    params: {
      /** requestBody */
      body?: UserFireBaseTokenDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/auth-plugin/user-fire-base-tokens/create-or-edit';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
