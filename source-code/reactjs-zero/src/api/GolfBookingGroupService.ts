import {
    axios,
    basePath,
    ComboOptionDto,
    CommonResultDtoOfBoolean,
    CommonResultDtoOfGolfBookingGroupDto,
    CommonResultDtoOfGolfBookingGroupImportOutputDto,
    CommonResultDtoOfGolfGolferGroupDetailDto,
    getConfigs,
    GolfBookingGroupDto,
    GolfBookingGroupImportDto,
    GolfBookingGroupImportOutputDto,
    GolfGolferGroupDetailDto,
    IRequestConfig,
    IRequestOptions,
    OrdPagedRequestDto,
    PagedGoferGroupDetailDto,
    PagedResultDtoOfGolfBookingGroupDto,
    PagedResultDtoOfGolfGolferGroupDetailDto
} from './index.defs';

export class GolfBookingGroupService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: OrdPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfGolfBookingGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking-group/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPagedGroupDetail(
    params: {
      /** requestBody */
      body?: PagedGoferGroupDetailDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfGolfGolferGroupDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking-group/get-paged-group-detail';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createOrUpdateMemberShip(
    params: {
      /** requestBody */
      body?: GolfGolferGroupDetailDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfGolferGroupDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking-group/create-or-update-member-ship';

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
      body?: GolfBookingGroupDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfBookingGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking-group/create-or-update';

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
  ): Promise<CommonResultDtoOfGolfBookingGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking-group/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static removeMemberShip(
    params: {
      /** requestBody */
      body?: GolfGolferGroupDetailDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfGolferGroupDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking-group/remove-member-ship';

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
  ): Promise<GolfBookingGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking-group/{id}/get-by-id';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportPagedResult(
    params: {
      /** requestBody */
      body?: OrdPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking-group/export-paged-result';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking-group/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static changePartnerGroupStatus(
    params: {
      /**  */
      groupId: number;
      /**  */
      isActived?: boolean;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfBookingGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking-group/change-partner-group-status/{groupId}';
      url = url.replace('{groupId}', params['groupId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { isActived: params['isActived'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static changeMembershipStatus(
    params: {
      /**  */
      id: number;
      /**  */
      isActived?: boolean;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking-group/{id}/change-membership-status';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { isActived: params['isActived'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getComboOptions(options: IRequestOptions = {}): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking-group/get-combo-options';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPartnerComboOptions(
    params: {
      /**  */
      groupId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking-group/get-partner-combo-options/{groupId}';
      url = url.replace('{groupId}', params['groupId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static validateImport(
    params: {
      /** requestBody */
      body?: GolfBookingGroupImportDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<GolfBookingGroupImportOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking-group/validate-import';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static import(
    params: {
      /** requestBody */
      body?: GolfBookingGroupImportDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfBookingGroupImportOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking-group/import';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportTemplate(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking-group/export-template';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
