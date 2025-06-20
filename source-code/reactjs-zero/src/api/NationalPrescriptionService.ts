import {
    axios,
    basePath,
    CommonResultDtoOfNationalPrescriptionOutputDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions
} from './index.defs';

export class NationalPrescriptionService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getByCode(
    params: {
      /**  */
      code?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfNationalPrescriptionOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-prescription/get-by-code';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { code: params['code'] };

      axios(configs, resolve, reject);
    });
  }
}
