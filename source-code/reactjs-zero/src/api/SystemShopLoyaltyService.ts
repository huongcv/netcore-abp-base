import {
  CommonResultDtoOfSystemShopLoyaltyDto,
  CommonResultExtendDto,
  ValidateInputDto,
  SystemShopLoyaltyDto,
  SystemShopLoyaltyTierDto,
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

export class SystemShopLoyaltyService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getInfo(options: IRequestOptions = {}): Promise<CommonResultDtoOfSystemShopLoyaltyDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/system-shop-loyalty/get-info';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateInfo(
    params: {
      /** requestBody */
      body?: SystemShopLoyaltyDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfSystemShopLoyaltyDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/system-shop-loyalty/update-info';

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
