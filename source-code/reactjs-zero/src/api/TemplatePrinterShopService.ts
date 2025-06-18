import {
    axios,
    basePath,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    OrdPagedRequestDto,
    PagedResultDtoOfShopTemplatePrinterGroupDto
} from './index.defs';

export class TemplatePrinterShopService {
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
  ): Promise<PagedResultDtoOfShopTemplatePrinterGroupDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/template-printer-shop/get-list-paging';

      const configs: IRequestConfig = getConfigs('post', 'application/json', url, options);

      let data = params.body;

      configs.data = data;

      axios(configs, resolve, reject);
    });
  }
}
