import {
    axios,
    basePath,
    CommonResultDtoOfGolfCourseMaintenanceLogDto,
    getConfigs,
    GolfCourseMaintenanceLogDto,
    IRequestConfig,
    IRequestOptions,
    OrdGolfCourseMaintenanceLogPagedRequestDto,
    PagedResultDtoOfGolfCourseMaintenanceLogDto
} from './index.defs';

export class GolfCourseMaintenanceLogService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: OrdGolfCourseMaintenanceLogPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfGolfCourseMaintenanceLogDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-course-maintenance-log/get-paged';

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
      body?: GolfCourseMaintenanceLogDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfCourseMaintenanceLogDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-course-maintenance-log/create-or-update';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
