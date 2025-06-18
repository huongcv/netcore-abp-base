import {
    axios,
    BarcodeProductGetInpuDto,
    basePath,
    CommonResultDtoOfImportSaleInvoiceOutputDto,
    CommonResultDtoOfListOfProductPriceListDetailDto,
    CommonResultDtoOfListOfStockProductSelectDto,
    CommonResultDtoOfProductGetBarCodeExtendProductDto,
    CommonResultDtoOfSaleInvoiceDto,
    CommonResultDtoOfVietQrImgOutputDto,
    CreateSaleInvoiceQrInputDto,
    DiscountByCustomerGroupOutputDto,
    getConfigs,
    GetInvoiceForCentralBillingInputDto,
    GetProductPriceListDetailDto,
    InvoiceStatusPagedCountDto,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfPartnerDto,
    PagedResultDtoOfProductDto,
    PagedResultDtoOfSaleInvoiceDto,
    PartnerSearchRequestDto,
    ProductDetailDto,
    ProductGetPagedInputDto,
    ProductModelForGetInventoryCurrent,
    SaleInvoiceDto,
    SaleInvoiceGetListDto,
    StockProductSelectCommand
} from './index.defs';

export class SaleInvoiceService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static searchCustomer(
    params: {
      /** requestBody */
      body?: PartnerSearchRequestDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfPartnerDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/search-customer';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getPaged(
    params: {
      /** requestBody */
      body?: SaleInvoiceGetListDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfSaleInvoiceDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/get-paged';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getProducts(
    params: {
      /** requestBody */
      body?: ProductGetPagedInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfProductDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/get-products';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getProductBarcode(
    params: {
      /** requestBody */
      body?: BarcodeProductGetInpuDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfProductGetBarCodeExtendProductDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/get-product-barcode';

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
      body?: SaleInvoiceGetListDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<InvoiceStatusPagedCountDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/get-count';

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
      findId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SaleInvoiceDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/get-by-id/{findId}';
      url = url.replace('{findId}', params['findId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static viewById(
    params: {
      /**  */
      id: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SaleInvoiceDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/{id}/view-by-id';
      url = url.replace('{id}', params['id'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cloneById(
    params: {
      /**  */
      findId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfSaleInvoiceDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/clone-by-id/{findId}';
      url = url.replace('{findId}', params['findId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getSaleInvoiceForReturn(
    params: {
      /**  */
      findId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfSaleInvoiceDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/get-sale-invoice-for-return/{findId}';
      url = url.replace('{findId}', params['findId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getSaleInvoiceByCode(
    params: {
      /**  */
      invoiceCode?: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfSaleInvoiceDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/get-sale-invoice-by-code';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { invoiceCode: params['invoiceCode'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static create(
    params: {
      /** requestBody */
      body?: SaleInvoiceDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfSaleInvoiceDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/create';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static createDraft(
    params: {
      /** requestBody */
      body?: SaleInvoiceDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfSaleInvoiceDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/create-draft';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getQrSaleOrder(
    params: {
      /** requestBody */
      body?: CreateSaleInvoiceQrInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfVietQrImgOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/get-qr-sale-order';

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
      removeId: string;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfSaleInvoiceDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/remove/{removeId}';
      url = url.replace('{removeId}', params['removeId'] + '');

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static cancel(
    params: {
      /** requestBody */
      body?: SaleInvoiceDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfSaleInvoiceDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/cancel';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getInventoryProductCurrentQty(
    params: {
      /** requestBody */
      body?: any | null[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ProductModelForGetInventoryCurrent[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/get-inventory-product-current-qty';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDetailInPriceList(
    params: {
      /**  */
      idHash?: string;
      /**  */
      priceLisId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ProductDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/get-detail-in-price-list/{priceLisId}';
      url = url.replace('{priceLisId}', params['priceLisId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { idHash: params['idHash'] };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static clearCache(options: IRequestOptions = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/clear-cache';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportSaleInvoiceResult(
    params: {
      /** requestBody */
      body?: SaleInvoiceGetListDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/export-sale-invoice-result';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static exportSaleInvoiceDetailResult(
    params: {
      /** requestBody */
      body?: SaleInvoiceGetListDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/export-sale-invoice-detail-result';

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
      /**  */
      files: [];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfImportSaleInvoiceOutputDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/import';

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
  static getProductPriceListDetail(
    params: {
      /** requestBody */
      body?: GetProductPriceListDetailDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfListOfProductPriceListDetailDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/get-product-price-list-detail';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static productSelect(
    params: {
      /** requestBody */
      body?: StockProductSelectCommand;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfListOfStockProductSelectDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/product-select';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getInvoiceCentralBilling(
    params: {
      /** requestBody */
      body?: GetInvoiceForCentralBillingInputDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<SaleInvoiceDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/get-invoice-central-billing';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getDiscountByCustomerGroup(
    params: {
      /**  */
      listPartnerId?: any | null[];
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<DiscountByCustomerGroupOutputDto[]> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/sale-invoice/get-discount-by-customer-group';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = { ListPartnerId: params['listPartnerId'] };

      axios(configs, resolve, reject);
    });
  }
}
