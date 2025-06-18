import {
    axios,
    basePath,
    CommonResultDtoOfBoolean,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    NationalPharmacyIntegrationCountDto,
    NationalPharmacyIntegrationDto,
    NationalPharmacyIntegrationPaging,
    PagedResultDtoOfNationalPharmacyIntegrationDto
} from './index.defs';

export class IntegrateService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getNationalPharmacyInCase(
    params: {
      /** requestBody */
      body?: NationalPharmacyIntegrationPaging;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<NationalPharmacyIntegrationCountDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/integrate/get-national-pharmacy-in-case';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getNationalPharmacyIntegrationPaging(
    params: {
      /** requestBody */
      body?: NationalPharmacyIntegrationPaging;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfNationalPharmacyIntegrationDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/integrate/get-national-pharmacy-integration-paging';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static nationalPharmacyIntegrationList(
    params: {
      /** requestBody */
      body?: NationalPharmacyIntegrationDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/integrate/national-pharmacy-integration-list';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
