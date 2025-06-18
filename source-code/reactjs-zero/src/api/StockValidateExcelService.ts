import {
  number,
  CommonResultDtoOfListOfImportExcelImportSuplierExcelBaseDto,
  CommonResultExtendDto,
  ValidateInputDto,
  ImportExcelImportSuplierExcelBaseDto,
  StockProductSelectUnitDto,
  StockProductUnitDto,
  DiscountTypeEnum,
  CommonResultDtoOfListOfImportExcelTransferExcelBaseDto,
  ImportExcelTransferExcelBaseDto,
  CommonResultDtoOfListOfImportExcelCheckExcelBaseDto,
  ImportExcelCheckExcelBaseDto,
  CommonResultDtoOfListOfImportExcelExportExcelBaseDto,
  ImportExcelExportExcelBaseDto,
  MOVE_TYPE,
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

export class StockValidateExcelService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static validateDataImportStock(
    params: {
      /**  */
      uploadFile: any;
      /**  */
      moveType: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfListOfImportExcelImportSuplierExcelBaseDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/stock-validate-excel/validate-data-import-stock';

      const configs: IRequestConfig = getConfigs('post', 'multipart/form-data', url, options);

      let data = null;
      data = new FormData();
      if (params['uploadFile']) {
        if (Object.prototype.toString.call(params['uploadFile']) === '[object Array]') {
          for (const item of params['uploadFile']) {
            data.append('UploadFile', item as any);
          }
        } else {
          data.append('UploadFile', params['uploadFile'] as any);
        }
      }

      if (params['moveType']) {
        if (Object.prototype.toString.call(params['moveType']) === '[object Array]') {
          for (const item of params['moveType']) {
            data.append('MoveType', item as any);
          }
        } else {
          data.append('MoveType', params['moveType'] as any);
        }
      }

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static validateDataTransferStock(
    params: {
      /**  */
      uploadFile: any;
      /**  */
      moveType: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfListOfImportExcelTransferExcelBaseDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/stock-validate-excel/validate-data-transfer-stock';

      const configs: IRequestConfig = getConfigs('post', 'multipart/form-data', url, options);

      let data = null;
      data = new FormData();
      if (params['uploadFile']) {
        if (Object.prototype.toString.call(params['uploadFile']) === '[object Array]') {
          for (const item of params['uploadFile']) {
            data.append('UploadFile', item as any);
          }
        } else {
          data.append('UploadFile', params['uploadFile'] as any);
        }
      }

      if (params['moveType']) {
        if (Object.prototype.toString.call(params['moveType']) === '[object Array]') {
          for (const item of params['moveType']) {
            data.append('MoveType', item as any);
          }
        } else {
          data.append('MoveType', params['moveType'] as any);
        }
      }

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static validateDataCheckStock(
    params: {
      /**  */
      uploadFile: any;
      /**  */
      moveType: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfListOfImportExcelCheckExcelBaseDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/stock-validate-excel/validate-data-check-stock';

      const configs: IRequestConfig = getConfigs('post', 'multipart/form-data', url, options);

      let data = null;
      data = new FormData();
      if (params['uploadFile']) {
        if (Object.prototype.toString.call(params['uploadFile']) === '[object Array]') {
          for (const item of params['uploadFile']) {
            data.append('UploadFile', item as any);
          }
        } else {
          data.append('UploadFile', params['uploadFile'] as any);
        }
      }

      if (params['moveType']) {
        if (Object.prototype.toString.call(params['moveType']) === '[object Array]') {
          for (const item of params['moveType']) {
            data.append('MoveType', item as any);
          }
        } else {
          data.append('MoveType', params['moveType'] as any);
        }
      }

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static validateDataExportStock(
    params: {
      /**  */
      uploadFile: any;
      /**  */
      moveType: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfListOfImportExcelExportExcelBaseDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/stock-validate-excel/validate-data-export-stock';

      const configs: IRequestConfig = getConfigs('post', 'multipart/form-data', url, options);

      let data = null;
      data = new FormData();
      if (params['uploadFile']) {
        if (Object.prototype.toString.call(params['uploadFile']) === '[object Array]') {
          for (const item of params['uploadFile']) {
            data.append('UploadFile', item as any);
          }
        } else {
          data.append('UploadFile', params['uploadFile'] as any);
        }
      }

      if (params['moveType']) {
        if (Object.prototype.toString.call(params['moveType']) === '[object Array]') {
          for (const item of params['moveType']) {
            data.append('MoveType', item as any);
          }
        } else {
          data.append('MoveType', params['moveType'] as any);
        }
      }

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getStockTemplate(
    params: {
      /**  */
      moveType?: MOVE_TYPE;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/stock-validate-excel/get-stock-template';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { moveType: params['moveType'] };

      axios(configs, resolve, reject);
    });
  }
}
