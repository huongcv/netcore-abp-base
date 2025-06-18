import {
    axios,
    basePath,
    FileUploadDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    ValueTupleOfStringString
} from './index.defs';

export class UploadFileService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static upload(
    params: {
      /**  */
      blobContainerPath?: string;
      /**  */
      files: [];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<FileUploadDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/upload-file/upload';

      const configs: IRequestConfig = getConfigs('post', 'multipart/form-data', url, options);
      configs.params = { blobContainerPath: params['blobContainerPath'] };

      let data = null;
      data = new FormData();
      if (params['files']) {
        if (Object.prototype.toString.call(params['files']) === '[object Array]') {
          for (const item of params['files']) {
            data.append('files', item as any);
          }
        } else {
          data.append('files', params['files'] as any);
        }
      }

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getFile(
    params: {
      /**  */
      fileId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/upload-file/get-file/{fileId}';
      url = url.replace('{fileId}', params['fileId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static uploadFileToCache(
    params: {
      /**  */
      getBytes?: boolean;
      /**  */
      file: any;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<FileUploadDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/upload-file/upload-file-to-cache';

      const configs: IRequestConfig = getConfigs('post', 'multipart/form-data', url, options);
      configs.params = { getBytes: params['getBytes'] };

      let data = null;
      data = new FormData();
      if (params['file']) {
        if (Object.prototype.toString.call(params['file']) === '[object Array]') {
          for (const item of params['file']) {
            data.append('file', item as any);
          }
        } else {
          data.append('file', params['file'] as any);
        }
      }

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getFileFromCache(
    params: {
      /**  */
      fileCacheId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/upload-file/get-file-from-cache/{fileCacheId}';
      url = url.replace('{fileCacheId}', params['fileCacheId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getFileFromCacheByPdf(
    params: {
      /**  */
      fileCacheId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/upload-file/get-file-from-cache-by-pdf/{fileCacheId}';
      url = url.replace('{fileCacheId}', params['fileCacheId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getBlobContainerPath(
    params: {
      /**  */
      blobContainerPath?: string;
      /**  */
      fileName?: string;
      /**  */
      id: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ValueTupleOfStringString> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/upload-file/{id}/get-blob-container-path';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { blobContainerPath: params['blobContainerPath'], fileName: params['fileName'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static removeFile(
    params: {
      /**  */
      fileId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/upload-file/remove-file/{fileId}';
      url = url.replace('{fileId}', params['fileId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static downloadFile(
    params: {
      /**  */
      fileId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/upload-file/download-file/{fileId}';
      url = url.replace('{fileId}', params['fileId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
