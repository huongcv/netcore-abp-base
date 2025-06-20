import {
    axios,
    basePath,
    CheckNationalDrugSyncModel,
    CommonResponse,
    CommonResultDtoOfAccountInfoResponse,
    getConfigs,
    HttpResponseMessage,
    IntegrateDrugModel,
    IntegrateInvoiceModel,
    IntegrateMoveExportModel,
    IntegrateMoveImportModel,
    IRequestConfig,
    IRequestOptions,
    SyncNationalDrugModel,
    UpdateIntegratedDrugExpiryModel
} from './index.defs';

export class NationalPharmacyService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static integrateInvoicePost(
    params: {
      /**  */
      userName?: string;
      /**  */
      pwd?: string;
      /** requestBody */
      body?: IntegrateInvoiceModel;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/integrate-invoice-post';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { userName: params['userName'], pwd: params['pwd'] };

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static integrateInvoiceDelete(
    params: {
      /**  */
      userName?: string;
      /**  */
      pwd?: string;
      /** requestBody */
      body?: IntegrateInvoiceModel;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/integrate-invoice-delete';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { userName: params['userName'], pwd: params['pwd'] };

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static callGetMethod(
    params: {
      /**  */
      requestPath?: string;
      /**  */
      token?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<HttpResponseMessage> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/call-get-method';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { requestPath: params['requestPath'], token: params['token'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static callPostMethod(
    params: {
      /**  */
      token?: string;
      /**  */
      request?: string;
      /**  */
      timeOutSecond?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<HttpResponseMessage> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/call-post-method';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { token: params['token'], request: params['request'], timeOutSecond: params['timeOutSecond'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static callPutMethod(
    params: {
      /**  */
      token?: string;
      /**  */
      request?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<HttpResponseMessage> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/call-put-method';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { token: params['token'], request: params['request'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static callDeleteMethod(
    params: {
      /**  */
      token?: string;
      /**  */
      request?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<HttpResponseMessage> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/call-delete-method';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { token: params['token'], request: params['request'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static callGetApi(
    params: {
      /**  */
      requestPath?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<HttpResponseMessage> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/call-get-api';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { requestPath: params['requestPath'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static callPostApi(
    params: {
      /**  */
      request?: string;
      /**  */
      timeOutSecond?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<HttpResponseMessage> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/call-post-api';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { request: params['request'], timeOutSecond: params['timeOutSecond'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static callDeleteApi(
    params: {
      /**  */
      request?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<HttpResponseMessage> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/call-delete-api';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { request: params['request'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static callApiIntegrateGetMethod(
    params: {
      /**  */
      requestPath?: string;
      /**  */
      userName?: string;
      /**  */
      pwd?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<HttpResponseMessage> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/call-api-integrate-get-method';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { requestPath: params['requestPath'], userName: params['userName'], pwd: params['pwd'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static callApiIntegratePostMethod(
    params: {
      /**  */
      request?: string;
      /**  */
      userName?: string;
      /**  */
      pwd?: string;
      /**  */
      timeOutSecond?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<HttpResponseMessage> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/call-api-integrate-post-method';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = {
        request: params['request'],
        userName: params['userName'],
        pwd: params['pwd'],
        timeOutSecond: params['timeOutSecond']
      };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static callApiIntegratePutMethod(
    params: {
      /**  */
      request?: string;
      /**  */
      userName?: string;
      /**  */
      pwd?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<HttpResponseMessage> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/call-api-integrate-put-method';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { request: params['request'], userName: params['userName'], pwd: params['pwd'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static callApiIntegrateDeleteMethod(
    params: {
      /**  */
      request?: string;
      /**  */
      userName?: string;
      /**  */
      pwd?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<HttpResponseMessage> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/call-api-integrate-delete-method';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { request: params['request'], userName: params['userName'], pwd: params['pwd'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getToken(
    params: {
      /**  */
      usr?: string;
      /**  */
      pwd?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/get-token';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { usr: params['usr'], pwd: params['pwd'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearTokenCache(
    params: {
      /**  */
      userName?: string;
      /**  */
      pwd?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/clear-token-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { userName: params['userName'], pwd: params['pwd'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static callLoginApi(
    params: {
      /**  */
      usr?: string;
      /**  */
      pwd?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/call-login-api';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { usr: params['usr'], pwd: params['pwd'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static nationalPharmacyAccountInfo(
    params: {
      /**  */
      usr?: string;
      /**  */
      pwd?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfAccountInfoResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/national-pharmacy-account-info';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { usr: params['usr'], pwd: params['pwd'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static integrateDrug(
    params: {
      /**  */
      userName?: string;
      /**  */
      pwd?: string;
      /** requestBody */
      body?: IntegrateDrugModel;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/integrate-drug';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { userName: params['userName'], pwd: params['pwd'] };

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateIntegrateDrugInfo(
    params: {
      /**  */
      userName?: string;
      /**  */
      pwd?: string;
      /** requestBody */
      body?: IntegrateDrugModel;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/update-integrate-drug-info';

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);
      configs.params = { userName: params['userName'], pwd: params['pwd'] };

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static updateNationalDrugExpireDate(
    params: {
      /** requestBody */
      body?: UpdateIntegratedDrugExpiryModel;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/update-national-drug-expire-date';

      const configs: IRequestConfig = getConfigs('put', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static checkNationaDrugSync(
    params: {
      /** requestBody */
      body?: CheckNationalDrugSyncModel;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/check-nationa-drug-sync';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static syncNationalDrugData(
    params: {
      /** requestBody */
      body?: SyncNationalDrugModel;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResponse> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/sync-national-drug-data';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static integrateImportTicketPost(
    params: {
      /**  */
      userName?: string;
      /**  */
      pwd?: string;
      /** requestBody */
      body?: IntegrateMoveImportModel;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/integrate-import-ticket-post';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { userName: params['userName'], pwd: params['pwd'] };

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static integrateImportTicketDelete(
    params: {
      /**  */
      userName?: string;
      /**  */
      pwd?: string;
      /** requestBody */
      body?: IntegrateMoveImportModel;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/integrate-import-ticket-delete';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { userName: params['userName'], pwd: params['pwd'] };

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static integrateExportTicketPost(
    params: {
      /**  */
      userName?: string;
      /**  */
      pwd?: string;
      /** requestBody */
      body?: IntegrateMoveExportModel;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/integrate-export-ticket-post';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { userName: params['userName'], pwd: params['pwd'] };

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static integrateExportTicketDelete(
    params: {
      /**  */
      userName?: string;
      /**  */
      pwd?: string;
      /** requestBody */
      body?: IntegrateMoveExportModel;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/national-pharmacy/integrate-export-ticket-delete';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);
      configs.params = { userName: params['userName'], pwd: params['pwd'] };

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
