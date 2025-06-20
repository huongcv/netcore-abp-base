import {
    axios,
    basePath,
    ComboOptionDto,
    CommonResultDtoOfGuid,
    CommonResultDtoOfTemplatePrinterDto,
    CurrentShopTemplatePrinterOutputDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    OrdPagedRequestDto,
    PagedResultDtoOfTemplatePrinterGroupDto,
    TEMPLATE_PRINTER,
    TemplatePrinterDto
} from './index.defs';

export class TemplatePrinterService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static getListPaging(
    params: {
      /** requestBody */
      body?: OrdPagedRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfTemplatePrinterGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/template-printer/get-list-paging';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static importNewFile(
    params: {
      /**  */
      printerEnum?: TEMPLATE_PRINTER;
      /**  */
      files: [];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfTemplatePrinterDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/template-printer/import-new-file';

      const configs: IRequestConfig = getConfigs('post', 'multipart/form-data', url, options);
      configs.params = { printerEnum: params['printerEnum'] };

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
  static cruTemplate(
    params: {
      /** requestBody */
      body?: TemplatePrinterDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<TemplatePrinterDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/template-printer/cru-template';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static get(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<TemplatePrinterDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/template-printer/{id}/get';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static changeFile(
    params: {
      /**  */
      id: number;
      /**  */
      files: [];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfGuid> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/template-printer/{id}/change-file';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('post', 'multipart/form-data', url, options);

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
  static setDefault(
    params: {
      /**  */
      id: number;
      /**  */
      templatePrintEnumId: TEMPLATE_PRINTER;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/template-printer/{id}/set-default/{templatePrintEnumId}';
      url = url.replace('{id}', params['id'] + '');
      url = url.replace('{templatePrintEnumId}', params['templatePrintEnumId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static delete(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/template-printer/{id}/delete';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static changeActive(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/template-printer/{id}/change-active';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getCombobox(
    params: {
      /**  */
      templatePrintEnumId: TEMPLATE_PRINTER;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ComboOptionDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/template-printer/get-combobox/{templatePrintEnumId}';
      url = url.replace('{templatePrintEnumId}', params['templatePrintEnumId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static changeName(
    params: {
      /**  */
      id: number;
      /**  */
      name?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/template-printer/{id}/change-name';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { name: params['name'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static alowShopChangeTplPrinter(
    params: {
      /**  */
      enumId: TEMPLATE_PRINTER;
      /**  */
      alow?: boolean;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfTemplatePrinterDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/template-printer/alow-shop-change-tpl-printer/{enumId}';
      url = url.replace('{enumId}', params['enumId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { alow: params['alow'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static downloadDefaultSystemFile(
    params: {
      /**  */
      enumId: TEMPLATE_PRINTER;
      /**  */
      fName?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/template-printer/download-default-system-file/{enumId}';
      url = url.replace('{enumId}', params['enumId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { fName: params['fName'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static downloadDefaultSystemFilePdf(
    params: {
      /**  */
      enumId: TEMPLATE_PRINTER;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/template-printer/download-default-system-file-pdf/{enumId}';
      url = url.replace('{enumId}', params['enumId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static testGetData(
    params: {
      /**  */
      enumId: TEMPLATE_PRINTER;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CurrentShopTemplatePrinterOutputDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/template-printer/test-get-data/{enumId}';
      url = url.replace('{enumId}', params['enumId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
}
