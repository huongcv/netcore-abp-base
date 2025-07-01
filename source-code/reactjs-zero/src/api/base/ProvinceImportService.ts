import {
    axios,
    basePath,
    CommonResultDtoOfImportOutputDtoOfProvinceImportDto,
    DownloadResultFileImportOfProvinceImportDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    ProvinceImportDto
} from './index.defs';

export class ProvinceImportService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static downloadSampleTemplate(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/master-data/province-import/download-sample-template';

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
      body?: DownloadResultFileImportOfProvinceImportDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/master-data/province-import/download-import-result';

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
      body?: ProvinceImportDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfImportOutputDtoOfProvinceImportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/master-data/province-import/validate-data-import';

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
      body?: ProvinceImportDto[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfImportOutputDtoOfProvinceImportDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/master-data/province-import/import';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
