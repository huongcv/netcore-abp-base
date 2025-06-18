import {
  OrdGolfCoursePagedRequestDto,
  OrdExportPaged,
  OrdColumnFilter,
  FieldStatusEnum,
  CourseTypeEnum,
  PagedResultDtoOfGolfCourseDto,
  GolfCourseDto,
  GameTypeEnum,
  GolfCourseHolesDto,
  CommonResultDtoOfGolfCourseDto,
  CommonResultExtendDto,
  ValidateInputDto,
  number,
  ComboOptionDto,
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

export class GolfCourseService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: OrdGolfCoursePagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfGolfCourseDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-course/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createOrUpdate(
    params: {
      /** requestBody */
      body?: GolfCourseDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfCourseDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-course/create-or-update';

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
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<GolfCourseDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-course/{id}/get-by-id';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getListHolesById(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<GolfCourseHolesDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-course/{id}/get-list-holes-by-id';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getComboOptions(options: IRequestOptions = {}): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-course/get-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

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
  ): Promise<CommonResultDtoOfGolfCourseDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-course/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
