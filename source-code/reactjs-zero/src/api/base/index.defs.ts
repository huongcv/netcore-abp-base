/** Generate by swagger-axios-codegen */
/* eslint-disable */
// @ts-nocheck
import {type AxiosInstance, type AxiosRequestConfig} from 'axios';

export interface IRequestOptions extends AxiosRequestConfig {
  /**
   * show loading status
   */
  loading?: boolean;
  /**
   * display error message
   */
  showError?: boolean;
  /**
   * data security, extended fields are encrypted using the specified algorithm
   */
  security?: Record<string, 'md5' | 'sha1' | 'aes' | 'des'>;
  /**
   * indicates whether Authorization credentials are required for the request
   * @default true
   */
  withAuthorization?: boolean;
}

export interface IRequestConfig {
  method?: any;
  headers?: any;
  url?: any;
  data?: any;
  params?: any;
}

// Add options interface
export interface ServiceOptions {
  axios?: AxiosInstance;
  /** only in axios interceptor config*/
  loading: boolean;
  showError: boolean;
}

// Add default options
export const serviceOptions: ServiceOptions = {};

// Instance selector
export function axios(configs: IRequestConfig, resolve: (p: any) => void, reject: (p: any) => void): Promise<any> {
  if (serviceOptions.axios) {
    return serviceOptions.axios
      .request(configs)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  } else {
    throw new Error('please inject yourself instance like axios  ');
  }
}

export function getConfigs(method: string, contentType: string, url: string, options: any): IRequestConfig {
  const configs: IRequestConfig = {
    loading: serviceOptions.loading,
    showError: serviceOptions.showError,
    ...options,
    method,
    url
  };
  configs.headers = {
    ...options.headers,
    'Content-Type': contentType
  };
  return configs;
}

export const basePath = '';

export interface IList<T> extends Array<T> {}
export interface List<T> extends Array<T> {}
export interface IDictionary<TValue> {
  [key: string]: TValue;
}
export interface Dictionary<TValue> extends IDictionary<TValue> {}

export interface IListResult<T> {
  items?: T[];
}

export class ListResultDto<T> implements IListResult<T> {
  items?: T[];
}

export interface IPagedResult<T> extends IListResult<T> {
  totalCount?: number;
  items?: T[];
}

export class PagedResultDto<T = any> implements IPagedResult<T> {
  totalCount?: number;
  items?: T[];
}

// customer definition
// empty

export interface ActionApiDescriptionModel {
  /**  */
  uniqueName?: string;

  /**  */
  name?: string;

  /**  */
  httpMethod?: string;

  /**  */
  url?: string;

  /**  */
  supportedVersions?: string[];

  /**  */
  parametersOnMethod?: MethodParameterApiDescriptionModel[];

  /**  */
  parameters?: ParameterApiDescriptionModel[];

  /**  */
  returnValue?: ReturnValueApiDescriptionModel;

  /**  */
  allowAnonymous?: boolean;

  /**  */
  implementFrom?: string;
}

export interface AppBootstrapDto {
  /**  */
  setting?: object;

  /**  */
  user?: UserInformationDto;

  /**  */
  isLogined?: boolean;

  /**  */
  listAssignedShop?: UserCurrentShopAssign[];

  /**  */
  currentShop?: number;

  /**  */
  currentShopHashId?: string;

  /**  */
  currentShopType?: ShopType;

  /**  */
  businessType?: number;

  /**  */
  isShopMain?: boolean;

  /**  */
  productPriceListMainId?: string;

  /**  */
  eInvoiceMethod?: string;

  /**  */
  theme?: OrdThemeDto;
}

export interface ApplicationApiDescriptionModel {
  /**  */
  modules?: object;

  /**  */
  types?: object;
}

export interface ApplicationAuthConfigurationDto {
  /**  */
  grantedPolicies?: object;
}

export interface ApplicationConfigurationDto {
  /**  */
  localization?: ApplicationLocalizationConfigurationDto;

  /**  */
  auth?: ApplicationAuthConfigurationDto;

  /**  */
  setting?: ApplicationSettingConfigurationDto;

  /**  */
  currentUser?: CurrentUserDto;

  /**  */
  features?: ApplicationFeatureConfigurationDto;

  /**  */
  globalFeatures?: ApplicationGlobalFeatureConfigurationDto;

  /**  */
  multiTenancy?: MultiTenancyInfoDto;

  /**  */
  currentTenant?: CurrentTenantDto;

  /**  */
  timing?: TimingDto;

  /**  */
  clock?: ClockDto;

  /**  */
  objectExtensions?: ObjectExtensionsDto;

  /**  */
  extraProperties?: object;
}

export interface ApplicationFeatureConfigurationDto {
  /**  */
  values?: object;
}

export interface ApplicationGlobalFeatureConfigurationDto {
  /**  */
  enabledFeatures?: string[];
}

export interface ApplicationLocalizationConfigurationDto {
  /**  */
  values?: object;

  /**  */
  resources?: object;

  /**  */
  languages?: LanguageInfo[];

  /**  */
  currentCulture?: CurrentCultureDto;

  /**  */
  defaultResourceName?: string;

  /**  */
  languagesMap?: object;

  /**  */
  languageFilesMap?: object;
}

export interface ApplicationLocalizationDto {
  /**  */
  resources?: object;

  /**  */
  currentCulture?: CurrentCultureDto;
}

export interface ApplicationLocalizationResourceDto {
  /**  */
  texts?: object;

  /**  */
  baseResources?: string[];
}

export interface ApplicationSettingConfigurationDto {
  /**  */
  values?: object;
}

export interface AssignPermissionsToRoleDto {
  /**  */
  encodedId?: string;

  /**  */
  permissionNames?: string[];
}

export interface AssignRolesToUserDto {
  /**  */
  encodedId?: string;

  /**  */
  roleIds?: string[];
}

export interface ChangePasswordUserDto {
  /**  */
  currentPassword?: string;

  /**  */
  newPassword?: string;
}

export interface ClockDto {
  /**  */
  kind?: string;
}

export interface ComboOptionDto {
  /**  */
  value?: any | null;

  /**  */
  displayName?: string;

  /**  */
  data?: any | null;
}

export interface CommonResultDtoOfAppBootstrapDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: AppBootstrapDto;

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfBoolean {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: boolean;

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfCounterByIsActivedDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: CounterByIsActivedDto;

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfCountryDetailDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: CountryDetailDto;

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfDistrictDetailDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: DistrictDetailDto;

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfIEnumerableOfGuid {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: string[];

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfIEnumerableOfString {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: string[];

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfImportOutputDtoOfCountryImportDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: ImportOutputDtoOfCountryImportDto;

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfInt32 {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: number;

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfJwtDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: JwtDto;

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfListOfComboOptionDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: ComboOptionDto[];

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfListOfFileUploadDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: FileUploadDto[];

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfListOfString {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: string[];

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfNotificationSummaryDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: NotificationSummaryDto;

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfPagedResultDtoOfCountryPagedDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: PagedResultDtoOfCountryPagedDto;

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfPagedResultDtoOfDistrictPagedDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: PagedResultDtoOfDistrictPagedDto;

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfPagedResultDtoOfProvincePagedDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: PagedResultDtoOfProvincePagedDto;

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfPagedResultDtoOfRolePagedDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: PagedResultDtoOfRolePagedDto;

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfPagedResultDtoOfTenantPagedDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: PagedResultDtoOfTenantPagedDto;

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfPagedResultDtoOfUserInRoleDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: PagedResultDtoOfUserInRoleDto;

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfPagedResultDtoOfUserNotificationDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: PagedResultDtoOfUserNotificationDto;

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfPagedResultDtoOfUserPagedDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: PagedResultDtoOfUserPagedDto;

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfProvinceDetailDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: ProvinceDetailDto;

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfRoleDetailDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: RoleDetailDto;

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfTenantDetailDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: TenantDetailDto;

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface CommonResultDtoOfUserDetailDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  data?: UserDetailDto;

  /**  */
  extend?: any | null;

  /**  */
  isSuccessful?: boolean;
}

export interface ControllerApiDescriptionModel {
  /**  */
  controllerName?: string;

  /**  */
  controllerGroupName?: string;

  /**  */
  isRemoteService?: boolean;

  /**  */
  isIntegrationService?: boolean;

  /**  */
  apiVersion?: string;

  /**  */
  type?: string;

  /**  */
  interfaces?: ControllerInterfaceApiDescriptionModel[];

  /**  */
  actions?: object;
}

export interface ControllerInterfaceApiDescriptionModel {
  /**  */
  type?: string;

  /**  */
  name?: string;

  /**  */
  methods?: InterfaceMethodApiDescriptionModel[];
}

export interface CounterByIsActivedDto {
  /**  */
  totalTrue?: number;

  /**  */
  totalFalse?: number;

  /**  */
  total?: number;

  /**  */
  items?: CounterByIsActivedItemDto[];
}

export interface CounterByIsActivedItemDto {
  /**  */
  isActived?: boolean;

  /**  */
  totalCount?: number;
}

export interface CountryDetailDto {
  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  phoneCode?: string;

  /**  */
  currencyCode?: string;

  /**  */
  isActived?: boolean;

  /**  */
  encodedId?: string;

  /**  */
  id?: number;

  /**  */
  creationTime?: Date;
}

export interface CountryImportDto {
  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  phoneCode?: string;

  /**  */
  currencyCode?: string;

  /**  */
  isActived?: boolean;

  /**  */
  encodedId?: string;

  /**  */
  rowNumber?: number;

  /**  */
  errorMessages?: string[];
}

export interface CountryPagedDto {
  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  phoneCode?: string;

  /**  */
  currencyCode?: string;

  /**  */
  isActived?: boolean;

  /**  */
  encodedId?: string;

  /**  */
  id?: number;

  /**  */
  creationTime?: Date;
}

export interface CountryPagedInput {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  isActived?: boolean;
}

export interface CreateCountryDto {
  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  phoneCode?: string;

  /**  */
  currencyCode?: string;

  /**  */
  isActived?: boolean;

  /**  */
  encodedId?: string;
}

export interface CreateDistrictDto {
  /**  */
  provinceCode?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  level?: string;

  /**  */
  isActived?: boolean;

  /**  */
  encodedId?: string;
}

export interface CreateProvinceDto {
  /**  */
  countryCode?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  level?: string;

  /**  */
  isActived?: boolean;

  /**  */
  encodedId?: string;
}

export interface CreateRoleDto {
  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  description?: string;

  /**  */
  isActived?: boolean;
}

export interface CreateTenantDto {
  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  email?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  address?: string;

  /**  */
  isActived?: boolean;

  /**  */
  adminPassword?: string;

  /**  */
  adminUsername?: string;

  /**  */
  createDefaultAdmin?: boolean;
}

export interface CreateUserDto {
  /**  */
  email?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  name?: string;

  /**  */
  isActived?: boolean;

  /**  */
  encodedId?: string;

  /**  */
  mustChangePassword?: boolean;

  /**  */
  isLockoutEnabled?: boolean;

  /**  */
  birthDay?: Date;

  /**  */
  userName?: string;

  /**  */
  password?: string;
}

export interface CurrentCultureDto {
  /**  */
  displayName?: string;

  /**  */
  englishName?: string;

  /**  */
  threeLetterIsoLanguageName?: string;

  /**  */
  twoLetterIsoLanguageName?: string;

  /**  */
  isRightToLeft?: boolean;

  /**  */
  cultureName?: string;

  /**  */
  name?: string;

  /**  */
  nativeName?: string;

  /**  */
  dateTimeFormat?: DateTimeFormatDto;
}

export interface CurrentTenantDto {
  /**  */
  id?: string;

  /**  */
  name?: string;

  /**  */
  isAvailable?: boolean;
}

export interface CurrentUserDto {
  /**  */
  isAuthenticated?: boolean;

  /**  */
  id?: string;

  /**  */
  tenantId?: string;

  /**  */
  impersonatorUserId?: string;

  /**  */
  impersonatorTenantId?: string;

  /**  */
  impersonatorUserName?: string;

  /**  */
  impersonatorTenantName?: string;

  /**  */
  userName?: string;

  /**  */
  name?: string;

  /**  */
  surName?: string;

  /**  */
  email?: string;

  /**  */
  emailVerified?: boolean;

  /**  */
  phoneNumber?: string;

  /**  */
  phoneNumberVerified?: boolean;

  /**  */
  roles?: string[];

  /**  */
  sessionId?: string;
}

export interface DateRangeDto {
  /**  */
  autoSetTimeStartEnd?: boolean;

  /**  */
  startDate?: Date;

  /**  */
  endDate?: Date;
}

export interface DateTimeFormatDto {
  /**  */
  calendarAlgorithmType?: string;

  /**  */
  dateTimeFormatLong?: string;

  /**  */
  shortDatePattern?: string;

  /**  */
  fullDateTimePattern?: string;

  /**  */
  dateSeparator?: string;

  /**  */
  shortTimePattern?: string;

  /**  */
  longTimePattern?: string;
}

export interface DistrictDetailDto {
  /**  */
  provinceCode?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  level?: string;

  /**  */
  isActived?: boolean;

  /**  */
  encodedId?: string;

  /**  */
  id?: number;

  /**  */
  provinceName?: string;

  /**  */
  creationTime?: Date;
}

export interface DistrictPagedDto {
  /**  */
  provinceCode?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  level?: string;

  /**  */
  isActived?: boolean;

  /**  */
  encodedId?: string;

  /**  */
  id?: number;

  /**  */
  provinceName?: string;

  /**  */
  creationTime?: Date;
}

export interface DistrictPagedInput {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  isActived?: boolean;

  /**  */
  provinceCode?: string;
}

export interface DownloadResultFileImportOfCountryImportDto {
  /**  */
  items?: CountryImportDto[];

  /**  */
  isSuccessList?: boolean;
}

export interface EncodedIdDto {
  /**  */
  encodedId?: string;
}

export interface EntityExtensionDto {
  /**  */
  properties?: object;

  /**  */
  configuration?: object;
}

export interface ExtensionEnumDto {
  /**  */
  fields?: ExtensionEnumFieldDto[];

  /**  */
  localizationResource?: string;
}

export interface ExtensionEnumFieldDto {
  /**  */
  name?: string;

  /**  */
  value?: any | null;
}

export interface ExtensionPropertyApiCreateDto {
  /**  */
  isAvailable?: boolean;
}

export interface ExtensionPropertyApiDto {
  /**  */
  onGet?: ExtensionPropertyApiGetDto;

  /**  */
  onCreate?: ExtensionPropertyApiCreateDto;

  /**  */
  onUpdate?: ExtensionPropertyApiUpdateDto;
}

export interface ExtensionPropertyApiGetDto {
  /**  */
  isAvailable?: boolean;
}

export interface ExtensionPropertyApiUpdateDto {
  /**  */
  isAvailable?: boolean;
}

export interface ExtensionPropertyAttributeDto {
  /**  */
  typeSimple?: string;

  /**  */
  config?: object;
}

export interface ExtensionPropertyDto {
  /**  */
  type?: string;

  /**  */
  typeSimple?: string;

  /**  */
  displayName?: LocalizableStringDto;

  /**  */
  api?: ExtensionPropertyApiDto;

  /**  */
  ui?: ExtensionPropertyUiDto;

  /**  */
  attributes?: ExtensionPropertyAttributeDto[];

  /**  */
  configuration?: object;

  /**  */
  defaultValue?: any | null;
}

export interface ExtensionPropertyUiDto {
  /**  */
  onTable?: ExtensionPropertyUiTableDto;

  /**  */
  onCreateForm?: ExtensionPropertyUiFormDto;

  /**  */
  onEditForm?: ExtensionPropertyUiFormDto;

  /**  */
  lookup?: ExtensionPropertyUiLookupDto;
}

export interface ExtensionPropertyUiFormDto {
  /**  */
  isVisible?: boolean;
}

export interface ExtensionPropertyUiLookupDto {
  /**  */
  url?: string;

  /**  */
  resultListPropertyName?: string;

  /**  */
  displayPropertyName?: string;

  /**  */
  valuePropertyName?: string;

  /**  */
  filterParamName?: string;
}

export interface ExtensionPropertyUiTableDto {
  /**  */
  isVisible?: boolean;
}

export interface FileUploadDto {
  /**  */
  id?: string;

  /**  */
  fileName?: string;

  /**  */
  mimeType?: string;
}

export interface FireBaseDto {
  /**  */
  fireBaseToken?: string;

  /**  */
  deviceId?: string;

  /**  */
  deviceName?: string;

  /**  */
  platform?: string;
}

export interface GetComboOptionInputDto {
  /**  */
  includeUnActive?: boolean;
}

export interface GetUserNotificationInput {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  isActived?: boolean;

  /**  */
  isRead?: boolean;

  /**  */
  severity?: NotificationSeverity;

  /**  */
  creationTimeRange?: DateRangeDto;

  /**  */
  fromDate?: Date;

  /**  */
  toDate?: Date;
}

export interface GetUsersInRoleInput {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  encodedId?: string;

  /**  */
  isActived?: boolean;
}

export interface GrantPermissionToUserDto {
  /**  */
  encodedId?: string;

  /**  */
  permissionName?: string;
}

export interface IanaTimeZone {
  /**  */
  timeZoneName?: string;
}

export interface ImportOutputDtoOfCountryImportDto {
  /**  */
  errorImportList?: CountryImportDto[];

  /**  */
  successImportList?: CountryImportDto[];
}

export interface InterfaceMethodApiDescriptionModel {
  /**  */
  name?: string;

  /**  */
  parametersOnMethod?: MethodParameterApiDescriptionModel[];

  /**  */
  returnValue?: ReturnValueApiDescriptionModel;
}

export interface JwtDto {
  /**  */
  accessToken?: string;

  /**  */
  expireInSeconds?: number;

  /**  */
  refreshToken?: string;
}

export interface LanguageInfo {
  /**  */
  cultureName?: string;

  /**  */
  uiCultureName?: string;

  /**  */
  displayName?: string;

  /**  */
  twoLetterISOLanguageName?: string;
}

export interface LocalizableStringDto {
  /**  */
  name?: string;

  /**  */
  resource?: string;
}

export interface LoginInputDto {
  /**  */
  userName?: string;

  /**  */
  password?: string;

  /**  */
  tenantCode?: string;

  /**  */
  fireBase?: FireBaseDto;
}

export interface MethodParameterApiDescriptionModel {
  /**  */
  name?: string;

  /**  */
  typeAsString?: string;

  /**  */
  type?: string;

  /**  */
  typeSimple?: string;

  /**  */
  isOptional?: boolean;

  /**  */
  defaultValue?: any | null;
}

export interface ModuleApiDescriptionModel {
  /**  */
  rootPath?: string;

  /**  */
  remoteServiceName?: string;

  /**  */
  controllers?: object;
}

export interface ModuleExtensionDto {
  /**  */
  entities?: object;

  /**  */
  configuration?: object;
}

export interface MultiTenancyInfoDto {
  /**  */
  isEnabled?: boolean;
}

export interface NameValue {
  /**  */
  name?: string;

  /**  */
  value?: string;
}

export interface NotificationSummaryDto {
  /**  */
  totalCount?: number;

  /**  */
  unreadCount?: number;

  /**  */
  readCount?: number;
}

export interface ObjectExtensionsDto {
  /**  */
  modules?: object;

  /**  */
  enums?: object;
}

export interface OrdThemeDto {
  /**  */
  themeInfo?: string;

  /**  */
  logoFull?: string;

  /**  */
  logoSimple?: string;

  /**  */
  copyright?: string;

  /**  */
  systemName?: string;

  /**  */
  descriptionPage?: string;

  /**  */
  faviconIco?: string;

  /**  */
  bgLoginLeft?: string;

  /**  */
  bgLoginUnder?: string;

  /**  */
  landingPageUrl?: string;

  /**  */
  dashboardSlider?: string[];

  /**  */
  dashboardSlider1?: string;

  /**  */
  dashboardSlider2?: string;

  /**  */
  dashboardSlider3?: string;

  /**  */
  dashboardSlider4?: string;

  /**  */
  dashboardSlider5?: string;
}

export interface PagedResultDtoOfCountryPagedDto {
  /**  */
  items?: CountryPagedDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfDistrictPagedDto {
  /**  */
  items?: DistrictPagedDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfProvincePagedDto {
  /**  */
  items?: ProvincePagedDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfRolePagedDto {
  /**  */
  items?: RolePagedDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfTenantPagedDto {
  /**  */
  items?: TenantPagedDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfUserInRoleDto {
  /**  */
  items?: UserInRoleDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfUserNotificationDto {
  /**  */
  items?: UserNotificationDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfUserPagedDto {
  /**  */
  items?: UserPagedDto[];

  /**  */
  totalCount?: string;
}

export interface ParameterApiDescriptionModel {
  /**  */
  nameOnMethod?: string;

  /**  */
  name?: string;

  /**  */
  jsonName?: string;

  /**  */
  type?: string;

  /**  */
  typeSimple?: string;

  /**  */
  isOptional?: boolean;

  /**  */
  defaultValue?: any | null;

  /**  */
  constraintTypes?: string[];

  /**  */
  bindingSourceId?: string;

  /**  */
  descriptorName?: string;
}

export interface PropertyApiDescriptionModel {
  /**  */
  name?: string;

  /**  */
  jsonName?: string;

  /**  */
  type?: string;

  /**  */
  typeSimple?: string;

  /**  */
  isRequired?: boolean;

  /**  */
  minLength?: number;

  /**  */
  maxLength?: number;

  /**  */
  minimum?: string;

  /**  */
  maximum?: string;

  /**  */
  regex?: string;
}

export interface ProvinceDetailDto {
  /**  */
  countryCode?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  level?: string;

  /**  */
  isActived?: boolean;

  /**  */
  encodedId?: string;

  /**  */
  id?: number;

  /**  */
  countryName?: string;

  /**  */
  creationTime?: Date;
}

export interface ProvincePagedDto {
  /**  */
  countryCode?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  level?: string;

  /**  */
  isActived?: boolean;

  /**  */
  encodedId?: string;

  /**  */
  id?: number;

  /**  */
  countryName?: string;

  /**  */
  creationTime?: Date;
}

export interface ProvincePagedInput {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  isActived?: boolean;

  /**  */
  countryCode?: string;
}

export interface RemoteServiceErrorInfo {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  details?: string;

  /**  */
  data?: object;

  /**  */
  validationErrors?: RemoteServiceValidationErrorInfo[];
}

export interface RemoteServiceErrorResponse {
  /**  */
  error?: RemoteServiceErrorInfo;
}

export interface RemoteServiceValidationErrorInfo {
  /**  */
  message?: string;

  /**  */
  members?: string[];
}

export interface ResetPasswordUserDto {
  /**  */
  encodedId?: string;

  /**  */
  newPassword?: string;

  /**  */
  mustChangePassword?: boolean;
}

export interface ReturnValueApiDescriptionModel {
  /**  */
  type?: string;

  /**  */
  typeSimple?: string;
}

export interface RevokePermissionFromUserDto {
  /**  */
  encodedId?: string;

  /**  */
  permissionName?: string;
}

export interface RoleDetailDto {
  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  description?: string;

  /**  */
  isActived?: boolean;

  /**  */
  id?: string;

  /**  */
  encodedId?: string;

  /**  */
  creationTime?: Date;

  /**  */
  assignedPermissions?: string[];
}

export interface RolePagedDto {
  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  description?: string;

  /**  */
  isActived?: boolean;

  /**  */
  id?: string;

  /**  */
  encodedId?: string;

  /**  */
  creationTime?: Date;
}

export interface RolePagedInput {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  isActived?: boolean;
}

export interface SetActiveStatusDto {
  /**  */
  encodedId?: string;

  /**  */
  isActived?: boolean;
}

export interface TenantDetailDto {
  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  email?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  address?: string;

  /**  */
  isActived?: boolean;

  /**  */
  id?: string;

  /**  */
  creationTime?: Date;

  /**  */
  userCount?: number;

  /**  */
  encodedId?: string;

  /**  */
  users?: TenantUserDto[];
}

export interface TenantPagedDto {
  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  email?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  address?: string;

  /**  */
  isActived?: boolean;

  /**  */
  id?: string;

  /**  */
  creationTime?: Date;

  /**  */
  userCount?: number;

  /**  */
  encodedId?: string;
}

export interface TenantPagedInput {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  isActived?: boolean;
}

export interface TenantSharedDto {
  /**  */
  id?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  isActived?: boolean;

  /**  */
  email?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  address?: string;
}

export interface TenantUserDto {
  /**  */
  userEncodedId?: string;

  /**  */
  id?: string;

  /**  */
  tenantId?: string;

  /**  */
  userName?: string;

  /**  */
  name?: string;

  /**  */
  email?: string;

  /**  */
  isActived?: boolean;

  /**  */
  isAdminAccount?: boolean;

  /**  */
  creationTime?: Date;
}

export interface TimeZone {
  /**  */
  iana?: IanaTimeZone;

  /**  */
  windows?: WindowsTimeZone;
}

export interface TimingDto {
  /**  */
  timeZone?: TimeZone;
}

export interface TypeApiDescriptionModel {
  /**  */
  baseType?: string;

  /**  */
  isEnum?: boolean;

  /**  */
  enumNames?: string[];

  /**  */
  enumValues?: any | null[];

  /**  */
  genericArguments?: string[];

  /**  */
  properties?: PropertyApiDescriptionModel[];
}

export interface UpdateCountryDto {
  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  phoneCode?: string;

  /**  */
  currencyCode?: string;

  /**  */
  isActived?: boolean;

  /**  */
  encodedId?: string;
}

export interface UpdateDistrictDto {
  /**  */
  provinceCode?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  level?: string;

  /**  */
  isActived?: boolean;

  /**  */
  encodedId?: string;
}

export interface UpdateProvinceDto {
  /**  */
  countryCode?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  level?: string;

  /**  */
  isActived?: boolean;

  /**  */
  encodedId?: string;
}

export interface UpdateRoleDto {
  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  description?: string;

  /**  */
  isActived?: boolean;

  /**  */
  encodedId?: string;
}

export interface UpdateTenantDto {
  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  email?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  address?: string;

  /**  */
  isActived?: boolean;

  /**  */
  encodedId?: string;
}

export interface UpdateUserDto {
  /**  */
  email?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  name?: string;

  /**  */
  isActived?: boolean;

  /**  */
  encodedId?: string;

  /**  */
  mustChangePassword?: boolean;

  /**  */
  isLockoutEnabled?: boolean;

  /**  */
  birthDay?: Date;

  /**  */
  password?: string;
}

export interface UserCurrentShopAssign {
  /**  */
  shopId?: number;

  /**  */
  shopIdHash?: string;

  /**  */
  shopName?: string;

  /**  */
  shopCode?: string;

  /**  */
  shopType?: ShopType;

  /**  */
  businessType?: number;

  /**  */
  productPriceListMainId?: string;

  /**  */
  isMain?: boolean;
}

export interface UserDetailDto {
  /**  */
  email?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  name?: string;

  /**  */
  isActived?: boolean;

  /**  */
  encodedId?: string;

  /**  */
  mustChangePassword?: boolean;

  /**  */
  isLockoutEnabled?: boolean;

  /**  */
  birthDay?: Date;

  /**  */
  id?: string;

  /**  */
  userName?: string;

  /**  */
  creationTime?: Date;
}

export interface UserInRoleDto {
  /**  */
  userId?: string;

  /**  */
  tenantId?: string;

  /**  */
  userName?: string;

  /**  */
  name?: string;

  /**  */
  email?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  isActived?: boolean;

  /**  */
  assignedDate?: Date;

  /**  */
  userEncodedId?: string;
}

export interface UserInformationDto {
  /**  */
  userName?: string;

  /**  */
  email?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  name?: string;

  /**  */
  isActived?: boolean;

  /**  */
  level?: string;

  /**  */
  isLockoutEnabled?: boolean;

  /**  */
  lockoutEnd?: Date;

  /**  */
  listRoleId?: string[];

  /**  */
  listPermission?: string[];

  /**  */
  mustChangePassword?: boolean;

  /**  */
  lastModificationTime?: Date;

  /**  */
  birthDay?: Date;

  /**  */
  id?: string;

  /**  */
  tenantId?: string;

  /**  */
  tenantType?: TenantType;

  /**  */
  tenantCode?: string;

  /**  */
  tenantName?: string;

  /**  */
  tenantDto?: TenantSharedDto;

  /**  */
  isSuperAdmin?: boolean;
}

export interface UserNotificationDto {
  /**  */
  id?: string;

  /**  */
  notificationId?: string;

  /**  */
  notificationName?: string;

  /**  */
  title?: string;

  /**  */
  body?: string;

  /**  */
  dataJson?: string;

  /**  */
  severity?: NotificationSeverity;

  /**  */
  state?: boolean;

  /**  */
  creationTime?: Date;

  /**  */
  severityText?: string;

  /**  */
  isRead?: boolean;

  /**  */
  encodedId?: string;
}

export interface UserPagedDto {
  /**  */
  email?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  name?: string;

  /**  */
  isActived?: boolean;

  /**  */
  encodedId?: string;

  /**  */
  mustChangePassword?: boolean;

  /**  */
  isLockoutEnabled?: boolean;

  /**  */
  birthDay?: Date;

  /**  */
  id?: string;

  /**  */
  userName?: string;

  /**  */
  creationTime?: Date;
}

export interface UserPagedInput {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  isActived?: boolean;
}

export interface UsersToRoleDto {
  /**  */
  encodedId?: string;

  /**  */
  userIds?: string[];
}

export interface WindowsTimeZone {
  /**  */
  timeZoneId?: string;
}

export type NotificationSeverity = 1 | 2 | 3 | 4 | 5;

export type ShopType =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 100
  | 101
  | 102
  | 103
  | 104
  | 105
  | 106
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 300
  | 301;

export type TenantType = 0 | 100;
