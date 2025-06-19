import {
    axios,
    basePath,
    CommonResultDtoOfBoolean,
    CommonResultDtoOfCounterByIsActivedDto,
    CommonResultDtoOfDistrictDetailDto,
    CommonResultDtoOfListOfComboOptionDto,
    CommonResultDtoOfPagedResultDtoOfDistrictPagedDto,
    CreateDistrictDto,
    DistrictPagedInput,
    EncodedIdDto,
    GetComboOptionInputDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    SetActiveStatusDto,
    UpdateDistrictDto
} from './index.defs';

export class DistrictService {
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
      let url = basePath + '/api/master-data/district/get-combo-options';

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
      body?: DistrictPagedInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/master-data/district/export-to-excel';

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
      body?: CreateDistrictDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfDistrictDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/master-data/district/create';

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
      body?: UpdateDistrictDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfDistrictDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/master-data/district/update';

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
      let url = basePath + '/api/master-data/district/remove';

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
      let url = basePath + '/api/master-data/district/set-active-status';

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
      body?: DistrictPagedInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfPagedResultDtoOfDistrictPagedDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/master-data/district/get-paged';

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
      body?: DistrictPagedInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfCounterByIsActivedDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/master-data/district/get-count-by-active';

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
  ): Promise<CommonResultDtoOfDistrictDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/master-data/district/get-by-id';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
