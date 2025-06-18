import {axios, basePath, ComboOptionDto, getConfigs, IRequestConfig, IRequestOptions, PARTNER_TYPE} from './index.defs';

export class PartnerGroupService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getComboOptions(
    params: {
      /**  */
      type?: PARTNER_TYPE;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/partner-group/get-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { type: params['type'] };

      axios(configs, resolve, reject);
    });
  }
}
