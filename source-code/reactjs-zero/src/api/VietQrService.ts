import {
  ComboOptionDto,
  VietQrImgInputDto,
  VietQrBaseResOfVietQrImgOutputDto,
  VietQrImgOutputDto,
  string,
  number,
  CommonResultDtoOfString,
  CommonResultExtendDto,
  ValidateInputDto,
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

export class VietQrService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getListBank(options: IRequestOptions = {}): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/viet-qr/get-list-bank';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static generateQrBanking(
    params: {
      /** requestBody */
      body?: VietQrImgInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<VietQrBaseResOfVietQrImgOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/viet-qr/generate-qRBanking';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static geneBankingText(
    params: {
      /**  */
      qrbankingtext?: string;
      /**  */
      tongTienCanThanhToan?: number;
      /**  */
      noiDungChuyenKhoan?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/viet-qr/gene-banking-text';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = {
        qrbankingtext: params['qrbankingtext'],
        tongTienCanThanhToan: params['tongTienCanThanhToan'],
        noiDungChuyenKhoan: params['noiDungChuyenKhoan']
      };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static genStaticQr(
    params: {
      /** requestBody */
      body?: VietQrImgInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfString> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/viet-qr/gen-static-qr';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
