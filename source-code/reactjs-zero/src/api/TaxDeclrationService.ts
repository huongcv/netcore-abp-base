import {
    axios,
    basePath,
    CommonResultDtoOfReportTaxDeclarationDto,
    getConfigs,
    IRequestConfig,
    IRequestOptions,
    PagedResultDtoOfReportTaxDeclarationDto,
    ReportTaxDeclarationDto,
    TimeSpan
} from './index.defs';

export class TaxDeclrationService {
  /** Generate by swagger-axios-codegen */
  // @ts-nocheck
  /* eslint-disable */

  /**
   *
   */
  static createOrUpdate(
    params: {
      /** requestBody */
      body?: ReportTaxDeclarationDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfReportTaxDeclarationDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/tax-declration/create-or-update';

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
      code?: string;
      /**  */
      name?: string;
      /**  */
      periodType?: number;
      /**  */
      periodYear?: number;
      /**  */
      periodMonth?: number;
      /**  */
      periodQuarter?: number;
      /**  */
      periodDate?: string;
      /**  */
      periodMonthFrom?: number;
      /**  */
      periodMonthTo?: number;
      /**  */
      declarationTemplate?: number;
      /**  */
      declarationType?: number;
      /**  */
      isFirstTimeReport?: boolean;
      /**  */
      additionalTime?: number;
      /**  */
      taxPayerName?: string;
      /**  */
      shopName?: string;
      /**  */
      bankAccountCode?: string;
      /**  */
      taxCode?: string;
      /**  */
      shopTypeName?: string;
      /**  */
      isChangeInformation?: boolean;
      /**  */
      area?: string;
      /**  */
      isRentArea?: boolean;
      /**  */
      numberOfEmployee?: number;
      /**  */
      openHours?: TimeSpan;
      /**  */
      closeHours?: TimeSpan;
      /**  */
      address?: string;
      /**  */
      isChangeAddress?: boolean;
      /**  */
      street?: string;
      /**  */
      wardCode?: string;
      /**  */
      wardName?: string;
      /**  */
      districtCode?: string;
      /**  */
      districtName?: string;
      /**  */
      cityCode?: string;
      /**  */
      cityName?: string;
      /**  */
      isBorderMarket?: boolean;
      /**  */
      residentialAddress?: string;
      /**  */
      residentialStreet?: string;
      /**  */
      residentialWardCode?: string;
      /**  */
      residentialWardName?: string;
      /**  */
      residentialDistrictCode?: string;
      /**  */
      residentialDistrictName?: string;
      /**  */
      residentialCityCode?: string;
      /**  */
      residentialCityName?: string;
      /**  */
      phone?: string;
      /**  */
      fax?: string;
      /**  */
      email?: string;
      /**  */
      authorizationDocumentNumber?: string;
      /**  */
      authorizationDocumentDate?: string;
      /**  */
      agentName?: string;
      /**  */
      agentTaxCode?: string;
      /**  */
      agentContractNumber?: string;
      /**  */
      agentContractDate?: string;
      /**  */
      representativeOrganizationName?: string;
      /**  */
      representativeOrganizationTaxCode?: string;
      /**  */
      representativeOrganizationAddress?: string;
      /**  */
      representativeOrganizationPhone?: string;
      /**  */
      representativeOrganizationFax?: string;
      /**  */
      representativeOrganizationEmail?: string;
      /**  */
      idHash?: string;
      /**  */
      publishViewId?: number;
      /**  */
      id?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<CommonResultDtoOfReportTaxDeclarationDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/tax-declration/remove';

      const configs: IRequestConfig = getConfigs('delete', 'application/json', url, options);
      configs.params = {
        Code: params['code'],
        Name: params['name'],
        PeriodType: params['periodType'],
        PeriodYear: params['periodYear'],
        PeriodMonth: params['periodMonth'],
        PeriodQuarter: params['periodQuarter'],
        PeriodDate: params['periodDate'],
        PeriodMonthFrom: params['periodMonthFrom'],
        PeriodMonthTo: params['periodMonthTo'],
        DeclarationTemplate: params['declarationTemplate'],
        DeclarationType: params['declarationType'],
        IsFirstTimeReport: params['isFirstTimeReport'],
        AdditionalTime: params['additionalTime'],
        TaxPayerName: params['taxPayerName'],
        ShopName: params['shopName'],
        BankAccountCode: params['bankAccountCode'],
        TaxCode: params['taxCode'],
        ShopTypeName: params['shopTypeName'],
        IsChangeInformation: params['isChangeInformation'],
        Area: params['area'],
        IsRentArea: params['isRentArea'],
        NumberOfEmployee: params['numberOfEmployee'],
        OpenHours: params['openHours'],
        CloseHours: params['closeHours'],
        Address: params['address'],
        IsChangeAddress: params['isChangeAddress'],
        Street: params['street'],
        WardCode: params['wardCode'],
        WardName: params['wardName'],
        DistrictCode: params['districtCode'],
        DistrictName: params['districtName'],
        CityCode: params['cityCode'],
        CityName: params['cityName'],
        IsBorderMarket: params['isBorderMarket'],
        ResidentialAddress: params['residentialAddress'],
        ResidentialStreet: params['residentialStreet'],
        ResidentialWardCode: params['residentialWardCode'],
        ResidentialWardName: params['residentialWardName'],
        ResidentialDistrictCode: params['residentialDistrictCode'],
        ResidentialDistrictName: params['residentialDistrictName'],
        ResidentialCityCode: params['residentialCityCode'],
        ResidentialCityName: params['residentialCityName'],
        Phone: params['phone'],
        Fax: params['fax'],
        Email: params['email'],
        AuthorizationDocumentNumber: params['authorizationDocumentNumber'],
        AuthorizationDocumentDate: params['authorizationDocumentDate'],
        AgentName: params['agentName'],
        AgentTaxCode: params['agentTaxCode'],
        AgentContractNumber: params['agentContractNumber'],
        AgentContractDate: params['agentContractDate'],
        RepresentativeOrganizationName: params['representativeOrganizationName'],
        RepresentativeOrganizationTaxCode: params['representativeOrganizationTaxCode'],
        RepresentativeOrganizationAddress: params['representativeOrganizationAddress'],
        RepresentativeOrganizationPhone: params['representativeOrganizationPhone'],
        RepresentativeOrganizationFax: params['representativeOrganizationFax'],
        RepresentativeOrganizationEmail: params['representativeOrganizationEmail'],
        IdHash: params['idHash'],
        PublishViewId: params['publishViewId'],
        Id: params['id']
      };

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static getById(
    params: {
      /**  */
      findId: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<ReportTaxDeclarationDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/tax-declration/get-by-id/{findId}';
      url = url.replace('{findId}', params['findId'] + '');

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);

      axios(configs, resolve, reject);
    });
  }
  /**
   *
   */
  static mappingInputBeforeAtion(
    params: {
      /** requestBody */
      body?: ReportTaxDeclarationDto;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/tax-declration/mapping-input-before-ation';

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
      /**  */
      filter?: string;
      /**  */
      textSearch?: string;
      /**  */
      filter2?: string;
      /**  */
      isActived?: boolean;
      /**  */
      type?: number;
      /**  */
      exportTitle?: string;
      /**  */
      exportColumnNames?: any | null[];
      /**  */
      exportOtherFields?: object;
      /**  */
      filtersIsActived?: any | null[];
      /**  */
      maxGetAllSize?: number;
      /**  */
      sorting?: string;
      /**  */
      skipCount?: number;
      /**  */
      maxResultCount?: number;
    } = {} as any,
    options: IRequestOptions = {}
  ): Promise<PagedResultDtoOfReportTaxDeclarationDto> {
    return new Promise((resolve, reject) => {
      let url = basePath + '/api/pos/tax-declration/get-paged';

      const configs: IRequestConfig = getConfigs('get', 'application/json', url, options);
      configs.params = {
        Filter: params['filter'],
        TextSearch: params['textSearch'],
        Filter2: params['filter2'],
        IsActived: params['isActived'],
        Type: params['type'],
        'Export.Title': params['exportTitle'],
        'Export.ColumnNames': params['exportColumnNames'],
        'Export.OtherFields': params['exportOtherFields'],
        'Filters.IsActived': params['filtersIsActived'],
        MaxGetAllSize: params['maxGetAllSize'],
        Sorting: params['sorting'],
        SkipCount: params['skipCount'],
        MaxResultCount: params['maxResultCount']
      };

      axios(configs, resolve, reject);
    });
  }
}
