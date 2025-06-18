import {axios, basePath, ComboOptionDto, getConfigs, IRequestConfig, IRequestOptions} from './index.defs';

export class ComboBoxService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getQuocGia(options: IRequestOptions = {}): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/master-data/dvhc/combo-box/get-quoc-gia';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getTinh(options: IRequestOptions = {}): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/master-data/dvhc/combo-box/get-tinh';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getHuyen(
    params: {
      /**  */
      maTinh?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/master-data/dvhc/combo-box/get-huyen';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { maTinh: params['maTinh'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getXa(
    params: {
      /**  */
      maHuyen?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/master-data/dvhc/combo-box/get-xa';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { maHuyen: params['maHuyen'] };

      axios(configs, resolve, reject);
    });
  }
}
