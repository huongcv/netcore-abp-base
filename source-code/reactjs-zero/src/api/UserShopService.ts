import {
    AssignUserShopDto,
    axios,
    basePath,
    CommonResultDtoOfInt32,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    TreeUserShopAssignDto
} from './index.defs';

export class UserShopService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getTreeDataForAssignShop(
    params: {
      /**  */
      strUserId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<TreeUserShopAssignDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/user-shop/get-tree-data-for-assign-shop/{strUserId}';
      url = url.replace('{strUserId}', params['strUserId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static assignShopForUser(
    params: {
      /** requestBody */
      body?: AssignUserShopDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfInt32> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/user-shop/assign-shop-for-user';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
