import {
    axios,
    basePath,
    CommonResultDtoOfImportOutputDtoOfCountryImportDto,
    CountryImportDto,
    DownloadResultFileImportOfCountryImportDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions
} from './index.defs';

export class CountryImportService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static downloadSampleTemplate(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/master-data/country-import/download-sample-template';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static downloadImportResult(
    params: {
      /** requestBody */
      body?: DownloadResultFileImportOfCountryImportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/master-data/country-import/download-import-result';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static validateDataImport(
    params: {
      /** requestBody */
      body?: CountryImportDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfImportOutputDtoOfCountryImportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/master-data/country-import/validate-data-import';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static validateFile(
    params: {
      /**  */
      file: any;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfImportOutputDtoOfCountryImportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/master-data/country-import/validate-file';

      const configs: IRequestConfig = getConfigs('post', 'multipart/form-data', url, options);

      let data = null;
      data = new FormData();
      if (params['file']) {
        if (Object.prototype.toString.call(params['file']) === '[object Array]') {
          for (const item of params['file']) {
            data.append('File', item as any);
          }
        } else {
          data.append('File', params['file'] as any);
        }
      }

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
      body?: CountryImportDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfImportOutputDtoOfCountryImportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/master-data/country-import/import';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
