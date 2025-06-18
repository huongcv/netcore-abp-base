import {
    axios,
    basePath,
    CommonResultDtoOfBoolean,
    CommonResultDtoOfFnbReservationDto,
    FnbReservationCreateDto,
    FnbReservationDto,
    FnbReservationPagedCountDto,
    FnbReservationPagedInputDto,
    FnbReservationUpdateDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfFnbReservationDto,
    RESERVATION_STATUS
} from './index.defs';

export class ReservationService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static create(
    params: {
      /** requestBody */
      body?: FnbReservationCreateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/restaurant/reservation/create';

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
      body?: FnbReservationUpdateDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/restaurant/reservation/update';

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
      idHash?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/restaurant/reservation/remove';

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);
      configs.params = { idHash: params['idHash'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cancel(
    params: {
      /** requestBody */
      body?: FnbReservationDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/restaurant/reservation/cancel';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static changeStatus(
    params: {
      /**  */
      idHash?: string;
      /**  */
      status?: RESERVATION_STATUS;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/restaurant/reservation/change-status';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { idHash: params['idHash'], status: params['status'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: FnbReservationPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfFnbReservationDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/restaurant/reservation/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getCount(
    params: {
      /** requestBody */
      body?: FnbReservationPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<FnbReservationPagedCountDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/restaurant/reservation/get-count';

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
      idHash?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfFnbReservationDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/restaurant/reservation/get-by-id';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { idHash: params['idHash'] };

      axios(configs, resolve, reject);
    });
  }
}
