import {
    axios,
    basePath,
    ComboOptionDto,
    CommonResultDtoOfBookingInvoiceTempDto,
    CommonResultDtoOfBookingStatusEnum,
    CommonResultDtoOfBoolean,
    CommonResultDtoOfCheckinStatusEnum,
    CommonResultDtoOfCruPrivateBookingDto,
    CommonResultDtoOfGolfFlightOutputDto,
    CommonResultDtoOfIEnumerableOfComboOptionDto,
    CommonResultDtoOfInfoPrivateBookingDto,
    CommonResultDtoOfInt32,
    CommonResultDtoOfIssueRfidDto,
    CommonResultDtoOfListOfTeeTimeAvailabilityDto,
    CommonResultDtoOfMemberInfoByCardOutputDto,
    CommonResultDtoOfSaleInvoiceDto,
    CreateGroupBookingDto,
    CruPrivateBookingDto,
    DestroyInvoiceInputDto,
    FlightInfoByFilterInputDto,
    FlightInfoByFilterOutputDto,
    GetComboCoursePublicQuerry,
    GetComboOptionGameTypeAllowOfCourseQuerry,
    getConfigs,
    GetServiceInitDefaultByFilterQuerry,
    GetTeeTimeAvailableityPublicQuerry,
    GolfFlightOutputDto,
    IRequestConfig,
    IRequestOptions,
    IssueRfidDto,
    MemberInfoByCardInputDto,
    MoveTeeTimeInputDto,
    NewUserBlockInputDto,
    ServiceInitDefaultByFilterOutputDto,
    TeeTimeBookingInputDto,
    UnBlockTeeTimeInputDto
} from './index.defs';

export class GolfBookingService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getTeeTimeAvailableityPublic(
    params: {
      /** requestBody */
      body?: GetTeeTimeAvailableityPublicQuerry;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfListOfTeeTimeAvailabilityDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/get-tee-time-availableity-public';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getComboCoursePublic(
    params: {
      /** requestBody */
      body?: GetComboCoursePublicQuerry;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfIEnumerableOfComboOptionDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/get-combo-course-public';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getComboOptionGameTypeAllowOfCourseAndTeeTimeConfig(
    params: {
      /** requestBody */
      body?: GetComboOptionGameTypeAllowOfCourseQuerry;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfIEnumerableOfComboOptionDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/get-combo-option-game-type-allow-of-course-and-tee-time-config';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getTeeTimeBooking(
    params: {
      /** requestBody */
      body?: TeeTimeBookingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<GolfFlightOutputDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/get-tee-time-booking';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPrivateBooking(
    params: {
      /**  */
      bookingTeeTimeId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CruPrivateBookingDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/get-private-booking/{bookingTeeTimeId}';
      url = url.replace('{bookingTeeTimeId}', params['bookingTeeTimeId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getListGoflerGroupByFilter(
    params: {
      /** requestBody */
      body?: FlightInfoByFilterInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/get-list-gofler-group-by-filter';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getFlightInfoByFilter(
    params: {
      /** requestBody */
      body?: FlightInfoByFilterInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<FlightInfoByFilterOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/get-flight-info-by-filter';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getServiceInitDefaultByFilter(
    params: {
      /** requestBody */
      body?: GetServiceInitDefaultByFilterQuerry;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ServiceInitDefaultByFilterOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/get-service-init-default-by-filter';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cruPrivateBooking(
    params: {
      /** requestBody */
      body?: CruPrivateBookingDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfCruPrivateBookingDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/cru-private-booking';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cruGroupBooking(
    params: {
      /** requestBody */
      body?: CreateGroupBookingDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfInt32> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/cru-group-booking';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static checkIn(
    params: {
      /**  */
      bookingPlayerId?: number;
      /**  */
      accessCardId?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfCheckinStatusEnum> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/check-in';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { bookingPlayerId: params['bookingPlayerId'], accessCardId: params['accessCardId'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cancelCheckIn(
    params: {
      /**  */
      bookingPlayerId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfCheckinStatusEnum> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/cancel-check-in/{bookingPlayerId}';
      url = url.replace('{bookingPlayerId}', params['bookingPlayerId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static setNoShow(
    params: {
      /**  */
      bookingPlayerId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfCheckinStatusEnum> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/set-no-show/{bookingPlayerId}';
      url = url.replace('{bookingPlayerId}', params['bookingPlayerId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cancelSetNoShow(
    params: {
      /**  */
      bookingPlayerId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfCheckinStatusEnum> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/cancel-set-no-show/{bookingPlayerId}';
      url = url.replace('{bookingPlayerId}', params['bookingPlayerId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static comfirmBooking(
    params: {
      /**  */
      bookingId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBookingStatusEnum> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/comfirm-booking/{bookingId}';
      url = url.replace('{bookingId}', params['bookingId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cancelComfirmBooking(
    params: {
      /**  */
      bookingId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBookingStatusEnum> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/cancel-comfirm-booking/{bookingId}';
      url = url.replace('{bookingId}', params['bookingId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getInfoPrivateBooking(
    params: {
      /**  */
      bookingTeeTimeId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfInfoPrivateBookingDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/get-info-private-booking/{bookingTeeTimeId}';
      url = url.replace('{bookingTeeTimeId}', params['bookingTeeTimeId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static issueRfid(
    params: {
      /** requestBody */
      body?: IssueRfidDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfIssueRfidDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/issue-rfid';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static deleteBooking(
    params: {
      /**  */
      bookingId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/delete-booking/{bookingId}';
      url = url.replace('{bookingId}', params['bookingId'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static newUserBlock(
    params: {
      /** requestBody */
      body?: NewUserBlockInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/new-user-block';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static unBlockTeeTime(
    params: {
      /** requestBody */
      body?: UnBlockTeeTimeInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBoolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/un-block-tee-time';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static moveOneTeeTime(
    params: {
      /** requestBody */
      body?: MoveTeeTimeInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGolfFlightOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/move-one-tee-time';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static destroyInvoice(
    params: {
      /** requestBody */
      body?: DestroyInvoiceInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfSaleInvoiceDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/destroy-invoice';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getMemberInfoByCard(
    params: {
      /** requestBody */
      body?: MemberInfoByCardInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfMemberInfoByCardOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/get-member-info-by-card';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getBookingInvoiceTemp(
    params: {
      /**  */
      bookingPlayerId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfBookingInvoiceTempDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/golf/golf-booking/get-booking-invoice-temp/{bookingPlayerId}';
      url = url.replace('{bookingPlayerId}', params['bookingPlayerId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
