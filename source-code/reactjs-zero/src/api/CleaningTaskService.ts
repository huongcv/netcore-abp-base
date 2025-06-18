import {
    axios,
    basePath,
    CleaningTaskDto,
    CleaningTaskGetPagedDto,
    CleaningTaskGroupByDateParamDto,
    CleaningTaskInput,
    CommonResultDtoOfCleaningTaskDto,
    CommonResultDtoOfListOfCleaningTaskDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfCleaningTaskGroupByDateParamDto
} from './index.defs';

export class CleaningTaskService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/cleaning-task/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: CleaningTaskGetPagedDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfCleaningTaskGroupByDateParamDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/cleaning-task/get-paged';

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
      body?: CleaningTaskInput;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfListOfCleaningTaskDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/cleaning-task/create-or-update';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getByDate(
    params: {
      /** requestBody */
      body?: CleaningTaskGroupByDateParamDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CleaningTaskDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/cleaning-task/get-by-date';

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
  ): Promise<CommonResultDtoOfCleaningTaskDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/cleaning-task/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static removeByDate(
    params: {
      /** requestBody */
      body?: CleaningTaskGroupByDateParamDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfCleaningTaskDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/cleaning-task/remove-by-date';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
