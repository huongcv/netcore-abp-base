/** Generate by swagger-axios-codegen */
/* eslint-disable */
// @ts-nocheck
import axiosStatic, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

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

export interface ACCOUNT_MOVE_TYPE {}

export interface boolean {}

export interface number {}

export interface PARTNER_TYPE {}

export interface RESERVATION_STATUS {}

export interface ShopTemplateTypeEnum {}

export interface string {}

export interface SupplierInvoice {}

export interface TEMPLATE_PRINTER {}

export interface AccessCardAvairableInputDto {
  /**  */
  timeCheck?: Date;

  /**  */
  cardType?: AccessCardTypeEnum;

  /**  */
  partnerId?: string;

  /**  */
  accessCardId?: string;
}

export interface AccessCardDto {
  /**  */
  id?: string;

  /**  */
  code?: string;

  /**  */
  uid?: string;

  /**  */
  accessCode?: string;

  /**  */
  printedNumber?: string;

  /**  */
  description?: string;

  /**  */
  version?: string;

  /**  */
  accessStatus?: AccessCardStatusEnum;

  /**  */
  cardType?: AccessCardTypeEnum;

  /**  */
  strAccessStatus?: string;

  /**  */
  strCardType?: string;

  /**  */
  isActived?: boolean;

  /**  */
  accessCardColorId?: string;

  /**  */
  cardColorName?: string;
}

export interface AccessCardHistoryDto {
  /**  */
  id?: string;

  /**  */
  code?: string;

  /**  */
  uid?: string;

  /**  */
  partnerName?: string;

  /**  */
  partnerCode?: string;

  /**  */
  startDate?: Date;

  /**  */
  endDate?: Date;
}

export interface AccessCardPageRequest {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  accessStatus?: AccessCardStatusEnum;

  /**  */
  cardType?: AccessCardTypeEnum;

  /**  */
  isActived?: boolean;
}

export interface AccessCardUseByBookingPlayerDto {
  /**  */
  id?: string;

  /**  */
  code?: string;

  /**  */
  uid?: string;

  /**  */
  partnerName?: string;

  /**  */
  partnerCode?: string;

  /**  */
  startDate?: Date;

  /**  */
  endDate?: Date;

  /**  */
  cardType?: AccessCardTypeEnum;

  /**  */
  accessStatus?: AccessCardStatusEnum;

  /**  */
  accessCardId?: string;
}

export interface AccountInfoResponse {
  /**  */
  name?: string;

  /**  */
  surname?: string;

  /**  */
  userName?: string;

  /**  */
  emailAddress?: string;

  /**  */
  provinceId?: string;

  /**  */
  rolesName?: string;

  /**  */
  roleLevel?: number;

  /**  */
  districtId?: string;

  /**  */
  wardId?: string;

  /**  */
  businessId?: number;

  /**  */
  businessCode?: string;

  /**  */
  id?: number;
}

export interface AccountMoveDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  cashBookId?: string;

  /**  */
  accountMoveCode?: string;

  /**  */
  accountMoveType?: ACCOUNT_MOVE_TYPE;

  /**  */
  accountMoveDate?: Date;

  /**  */
  accountMoveReasonTypeId?: string;

  /**  */
  accountMoveReasonType?: REASON_TYPE;

  /**  */
  accountMoveReasonName?: string;

  /**  */
  partnerType?: AccountMovePartnerTypeEnum;

  /**  */
  partnerId?: string;

  /**  */
  amount?: number;

  /**  */
  paymentMethod?: PAYMENT_METHOD;

  /**  */
  paymentMethodName?: string;

  /**  */
  relatedMoveType?: MOVE_TYPE;

  /**  */
  relatedMoveId?: string;

  /**  */
  relatedMoveDate?: Date;

  /**  */
  relatedMoveCode?: string;

  /**  */
  status?: MOVE_STATUS;

  /**  */
  notes?: string;

  /**  */
  description?: string;

  /**  */
  isIncludedFinancialReport?: boolean;

  /**  */
  isPayDebt?: boolean;

  /**  */
  income?: number;

  /**  */
  strPaymentMethod?: string;

  /**  */
  strStatus?: string;

  /**  */
  strPartnerType?: string;

  /**  */
  partnerName?: string;

  /**  */
  partnerPhone?: string;

  /**  */
  paymentAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  bankCode?: string;

  /**  */
  bankAccountCode?: string;

  /**  */
  bankAccountName?: string;

  /**  */
  bankVirtualCode?: string;

  /**  */
  debtDetails?: DebtInfo_DetailsDto[];
}

export interface AccountMovePagingInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  accountMoveType?: ACCOUNT_MOVE_TYPE;

  /**  */
  reasonTypeId?: string;

  /**  */
  paymentMethod?: PAYMENT_METHOD;

  /**  */
  status?: MOVE_STATUS;
}

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

export interface AddProductForPlayerInputDto {
  /**  */
  bookingId?: string;

  /**  */
  bookingPlayerId?: string;

  /**  */
  invoiceId?: string;

  /**  */
  listDeleteId?: string[];

  /**  */
  listProduct?: ProductForPlayerProductInputDto[];
}

export interface AllowanceDto {
  /**  */
  id?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  amount?: number;

  /**  */
  notes?: string;

  /**  */
  type?: ALOWANCE_TYPE;

  /**  */
  isActived?: boolean;

  /**  */
  isTaxable?: boolean;

  /**  */
  isInsurance?: boolean;
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

export interface ApplyDaysDto {
  /**  */
  daysOfWeek?: DayOfWeek[];

  /**  */
  months?: number[];

  /**  */
  hours?: TimeRange[];

  /**  */
  daysOfMonth?: number[];

  /**  */
  specificDates?: Date[];
}

export interface AssignPartnerAccessCardDto {
  /**  */
  id?: string;

  /**  */
  partnerId?: string;

  /**  */
  accessCardId?: string;

  /**  */
  startDate?: Date;

  /**  */
  endDate?: Date;

  /**  */
  isReturned?: boolean;

  /**  */
  notes?: string;

  /**  */
  isPaid?: boolean;

  /**  */
  isFree?: boolean;

  /**  */
  invoiceId?: string;
}

export interface AssignUserShopDto {
  /**  */
  userId?: string;

  /**  */
  listShopRole?: string[];
}

export interface BarcodeDiscountItemDto {
  /**  */
  barCode?: string;

  /**  */
  code?: string;

  /**  */
  discounT_TYPE?: DiscountTypeEnum;

  /**  */
  discounT_USE_TYPE?: DISCOUNT_USE_TYPE;

  /**  */
  discountValue?: number;

  /**  */
  qtyPrint?: number;
}

export interface BarcodeDiscountPrintInput {
  /**  */
  discounts?: BarcodeDiscountItemDto[];

  /**  */
  setting?: DiscountBarCodeLayoutSettingDto;
}

export interface BarcodeProductGetInpuDto {
  /**  */
  barCode?: string;

  /**  */
  priceListId?: string;
}

export interface BarcodeProductItemDto {
  /**  */
  id?: string;

  /**  */
  productUnitId?: string;

  /**  */
  unitName?: string;

  /**  */
  barCode?: string;

  /**  */
  price?: number;

  /**  */
  priceWithTax?: number;

  /**  */
  productName?: string;

  /**  */
  qtyPrint?: number;

  /**  */
  units?: ProductUnitBarCodeDto[];
}

export interface BookingInvoiceTempDto {
  /**  */
  invoiceId?: string;

  /**  */
  debtAmount?: number;

  /**  */
  viewInvoice?: InfoPrivateInvoiceSimple[];
}

export interface BusinessHouseHoldBankBookDetailDto {
  /**  */
  bankAccountCode?: string;

  /**  */
  accountMoveDate?: Date;

  /**  */
  accountMoveDateStr?: string;

  /**  */
  accountMoveType?: number;

  /**  */
  accountMoveName?: string;

  /**  */
  amount?: number;

  /**  */
  descriptions?: string;

  /**  */
  notes?: string;

  /**  */
  partnerName?: string;

  /**  */
  totalPurchase?: number;

  /**  */
  totalPayment?: number;

  /**  */
  duringTotalPayment?: number;
}

export interface BusinessHouseHoldBankBookDto {
  /**  */
  totalPurchase?: number;

  /**  */
  totalPayment?: number;

  /**  */
  duringTotalPayment?: number;

  /**  */
  openingTotalPayment?: number;
}

export interface BusinessHouseHoldCashBookDetailDto {
  /**  */
  accountMoveDate?: Date;

  /**  */
  accountMoveDateStr?: string;

  /**  */
  accountMoveType?: number;

  /**  */
  accountMoveName?: string;

  /**  */
  amount?: number;

  /**  */
  descriptions?: string;

  /**  */
  notes?: string;

  /**  */
  partnerName?: string;

  /**  */
  totalPurchase?: number;

  /**  */
  totalPayment?: number;

  /**  */
  duringTotalPayment?: number;
}

export interface BusinessHouseHoldCashBookDto {
  /**  */
  totalPurchase?: number;

  /**  */
  totalPayment?: number;

  /**  */
  duringTotalPayment?: number;
}

export interface CaddyWorkScheduleDto {
  /**  */
  id?: string;

  /**  */
  hourFrom?: string;

  /**  */
  hourTo?: string;

  /**  */
  notes?: string;

  /**  */
  workCalendarId?: string;

  /**  */
  workCalendarName?: string;

  /**  */
  hourBreakTimeFrom?: string;

  /**  */
  hourBreakTimeTo?: string;

  /**  */
  name?: string;
}

export interface CaddyWorkSchedulePagedRequestDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  dateRange?: DateRangeDto;

  /**  */
  caddyId?: string;
}

export interface CancelMoveStockDto {
  /**  */
  moveHashId?: string;

  /**  */
  cancelReason?: string;
}

export interface CancelOrderDto {
  /**  */
  idHash?: string;

  /**  */
  canceledReason?: string;
}

export interface CashbookStatisticsOutputDto {
  /**  */
  beginningBalance?: number;

  /**  */
  totalIncome?: number;

  /**  */
  totalCost?: number;

  /**  */
  endingBalance?: number;
}

export interface ChangePasswordCommand {
  /**  */
  currentPassword?: string;

  /**  */
  newPassword?: string;
}

export interface ChangeShopQuery {
  /**  */
  shopPublishViewId?: number;
}

export interface CheckCodeForgotPasswordQuery {
  /**  */
  code?: string;
}

export interface CheckNationalDrugSyncModel {
  /**  */
  facilityCode?: string;

  /**  */
  lotNumber?: string;

  /**  */
  drugCode?: string;
}

export interface CheckStockMoveDetailDto {
  /**  */
  uuid?: string;

  /**  */
  inventoryId?: string;

  /**  */
  inventoryRootDetailId?: string;

  /**  */
  inventoryLineDetailId?: string;

  /**  */
  moveId?: string;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  moveCode?: string;

  /**  */
  moveDate?: Date;

  /**  */
  productId?: string;

  /**  */
  productHashId?: string;

  /**  */
  productName?: string;

  /**  */
  productUnitId?: string;

  /**  */
  unitName?: string;

  /**  */
  productTypeId?: number;

  /**  */
  productCategoryId?: number;

  /**  */
  productSubCategoryId?: number;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  lotNumberId?: string;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  invoiceId?: string;

  /**  */
  qty?: number;

  /**  */
  qtyConvert?: number;

  /**  */
  convertRate?: number;

  /**  */
  returnQty?: number;

  /**  */
  price?: number;

  /**  */
  latestImportPrice?: number;

  /**  */
  priceWithTax?: number;

  /**  */
  isPriceIncludeTax?: boolean;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountValue?: number;

  /**  */
  subTaxAmount?: number;

  /**  */
  subTotalAmount?: number;

  /**  */
  taxDiscountAmountAllocation?: number;

  /**  */
  discountAmountCaculate?: number;

  /**  */
  discountAmount?: number;

  /**  */
  totalAmountAfterDiscount?: number;

  /**  */
  discountAmountAllocation?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  taxAmount?: number;

  /**  */
  taxName?: string;

  /**  */
  totalAmount?: number;

  /**  */
  status?: MOVE_STATUS;

  /**  */
  costPrice?: number;

  /**  */
  totalCostAmount?: number;

  /**  */
  partnerId?: string;

  /**  */
  partnerType?: number;

  /**  */
  relatedMoveId?: string;

  /**  */
  relatedMoveRootDetailId?: string;

  /**  */
  relatedMoveLineDetailId?: string;

  /**  */
  productDetail?: ProductStockViewDto;

  /**  */
  moveLineDetailId?: string;

  /**  */
  moveRootDetailId?: string;

  /**  */
  lotNumbers?: StockProductUnitDto[];

  /**  */
  units?: StockProductSelectUnitDto[];

  /**  */
  maxQtyEnable?: number;

  /**  */
  inventoryQty?: number;

  /**  */
  openingInventoryQty?: number;

  /**  */
  closingInventoryQty?: number;

  /**  */
  note?: string;
}

export interface CheckStockMoveDto {
  /**  */
  moveId?: string;

  /**  */
  moveHashId?: string;

  /**  */
  inventoryId?: string;

  /**  */
  inventoryName?: string;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  moveStatus?: MOVE_STATUS;

  /**  */
  moveCode?: string;

  /**  */
  moveDate?: Date;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountValue?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxDiscountPercent?: number;

  /**  */
  taxDiscountCode?: string;

  /**  */
  taxDiscountName?: string;

  /**  */
  taxDiscountAmount?: number;

  /**  */
  discountAmountCaculate?: number;

  /**  */
  discountAmountDisplay?: number;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  totalAmountRound?: number;

  /**  */
  paymentAmount?: number;

  /**  */
  debtAmount?: number;

  /**  */
  paymentStatus?: number;

  /**  */
  paymentMethod?: number;

  /**  */
  paymentMethodName?: string;

  /**  */
  totalQty?: number;

  /**  */
  invoiceId?: string;

  /**  */
  invoiceCode?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  note?: string;

  /**  */
  partnerId?: string;

  /**  */
  partnerName?: string;

  /**  */
  partnerType?: number;

  /**  */
  relatedMoveId?: string;

  /**  */
  relatedMoveIdHash?: string;

  /**  */
  relatedMoveCode?: string;

  /**  */
  relatedMoveDate?: Date;

  /**  */
  relatedMoveType?: MOVE_TYPE;

  /**  */
  relatedMoveStatus?: MOVE_STATUS;

  /**  */
  totalReturnQty?: number;

  /**  */
  cancelReason?: string;

  /**  */
  creatorId?: string;

  /**  */
  partnerInvoiceCode?: string;

  /**  */
  partnerInvoiceDate?: Date;
}

export interface CheckStockTicketDto {
  /**  */
  productInTicket?: ProductMoveStockDto[];

  /**  */
  moveDto?: CheckStockMoveDto;

  /**  */
  items?: CheckStockMoveDetailDto[];

  /**  */
  moveDateOld?: Date;

  /**  */
  isDraft?: boolean;

  /**  */
  totalCostPriceInMove?: number;
}

export interface CitizenIdentityCardDto {
  /**  */
  nationalId?: string;

  /**  */
  oldIdNumber?: string;

  /**  */
  fullName?: string;

  /**  */
  dateOfBirth?: Date;

  /**  */
  gender?: GENDER;

  /**  */
  permanentAddress?: string;

  /**  */
  idIssuedDate?: Date;

  /**  */
  cityCode?: string;

  /**  */
  districtCode?: string;

  /**  */
  wardCode?: string;
}

export interface CleaningTaskDto {
  /**  */
  id?: string;

  /**  */
  executionDate?: Date;

  /**  */
  floorCleaned?: boolean;

  /**  */
  shelvesCleaned?: boolean;

  /**  */
  tablesChairsCleaned?: boolean;

  /**  */
  fansAndAirConditionersCleaned?: boolean;

  /**  */
  cabinetsCleaned?: boolean;

  /**  */
  wallsAndCeilingsCleaned?: boolean;

  /**  */
  medicineOrganized?: boolean;

  /**  */
  cleaningTasksCompleted?: boolean;

  /**  */
  performedById?: string;

  /**  */
  inspectedById?: string;

  /**  */
  notes?: string;

  /**  */
  performedByName?: string;

  /**  */
  inspectedByName?: string;
}

export interface CleaningTaskGetPagedDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  performedById?: string;

  /**  */
  inspectedById?: string;

  /**  */
  notes?: string;

  /**  */
  rangeDate?: DateRangeDto;
}

export interface CleaningTaskGroupByDateParamDto {
  /**  */
  executionDate?: Date;
}

export interface CleaningTaskInput {
  /**  */
  cleaningTasks?: CleaningTaskDto[];
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
  disabled?: boolean;

  /**  */
  data?: any | null;
}

export interface CommonResponse {
  /**  */
  code?: number;

  /**  */
  message?: string;

  /**  */
  data?: string;
}

export interface CommonResultDtoOfAccessCardDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: AccessCardDto;
}

export interface CommonResultDtoOfAccessCardUseByBookingPlayerDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: AccessCardUseByBookingPlayerDto;
}

export interface CommonResultDtoOfAccountInfoResponse {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: AccountInfoResponse;
}

export interface CommonResultDtoOfAllowanceDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: AllowanceDto;
}

export interface CommonResultDtoOfAssignPartnerAccessCardDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: AssignPartnerAccessCardDto;
}

export interface CommonResultDtoOfBookingInvoiceTempDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: BookingInvoiceTempDto;
}

export interface CommonResultDtoOfBookingStatusEnum {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: BookingStatusEnum;
}

export interface CommonResultDtoOfBoolean {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: boolean;
}

export interface CommonResultDtoOfCashbookStatisticsOutputDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: CashbookStatisticsOutputDto;
}

export interface CommonResultDtoOfCheckStockTicketDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: CheckStockTicketDto;
}

export interface CommonResultDtoOfCheckinStatusEnum {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: CheckinStatusEnum;
}

export interface CommonResultDtoOfCleaningTaskDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: CleaningTaskDto;
}

export interface CommonResultDtoOfCountryDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: CountryDto;
}

export interface CommonResultDtoOfCountryStateDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: CountryStateDto;
}

export interface CommonResultDtoOfCreateEinvoiceResultDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: CreateEinvoiceResultDto;
}

export interface CommonResultDtoOfCruPrivateBookingDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: CruPrivateBookingDto;
}

export interface CommonResultDtoOfCustomerComparisonDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: CustomerComparisonDto;
}

export interface CommonResultDtoOfDictionaryDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: DictionaryDto;
}

export interface CommonResultDtoOfDistrictDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: DistrictDto;
}

export interface CommonResultDtoOfDrugRecallDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: DrugRecallDto;
}

export interface CommonResultDtoOfEmployeeDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: EmployeeDto;
}

export interface CommonResultDtoOfEmployeePayrollDetailDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: EmployeePayrollDetailDto;
}

export interface CommonResultDtoOfEmployeePayrollDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: EmployeePayrollDto;
}

export interface CommonResultDtoOfEmployeeTimekeepingDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: EmployeeTimekeepingDto;
}

export interface CommonResultDtoOfEmployeeTimesheetDetailSummaryDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: EmployeeTimesheetDetailSummaryDto;
}

export interface CommonResultDtoOfEmployeeTimesheetDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: EmployeeTimesheetDto;
}

export interface CommonResultDtoOfExportSaleStockTicketDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ExportSaleStockTicketDto;
}

export interface CommonResultDtoOfExportStockTicketDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ExportStockTicketDto;
}

export interface CommonResultDtoOfFileUploadDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: FileUploadDto;
}

export interface CommonResultDtoOfFinancialReportOutputDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: FinancialReportOutputDto;
}

export interface CommonResultDtoOfFnbAreaDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: FnbAreaDto;
}

export interface CommonResultDtoOfFnbProcessingAreaDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: FnbProcessingAreaDto;
}

export interface CommonResultDtoOfFnbReservationDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: FnbReservationDto;
}

export interface CommonResultDtoOfFnbTableDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: FnbTableDto;
}

export interface CommonResultDtoOfGdpOrderStockTicketDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GdpOrderStockTicketDto;
}

export interface CommonResultDtoOfGolfAccessCardColorDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GolfAccessCardColorDto;
}

export interface CommonResultDtoOfGolfAreaDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GolfAreaDto;
}

export interface CommonResultDtoOfGolfBookingGroupDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GolfBookingGroupDto;
}

export interface CommonResultDtoOfGolfBookingGroupImportOutputDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GolfBookingGroupImportOutputDto;
}

export interface CommonResultDtoOfGolfBuggyDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GolfBuggyDto;
}

export interface CommonResultDtoOfGolfBuggyGroupDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GolfBuggyGroupDto;
}

export interface CommonResultDtoOfGolfCheckoutOutputDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GolfCheckoutOutputDto;
}

export interface CommonResultDtoOfGolfCourseDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GolfCourseDto;
}

export interface CommonResultDtoOfGolfCourseMaintenanceLogDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GolfCourseMaintenanceLogDto;
}

export interface CommonResultDtoOfGolfCustomerDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GolfCustomerDto;
}

export interface CommonResultDtoOfGolfFlightOutputDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GolfFlightOutputDto;
}

export interface CommonResultDtoOfGolfGolferGroupDetailDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GolfGolferGroupDetailDto;
}

export interface CommonResultDtoOfGolfLockerBlockCodeDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GolfLockerBlockCodeDto;
}

export interface CommonResultDtoOfGolfLockerDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GolfLockerDto;
}

export interface CommonResultDtoOfGolfLockerGroupDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GolfLockerGroupDto;
}

export interface CommonResultDtoOfGolfLockerMaintenanceLogDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GolfLockerMaintenanceLogDto;
}

export interface CommonResultDtoOfGolfProductDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GolfProductDto;
}

export interface CommonResultDtoOfGolfProductGroupDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GolfProductGroupDto;
}

export interface CommonResultDtoOfGolfReasonDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GolfReasonDto;
}

export interface CommonResultDtoOfGolfTeeTimeConfigDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GolfTeeTimeConfigDto;
}

export interface CommonResultDtoOfGuid {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: string;
}

export interface CommonResultDtoOfIEnumerableOfBarcodeProductItemDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: BarcodeProductItemDto[];
}

export interface CommonResultDtoOfIEnumerableOfComboOptionDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ComboOptionDto[];
}

export interface CommonResultDtoOfIEnumerableOfProductLotDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ProductLotDto[];
}

export interface CommonResultDtoOfIEnumerableOfRevenueDataByChanelDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: RevenueDataByChanelDto[];
}

export interface CommonResultDtoOfIEnumerableOfTableStatusCounterDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: TableStatusCounterDto[];
}

export interface CommonResultDtoOfImportDiscountSupplierOutputDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ImportDiscountSupplierOutputDto;
}

export interface CommonResultDtoOfImportExcelAccessCardOutputDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ImportExcelAccessCardOutputDto;
}

export interface CommonResultDtoOfImportExcelPartnerGroupOutputDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ImportExcelPartnerGroupOutputDto;
}

export interface CommonResultDtoOfImportPartnerOutputDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ImportPartnerOutputDto;
}

export interface CommonResultDtoOfImportSaleInvoiceOutputDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ImportSaleInvoiceOutputDto;
}

export interface CommonResultDtoOfImportStockInvoiceReturnTicketDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ImportStockInvoiceReturnTicketDto;
}

export interface CommonResultDtoOfImportStockTicketDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ImportStockTicketDto;
}

export interface CommonResultDtoOfInfoPrivateBookingDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: InfoPrivateBookingDto;
}

export interface CommonResultDtoOfInt32 {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: number;
}

export interface CommonResultDtoOfInt64 {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: string;
}

export interface CommonResultDtoOfInvoiceReturnDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: InvoiceReturnDto;
}

export interface CommonResultDtoOfIssueRfidDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: IssueRfidDto;
}

export interface CommonResultDtoOfJwtDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: JwtDto;
}

export interface CommonResultDtoOfListOfCleaningTaskDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: CleaningTaskDto[];
}

export interface CommonResultDtoOfListOfComboOptionDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ComboOptionDto[];
}

export interface CommonResultDtoOfListOfGolfTeeTimeConfigDetailDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: GolfTeeTimeConfigDetailDto[];
}

export interface CommonResultDtoOfListOfImportExcelCheckExcelBaseDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ImportExcelCheckExcelBaseDto[];
}

export interface CommonResultDtoOfListOfImportExcelExportExcelBaseDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ImportExcelExportExcelBaseDto[];
}

export interface CommonResultDtoOfListOfImportExcelImportSuplierExcelBaseDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ImportExcelImportSuplierExcelBaseDto[];
}

export interface CommonResultDtoOfListOfImportExcelTransferExcelBaseDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ImportExcelTransferExcelBaseDto[];
}

export interface CommonResultDtoOfListOfInvoiceReturnDetailSampleDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: InvoiceReturnDetailSampleDto[];
}

export interface CommonResultDtoOfListOfProductHotSaleDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ProductHotSaleDto[];
}

export interface CommonResultDtoOfListOfProductPriceListDetailDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ProductPriceListDetailDto[];
}

export interface CommonResultDtoOfListOfProductSelectDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ProductSelectDto[];
}

export interface CommonResultDtoOfListOfShopWeatherDataDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ShopWeatherDataDto[];
}

export interface CommonResultDtoOfListOfStockProductSelectDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: StockProductSelectDto[];
}

export interface CommonResultDtoOfListOfTableTreeDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: TableTreeDto[];
}

export interface CommonResultDtoOfListOfTeeTimeAvailabilityDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: TeeTimeAvailabilityDto[];
}

export interface CommonResultDtoOfLogApiDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: LogApiDto;
}

export interface CommonResultDtoOfMemberInfoByCardMemberOutputDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: MemberInfoByCardMemberOutputDto;
}

export interface CommonResultDtoOfMemberInfoByCardOutputDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: MemberInfoByCardOutputDto;
}

export interface CommonResultDtoOfMoveReasonTypeDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: MoveReasonTypeDto;
}

export interface CommonResultDtoOfNationalPrescriptionOutputDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: NationalPrescriptionOutputDto;
}

export interface CommonResultDtoOfNullableOfInt64 {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: string;
}

export interface CommonResultDtoOfOrdGolfTeeTimeConfigPagedRequestDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: OrdGolfTeeTimeConfigPagedRequestDto;
}

export interface CommonResultDtoOfOrderByIdDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: OrderByIdDto;
}

export interface CommonResultDtoOfOrderStockTicketDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: OrderStockTicketDto;
}

export interface CommonResultDtoOfPackageDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: PackageDto;
}

export interface CommonResultDtoOfPagedResultDtoOfFoodGridDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: PagedResultDtoOfFoodGridDto;
}

export interface CommonResultDtoOfPagedResultDtoOfProductGroupOrderDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: PagedResultDtoOfProductGroupOrderDto;
}

export interface CommonResultDtoOfPagedResultDtoOfSaleOrderDetailDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: PagedResultDtoOfSaleOrderDetailDto;
}

export interface CommonResultDtoOfPagedResultDtoOfTableGridDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: PagedResultDtoOfTableGridDto;
}

export interface CommonResultDtoOfPartnerDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: PartnerDto;
}

export interface CommonResultDtoOfPartnerGroupDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: PartnerGroupDto;
}

export interface CommonResultDtoOfPartnerTransactionDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: PartnerTransactionDto;
}

export interface CommonResultDtoOfPharmacyAdverseReactionDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: PharmacyAdverseReactionDto;
}

export interface CommonResultDtoOfPharmacyComplaintLogDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: PharmacyComplaintLogDto;
}

export interface CommonResultDtoOfPharmacyLogReportQualityInspectionOutputDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: PharmacyLogReportQualityInspectionOutputDto;
}

export interface CommonResultDtoOfPlayerInfoByIdOutputDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: PlayerInfoByIdOutputDto;
}

export interface CommonResultDtoOfProductCreateImportResponseDtoOfProductImportDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ProductCreateImportResponseDtoOfProductImportDto;
}

export interface CommonResultDtoOfProductCreateImportResponseDtoOfProductImportKiotVietDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ProductCreateImportResponseDtoOfProductImportKiotVietDto;
}

export interface CommonResultDtoOfProductDetailDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ProductDetailDto;
}

export interface CommonResultDtoOfProductDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ProductDto;
}

export interface CommonResultDtoOfProductGetBarCodeExtendProductDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ProductGetBarCodeExtendProductDto;
}

export interface CommonResultDtoOfProductGroupDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ProductGroupDto;
}

export interface CommonResultDtoOfProductGroupImportOutputDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ProductGroupImportOutputDto;
}

export interface CommonResultDtoOfProductInventoryMoveReponseDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ProductInventoryMoveReponseDto;
}

export interface CommonResultDtoOfProductPriceListDetailDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ProductPriceListDetailDto;
}

export interface CommonResultDtoOfProductPriceListDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ProductPriceListDto;
}

export interface CommonResultDtoOfProductReportDashboard {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ProductReportDashboard;
}

export interface CommonResultDtoOfReportTaxDeclarationDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ReportTaxDeclarationDto;
}

export interface CommonResultDtoOfRevenueComparisonByMonthDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: RevenueComparisonByMonthDto;
}

export interface CommonResultDtoOfRevenueComparisonDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: RevenueComparisonDto;
}

export interface CommonResultDtoOfRevenueDataInMonthDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: RevenueDataInMonthDto;
}

export interface CommonResultDtoOfRoleDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: RoleDto;
}

export interface CommonResultDtoOfSaleInvoiceComparisonDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: SaleInvoiceComparisonDto;
}

export interface CommonResultDtoOfSaleInvoiceDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: SaleInvoiceDto;
}

export interface CommonResultDtoOfSaleOrderDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: SaleOrderDto;
}

export interface CommonResultDtoOfSalesPromotionDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: SalesPromotionDto;
}

export interface CommonResultDtoOfSellReportDashboardDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: SellReportDashboardDto;
}

export interface CommonResultDtoOfSettingDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: SettingDto;
}

export interface CommonResultDtoOfShopBankAccountDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ShopBankAccountDto;
}

export interface CommonResultDtoOfShopDiscountDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ShopDiscountDto;
}

export interface CommonResultDtoOfShopDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ShopDto;
}

export interface CommonResultDtoOfShopInfoDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ShopInfoDto;
}

export interface CommonResultDtoOfShopPackageRegistrationDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ShopPackageRegistrationDto;
}

export interface CommonResultDtoOfShopTemplateDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ShopTemplateDto;
}

export interface CommonResultDtoOfShopWeatherDataDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ShopWeatherDataDto;
}

export interface CommonResultDtoOfShopWorkCalendarDetailDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ShopWorkCalendarDetailDto;
}

export interface CommonResultDtoOfShopWorkCalendarDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ShopWorkCalendarDto;
}

export interface CommonResultDtoOfShopWorkShiftDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ShopWorkShiftDto;
}

export interface CommonResultDtoOfStockInventoryDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: StockInventoryDto;
}

export interface CommonResultDtoOfStockInventoryLineDetailEntity {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: StockInventoryLineDetailEntity;
}

export interface CommonResultDtoOfString {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: string;
}

export interface CommonResultDtoOfSummaryTotalClosingShiftDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: SummaryTotalClosingShiftDto;
}

export interface CommonResultDtoOfSystemShopLoyaltyDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: SystemShopLoyaltyDto;
}

export interface CommonResultDtoOfTemplatePrinterDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: TemplatePrinterDto;
}

export interface CommonResultDtoOfTenantDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: TenantDto;
}

export interface CommonResultDtoOfTransferStockTicketDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: TransferStockTicketDto;
}

export interface CommonResultDtoOfUserBaseDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: UserBaseDto;
}

export interface CommonResultDtoOfUserDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: UserDto;
}

export interface CommonResultDtoOfValidateProductImportResultOfProductImportDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ValidateProductImportResultOfProductImportDto;
}

export interface CommonResultDtoOfValidateProductImportResultOfProductImportKiotVietDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: ValidateProductImportResultOfProductImportKiotVietDto;
}

export interface CommonResultDtoOfVietQrImgOutputDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: VietQrImgOutputDto;
}

export interface CommonResultDtoOfWardDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: WardDto;
}

export interface CommonResultDtoOfWarningExpiryProductDto {
  /**  */
  isSuccessful?: boolean;

  /**  */
  errorDetail?: CommonResultExtendDto;

  /**  */
  notification?: CommonResultExtendDto;

  /**  */
  errors?: ValidateInputDto[];

  /**  */
  message?: string;

  /**  */
  data?: WarningExpiryProductDto;
}

export interface CommonResultExtendDto {
  /**  */
  code?: string;

  /**  */
  message?: string;

  /**  */
  paramMessage?: string[];

  /**  */
  data?: any | null;
}

export interface ComparisonRevenueMonthDto {
  /**  */
  lastMonthRevenue?: number;

  /**  */
  currentMonthRevenue?: number;

  /**  */
  lastMonthSaleInvoice?: number;

  /**  */
  currentMonthSaleInvoice?: number;

  /**  */
  percentWithLastMonth?: number;
}

export interface ConfirmAccessCardLoseAndIssueDto {
  /**  */
  idRecord?: string;

  /**  */
  note?: string;

  /**  */
  accessCardIdOld?: string;

  /**  */
  accessCardIdNew?: string;

  /**  */
  bookingPlayerId?: string;
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

export interface CounterByIsActivedItem {
  /**  */
  isActived?: boolean;

  /**  */
  totalCount?: number;
}

export interface CounterByIsActivedItemDto {
  /**  */
  isActived?: boolean;

  /**  */
  totalCount?: number;
}

export interface CounterByIsActivedStatusDto {
  /**  */
  totalTrue?: number;

  /**  */
  totalFalse?: number;

  /**  */
  total?: number;

  /**  */
  items?: CounterByIsActivedItem[];
}

export interface CountryDto {
  /**  */
  id?: number;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  phoneCode?: string;

  /**  */
  currencyCode?: string;

  /**  */
  imageUrl?: string;

  /**  */
  isActived?: boolean;
}

export interface CountryStateDto {
  /**  */
  id?: number;

  /**  */
  countryId?: number;

  /**  */
  stateCode?: string;

  /**  */
  stateName?: string;

  /**  */
  stateLevel?: string;
}

export interface CreateEinvoiceInput {
  /**  */
  listSaleInvoice?: SaleInvoiceDto[];

  /**  */
  eInvoiceBuyerName?: string;

  /**  */
  eInvoiceCompany?: string;

  /**  */
  eInvoiceTaxCode?: string;

  /**  */
  eInvoiceBuyerAddress?: string;

  /**  */
  eInvoiceBuyerPhone?: string;

  /**  */
  eInvoiceBuyerEmail?: string;
}

export interface CreateEinvoiceResultDto {
  /**  */
  totalSuccess?: number;

  /**  */
  totalError?: number;
}

export interface CreateGroupBookingDto {
  /**  */
  id?: string;

  /**  */
  courseId?: string;

  /**  */
  playDate?: Date;

  /**  */
  teeTime?: TimeSpan;

  /**  */
  note?: string;

  /**  */
  totalPlayers?: number;

  /**  */
  isSharedFlight?: boolean;

  /**  */
  bookingSource?: BookingSourceEnum;

  /**  */
  bookingDate?: Date;

  /**  */
  gameType?: GameTypeEnum;

  /**  */
  salesPersonId?: string;

  /**  */
  requestedBy?: string;

  /**  */
  contactNo?: string;

  /**  */
  refrenceNo?: string;

  /**  */
  noOfGallery?: number;

  /**  */
  noOfBuggy?: number;

  /**  */
  noOfCaddy?: number;

  /**  */
  listPlayer?: GolfBookingPLayerDto[];

  /**  */
  createInvoice?: GolfSaleInvoiceDto;

  /**  */
  extraService?: SaleInvoiceDetailDto[];

  /**  */
  playerNo?: number;

  /**  */
  bookingTeeTimeId?: string;

  /**  */
  createMode?: string;
}

export interface CreateSaleInvoiceQrInputDto {
  /**  */
  deviceTokenId?: string;

  /**  */
  invoiceId?: string;

  /**  */
  invoiceCode?: string;

  /**  */
  totalAmount?: number;

  /**  */
  shopBankAccountId?: string;
}

export interface CreateSaleOrderDetailDto {
  /**  */
  productId?: string;

  /**  */
  productUnitId?: string;

  /**  */
  orderQty?: number;

  /**  */
  qty?: number;

  /**  */
  convertRate?: number;

  /**  */
  price?: number;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  notes?: string;
}

export interface CreateSaleOrderDto {
  /**  */
  partnerId?: string;

  /**  */
  tableId?: string;

  /**  */
  notes?: string;

  /**  */
  numberOfCustomer?: number;

  /**  */
  reservationId?: string;

  /**  */
  details?: CreateSaleOrderDetailDto[];
}

export interface CreateSalesPromotionDto {
  /**  */
  id?: number;

  /**  */
  name?: string;

  /**  */
  code?: string;

  /**  */
  description?: string;

  /**  */
  startDate?: Date;

  /**  */
  endDate?: Date;

  /**  */
  promotionType?: PromotionType;

  /**  */
  details?: PromotionDetailDto[];

  /**  */
  applyDaysDto?: ApplyDaysDto;

  /**  */
  isActived?: boolean;
}

export interface CreateUserCommand {
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
  dynamicInformation?: object;

  /**  */
  listRoleId?: string[];

  /**  */
  listPermission?: string[];

  /**  */
  extendData?: any | null;

  /**  */
  mustChangePassword?: boolean;

  /**  */
  lastModificationTime?: Date;

  /**  */
  birthDay?: Date;

  /**  */
  userNameIncludesShopCode?: boolean;

  /**  */
  password?: string;

  /**  */
  listShopRole?: string[];

  /**  */
  actionEmployeeType?: number;

  /**  */
  employeeId?: string;
}

export interface CreateUserHostCommand {
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
  dynamicInformation?: object;

  /**  */
  listRoleId?: string[];

  /**  */
  listPermission?: string[];

  /**  */
  extendData?: any | null;

  /**  */
  mustChangePassword?: boolean;

  /**  */
  lastModificationTime?: Date;

  /**  */
  birthDay?: Date;

  /**  */
  password?: string;
}

export interface CruCustomerDebtCommand {
  /**  */
  partnerTransactionId?: string;

  /**  */
  partnerId?: string;

  /**  */
  transactionDate?: Date;

  /**  */
  transactionName?: string;

  /**  */
  debt?: number;
}

export interface CruPrivateBookingDto {
  /**  */
  id?: string;

  /**  */
  courseId?: string;

  /**  */
  playDate?: Date;

  /**  */
  teeTime?: TimeSpan;

  /**  */
  bookingGroupId?: string;

  /**  */
  note?: string;

  /**  */
  totalPlayers?: number;

  /**  */
  isSharedFlight?: boolean;

  /**  */
  bookingSource?: BookingSourceEnum;

  /**  */
  bookingDate?: Date;

  /**  */
  gameType?: GameTypeEnum;

  /**  */
  memberGustOf?: string;

  /**  */
  salesPersonId?: string;

  /**  */
  requestedBy?: string;

  /**  */
  contactNo?: string;

  /**  */
  refrenceNo?: string;

  /**  */
  bagTagNo?: string;

  /**  */
  noOfGallery?: number;

  /**  */
  noOfBuggy?: number;

  /**  */
  noOfCaddy?: number;

  /**  */
  isSharedCaddie?: boolean;

  /**  */
  preferredCaddyId?: string;

  /**  */
  caddyAssignedId?: string;

  /**  */
  partnerId?: string;

  /**  */
  guestName?: string;

  /**  */
  isGuest?: boolean;

  /**  */
  isDefaultPlayer?: boolean;

  /**  */
  bookingPlayerId?: string;

  /**  */
  createInvoice?: GolfSaleInvoiceDto;

  /**  */
  playerNo?: number;

  /**  */
  bookingTeeTimeId?: string;

  /**  */
  createMode?: string;

  /**  */
  viewInvoice?: SaleInvoiceDto[];

  /**  */
  memberAccessCardId?: string;
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

export interface CurrentShopTemplatePrinterOutputDto {
  /**  */
  name?: string;

  /**  */
  documentId?: string;

  /**  */
  path?: string;

  /**  */
  isDefault?: boolean;
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

export interface CustomerComparisonDto {
  /**  */
  lastDayCustomer?: number;

  /**  */
  currentDayCustomer?: number;

  /**  */
  percentWithLastDay?: number;
}

export interface CustomerDebtReportDto {
  /**  */
  customerName?: string;

  /**  */
  customerCode?: string;

  /**  */
  beginingDebtPeriod?: number;

  /**  */
  endingDebtPeriod?: number;

  /**  */
  duringDebtPeriod?: number;

  /**  */
  totalPurchase?: number;

  /**  */
  totalPayment?: number;
}

export interface CustomerRevenueReportDetailDto {
  /**  */
  customerName?: string;

  /**  */
  customerCode?: string;

  /**  */
  totalPurchase?: number;

  /**  */
  totalDiscount?: number;

  /**  */
  totalVAT?: number;

  /**  */
  totalPayment?: number;

  /**  */
  totalDebt?: number;

  /**  */
  totalPayAgain?: number;

  /**  */
  totalRevenue?: number;

  /**  */
  strInvoiceCode?: string;

  /**  */
  strTotalAmount?: string;

  /**  */
  strInvoiceDateDetail?: string;

  /**  */
  strMoveType?: string;

  /**  */
  strCustomerName?: string;

  /**  */
  strCustomerCode?: string;

  /**  */
  invoiceCode?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  listInvoiceCode?: string[];

  /**  */
  listCustomerName?: string[];

  /**  */
  listCustomerCode?: string[];

  /**  */
  listTotalAmount?: number[];

  /**  */
  listInvoiceDateDetail?: Date[];

  /**  */
  listMoveType?: number[];

  /**  */
  invoiceAmount?: number;

  /**  */
  children?: CustomerRevenueReportDetailDto[];
}

export interface CustomerRevenueReportDto {
  /**  */
  customerName?: string;

  /**  */
  customerCode?: string;

  /**  */
  totalPurchase?: number;

  /**  */
  totalDiscount?: number;

  /**  */
  totalVAT?: number;

  /**  */
  totalPayment?: number;

  /**  */
  totalDebt?: number;

  /**  */
  totalPayAgain?: number;

  /**  */
  totalRevenue?: number;
}

export interface DailySummaryIncomeReportOutputDto {
  /**  */
  id?: string;

  /**  */
  accountMoveCode?: string;

  /**  */
  accountMoveDate?: Date;

  /**  */
  accountMoveType?: ACCOUNT_MOVE_TYPE;

  /**  */
  amount?: number;

  /**  */
  paymentMethod?: PAYMENT_METHOD;

  /**  */
  notes?: string;

  /**  */
  strPaymentMethod?: string;

  /**  */
  partnerName?: string;

  /**  */
  partnerPhone?: string;

  /**  */
  totalIncome?: number;

  /**  */
  totalSpending?: number;

  /**  */
  income?: number;
}

export interface DailySummaryIncomeReportPagingInput {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  reportDate?: Date;

  /**  */
  creatorId?: string;
}

export interface DailySummaryProductReportOutputDto {
  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  qtyConvert?: number;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  discountAmount?: number;

  /**  */
  discountAmountAllocation?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  returnTotalAmount?: number;

  /**  */
  returnQtyConvert?: number;

  /**  */
  revenueAmount?: number;

  /**  */
  invoiceIds?: string;
}

export interface DailySummaryProductReportPagingInput {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  reportDate?: Date;

  /**  */
  productTypeId?: number;
}

export interface DailySummaryShiftRevenueOutputDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  name?: string;

  /**  */
  startDate?: Date;

  /**  */
  endDate?: Date;

  /**  */
  openingCash?: number;

  /**  */
  employeeId?: string;

  /**  */
  openingEmployeeId?: string;

  /**  */
  invoiceQty?: number;

  /**  */
  invoiceAmount?: number;

  /**  */
  returnInvoiceQty?: number;

  /**  */
  returnInvoiceAmount?: number;

  /**  */
  importStockQty?: number;

  /**  */
  importStockAmount?: number;

  /**  */
  returnImportStockQty?: number;

  /**  */
  returnImportStockAmount?: number;

  /**  */
  otherReceiptAmount?: number;

  /**  */
  otherPaymentAmount?: number;

  /**  */
  differenceCash?: number;

  /**  */
  expectedCash?: number;

  /**  */
  closingCash?: number;

  /**  */
  closingEmployeeId?: string;

  /**  */
  notes?: string;

  /**  */
  status?: SHOP_WORKSHIFT_STATUS;

  /**  */
  openingEmployeeName?: string;

  /**  */
  closingEmployeeName?: string;

  /**  */
  details?: SaleWorkShiftDetailDto[];

  /**  */
  totalRevenuePaymentBank?: number;

  /**  */
  totalRevenuePaymentCash?: number;

  /**  */
  totalRevenuePaymentOther?: number;

  /**  */
  totalCash?: number;

  /**  */
  totalBank?: number;

  /**  */
  totalOther?: number;
}

export interface DailySummaryShiftRevenuePagingInput {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  reportDate?: Date;
}

export interface DataRevenueByDaysDto {
  /**  */
  day?: number;

  /**  */
  labelDay?: string;

  /**  */
  revenueInDay?: number;
}

export interface DataWarningProductStatusDto {
  /**  */
  productName?: string;

  /**  */
  productCode?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  qty?: number;

  /**  */
  basicUnitName?: string;

  /**  */
  lotNumber?: string;

  /**  */
  inventoryName?: string;

  /**  */
  restOfDays?: number;
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

export interface DebtInfoDto {
  /**  */
  partnerId?: string;

  /**  */
  partnerName?: string;

  /**  */
  partnerCode?: string;

  /**  */
  transactionDate?: Date;

  /**  */
  currentDebt?: number;

  /**  */
  debtLater?: number;

  /**  */
  amount?: number;

  /**  */
  notes?: string;

  /**  */
  debtDetails?: DebtInfo_DetailsDto[];
}

export interface DebtInfo_DetailsDto {
  /**  */
  stockInventoryMoveId?: string;

  /**  */
  invoiceId?: string;

  /**  */
  moveDate?: Date;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  moveCode?: string;

  /**  */
  totalAmount?: number;

  /**  */
  paymentAmount?: number;

  /**  */
  debtAmount?: number;

  /**  */
  customerPays?: number;

  /**  */
  shopId?: number;

  /**  */
  shopName?: string;
}

export interface DeserializeSalesPromotionDto {
  /**  */
  id?: number;

  /**  */
  name?: string;

  /**  */
  code?: string;

  /**  */
  description?: string;

  /**  */
  tenantId?: string;

  /**  */
  startDate?: Date;

  /**  */
  endDate?: Date;

  /**  */
  shopId?: number;

  /**  */
  promotionType?: string;

  /**  */
  promotionDetail?: string;

  /**  */
  applyDays?: string;

  /**  */
  isActived?: boolean;

  /**  */
  deserializePromotionJson?: PromotionJson;

  /**  */
  deserializeApplyDays?: ApplyDaysDto;
}

export interface DestroyInvoiceInputDto {
  /**  */
  invoiceId?: string;

  /**  */
  canceledEmployeeId?: string;

  /**  */
  canceledReason?: string;
}

export interface Diagnosis {
  /**  */
  diagnosisCode?: string;

  /**  */
  diagnosisName?: string;

  /**  */
  conclusion?: string;
}

export interface DictionaryDto {
  /**  */
  id?: number;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  nameOther?: string;

  /**  */
  dictionaryTypeId?: DictionaryTypeEnum;

  /**  */
  notes?: string;

  /**  */
  orderNumber?: number;

  /**  */
  relatedDictionaryCode?: string;

  /**  */
  relatedDictionaryName?: string;

  /**  */
  pId?: number;

  /**  */
  pCode?: string;

  /**  */
  isActived?: boolean;
}

export interface DictionaryRequestDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  filterDictionaryType?: DictionaryTypeEnum;
}

export interface DiscountBarCodeLayoutSettingDto {
  /**  */
  layoutType?: BarCodeLayoutType;

  /**  */
  isDefault?: boolean;

  /**  */
  shopName?: string;

  /**  */
  currencyName?: string;

  /**  */
  isShowShop?: boolean;

  /**  */
  isShowDiscountCode?: boolean;

  /**  */
  isShowDiscountType?: boolean;

  /**  */
  isShowDiscountUseType?: boolean;

  /**  */
  isShowStartDate?: boolean;

  /**  */
  isShowEndDate?: boolean;

  /**  */
  isShowDiscountValue?: boolean;

  /**  */
  isShowBarcodeText?: boolean;

  /**  */
  pageWidthMm?: number;

  /**  */
  pageHeightMn?: number;

  /**  */
  columnCount?: number;

  /**  */
  rowCount?: number;

  /**  */
  columnSpacing?: number;

  /**  */
  rowSpacing?: number;

  /**  */
  paddingTop?: number;

  /**  */
  paddingBottom?: number;

  /**  */
  paddingLeft?: number;

  /**  */
  paddingRight?: number;
}

export interface DiscountByCustomerGroupOutputDto {
  /**  */
  partnerId?: string;

  /**  */
  groupDiscountPercent?: number;
}

export interface DiscountGetPagedDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  discountStatus?: number;

  /**  */
  discountType?: number;

  /**  */
  discountUseType?: number;
}

export interface DistrictDto {
  /**  */
  id?: number;

  /**  */
  stateId?: number;

  /**  */
  stateCode?: string;

  /**  */
  stateName?: string;

  /**  */
  districtCode?: string;

  /**  */
  districtName?: string;

  /**  */
  districtLevel?: string;
}

export interface DoctorProfitByBillReportDto {
  /**  */
  doctorCode?: string;

  /**  */
  doctorName?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  invoiceCode?: string;

  /**  */
  customerName?: string;

  /**  */
  patientName?: string;

  /**  */
  subTotalAmount?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  returnTotalAmount?: number;

  /**  */
  totalReturnDiscount?: number;

  /**  */
  revenueAmount?: number;

  /**  */
  totalCostAmount?: number;

  /**  */
  totalProfit?: number;
}

export interface DoctorProfitByMoneyReportDto {
  /**  */
  doctorCode?: string;

  /**  */
  doctorName?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  subTotalAmount?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  returnTotalAmount?: number;

  /**  */
  revenueAmount?: number;

  /**  */
  totalCostAmount?: number;

  /**  */
  totalProfit?: number;
}

export interface DoctorProfitByProductReportDto {
  /**  */
  doctorCode?: string;

  /**  */
  doctorName?: string;

  /**  */
  lotNumber?: string;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  unitName?: string;

  /**  */
  price?: number;

  /**  */
  qty?: number;

  /**  */
  subTotalAmount?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  returnPrice?: number;

  /**  */
  returnQty?: number;

  /**  */
  returnTotalAmount?: number;

  /**  */
  totalReturnDiscount?: number;

  /**  */
  revenueAmount?: number;

  /**  */
  totalCostAmount?: number;

  /**  */
  totalProfit?: number;
}

export interface DoctorRevenueByBillReportDto {
  /**  */
  doctorCode?: string;

  /**  */
  doctorName?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  invoiceCode?: string;

  /**  */
  customerName?: string;

  /**  */
  patientName?: string;

  /**  */
  subTotalAmount?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  returnTotalAmount?: number;

  /**  */
  totalReturnDiscount?: number;

  /**  */
  revenueAmount?: number;
}

export interface DoctorRevenueByMoneyReportDto {
  /**  */
  doctorCode?: string;

  /**  */
  doctorName?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  subTotalAmount?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  returnTotalAmount?: number;

  /**  */
  revenueAmount?: number;
}

export interface DoctorRevenueByProductReportDto {
  /**  */
  doctorCode?: string;

  /**  */
  doctorName?: string;

  /**  */
  lotNumber?: string;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  unitName?: string;

  /**  */
  price?: number;

  /**  */
  qty?: number;

  /**  */
  subTotalAmount?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  returnPrice?: number;

  /**  */
  returnQty?: number;

  /**  */
  returnTotalAmount?: number;

  /**  */
  totalReturnDiscount?: number;

  /**  */
  revenueAmount?: number;
}

export interface DrugRecallDto {
  /**  */
  id?: number;

  /**  */
  createdTime?: Date;

  /**  */
  placeRequestRecall?: string;

  /**  */
  placeRecovery?: string;

  /**  */
  productId?: string;

  /**  */
  soldQty?: number;

  /**  */
  soldUnitName?: string;

  /**  */
  recalledQty?: number;

  /**  */
  recalledUnitName?: string;

  /**  */
  partnerId?: string;

  /**  */
  reasonRecall?: string;

  /**  */
  expectedTreatment?: string;

  /**  */
  notes?: string;

  /**  */
  isActived?: boolean;

  /**  */
  productName?: string;
}

export interface DrugRecallGetPagedInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  dateRange?: DateRangeDto;
}

export interface EmployeeAmountGroupDto {
  /**  */
  salaryAmount?: number;

  /**  */
  socialInsuranceAmount?: number;

  /**  */
  healthInsuranceAmount?: number;

  /**  */
  unemploymentInsuranceAmount?: number;
}

export interface EmployeeDto {
  /**  */
  id?: string;

  /**  */
  code?: string;

  /**  */
  userId?: string;

  /**  */
  userName?: string;

  /**  */
  fullUserName?: string;

  /**  */
  departmentId?: string;

  /**  */
  certificate?: string;

  /**  */
  studyField?: string;

  /**  */
  studySchool?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  email?: string;

  /**  */
  isActived?: boolean;

  /**  */
  isHaveUserAccount?: boolean;

  /**  */
  signaturePhotoUrl?: string;

  /**  */
  salaryAmount?: number;

  /**  */
  numberOfDependentPerson?: number;

  /**  */
  workCalendarId?: string;

  /**  */
  prefixCode?: string;

  /**  */
  groupIds?: string[];

  /**  */
  listRoleId?: string[];

  /**  */
  listInventoryId?: string[];

  /**  */
  listStrRoleId?: string;

  /**  */
  listStrInventoryId?: string;

  /**  */
  listStrAllowanceId?: string;

  /**  */
  listStrWorkScheduleId?: string;

  /**  */
  listAllowanceId?: string[];

  /**  */
  categoryId?: PartnerCategoryEnum;

  /**  */
  strCategoryId?: string;
}

export interface EmployeeInputDto {
  /**  */
  userId?: string;
}

export interface EmployeePagedRequestDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  tenantId?: string;

  /**  */
  categoryId?: number;
}

export interface EmployeePayrollDetailDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  payrollId?: string;

  /**  */
  employeeId?: string;

  /**  */
  employeeName?: string;

  /**  */
  timesheetId?: string;

  /**  */
  totalWorkDay?: number;

  /**  */
  actualWorkDay?: number;

  /**  */
  salaryAmount?: number;

  /**  */
  actualSalaryAmount?: number;

  /**  */
  taxableAllowanceAmount?: number;

  /**  */
  allowanceAmount?: number;

  /**  */
  insuranceAllowanceAmount?: number;

  /**  */
  socialInsuranceAmount?: number;

  /**  */
  healthInsuranceAmount?: number;

  /**  */
  unemploymentInsuranceAmount?: number;

  /**  */
  totalInsuranceDeduction?: number;

  /**  */
  companySocialInsuranceAmount?: number;

  /**  */
  companyHealthInsuranceAmount?: number;

  /**  */
  companyUnemploymentInsuranceAmount?: number;

  /**  */
  totalCompanyInsuranceAmount?: number;

  /**  */
  insuranceSalaryAmount?: number;

  /**  */
  personalDeductionAmount?: number;

  /**  */
  dependentDeductionAmount?: number;

  /**  */
  numberOfDependentPerson?: number;

  /**  */
  totalDependentDeductionAmount?: number;

  /**  */
  totalOtherDeductionAmount?: number;

  /**  */
  totalDeductionAmount?: number;

  /**  */
  totalTaxableIncome?: number;

  /**  */
  taxableIncome?: number;

  /**  */
  personalIncomeTaxAmount?: number;

  /**  */
  totalAfterTaxIncome?: number;

  /**  */
  takeHomeSalary?: number;

  /**  */
  totalSalaryAmount?: number;

  /**  */
  status?: PAYROLL_DETAIL_STATUS;

  /**  */
  paymentTotalSalary?: number;

  /**  */
  payingAmount?: number;

  /**  */
  notes?: string;
}

export interface EmployeePayrollDetailPayslipDto {
  /**  */
  id?: string;

  /**  */
  payrollId?: string;

  /**  */
  payrollDetailId?: string;

  /**  */
  employeeId?: string;

  /**  */
  name?: string;

  /**  */
  amount?: number;

  /**  */
  notes?: string;
}

export interface EmployeePayrollDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  timesheetId?: string;

  /**  */
  startDate?: Date;

  /**  */
  endDate?: Date;

  /**  */
  status?: PAYROLL_STATUS;

  /**  */
  totalSalaryAmount?: number;

  /**  */
  totalSocialInsuranceAmount?: number;

  /**  */
  totalHealthInsuranceAmount?: number;

  /**  */
  totalUnemploymentInsuranceAmount?: number;

  /**  */
  paymentSalaryAmount?: number;

  /**  */
  paymentSocialInsuranceAmount?: number;

  /**  */
  paymentHealthInsuranceAmount?: number;

  /**  */
  paymentUnemploymentInsuranceAmount?: number;

  /**  */
  notes?: string;

  /**  */
  details?: EmployeePayrollDetailDto[];
}

export interface EmployeePayrollGetPagedInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  timesheetId?: string;

  /**  */
  year?: number;
}

export interface EmployeeProductReportDto {
  /**  */
  employeeName?: string;

  /**  */
  purchaseProduct?: number;

  /**  */
  payAgainProduct?: number;

  /**  */
  productName?: string;

  /**  */
  totalPurchase?: number;

  /**  */
  totalDebt?: number;

  /**  */
  totalPayment?: number;

  /**  */
  totalPayAgain?: number;

  /**  */
  totalRevenue?: number;
}

export interface EmployeeRevenueReportDetailDto {
  /**  */
  employeeName?: string;

  /**  */
  totalPurchase?: number;

  /**  */
  totalDiscount?: number;

  /**  */
  totalVAT?: number;

  /**  */
  totalPayment?: number;

  /**  */
  totalDebt?: number;

  /**  */
  totalPayAgain?: number;

  /**  */
  totalRevenue?: number;

  /**  */
  strInvoiceCode?: string;

  /**  */
  strTotalAmount?: string;

  /**  */
  strInvoiceDateDetail?: string;

  /**  */
  strMoveType?: string;

  /**  */
  strEmployeeName?: string;

  /**  */
  invoiceCode?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  listInvoiceCode?: string[];

  /**  */
  listEmployeeName?: string[];

  /**  */
  listCustomerCode?: string[];

  /**  */
  listTotalAmount?: number[];

  /**  */
  listInvoiceDateDetail?: Date[];

  /**  */
  listMoveType?: number[];

  /**  */
  invoiceAmount?: number;

  /**  */
  children?: EmployeeRevenueReportDetailDto[];
}

export interface EmployeeRevenueReportDto {
  /**  */
  employeeName?: string;

  /**  */
  totalPurchase?: number;

  /**  */
  totalDiscount?: number;

  /**  */
  totalVAT?: number;

  /**  */
  totalPayment?: number;

  /**  */
  totalDebt?: number;

  /**  */
  totalPayAgain?: number;

  /**  */
  totalRevenue?: number;
}

export interface EmployeeSalaryPaymentBookDetailDto {
  /**  */
  accountMoveDate?: Date;

  /**  */
  accountMoveDateStr?: string;

  /**  */
  accountMoveCode?: string;

  /**  */
  descriptions?: string;

  /**  */
  reasonTyeName?: string;

  /**  */
  totalSalaryAmount?: number;

  /**  */
  totalSocialInsuranceAmount?: number;

  /**  */
  totalHealthInsuranceAmount?: number;

  /**  */
  totalUnemploymentInsuranceAmount?: number;

  /**  */
  paymentSalaryAmount?: number;

  /**  */
  paymentSocialInsuranceAmount?: number;

  /**  */
  paymentHealthInsuranceAmount?: number;

  /**  */
  paymentUnemploymentInsuranceAmount?: number;

  /**  */
  remainingSalaryAmount?: number;

  /**  */
  remainingSocialInsuranceAmount?: number;

  /**  */
  remainingHealthInsuranceAmount?: number;

  /**  */
  remainingUnemploymentInsuranceAmount?: number;

  /**  */
  notes?: string;
}

export interface EmployeeSalaryPaymentBookSummaryDto {
  /**  */
  opening?: EmployeeAmountGroupDto;

  /**  */
  duringTotal?: EmployeeAmountGroupDto;

  /**  */
  duringPayment?: EmployeeAmountGroupDto;

  /**  */
  ending?: EmployeeAmountGroupDto;
}

export interface EmployeeTimekeepingDto {
  /**  */
  id?: string;

  /**  */
  employeeId?: string;

  /**  */
  workDate?: Date;

  /**  */
  checkIn?: Date;

  /**  */
  checkOut?: Date;

  /**  */
  status?: TIMEKEEPING_STATUS;

  /**  */
  isHalfDayOff?: boolean;

  /**  */
  lateInMinutes?: number;

  /**  */
  earlyOutMinutes?: number;

  /**  */
  authorizedLeave?: boolean;

  /**  */
  unAuthorizedLeave?: boolean;

  /**  */
  totalWorkDay?: number;

  /**  */
  employeeName?: string;

  /**  */
  signatureId?: string;

  /**  */
  listDayOfWeek?: string;

  /**  */
  workCalendarName?: string;
}

export interface EmployeeTimesheetDetailDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  timesheetId?: string;

  /**  */
  employeeId?: string;

  /**  */
  workDate?: Date;

  /**  */
  workRate?: number;

  /**  */
  checkIn?: Date;

  /**  */
  checkOut?: Date;

  /**  */
  status?: TIMEKEEPING_STATUS;

  /**  */
  strStatus?: string;

  /**  */
  timeKeepingId?: string;

  /**  */
  lateInMinutes?: number;

  /**  */
  earlyOutMinutes?: number;

  /**  */
  overTimeHour?: number;

  /**  */
  notes?: string;
}

export interface EmployeeTimesheetDetailSummaryDto {
  /**  */
  id?: string;

  /**  */
  timesheetId?: string;

  /**  */
  employeeId?: string;

  /**  */
  totalWorkDay?: number;

  /**  */
  actualWorkDay?: number;

  /**  */
  totalOffDayWithSalary?: number;

  /**  */
  totalOffDayWithoutSalary?: number;

  /**  */
  totalOverTimeHour?: number;

  /**  */
  totalLateInEarlyOutMinutes?: number;

  /**  */
  employeeName?: string;

  /**  */
  listEmployeeTimesheetDetail?: EmployeeTimesheetDetailDto[];

  /**  */
  shopWorkCalendar?: ShopWorkCalendarDto;

  /**  */
  timesheetDate?: Date;

  /**  */
  employeeTimesheetDetailObject?: object;
}

export interface EmployeeTimesheetDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  name?: string;

  /**  */
  startDate?: Date;

  /**  */
  endDate?: Date;

  /**  */
  status?: TIMESHEET_STATUS;

  /**  */
  listEmployeeTimesheetDetailSummary?: EmployeeTimesheetDetailSummaryDto[];

  /**  */
  month?: number;

  /**  */
  year?: number;
}

export interface EmployeeTimesheetGetPagedInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  timeSheetDate?: Date;

  /**  */
  status?: TIMESHEET_STATUS;

  /**  */
  timeSheetYear?: number;
}

export interface EmployeeTimesheetStatusDto {
  /**  */
  status?: number;

  /**  */
  totalCount?: number;
}

export interface EntityExtensionDto {
  /**  */
  properties?: object;

  /**  */
  configuration?: object;
}

export interface ExportFinancialReportDataInputDto {
  /**  */
  order?: string;

  /**  */
  name?: string;

  /**  */
  formula?: string;

  /**  */
  totalAmount?: number;

  /**  */
  children?: ExportFinancialReportDataInputDto[];
}

export interface ExportFinancialReportInputDto {
  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  export?: OrdExportPaged;

  /**  */
  dataSource?: ExportFinancialReportDataInputDto[];
}

export interface ExportSaleStockDetailDto {
  /**  */
  uuid?: string;

  /**  */
  inventoryId?: string;

  /**  */
  inventoryRootDetailId?: string;

  /**  */
  inventoryLineDetailId?: string;

  /**  */
  moveId?: string;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  moveCode?: string;

  /**  */
  moveDate?: Date;

  /**  */
  productId?: string;

  /**  */
  productHashId?: string;

  /**  */
  productName?: string;

  /**  */
  productUnitId?: string;

  /**  */
  unitName?: string;

  /**  */
  productTypeId?: number;

  /**  */
  productCategoryId?: number;

  /**  */
  productSubCategoryId?: number;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  lotNumberId?: string;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  invoiceId?: string;

  /**  */
  qty?: number;

  /**  */
  qtyConvert?: number;

  /**  */
  convertRate?: number;

  /**  */
  returnQty?: number;

  /**  */
  price?: number;

  /**  */
  latestImportPrice?: number;

  /**  */
  priceWithTax?: number;

  /**  */
  isPriceIncludeTax?: boolean;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountValue?: number;

  /**  */
  subTaxAmount?: number;

  /**  */
  subTotalAmount?: number;

  /**  */
  taxDiscountAmountAllocation?: number;

  /**  */
  discountAmountCaculate?: number;

  /**  */
  discountAmount?: number;

  /**  */
  totalAmountAfterDiscount?: number;

  /**  */
  discountAmountAllocation?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  taxAmount?: number;

  /**  */
  taxName?: string;

  /**  */
  totalAmount?: number;

  /**  */
  status?: MOVE_STATUS;

  /**  */
  costPrice?: number;

  /**  */
  totalCostAmount?: number;

  /**  */
  partnerId?: string;

  /**  */
  partnerType?: number;

  /**  */
  relatedMoveId?: string;

  /**  */
  relatedMoveRootDetailId?: string;

  /**  */
  relatedMoveLineDetailId?: string;

  /**  */
  productDetail?: ProductStockViewDto;

  /**  */
  moveLineDetailId?: string;

  /**  */
  moveRootDetailId?: string;

  /**  */
  lotNumbers?: StockProductUnitDto[];

  /**  */
  units?: StockProductSelectUnitDto[];

  /**  */
  maxQtyEnable?: number;

  /**  */
  inventoryQty?: number;

  /**  */
  invoiceDetailsId?: string;

  /**  */
  note?: string;
}

export interface ExportSaleStockMoveDto {
  /**  */
  moveId?: string;

  /**  */
  moveHashId?: string;

  /**  */
  inventoryId?: string;

  /**  */
  inventoryName?: string;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  moveStatus?: MOVE_STATUS;

  /**  */
  moveCode?: string;

  /**  */
  moveDate?: Date;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountValue?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxDiscountPercent?: number;

  /**  */
  taxDiscountCode?: string;

  /**  */
  taxDiscountName?: string;

  /**  */
  taxDiscountAmount?: number;

  /**  */
  discountAmountCaculate?: number;

  /**  */
  discountAmountDisplay?: number;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  totalAmountRound?: number;

  /**  */
  paymentAmount?: number;

  /**  */
  debtAmount?: number;

  /**  */
  paymentStatus?: number;

  /**  */
  paymentMethod?: number;

  /**  */
  paymentMethodName?: string;

  /**  */
  totalQty?: number;

  /**  */
  invoiceId?: string;

  /**  */
  invoiceCode?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  note?: string;

  /**  */
  partnerId?: string;

  /**  */
  partnerName?: string;

  /**  */
  partnerType?: number;

  /**  */
  relatedMoveId?: string;

  /**  */
  relatedMoveIdHash?: string;

  /**  */
  relatedMoveCode?: string;

  /**  */
  relatedMoveDate?: Date;

  /**  */
  relatedMoveType?: MOVE_TYPE;

  /**  */
  relatedMoveStatus?: MOVE_STATUS;

  /**  */
  totalReturnQty?: number;

  /**  */
  cancelReason?: string;

  /**  */
  creatorId?: string;

  /**  */
  partnerInvoiceCode?: string;

  /**  */
  partnerInvoiceDate?: Date;

  /**  */
  creatorEmployeeId?: string;

  /**  */
  salePartnerId?: string;
}

export interface ExportSaleStockTicketDto {
  /**  */
  productInTicket?: ProductMoveStockDto[];

  /**  */
  moveDto?: ExportSaleStockMoveDto;

  /**  */
  items?: ExportSaleStockDetailDto[];

  /**  */
  moveDateOld?: Date;

  /**  */
  isDraft?: boolean;

  /**  */
  totalCostPriceInMove?: number;
}

export interface ExportShopDetailTplInputDto {
  /**  */
  templateId?: string;

  /**  */
  export?: OrdExportPaged;
}

export interface ExportStockMoveDetailDto {
  /**  */
  uuid?: string;

  /**  */
  inventoryId?: string;

  /**  */
  inventoryRootDetailId?: string;

  /**  */
  inventoryLineDetailId?: string;

  /**  */
  moveId?: string;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  moveCode?: string;

  /**  */
  moveDate?: Date;

  /**  */
  productId?: string;

  /**  */
  productHashId?: string;

  /**  */
  productName?: string;

  /**  */
  productUnitId?: string;

  /**  */
  unitName?: string;

  /**  */
  productTypeId?: number;

  /**  */
  productCategoryId?: number;

  /**  */
  productSubCategoryId?: number;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  lotNumberId?: string;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  invoiceId?: string;

  /**  */
  qty?: number;

  /**  */
  qtyConvert?: number;

  /**  */
  convertRate?: number;

  /**  */
  returnQty?: number;

  /**  */
  price?: number;

  /**  */
  latestImportPrice?: number;

  /**  */
  priceWithTax?: number;

  /**  */
  isPriceIncludeTax?: boolean;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountValue?: number;

  /**  */
  subTaxAmount?: number;

  /**  */
  subTotalAmount?: number;

  /**  */
  taxDiscountAmountAllocation?: number;

  /**  */
  discountAmountCaculate?: number;

  /**  */
  discountAmount?: number;

  /**  */
  totalAmountAfterDiscount?: number;

  /**  */
  discountAmountAllocation?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  taxAmount?: number;

  /**  */
  taxName?: string;

  /**  */
  totalAmount?: number;

  /**  */
  status?: MOVE_STATUS;

  /**  */
  costPrice?: number;

  /**  */
  totalCostAmount?: number;

  /**  */
  partnerId?: string;

  /**  */
  partnerType?: number;

  /**  */
  relatedMoveId?: string;

  /**  */
  relatedMoveRootDetailId?: string;

  /**  */
  relatedMoveLineDetailId?: string;

  /**  */
  productDetail?: ProductStockViewDto;

  /**  */
  moveLineDetailId?: string;

  /**  */
  moveRootDetailId?: string;

  /**  */
  lotNumbers?: StockProductUnitDto[];

  /**  */
  units?: StockProductSelectUnitDto[];

  /**  */
  maxQtyEnable?: number;

  /**  */
  inventoryQty?: number;

  /**  */
  note?: string;
}

export interface ExportStockMoveDto {
  /**  */
  moveId?: string;

  /**  */
  moveHashId?: string;

  /**  */
  inventoryId?: string;

  /**  */
  inventoryName?: string;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  moveStatus?: MOVE_STATUS;

  /**  */
  moveCode?: string;

  /**  */
  moveDate?: Date;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountValue?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxDiscountPercent?: number;

  /**  */
  taxDiscountCode?: string;

  /**  */
  taxDiscountName?: string;

  /**  */
  taxDiscountAmount?: number;

  /**  */
  discountAmountCaculate?: number;

  /**  */
  discountAmountDisplay?: number;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  totalAmountRound?: number;

  /**  */
  paymentAmount?: number;

  /**  */
  debtAmount?: number;

  /**  */
  paymentStatus?: number;

  /**  */
  paymentMethod?: number;

  /**  */
  paymentMethodName?: string;

  /**  */
  totalQty?: number;

  /**  */
  invoiceId?: string;

  /**  */
  invoiceCode?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  note?: string;

  /**  */
  partnerId?: string;

  /**  */
  partnerName?: string;

  /**  */
  partnerType?: number;

  /**  */
  relatedMoveId?: string;

  /**  */
  relatedMoveIdHash?: string;

  /**  */
  relatedMoveCode?: string;

  /**  */
  relatedMoveDate?: Date;

  /**  */
  relatedMoveType?: MOVE_TYPE;

  /**  */
  relatedMoveStatus?: MOVE_STATUS;

  /**  */
  totalReturnQty?: number;

  /**  */
  cancelReason?: string;

  /**  */
  creatorId?: string;

  /**  */
  partnerInvoiceCode?: string;

  /**  */
  partnerInvoiceDate?: Date;

  /**  */
  debtDueDate?: Date;
}

export interface ExportStockTicketDto {
  /**  */
  productInTicket?: ProductMoveStockDto[];

  /**  */
  moveDto?: ExportStockMoveDto;

  /**  */
  items?: ExportStockMoveDetailDto[];

  /**  */
  moveDateOld?: Date;

  /**  */
  isDraft?: boolean;

  /**  */
  totalCostPriceInMove?: number;
}

export interface ExtensiblePagedResultDtoOfSaleInvoiceReportDto {
  /**  */
  extraProperties?: object;

  /**  */
  items?: SaleInvoiceReportDto[];

  /**  */
  totalCount?: string;
}

export interface ExtensiblePagedResultDtoOfSellReportProfitByBillOutputDto {
  /**  */
  extraProperties?: object;

  /**  */
  items?: SellReportProfitByBillOutputDto[];

  /**  */
  totalCount?: string;
}

export interface ExtensiblePagedResultDtoOfSellReportProfitByMoneyOutputDto {
  /**  */
  extraProperties?: object;

  /**  */
  items?: SellReportProfitByMoneyOutputDto[];

  /**  */
  totalCount?: string;
}

export interface ExtensiblePagedResultDtoOfSellReportProfitByProductOutputDto {
  /**  */
  extraProperties?: object;

  /**  */
  items?: SellReportProfitByProductOutputDto[];

  /**  */
  totalCount?: string;
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
  fileName?: string;

  /**  */
  fileId?: string;

  /**  */
  mimeType?: string;

  /**  */
  bytes?: string;

  /**  */
  blobContainerPath?: string;

  /**  */
  absPath?: string;
}

export interface FinancialReportInputDto {
  /**  */
  rangeDate?: DateRangeDto;
}

export interface FinancialReportOutputDto {
  /**  */
  revenue?: number;

  /**  */
  totalReturnAmount?: number;

  /**  */
  costOfGoodSold?: number;

  /**  */
  totalAmountForCancel?: number;

  /**  */
  totalAmountForOtherGoods?: number;

  /**  */
  grossProfit?: number;

  /**  */
  otherIncome?: number;

  /**  */
  operatingExpense?: number;

  /**  */
  revenueAndExpenditure?: number;

  /**  */
  netProfit?: number;

  /**  */
  revenueDeduction?: number;

  /**  */
  netRevenue?: number;

  /**  */
  employeeSalary?: number;

  /**  */
  operatingCosts?: number;

  /**  */
  financialTransactions?: number;
}

export interface FlightInfoByFilterInputDto {
  /**  */
  courseId?: string;

  /**  */
  playDate?: Date;

  /**  */
  isGetServiceDefault?: boolean;
}

export interface FlightInfoByFilterOutputDto {
  /**  */
  courseId?: string;

  /**  */
  courseName?: string;

  /**  */
  gameType?: GameTypeEnum;

  /**  */
  gameTypeAllow?: ComboOptionDto[];

  /**  */
  playDate?: Date;

  /**  */
  listTeeTime?: ComboOptionDto[];

  /**  */
  saleInvoiceDetails?: SaleInvoiceDetailDto[];
}

export interface FlightSlot {
  /**  */
  playerNo?: number;

  /**  */
  sourceType?: string;

  /**  */
  status?: TeetimeSlotEnum;

  /**  */
  isMemberPriority?: boolean;

  /**  */
  allowGuest?: boolean;

  /**  */
  partnerName?: string;

  /**  */
  partnerId?: string;

  /**  */
  guestName?: string;

  /**  */
  bookingGroupId?: string;

  /**  */
  groupName?: string;

  /**  */
  bookingTeeTimeId?: string;

  /**  */
  bookingId?: string;

  /**  */
  accessCardId?: string;

  /**  */
  bookingPlayerId?: string;

  /**  */
  checkInStatus?: CheckinStatusEnum;

  /**  */
  isNoShow?: boolean;

  /**  */
  bookingStatus?: BookingStatusEnum;

  /**  */
  checkOutTime?: Date;

  /**  */
  checkInTime?: Date;
}

export interface FnbAreaDto {
  /**  */
  id?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  isActived?: boolean;

  /**  */
  description?: string;

  /**  */
  shopId?: number;
}

export interface FnbProcessingAreaDto {
  /**  */
  id?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  isActived?: boolean;

  /**  */
  description?: string;

  /**  */
  shopId?: number;
}

export interface FnbReservationCreateDto {
  /**  */
  reservationCode?: string;

  /**  */
  creatorEmployeeId?: string;

  /**  */
  partnerId?: string;

  /**  */
  partnerName?: string;

  /**  */
  partnerPhone?: string;

  /**  */
  notes?: string;

  /**  */
  reservationDate?: Date;

  /**  */
  reservationStatus?: RESERVATION_STATUS;

  /**  */
  numberOfAdult?: number;

  /**  */
  numberOfChildren?: number;

  /**  */
  numberOfCustomer?: number;

  /**  */
  tableId?: string;
}

export interface FnbReservationDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  reservationCode?: string;

  /**  */
  partnerId?: string;

  /**  */
  creatorEmployeeId?: string;

  /**  */
  reservationDate?: Date;

  /**  */
  reservationStatus?: RESERVATION_STATUS;

  /**  */
  depositAmount?: number;

  /**  */
  notes?: string;

  /**  */
  canceledEmployeeId?: string;

  /**  */
  canceledDate?: Date;

  /**  */
  canceledReason?: string;

  /**  */
  saleEmployeeId?: string;

  /**  */
  reservationChannelTypeId?: number;

  /**  */
  partnerName?: string;

  /**  */
  partnerPhone?: string;

  /**  */
  numberOfAdult?: number;

  /**  */
  numberOfChildren?: number;

  /**  */
  numberOfCustomer?: number;

  /**  */
  areaName?: string;

  /**  */
  tableName?: string;

  /**  */
  tableId?: string;
}

export interface FnbReservationPagedCountDto {
  /**  */
  reservationStatus?: number;

  /**  */
  totalCount?: number;
}

export interface FnbReservationPagedInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  reservationStatus?: RESERVATION_STATUS;

  /**  */
  dateRange?: DateRangeDto;

  /**  */
  tableId?: string;
}

export interface FnbReservationUpdateDto {
  /**  */
  id?: string;

  /**  */
  reservationCode?: string;

  /**  */
  creatorEmployeeId?: string;

  /**  */
  partnerId?: string;

  /**  */
  partnerName?: string;

  /**  */
  partnerPhone?: string;

  /**  */
  notes?: string;

  /**  */
  reservationDate?: Date;

  /**  */
  numberOfAdult?: number;

  /**  */
  numberOfChildren?: number;

  /**  */
  numberOfCustomer?: number;

  /**  */
  tableId?: string;
}

export interface FnbTableDto {
  /**  */
  id?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  areaId?: string;

  /**  */
  areaName?: string;

  /**  */
  isActived?: boolean;

  /**  */
  numberOfSeat?: number;

  /**  */
  shopId?: number;
}

export interface FoodGridDto {
  /**  */
  productId?: string;

  /**  */
  productName?: string;

  /**  */
  imageUrl?: string;

  /**  */
  productGroupName?: string;

  /**  */
  description?: string;

  /**  */
  productPriceWithTax?: string;

  /**  */
  isProductPriceIncludeTax?: boolean;

  /**  */
  productPrice?: string;

  /**  */
  currencyUnit?: string;

  /**  */
  qty?: number;

  /**  */
  inventoryCurrentQty?: number;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  productUnitId?: string;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  priceListId?: string;

  /**  */
  units?: ComboOptionDto[];

  /**  */
  subTotalAmount?: number;
}

export interface FoodGridPagedDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  productGroupId?: string;

  /**  */
  priceListId?: string;
}

export interface GdpOrderStockMoveDetailDto {
  /**  */
  id?: string;

  /**  */
  stockOrderId?: string;

  /**  */
  parentId?: string;

  /**  */
  productId?: string;

  /**  */
  productUnitId?: string;

  /**  */
  qty?: number;

  /**  */
  qtyConvert?: number;

  /**  */
  convertRate?: number;

  /**  */
  price?: number;

  /**  */
  costPrice?: number;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  discountType?: number;

  /**  */
  discountValue?: number;

  /**  */
  discountAmount?: number;

  /**  */
  discountAmountAllocation?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxAmount?: number;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  unitName?: string;

  /**  */
  productDetail?: ProductStockViewDto;

  /**  */
  productHashId?: string;

  /**  */
  parentItem?: OrderStockMoveDetailDto;
}

export interface GdpOrderStockMoveDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  supplierId?: number;

  /**  */
  orderDate?: Date;

  /**  */
  desiredDeliveryDate?: Date;

  /**  */
  orderCode?: string;

  /**  */
  note?: string;

  /**  */
  totalAmount?: number;

  /**  */
  approvalTotalAmount?: number;

  /**  */
  moveStatus?: ORDER_STATUS;

  /**  */
  paymentDate?: Date;

  /**  */
  paymentStatus?: number;

  /**  */
  paymentMethod?: PAYMENT_METHOD;

  /**  */
  moveId?: string;

  /**  */
  shopId?: number;

  /**  */
  creatorId?: string;

  /**  */
  reviewerId?: string;

  /**  */
  creationUserName?: string;
}

export interface GdpOrderStockTicketDto {
  /**  */
  isDraft?: boolean;

  /**  */
  items?: GdpOrderStockMoveDetailDto[];

  /**  */
  moveDto?: GdpOrderStockMoveDto;
}

export interface GetCheckStockImportExcelTemplateQuery {}

export interface GetComboCoursePublicQuerry {
  /**  */
  shopCode?: string;
}

export interface GetComboOptionGameTypeAllowOfCourseQuerry {
  /**  */
  shopCode?: string;

  /**  */
  courseId?: string;
}

export interface GetInfoBeforeCheckoutQuerry {
  /**  */
  bookingId?: string;

  /**  */
  bookingPlayerId?: string;

  /**  */
  bookingGroupId?: string;
}

export interface GetInvoiceForCentralBillingInputDto {
  /**  */
  mainInvoiceId?: string;

  /**  */
  partnerId?: string;

  /**  */
  listInvoiceId?: string[];
}

export interface GetListPermissionQuery {
  /**  */
  listRoleId?: string[];

  /**  */
  isTemplateTenant?: boolean;
}

export interface GetListUserAssignByRoleQuery {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  roleId?: string;

  /**  */
  isTemplateTenant?: boolean;
}

export interface GetMemberCardInfoQuerry {
  /**  */
  checkTime?: Date;

  /**  */
  cardCode?: string;

  /**  */
  includeTempcard?: boolean;
}

export interface GetMisaInvoiceTemplateDataInputDto {
  /**  */
  typeInvoice?: number;

  /**  */
  taxCode?: string;

  /**  */
  userName?: string;

  /**  */
  password?: string;
}

export interface GetPagedProductBarcode {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;
}

export interface GetProductInfoFromInventoryAvailableQuery {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  inventoryId?: string;

  /**  */
  productTypeId?: number;

  /**  */
  listProductGroup?: string[];

  /**  */
  fromDate?: Date;

  /**  */
  expiryDateStatus?: number;

  /**  */
  inStock?: boolean;
}

export interface GetProductInventoryAvailableQuery {
  /**  */
  inventoryId?: string;

  /**  */
  listProductId?: string[];
}

export interface GetProductLotNumberInventoryStockQuery {
  /**  */
  productId?: string;

  /**  */
  inventoryId?: string;

  /**  */
  offsetQty?: number;

  /**  */
  inventoryLineDetailId?: string;

  /**  */
  moveStatus?: number;
}

export interface GetProductLotNumberIsStillExpiredSelectQuery {
  /**  */
  productId?: string;

  /**  */
  inventoryId?: string;
}

export interface GetProductLotNumberPageRequests {
  /**  */
  publishViewId?: string;

  /**  */
  inventoryId?: string;

  /**  */
  filter?: string;
}

export interface GetProductLotSelectQuery {
  /**  */
  productId?: string;

  /**  */
  inventoryId?: string;
}

export interface GetProductPriceListDetailDto {
  /**  */
  productId?: string;

  /**  */
  priceListId?: string;
}

export interface GetProductUnitSelectQuery {
  /**  */
  productId?: string;
}

export interface GetProductUnitSelectWithPriceListQuery {
  /**  */
  productId?: string;

  /**  */
  priceListId?: string;
}

export interface GetReturnMoveQuery {
  /**  */
  relatedMoveLineDetailId?: string;
}

export interface GetSaleInvoiceReportRequest {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  creationTime?: Date;

  /**  */
  creatorEmployeeId?: string;
}

export interface GetServiceInitDefaultByFilterQuerry {
  /**  */
  courseId?: string;

  /**  */
  gameType?: GameTypeEnum;

  /**  */
  listPlayer?: GolfBookingPLayerDto[];
}

export interface GetTeeTimeAvailableityPublicQuerry {
  /**  */
  shopCode?: string;

  /**  */
  courseId?: string;

  /**  */
  playDate?: Date;

  /**  */
  numberOfPlayers?: number;

  /**  */
  startTime?: TimeSpan;

  /**  */
  endTime?: TimeSpan;
}

export interface GetTimekeepingByEmployeeRequest {
  /**  */
  employeeId?: string;

  /**  */
  workDate?: Date;
}

export interface GetTopSellByChanelRequest {
  /**  */
  isQueryTopChannel?: boolean;

  /**  */
  timeUnitFilter?: TimeUnitFilterEnum;

  /**  */
  rangeDateCustom?: DateRangeDto;
}

export interface GetTransStockImportExcelTemplateQuery {}

export interface GetUserByIdQuery {
  /**  */
  userId?: string;
}

export interface GetUserFireBaseTokenForViewDto {
  /**  */
  firebaseToken?: string;

  /**  */
  platform?: string;
}

export interface GiftItemDto {
  /**  */
  quantity?: number;

  /**  */
  code?: string;

  /**  */
  name?: string;
}

export interface GolfAccessCardColorDto {
  /**  */
  id?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  description?: string;

  /**  */
  colorCode?: string;

  /**  */
  isActived?: boolean;
}

export interface GolfAreaDto {
  /**  */
  id?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  description?: string;

  /**  */
  isActived?: boolean;
}

export interface GolfBookingGroupDto {
  /**  */
  id?: string;

  /**  */
  groupName?: string;

  /**  */
  groupNo?: string;

  /**  */
  contactName?: string;

  /**  */
  contactNo?: string;

  /**  */
  note?: string;

  /**  */
  partnerName?: string;

  /**  */
  isActived?: boolean;
}

export interface GolfBookingGroupImportDto {
  /**  */
  id?: string;

  /**  */
  groupName?: string;

  /**  */
  groupNo?: string;

  /**  */
  contactName?: string;

  /**  */
  contactNo?: string;

  /**  */
  note?: string;

  /**  */
  partnerName?: string;

  /**  */
  isActived?: boolean;

  /**  */
  listErrorValidData?: ValidateErrorDetail[];

  /**  */
  isError?: boolean;
}

export interface GolfBookingGroupImportOutputDto {
  /**  */
  errorImportList?: GolfBookingGroupImportDto[];

  /**  */
  successImportList?: GolfBookingGroupImportDto[];

  /**  */
  errorFile?: FileUploadDto;

  /**  */
  successFile?: FileUploadDto;
}

export interface GolfBookingPLayerDto {
  /**  */
  id?: string;

  /**  */
  bookingGroupId?: string;

  /**  */
  bookingId?: string;

  /**  */
  partnerId?: string;

  /**  */
  isDefaultPlayer?: boolean;

  /**  */
  fullName?: string;

  /**  */
  accessCardId?: string;

  /**  */
  isGuest?: boolean;

  /**  */
  checkInStatus?: CheckinStatusEnum;

  /**  */
  checkInTime?: Date;

  /**  */
  checkOutTime?: Date;

  /**  */
  isNoShow?: boolean;

  /**  */
  bagTagNo?: string;

  /**  */
  bookingCaddyId?: string;

  /**  */
  caddyAssignedId?: string;

  /**  */
  bookingCaddyCode?: string;

  /**  */
  caddyAssignedCode?: string;

  /**  */
  rentalBuggyType?: ProductRentalBuggyType;

  /**  */
  isSharedCaddy?: boolean;

  /**  */
  order?: number;

  /**  */
  playerNo?: number;

  /**  */
  teeTime?: TimeSpan;
}

export interface GolfBuggyDto {
  /**  */
  id?: string;

  /**  */
  buggyName?: string;

  /**  */
  licensePlate?: string;

  /**  */
  buggyCode?: string;

  /**  */
  buggyType?: BuggyTypeEnum;

  /**  */
  description?: string;

  /**  */
  batteryType?: BatteryTypeEnum;

  /**  */
  batteryCapacity?: string;

  /**  */
  maxSpeedKph?: number;

  /**  */
  maxLoadKg?: number;

  /**  */
  color?: string;

  /**  */
  currentStatus?: BuggyCurrentStatusEnum;

  /**  */
  buggyGroupId?: string;

  /**  */
  areaId?: string;
}

export interface GolfBuggyGroupDto {
  /**  */
  id?: string;

  /**  */
  buggyGroupCode?: string;

  /**  */
  buggyGroupName?: string;

  /**  */
  notes?: string;

  /**  */
  isActived?: boolean;
}

export interface GolfBuggyGroupPageRequestDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  isActived?: boolean;
}

export interface GolfBuggyOutPutDto {
  /**  */
  id?: string;

  /**  */
  buggyName?: string;

  /**  */
  licensePlate?: string;

  /**  */
  buggyCode?: string;

  /**  */
  buggyType?: BuggyTypeEnum;

  /**  */
  description?: string;

  /**  */
  batteryType?: BatteryTypeEnum;

  /**  */
  batteryCapacity?: string;

  /**  */
  maxSpeedKph?: number;

  /**  */
  maxLoadKg?: number;

  /**  */
  color?: string;

  /**  */
  currentStatus?: BuggyCurrentStatusEnum;

  /**  */
  buggyGroupId?: string;

  /**  */
  areaId?: string;

  /**  */
  buggyGroupName?: string;
}

export interface GolfCartPageRequestDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  currentStatus?: BuggyCurrentStatusEnum;

  /**  */
  buggyType?: BuggyTypeEnum;
}

export interface GolfCheckNeedReturnItemCommand {
  /**  */
  bookingId?: string;

  /**  */
  bookingPlayerId?: string;

  /**  */
  bookingGroupId?: string;
}

export interface GolfCheckoutCommand {
  /**  */
  bookingId?: string;

  /**  */
  bookingPlayerId?: string;

  /**  */
  bookingGroupId?: string;

  /**  */
  invoice?: SaleInvoiceDto;
}

export interface GolfCheckoutOutputDto {
  /**  */
  partnerId?: string;

  /**  */
  checkoutTime?: Date;

  /**  */
  invoice?: SaleInvoiceDto;
}

export interface GolfCheckoutPlayerInfoDto {
  /**  */
  isGuest?: boolean;

  /**  */
  gustName?: string;

  /**  */
  isDefaultPlayer?: boolean;

  /**  */
  gender?: GENDER;

  /**  */
  phone?: string;

  /**  */
  partnerId?: string;

  /**  */
  partnerName?: string;
}

export interface GolfCourseDto {
  /**  */
  id?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  description?: string;

  /**  */
  holeCount?: number;

  /**  */
  currentStatus?: FieldStatusEnum;

  /**  */
  courseType?: CourseTypeEnum;

  /**  */
  expectedDurationPerRound?: number;

  /**  */
  expectedHolePerRound?: number;

  /**  */
  gameTypeDefault?: GameTypeEnum;

  /**  */
  areaId?: string;

  /**  */
  areaName?: string;

  /**  */
  golfCourseHoles?: GolfCourseHolesDto[];

  /**  */
  gameTypeAllowIds?: number[];

  /**  */
  gameTypeAllow?: string;
}

export interface GolfCourseHolesDto {
  /**  */
  id?: string;

  /**  */
  holeNumber?: number;

  /**  */
  distance?: number;

  /**  */
  par?: number;

  /**  */
  handicap?: number;

  /**  */
  courseId?: string;
}

export interface GolfCourseMaintenanceLogDto {
  /**  */
  id?: string;

  /**  */
  maintenanceDate?: Date;

  /**  */
  notes?: string;

  /**  */
  courseId?: string;

  /**  */
  performedById?: string;

  /**  */
  performedName?: string;
}

export interface GolfCustomerDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  phone?: string;

  /**  */
  email?: string;

  /**  */
  street?: string;

  /**  */
  zone?: string;

  /**  */
  address?: string;

  /**  */
  gender?: GENDER;

  /**  */
  type?: PARTNER_TYPE;

  /**  */
  groupId?: string;

  /**  */
  categoryId?: PartnerCategoryEnum;

  /**  */
  debtAmount?: number;

  /**  */
  dateOfBirth?: Date;

  /**  */
  dateOfBirthCompare?: Date;

  /**  */
  yearOfBirth?: number;

  /**  */
  monthOfBirth?: number;

  /**  */
  placeOfBirth?: string;

  /**  */
  companyName?: string;

  /**  */
  taxCode?: string;

  /**  */
  taxBranch?: string;

  /**  */
  passport?: string;

  /**  */
  visaNo?: string;

  /**  */
  visaExpireDate?: Date;

  /**  */
  notes?: string;

  /**  */
  identityCardNumber?: string;

  /**  */
  identityCardIssueDate?: Date;

  /**  */
  identityCardIssuePlace?: string;

  /**  */
  imageUrl?: string;

  /**  */
  job?: string;

  /**  */
  jobCode?: string;

  /**  */
  title?: string;

  /**  */
  ethnic?: string;

  /**  */
  ethnicCode?: string;

  /**  */
  country?: string;

  /**  */
  countryCode?: string;

  /**  */
  religion?: string;

  /**  */
  marital?: number;

  /**  */
  childrenNumber?: number;

  /**  */
  districtCode?: string;

  /**  */
  cityCode?: string;

  /**  */
  wardCode?: string;

  /**  */
  bankCode?: string;

  /**  */
  bankAccountName?: string;

  /**  */
  bankAccountCode?: string;

  /**  */
  emergencyContact?: string;

  /**  */
  emergencyPhone?: string;

  /**  */
  countryId?: number;

  /**  */
  wardId?: number;

  /**  */
  creatorShopId?: number;

  /**  */
  isActived?: boolean;

  /**  */
  prefixCode?: string;

  /**  */
  strType?: string;

  /**  */
  genderStr?: string;

  /**  */
  groupName?: string;

  /**  */
  fullAddress?: string;

  /**  */
  groupIds?: string[];

  /**  */
  groupIdRel?: string;

  /**  */
  groupNames?: string;

  /**  */
  groupCodes?: string;

  /**  */
  weight?: number;

  /**  */
  height?: number;

  /**  */
  monthAge?: number;

  /**  */
  age?: number;

  /**  */
  cityName?: string;

  /**  */
  districtName?: string;

  /**  */
  wardName?: string;

  /**  */
  totalReturnAmount?: number;

  /**  */
  lstGroupNames?: string[];

  /**  */
  groupDiscountPercent?: number;

  /**  */
  loyaltyTierId?: string;

  /**  */
  loyaltyPoint?: number;

  /**  */
  totalAmount?: number;

  /**  */
  loyaltyCode?: string;

  /**  */
  listCardAssigned?: AccessCardDto[];
}

export interface GolfFlightOutputDto {
  /**  */
  teeTimeId?: string;

  /**  */
  courseId?: string;

  /**  */
  playDate?: Date;

  /**  */
  teeTimeType?: TeetimeTypeEnum;

  /**  */
  startTime?: TimeSpan;

  /**  */
  maxGroupPerFlight?: number;

  /**  */
  listSlot?: FlightSlot[];

  /**  */
  players?: string;
}

export interface GolfGolferGroupDetailDto {
  /**  */
  id?: string;

  /**  */
  partnerName?: string;

  /**  */
  dateOfBirth?: Date;

  /**  */
  phoneNumber?: string;

  /**  */
  groupId?: string;

  /**  */
  partnerId?: string;

  /**  */
  golferMemberType?: GolferMemberTypeEnum;

  /**  */
  strGolferMemberType?: string;

  /**  */
  accessCardId?: string;

  /**  */
  isPaid?: boolean;

  /**  */
  isActived?: boolean;
}

export interface GolfHistoryBookingCourseOfCustomer {
  /**  */
  dateTime?: Date;

  /**  */
  courseName?: string;

  /**  */
  courseCode?: string;

  /**  */
  numberOfGolf?: string;

  /**  */
  courseId?: string;

  /**  */
  caddyId?: string;

  /**  */
  caddyName?: string;

  /**  */
  notes?: string;
}

export interface GolfHistoryUsingServicesOfCustomer {
  /**  */
  dateTime?: Date;

  /**  */
  productCategoryId?: number;

  /**  */
  serviceName?: string;

  /**  */
  serviceCode?: string;

  /**  */
  serviceId?: string;

  /**  */
  notes?: string;
}

export interface GolfInfoBeforeCheckoutOutputDto {
  /**  */
  playerInfo?: GolfCheckoutPlayerInfoDto;

  /**  */
  bookingInfo?: MemberInfoByCardBookingOutputDto;

  /**  */
  listPlayer?: PlayerCheckoutInfoDto[];

  /**  */
  listMiscItem?: ReturnItemInputDto[];

  /**  */
  debtAmount?: number;

  /**  */
  lockerInfo?: GolfLockerChangeHistoryDto;
}

export interface GolfLatestInformationOfCustomer {
  /**  */
  courseName?: string;

  /**  */
  courseId?: string;

  /**  */
  bookingId?: string;

  /**  */
  courseCode?: string;

  /**  */
  dateTime?: Date;

  /**  */
  totalRoundsPlayed?: number;

  /**  */
  gameType?: GameTypeEnum;

  /**  */
  bestAchievement?: string;

  /**  */
  discount?: string;
}

export interface GolfListProductWithCategoryComboOption {
  /**  */
  categoryIdParseGolfService?: number;

  /**  */
  categoryNameParseGolfService?: string;

  /**  */
  items?: ProductDto[];
}

export interface GolfLockerBlockCodeDto {
  /**  */
  id?: string;

  /**  */
  lockerId?: string;

  /**  */
  blockDate?: Date;

  /**  */
  blockBy?: string;

  /**  */
  reason?: string;
}

export interface GolfLockerChangeHistoryDto {
  /**  */
  id?: string;

  /**  */
  rentStartDate?: Date;

  /**  */
  rentEndDate?: Date;

  /**  */
  lockerId?: string;

  /**  */
  lockerCode?: string;

  /**  */
  partnerId?: string;

  /**  */
  bookingPlayerId?: string;

  /**  */
  notes?: string;

  /**  */
  partnerName?: string;

  /**  */
  partnerCode?: string;

  /**  */
  locationId?: string;

  /**  */
  isCheckedOut?: boolean;
}

export interface GolfLockerDto {
  /**  */
  id?: string;

  /**  */
  code?: string;

  /**  */
  locationId?: string;

  /**  */
  groupId?: string;

  /**  */
  image?: string;

  /**  */
  notes?: string;

  /**  */
  width?: number;

  /**  */
  height?: number;

  /**  */
  color?: string;

  /**  */
  remarks?: string;

  /**  */
  status?: GolfLockerStatusEnum;
}

export interface GolfLockerGroupDto {
  /**  */
  id?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  notes?: string;

  /**  */
  status?: GolfLockerGroupTypeEnum;

  /**  */
  isActived?: boolean;
}

export interface GolfLockerMaintenanceLogDto {
  /**  */
  id?: string;

  /**  */
  maintenanceDate?: Date;

  /**  */
  notes?: string;

  /**  */
  lockerId?: string;

  /**  */
  conditionLocker?: string;

  /**  */
  performedById?: string;
}

export interface GolfLockerPageDto {
  /**  */
  id?: string;

  /**  */
  code?: string;

  /**  */
  locationId?: string;

  /**  */
  groupId?: string;

  /**  */
  image?: string;

  /**  */
  notes?: string;

  /**  */
  width?: number;

  /**  */
  height?: number;

  /**  */
  color?: string;

  /**  */
  remarks?: string;

  /**  */
  status?: GolfLockerStatusEnum;

  /**  */
  locationName?: string;

  /**  */
  groupName?: string;

  /**  */
  partnerCode?: string;

  /**  */
  partnerId?: string;

  /**  */
  partnerName?: string;

  /**  */
  partnerPhone?: string;

  /**  */
  rentNotes?: string;

  /**  */
  golfChangeHistoryId?: string;

  /**  */
  rentStartDate?: Date;

  /**  */
  rentEndDate?: Date;

  /**  */
  blockDate?: Date;

  /**  */
  reason?: string;
}

export interface GolfProductDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  productTypeId?: number;

  /**  */
  productCategoryId?: number;

  /**  */
  productCategoryName?: string;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  productPriceWithTax?: number;

  /**  */
  isProductPriceIncludeTax?: boolean;

  /**  */
  productPrice?: number;

  /**  */
  isActived?: boolean;

  /**  */
  description?: string;

  /**  */
  productSubCategoryId?: number;

  /**  */
  costPrice?: number;

  /**  */
  isAllowSale?: boolean;

  /**  */
  isProductChain?: boolean;

  /**  */
  basicUnitName?: string;

  /**  */
  basicUnitId?: string;

  /**  */
  numberOfHoles?: number;

  /**  */
  gameType?: GameTypeEnum;

  /**  */
  accessCardColorId?: string;

  /**  */
  cardType?: AccessCardTypeEnum;

  /**  */
  compensationFee?: number;

  /**  */
  courseIds?: string[];

  /**  */
  idsProductGroup?: string[];

  /**  */
  shopIds?: number[];

  /**  */
  courseIdsRaw?: string;

  /**  */
  idsProductGroupRaw?: string;

  /**  */
  shopIdsRaw?: string;
}

export interface GolfProductGroupDto {
  /**  */
  id?: string;

  /**  */
  groupCode?: string;

  /**  */
  groupName?: string;

  /**  */
  orderNumber?: number;

  /**  */
  type?: ProductGroupEnum;

  /**  */
  notes?: string;

  /**  */
  pId?: string;

  /**  */
  shopId?: number;

  /**  */
  isActived?: boolean;
}

export interface GolfProductSimpleDto {
  /**  */
  id?: string;

  /**  */
  productName?: string;

  /**  */
  productCategoryId?: ProductTypeGolfServiceEnum;

  /**  */
  productPrice?: number;

  /**  */
  productPriceWithTax?: number;

  /**  */
  isProductPriceIncludeTax?: boolean;

  /**  */
  taxCode?: string;

  /**  */
  taxPercent?: number;

  /**  */
  basicUnitId?: string;
}

export interface GolfReasonDto {
  /**  */
  id?: string;

  /**  */
  reasonCode?: string;

  /**  */
  reasonName?: string;

  /**  */
  reasonNote?: string;
}

export interface GolfReasonPagedReq {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;
}

export interface GolfSaleInvoiceDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  invoiceCode?: string;

  /**  */
  partnerId?: string;

  /**  */
  creatorEmployeeId?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  status?: SaleInvoiceStatus;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  discountType?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxDiscountPercent?: number;

  /**  */
  taxDiscountCode?: string;

  /**  */
  taxDiscountAmount?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  totalAmountRound?: number;

  /**  */
  paymentAmount?: number;

  /**  */
  debtAmount?: number;

  /**  */
  paymentMethod?: number;

  /**  */
  paymentBankCode?: string;

  /**  */
  paymentBankAccountCode?: string;

  /**  */
  paymentBankAccountName?: string;

  /**  */
  paymentBankAccountVirtualName?: string;

  /**  */
  paymentStatus?: number;

  /**  */
  notes?: string;

  /**  */
  inventoryId?: string;

  /**  */
  canceledEmployeeId?: string;

  /**  */
  canceledDate?: Date;

  /**  */
  canceledReason?: string;

  /**  */
  totalQty?: number;

  /**  */
  totalReturnQty?: number;

  /**  */
  salePartnerId?: string;

  /**  */
  einvoiceNo?: string;

  /**  */
  einvoiceIssuedDate?: Date;

  /**  */
  einvoiceCanceledDate?: Date;

  /**  */
  einvoiceReservationCode?: string;

  /**  */
  einvoiceStatus?: EinvoiceStatus;

  /**  */
  einvoiceTransactionID?: string;

  /**  */
  eInvoiceBuyerName?: string;

  /**  */
  eInvoiceCompany?: string;

  /**  */
  eInvoiceTaxCode?: string;

  /**  */
  eInvoiceBuyerAddress?: string;

  /**  */
  eInvoiceBuyerPhone?: string;

  /**  */
  eInvoiceBuyerEmail?: string;

  /**  */
  einvoiceTransactionMerge?: boolean;

  /**  */
  eInvoiceSeri?: string;

  /**  */
  eInvoiceType?: string;

  /**  */
  einvoiceTaxAuthorityCode?: string;

  /**  */
  einvoiceNumber?: string;

  /**  */
  eInvoiceId?: string;

  /**  */
  isActived?: boolean;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  lotInventoryJson?: string;

  /**  */
  relatedInvoiceId?: string;

  /**  */
  relatedInvoiceCode?: string;

  /**  */
  totalQtyConvert?: number;

  /**  */
  totalReturnQtyConvert?: number;

  /**  */
  paymentMethodJson?: string;

  /**  */
  shopBankAccountId?: string;

  /**  */
  saleChannelTypeId?: CHANNEL_TYPE;

  /**  */
  prescriptionType?: PrescriptionTypeEnum;

  /**  */
  objectId?: string;

  /**  */
  objectType?: InvoiceObjectTypeEnum;

  /**  */
  saleChannelTypeName?: string;

  /**  */
  saleInvoiceDetails?: SaleInvoiceDetailDto[];

  /**  */
  prescriptionInfo?: SalesPrescriptionDto;

  /**  */
  partnerName?: string;

  /**  */
  customerPhone?: string;

  /**  */
  customerTaxCode?: string;

  /**  */
  taxCode?: string;

  /**  */
  email?: string;

  /**  */
  customerAddress?: string;

  /**  */
  customerState?: string;

  /**  */
  customerDistinct?: string;

  /**  */
  customerWard?: string;

  /**  */
  creatorEmployeeName?: string;

  /**  */
  creatorEmployeePhone?: string;

  /**  */
  creatorSalePartnerName?: string;

  /**  */
  invoiceTimeStr?: string;

  /**  */
  inventoryName?: string;

  /**  */
  relatedInvoiceIdHash?: string;

  /**  */
  paymentMethodObjDto?: PaymentMethodObjDto[];

  /**  */
  partnerCode?: string;

  /**  */
  parnerType?: PARTNER_TYPE;

  /**  */
  isShowInfoExportEInvoice?: boolean;

  /**  */
  deviceTokenId?: string;

  /**  */
  paymentMethodName?: string;

  /**  */
  shopId?: number;

  /**  */
  shopName?: string;

  /**  */
  orderId?: string;

  /**  */
  creatorId?: string;

  /**  */
  paymentMode?: PaymentModeEnum;

  /**  */
  depositPercentage?: number;

  /**  */
  depositAmount?: number;

  /**  */
  listDeleteId?: string[];
}

export interface GolfTeeTimeConfigDetailDto {
  /**  */
  id?: string;

  /**  */
  name?: string;

  /**  */
  teeTimeConfigId?: string;

  /**  */
  dayOfWeek?: number;

  /**  */
  startHour?: TimeSpan;

  /**  */
  endHour?: TimeSpan;
}

export interface GolfTeeTimeConfigDto {
  /**  */
  id?: string;

  /**  */
  teeTimeType?: TeetimeTypeEnum;

  /**  */
  courseId?: string;

  /**  */
  intervalMinutes?: number;

  /**  */
  maxGroupPerFlight?: number;

  /**  */
  applyFromDate?: Date;

  /**  */
  applyToDate?: Date;

  /**  */
  applyMode?: ApplyDayModeEnum;

  /**  */
  strApplyMode?: string;

  /**  */
  isActived?: boolean;

  /**  */
  startHour?: TimeSpan;

  /**  */
  endHour?: TimeSpan;

  /**  */
  courseName?: string;

  /**  */
  courseCode?: string;

  /**  */
  details?: GolfTeeTimeConfigDetailDto[];
}

export interface GroupByDateDto {
  /**  */
  measureDate?: Date;
}

export interface HttpContent {
  /**  */
  headers?: KeyValuePairOfStringIEnumerableOfString[];
}

export interface HttpMethod {
  /**  */
  method?: string;
}

export interface HttpRequestMessage {
  /**  */
  version?: Version;

  /**  */
  versionPolicy?: HttpVersionPolicy;

  /**  */
  content?: HttpContent;

  /**  */
  method?: HttpMethod;

  /**  */
  requestUri?: string;

  /**  */
  headers?: KeyValuePairOfStringIEnumerableOfString[];

  /**  */
  properties?: object;

  /**  */
  options?: object;
}

export interface HttpResponseMessage {
  /**  */
  version?: Version;

  /**  */
  content?: HttpContent;

  /**  */
  statusCode?: HttpStatusCode;

  /**  */
  reasonPhrase?: string;

  /**  */
  headers?: KeyValuePairOfStringIEnumerableOfString[];

  /**  */
  trailingHeaders?: KeyValuePairOfStringIEnumerableOfString[];

  /**  */
  requestMessage?: HttpRequestMessage;

  /**  */
  isSuccessStatusCode?: boolean;
}

export interface IEinvoiceService {}

export interface IanaTimeZone {
  /**  */
  timeZoneName?: string;
}

export interface ImportDiscountSupplierInputDto {
  /**  */
  id?: string;

  /**  */
  code?: string;

  /**  */
  discountUseType?: DISCOUNT_USE_TYPE;

  /**  */
  userId?: string;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountValue?: number;

  /**  */
  startDate?: Date;

  /**  */
  endDate?: Date;

  /**  */
  discountStatus?: DISCOUNTSTATUS;

  /**  */
  usageLimit?: number;

  /**  */
  usageCount?: number;

  /**  */
  barcode?: string;

  /**  */
  qtyPrint?: number;

  /**  */
  startDateFormatted?: string;

  /**  */
  endDateFormatted?: string;

  /**  */
  listError?: string[];

  /**  */
  isValid?: boolean;

  /**  */
  strError?: string;
}

export interface ImportDiscountSupplierOutputDto {
  /**  */
  errorImportList?: ImportDiscountSupplierInputDto[];

  /**  */
  successImportList?: ImportDiscountSupplierInputDto[];

  /**  */
  succesImportCount?: number;

  /**  */
  errorImportCount?: number;
}

export interface ImportExcelAccessCardInputDto {
  /**  */
  uid?: string;

  /**  */
  printedNumber?: string;

  /**  */
  description?: string;

  /**  */
  strAccessCardColor?: string;

  /**  */
  code?: string;

  /**  */
  accessStatus?: AccessCardStatusEnum;

  /**  */
  cardType?: AccessCardTypeEnum;

  /**  */
  accessCardColorId?: string;

  /**  */
  isActived?: boolean;

  /**  */
  listErrorValidData?: ValidateErrorDetail[];

  /**  */
  isError?: boolean;
}

export interface ImportExcelAccessCardOutputDto {
  /**  */
  errorImportList?: ImportExcelAccessCardInputDto[];

  /**  */
  successImportList?: ImportExcelAccessCardInputDto[];

  /**  */
  errorFile?: FileUploadDto;

  /**  */
  successFile?: FileUploadDto;
}

export interface ImportExcelCheckExcelBaseDto {
  /**  */
  uuid?: string;

  /**  */
  productId?: string;

  /**  */
  productName?: string;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  price?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  costPrice?: number;

  /**  */
  latestImportPrice?: number;

  /**  */
  productUnitId?: string;

  /**  */
  unitName?: string;

  /**  */
  convertRate?: number;

  /**  */
  units?: StockProductSelectUnitDto[];

  /**  */
  lotNumbers?: StockProductUnitDto[];

  /**  */
  inventoryId?: string;

  /**  */
  qty?: number;

  /**  */
  subTaxAmount?: number;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  totalAmountAfterDiscount?: number;

  /**  */
  productCode?: string;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  expiryDateStr?: string;

  /**  */
  lotNumberId?: string;

  /**  */
  errors?: string[];

  /**  */
  isValid?: boolean;

  /**  */
  closingInventoryQty?: number;

  /**  */
  closingInventoryQtyStr?: string;

  /**  */
  openingInventoryQty?: number;
}

export interface ImportExcelExportExcelBaseDto {
  /**  */
  uuid?: string;

  /**  */
  productId?: string;

  /**  */
  productName?: string;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  price?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  costPrice?: number;

  /**  */
  latestImportPrice?: number;

  /**  */
  productUnitId?: string;

  /**  */
  unitName?: string;

  /**  */
  convertRate?: number;

  /**  */
  units?: StockProductSelectUnitDto[];

  /**  */
  lotNumbers?: StockProductUnitDto[];

  /**  */
  inventoryId?: string;

  /**  */
  subTaxAmount?: number;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  totalAmountAfterDiscount?: number;

  /**  */
  productCode?: string;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  expiryDateStr?: string;

  /**  */
  lotNumberId?: string;

  /**  */
  errors?: string[];

  /**  */
  isValid?: boolean;

  /**  */
  note?: string;

  /**  */
  qty?: number;

  /**  */
  qtyStr?: string;
}

export interface ImportExcelImportSuplierExcelBaseDto {
  /**  */
  uuid?: string;

  /**  */
  productId?: string;

  /**  */
  productName?: string;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  costPrice?: number;

  /**  */
  latestImportPrice?: number;

  /**  */
  productUnitId?: string;

  /**  */
  unitName?: string;

  /**  */
  convertRate?: number;

  /**  */
  units?: StockProductSelectUnitDto[];

  /**  */
  lotNumbers?: StockProductUnitDto[];

  /**  */
  inventoryId?: string;

  /**  */
  subTaxAmount?: number;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  totalAmountAfterDiscount?: number;

  /**  */
  productCode?: string;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  expiryDateStr?: string;

  /**  */
  lotNumberId?: string;

  /**  */
  errors?: string[];

  /**  */
  isValid?: boolean;

  /**  */
  qty?: number;

  /**  */
  qtyStr?: string;

  /**  */
  price?: number;

  /**  */
  priceStr?: string;

  /**  */
  discountPercent?: number;

  /**  */
  discountPercentStr?: string;

  /**  */
  discountAmount?: number;

  /**  */
  discountAmountStr?: string;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountInput?: number;
}

export interface ImportExcelPartnerGroupInputDto {
  /**  */
  groupName?: string;

  /**  */
  groupCode?: string;

  /**  */
  groupType?: PARTNER_TYPE;

  /**  */
  notes?: string;

  /**  */
  strType?: string;

  /**  */
  isActived?: boolean;

  /**  */
  shopId?: number;

  /**  */
  listErrorValidData?: ValidateErrorDetail[];

  /**  */
  isError?: boolean;
}

export interface ImportExcelPartnerGroupOutputDto {
  /**  */
  errorImportList?: ImportExcelPartnerGroupInputDto[];

  /**  */
  successImportList?: ImportExcelPartnerGroupInputDto[];

  /**  */
  errorFile?: FileUploadDto;

  /**  */
  successFile?: FileUploadDto;
}

export interface ImportExcelTransferExcelBaseDto {
  /**  */
  uuid?: string;

  /**  */
  productId?: string;

  /**  */
  productName?: string;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  costPrice?: number;

  /**  */
  latestImportPrice?: number;

  /**  */
  productUnitId?: string;

  /**  */
  unitName?: string;

  /**  */
  convertRate?: number;

  /**  */
  units?: StockProductSelectUnitDto[];

  /**  */
  lotNumbers?: StockProductUnitDto[];

  /**  */
  inventoryId?: string;

  /**  */
  subTaxAmount?: number;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  totalAmountAfterDiscount?: number;

  /**  */
  productCode?: string;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  expiryDateStr?: string;

  /**  */
  lotNumberId?: string;

  /**  */
  errors?: string[];

  /**  */
  isValid?: boolean;

  /**  */
  qty?: number;

  /**  */
  qtyStr?: string;

  /**  */
  price?: number;

  /**  */
  priceStr?: string;
}

export interface ImportPartnerInputDto {
  /**  */
  id?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  phone?: string;

  /**  */
  email?: string;

  /**  */
  address?: string;

  /**  */
  gender?: GENDER;

  /**  */
  type?: PARTNER_TYPE;

  /**  */
  groupId?: string;

  /**  */
  categoryId?: PartnerCategoryEnum;

  /**  */
  debtAmount?: number;

  /**  */
  debtAmountStr?: string;

  /**  */
  dateOfBirth?: Date;

  /**  */
  taxCode?: string;

  /**  */
  taxBranch?: string;

  /**  */
  notes?: string;

  /**  */
  identityCardNumber?: string;

  /**  */
  identityCardIssueDate?: Date;

  /**  */
  identityCardIssuePlace?: string;

  /**  */
  country?: string;

  /**  */
  countryCode?: string;

  /**  */
  districtCode?: string;

  /**  */
  cityCode?: string;

  /**  */
  wardCode?: string;

  /**  */
  bankCode?: string;

  /**  */
  bankAccountName?: string;

  /**  */
  bankAccountCode?: string;

  /**  */
  countryId?: number;

  /**  */
  wardId?: number;

  /**  */
  isActived?: boolean;

  /**  */
  groupName?: string;

  /**  */
  fullAddress?: string;

  /**  */
  groupIds?: string[];

  /**  */
  groupNames?: string;

  /**  */
  weight?: number;

  /**  */
  height?: number;

  /**  */
  categoryStr?: string;

  /**  */
  dateOfBirthStr?: string;

  /**  */
  strType?: string;

  /**  */
  genderStr?: string;

  /**  */
  companyName?: string;

  /**  */
  listErrorValidData?: ValidateErrorDetail[];

  /**  */
  isError?: boolean;
}

export interface ImportPartnerOutputDto {
  /**  */
  errorImportList?: ImportPartnerInputDto[];

  /**  */
  successImportList?: ImportPartnerInputDto[];

  /**  */
  errorFile?: FileUploadDto;

  /**  */
  successFile?: FileUploadDto;
}

export interface ImportSaleInvoiceInputDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  invoiceCode?: string;

  /**  */
  partnerId?: string;

  /**  */
  creatorEmployeeId?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  status?: SaleInvoiceStatus;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  discountType?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxDiscountPercent?: number;

  /**  */
  taxDiscountCode?: string;

  /**  */
  taxDiscountAmount?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  totalAmountRound?: number;

  /**  */
  paymentAmount?: number;

  /**  */
  debtAmount?: number;

  /**  */
  paymentMethod?: number;

  /**  */
  paymentBankCode?: string;

  /**  */
  paymentBankAccountCode?: string;

  /**  */
  paymentBankAccountName?: string;

  /**  */
  paymentBankAccountVirtualName?: string;

  /**  */
  paymentStatus?: number;

  /**  */
  notes?: string;

  /**  */
  inventoryId?: string;

  /**  */
  canceledEmployeeId?: string;

  /**  */
  canceledDate?: Date;

  /**  */
  canceledReason?: string;

  /**  */
  totalQty?: number;

  /**  */
  totalReturnQty?: number;

  /**  */
  salePartnerId?: string;

  /**  */
  einvoiceNo?: string;

  /**  */
  einvoiceIssuedDate?: Date;

  /**  */
  einvoiceCanceledDate?: Date;

  /**  */
  einvoiceReservationCode?: string;

  /**  */
  einvoiceStatus?: EinvoiceStatus;

  /**  */
  einvoiceTransactionID?: string;

  /**  */
  eInvoiceBuyerName?: string;

  /**  */
  eInvoiceCompany?: string;

  /**  */
  eInvoiceTaxCode?: string;

  /**  */
  eInvoiceBuyerAddress?: string;

  /**  */
  eInvoiceBuyerPhone?: string;

  /**  */
  eInvoiceBuyerEmail?: string;

  /**  */
  einvoiceTransactionMerge?: boolean;

  /**  */
  eInvoiceSeri?: string;

  /**  */
  eInvoiceType?: string;

  /**  */
  einvoiceTaxAuthorityCode?: string;

  /**  */
  einvoiceNumber?: string;

  /**  */
  eInvoiceId?: string;

  /**  */
  isActived?: boolean;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  lotInventoryJson?: string;

  /**  */
  relatedInvoiceId?: string;

  /**  */
  relatedInvoiceCode?: string;

  /**  */
  totalQtyConvert?: number;

  /**  */
  totalReturnQtyConvert?: number;

  /**  */
  paymentMethodJson?: string;

  /**  */
  shopBankAccountId?: string;

  /**  */
  saleChannelTypeId?: CHANNEL_TYPE;

  /**  */
  prescriptionType?: PrescriptionTypeEnum;

  /**  */
  objectId?: string;

  /**  */
  objectType?: InvoiceObjectTypeEnum;

  /**  */
  saleChannelTypeName?: string;

  /**  */
  saleInvoiceDetails?: SaleInvoiceDetailDto[];

  /**  */
  prescriptionInfo?: SalesPrescriptionDto;

  /**  */
  partnerName?: string;

  /**  */
  customerPhone?: string;

  /**  */
  customerTaxCode?: string;

  /**  */
  taxCode?: string;

  /**  */
  email?: string;

  /**  */
  customerAddress?: string;

  /**  */
  customerState?: string;

  /**  */
  customerDistinct?: string;

  /**  */
  customerWard?: string;

  /**  */
  creatorEmployeeName?: string;

  /**  */
  creatorEmployeePhone?: string;

  /**  */
  creatorSalePartnerName?: string;

  /**  */
  invoiceTimeStr?: string;

  /**  */
  inventoryName?: string;

  /**  */
  relatedInvoiceIdHash?: string;

  /**  */
  paymentMethodObjDto?: PaymentMethodObjDto[];

  /**  */
  partnerCode?: string;

  /**  */
  parnerType?: PARTNER_TYPE;

  /**  */
  isShowInfoExportEInvoice?: boolean;

  /**  */
  deviceTokenId?: string;

  /**  */
  paymentMethodName?: string;

  /**  */
  shopId?: number;

  /**  */
  shopName?: string;

  /**  */
  orderId?: string;

  /**  */
  creatorId?: string;

  /**  */
  stt?: number;

  /**  */
  listError?: string[];

  /**  */
  isValid?: boolean;

  /**  */
  strError?: string;
}

export interface ImportSaleInvoiceOutputDto {
  /**  */
  errorImportList?: ImportSaleInvoiceInputDto[];

  /**  */
  successImportList?: ImportSaleInvoiceInputDto[];

  /**  */
  succesImportCount?: number;

  /**  */
  errorImportCount?: number;
}

export interface ImportStockInvoiceReturnDetailDto {
  /**  */
  uuid?: string;

  /**  */
  inventoryId?: string;

  /**  */
  inventoryRootDetailId?: string;

  /**  */
  inventoryLineDetailId?: string;

  /**  */
  moveId?: string;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  moveCode?: string;

  /**  */
  moveDate?: Date;

  /**  */
  productId?: string;

  /**  */
  productHashId?: string;

  /**  */
  productName?: string;

  /**  */
  productUnitId?: string;

  /**  */
  unitName?: string;

  /**  */
  productTypeId?: number;

  /**  */
  productCategoryId?: number;

  /**  */
  productSubCategoryId?: number;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  lotNumberId?: string;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  invoiceId?: string;

  /**  */
  qty?: number;

  /**  */
  qtyConvert?: number;

  /**  */
  convertRate?: number;

  /**  */
  returnQty?: number;

  /**  */
  price?: number;

  /**  */
  latestImportPrice?: number;

  /**  */
  priceWithTax?: number;

  /**  */
  isPriceIncludeTax?: boolean;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountValue?: number;

  /**  */
  subTaxAmount?: number;

  /**  */
  subTotalAmount?: number;

  /**  */
  taxDiscountAmountAllocation?: number;

  /**  */
  discountAmountCaculate?: number;

  /**  */
  discountAmount?: number;

  /**  */
  totalAmountAfterDiscount?: number;

  /**  */
  discountAmountAllocation?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  taxAmount?: number;

  /**  */
  taxName?: string;

  /**  */
  totalAmount?: number;

  /**  */
  status?: MOVE_STATUS;

  /**  */
  costPrice?: number;

  /**  */
  totalCostAmount?: number;

  /**  */
  partnerId?: string;

  /**  */
  partnerType?: number;

  /**  */
  relatedMoveId?: string;

  /**  */
  relatedMoveRootDetailId?: string;

  /**  */
  relatedMoveLineDetailId?: string;

  /**  */
  productDetail?: ProductStockViewDto;

  /**  */
  moveLineDetailId?: string;

  /**  */
  moveRootDetailId?: string;

  /**  */
  lotNumbers?: StockProductUnitDto[];

  /**  */
  units?: StockProductSelectUnitDto[];

  /**  */
  maxQtyEnable?: number;

  /**  */
  inventoryQty?: number;

  /**  */
  invoiceDetailsId?: string;

  /**  */
  note?: string;
}

export interface ImportStockInvoiceReturnMoveDto {
  /**  */
  moveId?: string;

  /**  */
  moveHashId?: string;

  /**  */
  inventoryId?: string;

  /**  */
  inventoryName?: string;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  moveStatus?: MOVE_STATUS;

  /**  */
  moveCode?: string;

  /**  */
  moveDate?: Date;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountValue?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxDiscountPercent?: number;

  /**  */
  taxDiscountCode?: string;

  /**  */
  taxDiscountName?: string;

  /**  */
  taxDiscountAmount?: number;

  /**  */
  discountAmountCaculate?: number;

  /**  */
  discountAmountDisplay?: number;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  totalAmountRound?: number;

  /**  */
  paymentAmount?: number;

  /**  */
  debtAmount?: number;

  /**  */
  paymentStatus?: number;

  /**  */
  paymentMethod?: number;

  /**  */
  paymentMethodName?: string;

  /**  */
  totalQty?: number;

  /**  */
  invoiceId?: string;

  /**  */
  invoiceCode?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  note?: string;

  /**  */
  partnerId?: string;

  /**  */
  partnerName?: string;

  /**  */
  partnerType?: number;

  /**  */
  relatedMoveId?: string;

  /**  */
  relatedMoveIdHash?: string;

  /**  */
  relatedMoveCode?: string;

  /**  */
  relatedMoveDate?: Date;

  /**  */
  relatedMoveType?: MOVE_TYPE;

  /**  */
  relatedMoveStatus?: MOVE_STATUS;

  /**  */
  totalReturnQty?: number;

  /**  */
  cancelReason?: string;

  /**  */
  creatorId?: string;

  /**  */
  partnerInvoiceCode?: string;

  /**  */
  partnerInvoiceDate?: Date;

  /**  */
  relatedInvoiceId?: string;
}

export interface ImportStockInvoiceReturnTicketDto {
  /**  */
  productInTicket?: ProductMoveStockDto[];

  /**  */
  moveDto?: ImportStockInvoiceReturnMoveDto;

  /**  */
  items?: ImportStockInvoiceReturnDetailDto[];

  /**  */
  moveDateOld?: Date;

  /**  */
  isDraft?: boolean;

  /**  */
  totalCostPriceInMove?: number;
}

export interface ImportStockMoveDetailDto {
  /**  */
  uuid?: string;

  /**  */
  inventoryId?: string;

  /**  */
  inventoryRootDetailId?: string;

  /**  */
  inventoryLineDetailId?: string;

  /**  */
  moveId?: string;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  moveCode?: string;

  /**  */
  moveDate?: Date;

  /**  */
  productId?: string;

  /**  */
  productHashId?: string;

  /**  */
  productName?: string;

  /**  */
  productUnitId?: string;

  /**  */
  unitName?: string;

  /**  */
  productTypeId?: number;

  /**  */
  productCategoryId?: number;

  /**  */
  productSubCategoryId?: number;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  lotNumberId?: string;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  invoiceId?: string;

  /**  */
  qty?: number;

  /**  */
  qtyConvert?: number;

  /**  */
  convertRate?: number;

  /**  */
  returnQty?: number;

  /**  */
  price?: number;

  /**  */
  latestImportPrice?: number;

  /**  */
  priceWithTax?: number;

  /**  */
  isPriceIncludeTax?: boolean;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountValue?: number;

  /**  */
  subTaxAmount?: number;

  /**  */
  subTotalAmount?: number;

  /**  */
  taxDiscountAmountAllocation?: number;

  /**  */
  discountAmountCaculate?: number;

  /**  */
  discountAmount?: number;

  /**  */
  totalAmountAfterDiscount?: number;

  /**  */
  discountAmountAllocation?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  taxAmount?: number;

  /**  */
  taxName?: string;

  /**  */
  totalAmount?: number;

  /**  */
  status?: MOVE_STATUS;

  /**  */
  costPrice?: number;

  /**  */
  totalCostAmount?: number;

  /**  */
  partnerId?: string;

  /**  */
  partnerType?: number;

  /**  */
  relatedMoveId?: string;

  /**  */
  relatedMoveRootDetailId?: string;

  /**  */
  relatedMoveLineDetailId?: string;

  /**  */
  productDetail?: ProductStockViewDto;

  /**  */
  moveLineDetailId?: string;

  /**  */
  moveRootDetailId?: string;

  /**  */
  lotNumbers?: StockProductUnitDto[];

  /**  */
  units?: StockProductSelectUnitDto[];

  /**  */
  maxQtyEnable?: number;

  /**  */
  inventoryQty?: number;
}

export interface ImportStockMoveDto {
  /**  */
  moveId?: string;

  /**  */
  moveHashId?: string;

  /**  */
  inventoryId?: string;

  /**  */
  inventoryName?: string;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  moveStatus?: MOVE_STATUS;

  /**  */
  moveCode?: string;

  /**  */
  moveDate?: Date;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountValue?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxDiscountPercent?: number;

  /**  */
  taxDiscountCode?: string;

  /**  */
  taxDiscountName?: string;

  /**  */
  taxDiscountAmount?: number;

  /**  */
  discountAmountCaculate?: number;

  /**  */
  discountAmountDisplay?: number;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  totalAmountRound?: number;

  /**  */
  paymentAmount?: number;

  /**  */
  debtAmount?: number;

  /**  */
  paymentStatus?: number;

  /**  */
  paymentMethod?: number;

  /**  */
  paymentMethodName?: string;

  /**  */
  totalQty?: number;

  /**  */
  invoiceId?: string;

  /**  */
  invoiceCode?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  note?: string;

  /**  */
  partnerId?: string;

  /**  */
  partnerName?: string;

  /**  */
  partnerType?: number;

  /**  */
  relatedMoveId?: string;

  /**  */
  relatedMoveIdHash?: string;

  /**  */
  relatedMoveCode?: string;

  /**  */
  relatedMoveDate?: Date;

  /**  */
  relatedMoveType?: MOVE_TYPE;

  /**  */
  relatedMoveStatus?: MOVE_STATUS;

  /**  */
  totalReturnQty?: number;

  /**  */
  cancelReason?: string;

  /**  */
  creatorId?: string;

  /**  */
  partnerInvoiceCode?: string;

  /**  */
  partnerInvoiceDate?: Date;

  /**  */
  debtDueDate?: Date;
}

export interface ImportStockTicketDto {
  /**  */
  productInTicket?: ProductMoveStockDto[];

  /**  */
  moveDto?: ImportStockMoveDto;

  /**  */
  items?: ImportStockMoveDetailDto[];

  /**  */
  moveDateOld?: Date;

  /**  */
  isDraft?: boolean;

  /**  */
  totalCostPriceInMove?: number;
}

export interface InfoPrivateBookingDto {
  /**  */
  playDate?: Date;

  /**  */
  bookingId?: string;

  /**  */
  bookingTeeTimeId?: string;

  /**  */
  bookingPlayerId?: string;

  /**  */
  bookingGroupId?: string;

  /**  */
  partnerId?: string;

  /**  */
  gameType?: GameTypeEnum;

  /**  */
  isGuest?: boolean;

  /**  */
  guestName?: string;

  /**  */
  isDefaultPlayer?: boolean;

  /**  */
  phone?: string;

  /**  */
  partnerName?: string;

  /**  */
  checkInTime?: Date;

  /**  */
  checkoutTime?: Date;

  /**  */
  checkinStatus?: CheckinStatusEnum;

  /**  */
  bookingStatus?: BookingStatusEnum;

  /**  */
  debtAmount?: number;

  /**  */
  accessCardId?: string;

  /**  */
  cardType?: AccessCardTypeEnum;

  /**  */
  cardCode?: string;

  /**  */
  memberAccessCardId?: string;

  /**  */
  memberAccessCardStartDate?: Date;

  /**  */
  memberAccessCardCode?: string;

  /**  */
  groupDiscountPercent?: number;

  /**  */
  viewInvoice?: InfoPrivateInvoiceSimple[];

  /**  */
  tempInvoiceId?: string;
}

export interface InfoPrivateInvoiceSimple {
  /**  */
  qty?: string;

  /**  */
  invoiceId?: string;

  /**  */
  invoiceDetailId?: string;

  /**  */
  productId?: string;

  /**  */
  productName?: string;

  /**  */
  totalAmount?: number;

  /**  */
  paymentStatus?: PAYMENT_STATUS;
}

export interface InformationMedicineCausingADRModel {
  /**  */
  suspectedDrugs?: SuspectedDrug[];

  /**  */
  diagnosisAndTreatmentIndication?: string;

  /**  */
  isDrugReused?: EnumReuseDrugs;
}

export interface InitEmployeeTimesheetFromTimekeepingInput {
  /**  */
  id?: string;

  /**  */
  month?: number;

  /**  */
  year?: number;
}

export interface InsertProductCommand {
  /**  */
  listProduct?: ProductImportDto[];
}

export interface InsertProductKiotVietCommand {
  /**  */
  listProduct?: ProductImportKiotVietDto[];

  /**  */
  isProductChain?: boolean;
}

export interface InsuranceDetailDto {
  /**  */
  type?: REASON_TYPE;

  /**  */
  totalAmount?: number;

  /**  */
  paymentAmount?: number;

  /**  */
  payingAmount?: number;

  /**  */
  notes?: string;

  /**  */
  partnerName?: string;
}

export interface IntegrateDrugModel {
  /**  */
  nationalDrugCode?: string;

  /**  */
  facilityCode?: string;

  /**  */
  drugName?: string;

  /**  */
  registrationNumber?: string;

  /**  */
  mainIngredient?: string;

  /**  */
  concentration?: string;

  /**  */
  packagingSpecifications?: string;

  /**  */
  manufacturer?: string;

  /**  */
  countryOfManufacturer?: string;

  /**  */
  unitName?: string;

  /**  */
  dosageForm?: string;

  /**  */
  packagingUnitForeign?: string;

  /**  */
  declaredPrice?: string;

  /**  */
  declarationDate?: string;

  /**  */
  wholesalePrice?: string;

  /**  */
  importer?: string;
}

export interface IntegrateInvoiceModel {
  /**  */
  invoiceCode?: string;

  /**  */
  facilityCode?: string;

  /**  */
  nationalDrugCode?: string;

  /**  */
  invoiceDate?: string;

  /**  */
  sellerName?: string;

  /**  */
  customerName?: string;

  /**  */
  errorMessage?: string;

  /**  */
  details?: SaleInvoiceDetailModel[];
}

export interface IntegrateMoveExportModel {
  /**  */
  moveCode?: string;

  /**  */
  facilityCode?: string;

  /**  */
  facilityName?: string;

  /**  */
  moveDate?: string;

  /**  */
  moveType?: number;

  /**  */
  notes?: string;

  /**  */
  receiveFacilityName?: string;

  /**  */
  errorMessage?: string;

  /**  */
  details?: MoveExportDetailModel[];
}

export interface IntegrateMoveImportModel {
  /**  */
  moveCode?: string;

  /**  */
  facilityCode?: string;

  /**  */
  moveDate?: string;

  /**  */
  moveType?: number;

  /**  */
  notes?: string;

  /**  */
  supplierName?: string;

  /**  */
  errorMessage?: string;

  /**  */
  details?: MoveImportDetailModel[];
}

export interface InterfaceMethodApiDescriptionModel {
  /**  */
  name?: string;

  /**  */
  parametersOnMethod?: MethodParameterApiDescriptionModel[];

  /**  */
  returnValue?: ReturnValueApiDescriptionModel;
}

export interface InventoryLineSyncDataDto {
  /**  */
  id?: string;

  /**  */
  isDeleted?: boolean;

  /**  */
  lastModificationTime?: Date;

  /**  */
  inventoryId?: string;

  /**  */
  stockInventoryRootDetailId?: string;

  /**  */
  stockInventoryLineId?: string;

  /**  */
  productId?: string;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  qty?: number;

  /**  */
  costPrice?: number;
}

export interface InventoryLineSyncResponseDto {
  /**  */
  newLastModificationTime?: Date;

  /**  */
  lines?: InventoryLineSyncDataDto[];
}

export interface InvoiceReturnDetailSampleDto {
  /**  */
  invoiceDate?: Date;

  /**  */
  invoiceCode?: string;

  /**  */
  productId?: string;

  /**  */
  productName?: string;

  /**  */
  productUnitId?: string;

  /**  */
  qty?: string;
}

export interface InvoiceReturnDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  invoiceCode?: string;

  /**  */
  partnerId?: string;

  /**  */
  creatorEmployeeId?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  status?: SaleInvoiceStatus;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  discountType?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxDiscountPercent?: number;

  /**  */
  taxDiscountCode?: string;

  /**  */
  taxDiscountAmount?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  totalAmountRound?: number;

  /**  */
  paymentAmount?: number;

  /**  */
  debtAmount?: number;

  /**  */
  paymentMethod?: number;

  /**  */
  paymentBankCode?: string;

  /**  */
  paymentBankAccountCode?: string;

  /**  */
  paymentBankAccountName?: string;

  /**  */
  paymentBankAccountVirtualName?: string;

  /**  */
  paymentStatus?: number;

  /**  */
  notes?: string;

  /**  */
  inventoryId?: string;

  /**  */
  canceledEmployeeId?: string;

  /**  */
  canceledDate?: Date;

  /**  */
  canceledReason?: string;

  /**  */
  totalQty?: number;

  /**  */
  totalReturnQty?: number;

  /**  */
  salePartnerId?: string;

  /**  */
  einvoiceNo?: string;

  /**  */
  einvoiceIssuedDate?: Date;

  /**  */
  einvoiceCanceledDate?: Date;

  /**  */
  einvoiceReservationCode?: string;

  /**  */
  einvoiceStatus?: EinvoiceStatus;

  /**  */
  einvoiceTransactionID?: string;

  /**  */
  eInvoiceBuyerName?: string;

  /**  */
  eInvoiceCompany?: string;

  /**  */
  eInvoiceTaxCode?: string;

  /**  */
  eInvoiceBuyerAddress?: string;

  /**  */
  eInvoiceBuyerPhone?: string;

  /**  */
  eInvoiceBuyerEmail?: string;

  /**  */
  einvoiceTransactionMerge?: boolean;

  /**  */
  eInvoiceSeri?: string;

  /**  */
  eInvoiceType?: string;

  /**  */
  einvoiceTaxAuthorityCode?: string;

  /**  */
  einvoiceNumber?: string;

  /**  */
  eInvoiceId?: string;

  /**  */
  isActived?: boolean;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  lotInventoryJson?: string;

  /**  */
  relatedInvoiceId?: string;

  /**  */
  relatedInvoiceCode?: string;

  /**  */
  totalQtyConvert?: number;

  /**  */
  totalReturnQtyConvert?: number;

  /**  */
  paymentMethodJson?: string;

  /**  */
  shopBankAccountId?: string;

  /**  */
  saleChannelTypeId?: CHANNEL_TYPE;

  /**  */
  prescriptionType?: PrescriptionTypeEnum;

  /**  */
  objectId?: string;

  /**  */
  objectType?: InvoiceObjectTypeEnum;

  /**  */
  saleChannelTypeName?: string;

  /**  */
  saleInvoiceDetails?: SaleInvoiceDetailDto[];

  /**  */
  prescriptionInfo?: SalesPrescriptionDto;

  /**  */
  partnerName?: string;

  /**  */
  customerPhone?: string;

  /**  */
  customerTaxCode?: string;

  /**  */
  taxCode?: string;

  /**  */
  email?: string;

  /**  */
  customerAddress?: string;

  /**  */
  customerState?: string;

  /**  */
  customerDistinct?: string;

  /**  */
  customerWard?: string;

  /**  */
  creatorEmployeeName?: string;

  /**  */
  creatorEmployeePhone?: string;

  /**  */
  creatorSalePartnerName?: string;

  /**  */
  invoiceTimeStr?: string;

  /**  */
  inventoryName?: string;

  /**  */
  relatedInvoiceIdHash?: string;

  /**  */
  paymentMethodObjDto?: PaymentMethodObjDto[];

  /**  */
  partnerCode?: string;

  /**  */
  parnerType?: PARTNER_TYPE;

  /**  */
  isShowInfoExportEInvoice?: boolean;

  /**  */
  deviceTokenId?: string;

  /**  */
  paymentMethodName?: string;

  /**  */
  shopId?: number;

  /**  */
  shopName?: string;

  /**  */
  orderId?: string;

  /**  */
  creatorId?: string;
}

export interface InvoiceStatusPagedCountDto {
  /**  */
  status?: number;

  /**  */
  totalCount?: number;
}

export interface IssueRfidDto {
  /**  */
  accessCardId?: string;

  /**  */
  bookingPlayerId?: string;

  /**  */
  bagTagNo?: string;
}

export interface JwtDto {
  /**  */
  accessToken?: string;

  /**  */
  expireInSeconds?: number;

  /**  */
  refreshToken?: string;
}

export interface KeyValuePairOfStringIEnumerableOfString {
  /**  */
  key?: string;

  /**  */
  value?: string[];
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

export interface ListOrderDetailDto {
  /**  */
  id?: string;

  /**  */
  orderId?: string;

  /**  */
  productId?: string;

  /**  */
  productUnitId?: string;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  qty?: number;

  /**  */
  qtyConvert?: number;

  /**  */
  convertRate?: number;

  /**  */
  price?: number;

  /**  */
  discountType?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  notes?: string;

  /**  */
  status?: number;

  /**  */
  inventoryLineDetailId?: string;

  /**  */
  productName?: string;

  /**  */
  description?: string;

  /**  */
  inventoryCurrentQty?: number;

  /**  */
  productPriceWithTax?: number;

  /**  */
  productPrice?: number;

  /**  */
  subTotalAmount?: number;

  /**  */
  isProductPriceIncludeTax?: boolean;

  /**  */
  priceListId?: boolean;

  /**  */
  units?: ComboOptionDto[];
}

export interface ListStatusProductInInventoryPaggingInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  listType?: ProductInventoryStatus;
}

export interface LocalizableStringDto {
  /**  */
  name?: string;

  /**  */
  resource?: string;
}

export interface LogApiDto {
  /**  */
  id?: string;

  /**  */
  type?: LOG_TYPE;

  /**  */
  url?: string;

  /**  */
  requestValue?: string;

  /**  */
  responeValue?: string;

  /**  */
  notes?: string;

  /**  */
  referenceId?: string;

  /**  */
  referenceCode?: string;

  /**  */
  status?: LOG_STATUS;

  /**  */
  partnerName?: string;

  /**  */
  totalAmount?: number;
}

export interface LoginPasswordlessQuery {
  /**  */
  id?: string;
}

export interface LoginQuery {
  /**  */
  userName?: string;

  /**  */
  password?: string;

  /**  */
  fireBaseToken?: string;

  /**  */
  platform?: string;
}

export interface LotInventoryDto {
  /**  */
  lotNumberId?: string;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  qty?: number;

  /**  */
  qtyConvert?: number;

  /**  */
  convertRate?: number;
}

export interface MedicationPeriod {
  /**  */
  period?: string;

  /**  */
  startDate?: string;

  /**  */
  endDate?: string;
}

export interface MemberInfoByCardBookingOutputDto {
  /**  */
  id?: string;

  /**  */
  bookingGroupId?: string;

  /**  */
  partnerId?: string;

  /**  */
  bookingDate?: Date;

  /**  */
  note?: string;

  /**  */
  totalPlayers?: number;

  /**  */
  coursePlan?: string;

  /**  */
  isSharedFlight?: boolean;

  /**  */
  bookingSource?: BookingSourceEnum;

  /**  */
  status?: BookingStatusEnum;

  /**  */
  gameType?: GameTypeEnum;

  /**  */
  memberGustOf?: string;

  /**  */
  salesPersonId?: string;

  /**  */
  requestedBy?: string;

  /**  */
  contactNo?: string;

  /**  */
  refrenceNo?: string;

  /**  */
  bagTagNo?: string;

  /**  */
  noOfGallery?: number;

  /**  */
  noOfBuggy?: number;

  /**  */
  noOfCaddy?: number;

  /**  */
  requirePrepayment?: boolean;

  /**  */
  isConfirmed?: boolean;

  /**  */
  comfirmedDate?: Date;

  /**  */
  teeTime?: TimeSpan;

  /**  */
  courseId?: string;

  /**  */
  courseName?: string;

  /**  */
  bookingTeeTimeId?: string;

  /**  */
  bookingPlayerId?: string;

  /**  */
  checkInTime?: Date;

  /**  */
  checkOutTime?: Date;

  /**  */
  tempInvoiceId?: string;

  /**  */
  checkInStatus?: CheckinStatusEnum;
}

export interface MemberInfoByCardInputDto {
  /**  */
  checkInTime?: Date;

  /**  */
  cardCode?: string;
}

export interface MemberInfoByCardMemberOutputDto {
  /**  */
  accessCardId?: string;

  /**  */
  uid?: string;

  /**  */
  code?: string;

  /**  */
  startDate?: Date;

  /**  */
  endDate?: Date;

  /**  */
  name?: string;

  /**  */
  gender?: GENDER;

  /**  */
  phone?: string;

  /**  */
  partnerId?: string;

  /**  */
  partnerName?: string;

  /**  */
  accessStatus?: AccessCardStatusEnum;
}

export interface MemberInfoByCardOutputDto {
  /**  */
  memberInfo?: MemberInfoByCardMemberOutputDto;

  /**  */
  bookingInfo?: MemberInfoByCardBookingOutputDto;
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

export interface MisaInvoiceTemplateData {
  /**  */
  check?: boolean;

  /**  */
  ipTemplateID?: string;

  /**  */
  companyID?: number;

  /**  */
  templateName?: string;

  /**  */
  invTemplateNo?: string;

  /**  */
  invSeries?: string;

  /**  */
  orgInvSeries?: string;

  /**  */
  templateType?: number;

  /**  */
  invoiceType?: number;

  /**  */
  businessAreas?: number;

  /**  */
  sortOrder?: number;

  /**  */
  signedDate?: Date;

  /**  */
  createdDate?: Date;

  /**  */
  createdBy?: string;

  /**  */
  modifiedDate?: Date;

  /**  */
  modifiedBy?: string;

  /**  */
  inactive?: boolean;

  /**  */
  templateContent?: string;

  /**  */
  defaultTemplateID?: string;

  /**  */
  isCustomTemplate?: boolean;

  /**  */
  isInheritFromOldTemplate?: boolean;

  /**  */
  xsltVersion?: number;

  /**  */
  isPublished?: boolean;

  /**  */
  isSendSummary?: boolean;

  /**  */
  isPetrol?: boolean;
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

export interface MoveExportDetailModel {
  /**  */
  drugCode?: string;

  /**  */
  drugName?: string;

  /**  */
  lotNumber?: string;

  /**  */
  productionDate?: string;

  /**  */
  expiryDate?: string;

  /**  */
  registrationNumber?: string;

  /**  */
  qty?: string;

  /**  */
  qtyConvert?: number;

  /**  */
  price?: number;

  /**  */
  productType?: number;

  /**  */
  unitName?: string;

  /**  */
  productCode?: string;

  /**  */
  totalAmount?: number;
}

export interface MoveImportDetailModel {
  /**  */
  drugCode?: string;

  /**  */
  drugName?: string;

  /**  */
  lotNumber?: string;

  /**  */
  productionDate?: string;

  /**  */
  expiryDate?: string;

  /**  */
  registrationNumber?: string;

  /**  */
  qty?: string;

  /**  */
  qtyConvert?: number;

  /**  */
  price?: number;

  /**  */
  productType?: number;

  /**  */
  unitName?: string;

  /**  */
  productCode?: string;

  /**  */
  totalAmount?: number;
}

export interface MoveReasonTypeDto {
  /**  */
  id?: string;

  /**  */
  reasonTypeName?: string;

  /**  */
  reasonTypeEnumId?: REASON_TYPE;

  /**  */
  reasonMoveType?: ACCOUNT_MOVE_TYPE;

  /**  */
  partnerType?: PARTNER_TYPE;

  /**  */
  isReasonTypeSystem?: boolean;

  /**  */
  isActived?: boolean;

  /**  */
  isEnableEdit?: boolean;
}

export interface MoveReasonTypePagedRequestDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  tenantId?: string;

  /**  */
  reasonTypeEnumId?: number;

  /**  */
  lstReasonTypeEnumId?: number[];

  /**  */
  reasonMoveType?: number;

  /**  */
  partnerType?: number;
}

export interface MoveTeeTimeInputDto {
  /**  */
  from?: MoveTeeTimeItemInputDto[];

  /**  */
  to?: MoveTeeTimeItemInputDto;
}

export interface MoveTeeTimeItemInputDto {
  /**  */
  courseId?: string;

  /**  */
  teeTimeId?: string;

  /**  */
  playDate?: Date;

  /**  */
  startTime?: TimeSpan;

  /**  */
  bookingTeeTimeId?: string;

  /**  */
  playerNo?: number;

  /**  */
  bookingId?: string;

  /**  */
  bookingPlayerId?: string;
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

export interface NationalPharmacyIntegrationCountDto {
  /**  */
  nationalPharmacyStatus?: IntegrateStatusTypeEnum;

  /**  */
  totalCount?: string;
}

export interface NationalPharmacyIntegrationDto {
  /**  */
  checked?: boolean;

  /**  */
  id?: string;

  /**  */
  tenantId?: string;

  /**  */
  nationalDrugCode?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  nationalPharmacyType?: number;

  /**  */
  nationalPharmacyDate?: Date;

  /**  */
  isEnableNationalPharmacy?: boolean;

  /**  */
  registrationNumber?: string;

  /**  */
  mainIngredient?: string;

  /**  */
  concentration?: string;

  /**  */
  packagingSpecifications?: string;

  /**  */
  manufacturer?: string;

  /**  */
  countryOfManufacturer?: string;

  /**  */
  unitName?: string;

  /**  */
  status?: number;

  /**  */
  creatorTicketName?: string;

  /**  */
  moveDate?: Date;

  /**  */
  errorMessage?: string;

  /**  */
  attributeJson?: string;
}

export interface NationalPharmacyIntegrationPaging {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  nationalPharmacyType?: number;

  /**  */
  nationalPharmacyStatus?: IntegrateStatusTypeEnum;
}

export interface NationalPrescriptionOutputDto {
  /**  */
  prescriptionId?: string;

  /**  */
  patientName?: string;

  /**  */
  dateOfBirth?: string;

  /**  */
  guardian?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  prescriptionType?: string;

  /**  */
  treatmentMethod?: string;

  /**  */
  address?: string;

  /**  */
  gender?: string;

  /**  */
  genderName?: string;

  /**  */
  weight?: number;

  /**  */
  healthInsuranceCard?: string;

  /**  */
  medicalIdentification?: string;

  /**  */
  notes?: string;

  /**  */
  doctorAdvice?: string;

  /**  */
  doctorName?: string;

  /**  */
  medicalFacility?: string;

  /**  */
  medicalFacilityInsuranceCode?: string;

  /**  */
  medicalFacilityPhoneNumber?: string;

  /**  */
  dateIssued?: string;

  /**  */
  dispensedPrescription?: string;

  /**  */
  prescriptionDetails?: PrescriptionDetail[];

  /**  */
  medicationPeriods?: MedicationPeriod[];

  /**  */
  diagnoses?: Diagnosis[];

  /**  */
  conclusion?: string;
}

export interface NewUserBlockDetailInputDto {
  /**  */
  courseId?: string;

  /**  */
  startTime?: TimeSpan;

  /**  */
  playDate?: Date;

  /**  */
  playerNo?: number;
}

export interface NewUserBlockInputDto {
  /**  */
  blockType?: GolfUserBlockTypeEnum;

  /**  */
  note?: string;

  /**  */
  details?: NewUserBlockDetailInputDto[];
}

export interface NotificationDto {
  /**  */
  id?: string;

  /**  */
  creationTime?: Date;

  /**  */
  creatorId?: string;

  /**  */
  lastModificationTime?: Date;

  /**  */
  lastModifierId?: string;

  /**  */
  notificationName?: string;

  /**  */
  title?: string;

  /**  */
  body?: string;

  /**  */
  data?: string;
}

export interface NotificationUserDto {
  /**  */
  id?: string;

  /**  */
  creationTime?: Date;

  /**  */
  creatorId?: string;

  /**  */
  lastModificationTime?: Date;

  /**  */
  lastModifierId?: string;

  /**  */
  userId?: string;

  /**  */
  state?: boolean;

  /**  */
  notificationId?: string;

  /**  */
  content?: NotificationDto;
}

export interface NotificationUserPageListOutputDto {
  /**  */
  items?: NotificationUserDto[];

  /**  */
  totalCount?: string;

  /**  */
  totalNotRead?: number;
}

export interface ObjectExtensionsDto {
  /**  */
  modules?: object;

  /**  */
  enums?: object;
}

export interface OrdColumnFilter {
  /**  */
  isActived?: boolean[];
}

export interface OrdExportPaged {
  /**  */
  title?: string;

  /**  */
  columnNames?: string[];

  /**  */
  otherFields?: object;
}

export interface OrdGolfCourseMaintenanceLogPagedRequestDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  dateRange?: DateRangeDto;

  /**  */
  courseId?: string;
}

export interface OrdGolfCoursePagedRequestDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  currentStatus?: FieldStatusEnum;

  /**  */
  courseType?: CourseTypeEnum;

  /**  */
  date?: Date;
}

export interface OrdGolfLockerHistoryPagedRequestDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  date?: Date;

  /**  */
  lockerId?: string;
}

export interface OrdGolfLockerPagedRequestDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  date?: Date;

  /**  */
  lockerStatus?: GolfLockerStatusEnum;

  /**  */
  locationId?: string;
}

export interface OrdGolfProductPagedInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  productCategoryId?: number;

  /**  */
  productGroupIds?: string[];
}

export interface OrdGolfTeeTimeConfigPagedRequestDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  courseId?: string;

  /**  */
  date?: Date;
}

export interface OrdPageRequestGolfHistoryBookingCourse {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  partnerId?: string;
}

export interface OrdPagedRequestAccessCardHistory {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  date?: Date;

  /**  */
  accessCardId?: string;
}

export interface OrdPagedRequestDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;
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

export interface OrderByIdDto {
  /**  */
  id?: string;

  /**  */
  orderCode?: string;

  /**  */
  partnerId?: string;

  /**  */
  partnerName?: string;

  /**  */
  orderDate?: Date;

  /**  */
  status?: ORDER_STATUS;

  /**  */
  discountType?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  depositAmount?: number;

  /**  */
  paymentAmount?: number;

  /**  */
  debtAmount?: number;

  /**  */
  deliveryAmount?: number;

  /**  */
  paymentMethod?: PAYMENT_METHOD;

  /**  */
  paymentStatus?: PAYMENT_STATUS;

  /**  */
  shopBankAccountId?: string;

  /**  */
  notes?: string;

  /**  */
  canceledEmployeeId?: string;

  /**  */
  saleInvoiceId?: string;

  /**  */
  orderChannelTypeId?: number;

  /**  */
  deliveryExpectedDate?: Date;

  /**  */
  printingCount?: number;

  /**  */
  codAmount?: number;

  /**  */
  isUsingCOD?: boolean;

  /**  */
  internalNotes?: string;

  /**  */
  tableId?: string;

  /**  */
  tableName?: string;

  /**  */
  numberOfCustomer?: number;

  /**  */
  details?: ListOrderDetailDto[];

  /**  */
  checked?: boolean;
}

export interface OrderGetPagedDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  orderCode?: string;

  /**  */
  partnerId?: string;

  /**  */
  partnerName?: string;

  /**  */
  orderDate?: Date;

  /**  */
  orderDateStr?: string;

  /**  */
  status?: ORDER_STATUS;

  /**  */
  statusStr?: string;

  /**  */
  tableId?: string;

  /**  */
  tableName?: string;

  /**  */
  ordersCount?: number;

  /**  */
  notes?: string;
}

export interface OrderGetPagedRequest {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  moveDateRange?: DateRangeDto;

  /**  */
  tableId?: string;
}

export interface OrderStockMoveDetailDto {
  /**  */
  id?: string;

  /**  */
  stockOrderId?: string;

  /**  */
  parentId?: string;

  /**  */
  productId?: string;

  /**  */
  productUnitId?: string;

  /**  */
  qty?: number;

  /**  */
  qtyConvert?: number;

  /**  */
  convertRate?: number;

  /**  */
  price?: number;

  /**  */
  costPrice?: number;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  discountType?: number;

  /**  */
  discountValue?: number;

  /**  */
  discountAmount?: number;

  /**  */
  discountAmountAllocation?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxAmount?: number;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  unitName?: string;

  /**  */
  productDetail?: ProductStockViewDto;

  /**  */
  productHashId?: string;
}

export interface OrderStockMoveDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  supplierId?: number;

  /**  */
  orderDate?: Date;

  /**  */
  desiredDeliveryDate?: Date;

  /**  */
  orderCode?: string;

  /**  */
  note?: string;

  /**  */
  totalAmount?: number;

  /**  */
  approvalTotalAmount?: number;

  /**  */
  moveStatus?: ORDER_STATUS;

  /**  */
  paymentDate?: Date;

  /**  */
  paymentStatus?: number;

  /**  */
  paymentMethod?: PAYMENT_METHOD;

  /**  */
  moveId?: string;

  /**  */
  shopId?: number;

  /**  */
  creatorId?: string;

  /**  */
  reviewerId?: string;

  /**  */
  creationUserName?: string;
}

export interface OrderStockTicketDto {
  /**  */
  isDraft?: boolean;

  /**  */
  items?: OrderStockMoveDetailDto[];

  /**  */
  moveDto?: OrderStockMoveDto;
}

export interface PackageDto {
  /**  */
  id?: string;

  /**  */
  packageRegistrationCode?: string;

  /**  */
  packageRegistrationName?: string;

  /**  */
  chargeTime?: number;

  /**  */
  freeTime?: number;

  /**  */
  totalTime?: number;

  /**  */
  timeUnit?: TimeUnit;

  /**  */
  notes?: string;

  /**  */
  price?: number;

  /**  */
  packageAccountNumber?: number;

  /**  */
  packageShopNumber?: number;

  /**  */
  packageRegistrationType?: ShopPackageRegistrationType;

  /**  */
  discountAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  isActived?: boolean;
}

export interface PagedBankBookResultDto {
  /**  */
  items?: BusinessHouseHoldBankBookDetailDto[];

  /**  */
  totalCount?: string;

  /**  */
  summaryData?: BusinessHouseHoldBankBookDto;
}

export interface PagedCashBookResultDto {
  /**  */
  items?: BusinessHouseHoldCashBookDetailDto[];

  /**  */
  totalCount?: string;

  /**  */
  summaryData?: BusinessHouseHoldCashBookDto;
}

export interface PagedEmployeeSalaryResultDto {
  /**  */
  items?: EmployeeSalaryPaymentBookDetailDto[];

  /**  */
  totalCount?: string;

  /**  */
  summaryData?: EmployeeSalaryPaymentBookSummaryDto;
}

export interface PagedGoferGroupDetailDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  groupId?: string;
}

export interface PagedGolfPartnerAccessCardDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  partnerId?: string;
}

export interface PagedProductionBusinessCostResultDto {
  /**  */
  items?: ProductionBusinessCostBookDetailDto[];

  /**  */
  totalCount?: string;

  /**  */
  summaryData?: ProductionBusinessCostSummaryDto[];
}

export interface PagedResultDtoOfAccessCardDto {
  /**  */
  items?: AccessCardDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfAccessCardHistoryDto {
  /**  */
  items?: AccessCardHistoryDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfAccountMoveDto {
  /**  */
  items?: AccountMoveDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfAllowanceDto {
  /**  */
  items?: AllowanceDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfBarcodeProductItemDto {
  /**  */
  items?: BarcodeProductItemDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfCaddyWorkScheduleDto {
  /**  */
  items?: CaddyWorkScheduleDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfCleaningTaskGroupByDateParamDto {
  /**  */
  items?: CleaningTaskGroupByDateParamDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfCountryDto {
  /**  */
  items?: CountryDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfCountryStateDto {
  /**  */
  items?: CountryStateDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfCustomerDebtReportDto {
  /**  */
  items?: CustomerDebtReportDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfCustomerRevenueReportDetailDto {
  /**  */
  items?: CustomerRevenueReportDetailDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfCustomerRevenueReportDto {
  /**  */
  items?: CustomerRevenueReportDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfDailySummaryIncomeReportOutputDto {
  /**  */
  items?: DailySummaryIncomeReportOutputDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfDailySummaryProductReportOutputDto {
  /**  */
  items?: DailySummaryProductReportOutputDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfDailySummaryShiftRevenueOutputDto {
  /**  */
  items?: DailySummaryShiftRevenueOutputDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfDataWarningProductStatusDto {
  /**  */
  items?: DataWarningProductStatusDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfDictionaryDto {
  /**  */
  items?: DictionaryDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfDistrictDto {
  /**  */
  items?: DistrictDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfDoctorProfitByBillReportDto {
  /**  */
  items?: DoctorProfitByBillReportDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfDoctorProfitByMoneyReportDto {
  /**  */
  items?: DoctorProfitByMoneyReportDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfDoctorProfitByProductReportDto {
  /**  */
  items?: DoctorProfitByProductReportDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfDoctorRevenueByBillReportDto {
  /**  */
  items?: DoctorRevenueByBillReportDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfDoctorRevenueByMoneyReportDto {
  /**  */
  items?: DoctorRevenueByMoneyReportDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfDoctorRevenueByProductReportDto {
  /**  */
  items?: DoctorRevenueByProductReportDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfDrugRecallDto {
  /**  */
  items?: DrugRecallDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfEmployeeDto {
  /**  */
  items?: EmployeeDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfEmployeePayrollDto {
  /**  */
  items?: EmployeePayrollDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfEmployeeProductReportDto {
  /**  */
  items?: EmployeeProductReportDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfEmployeeRevenueReportDetailDto {
  /**  */
  items?: EmployeeRevenueReportDetailDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfEmployeeRevenueReportDto {
  /**  */
  items?: EmployeeRevenueReportDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfEmployeeTimekeepingDto {
  /**  */
  items?: EmployeeTimekeepingDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfEmployeeTimesheetDto {
  /**  */
  items?: EmployeeTimesheetDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfFnbAreaDto {
  /**  */
  items?: FnbAreaDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfFnbProcessingAreaDto {
  /**  */
  items?: FnbProcessingAreaDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfFnbReservationDto {
  /**  */
  items?: FnbReservationDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfFnbTableDto {
  /**  */
  items?: FnbTableDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfFoodGridDto {
  /**  */
  items?: FoodGridDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfGdpOrderStockMoveDto {
  /**  */
  items?: GdpOrderStockMoveDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfGolfAccessCardColorDto {
  /**  */
  items?: GolfAccessCardColorDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfGolfAreaDto {
  /**  */
  items?: GolfAreaDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfGolfBookingGroupDto {
  /**  */
  items?: GolfBookingGroupDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfGolfBuggyGroupDto {
  /**  */
  items?: GolfBuggyGroupDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfGolfBuggyOutPutDto {
  /**  */
  items?: GolfBuggyOutPutDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfGolfCourseDto {
  /**  */
  items?: GolfCourseDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfGolfCourseMaintenanceLogDto {
  /**  */
  items?: GolfCourseMaintenanceLogDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfGolfCustomerDto {
  /**  */
  items?: GolfCustomerDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfGolfGolferGroupDetailDto {
  /**  */
  items?: GolfGolferGroupDetailDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfGolfHistoryBookingCourseOfCustomer {
  /**  */
  items?: GolfHistoryBookingCourseOfCustomer[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfGolfHistoryUsingServicesOfCustomer {
  /**  */
  items?: GolfHistoryUsingServicesOfCustomer[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfGolfLockerChangeHistoryDto {
  /**  */
  items?: GolfLockerChangeHistoryDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfGolfLockerGroupDto {
  /**  */
  items?: GolfLockerGroupDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfGolfLockerMaintenanceLogDto {
  /**  */
  items?: GolfLockerMaintenanceLogDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfGolfLockerPageDto {
  /**  */
  items?: GolfLockerPageDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfGolfProductDto {
  /**  */
  items?: GolfProductDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfGolfProductGroupDto {
  /**  */
  items?: GolfProductGroupDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfGolfReasonDto {
  /**  */
  items?: GolfReasonDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfGolfTeeTimeConfigDto {
  /**  */
  items?: GolfTeeTimeConfigDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfGroupByDateDto {
  /**  */
  items?: GroupByDateDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfInvoiceReturnDto {
  /**  */
  items?: InvoiceReturnDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfLogApiDto {
  /**  */
  items?: LogApiDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfMoveReasonTypeDto {
  /**  */
  items?: MoveReasonTypeDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfNationalPharmacyIntegrationDto {
  /**  */
  items?: NationalPharmacyIntegrationDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfOrderGetPagedDto {
  /**  */
  items?: OrderGetPagedDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfOrderStockMoveDto {
  /**  */
  items?: OrderStockMoveDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfPackageDto {
  /**  */
  items?: PackageDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfPartnerAccessCardDto {
  /**  */
  items?: PartnerAccessCardDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfPartnerDto {
  /**  */
  items?: PartnerDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfPartnerGroupDto {
  /**  */
  items?: PartnerGroupDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfPartnerLoyaltyTierHistoryDto {
  /**  */
  items?: PartnerLoyaltyTierHistoryDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfPartnerLoyaltyTransactionDto {
  /**  */
  items?: PartnerLoyaltyTransactionDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfPartnerTransactionDto {
  /**  */
  items?: PartnerTransactionDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfPharmacyAdverseReactionDto {
  /**  */
  items?: PharmacyAdverseReactionDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfPharmacyComplaintLogDto {
  /**  */
  items?: PharmacyComplaintLogDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfPharmacyLogReportControlledDrugLossOutputDto {
  /**  */
  items?: PharmacyLogReportControlledDrugLossOutputDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfPharmacyLogReportExpirationDateTrackingOutputDto {
  /**  */
  items?: PharmacyLogReportExpirationDateTrackingOutputDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfPharmacyLogReportMedicationSalesOutputDto {
  /**  */
  items?: PharmacyLogReportMedicationSalesOutputDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfPharmacyLogReportNonPrescriptionDrugSalesOutputDto {
  /**  */
  items?: PharmacyLogReportNonPrescriptionDrugSalesOutputDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfPharmacyLogReportPatientInformationOutputDto {
  /**  */
  items?: PharmacyLogReportPatientInformationOutputDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfPharmacyLogReportPrescriptionDrugSalesOutputDto {
  /**  */
  items?: PharmacyLogReportPrescriptionDrugSalesOutputDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfPharmacyLogReportQualityInspectionOutputDto {
  /**  */
  items?: PharmacyLogReportQualityInspectionOutputDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfPrescriptionHistoryDto {
  /**  */
  items?: PrescriptionHistoryDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfProductBookReportDto {
  /**  */
  items?: ProductBookReportDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfProductDetailDto {
  /**  */
  items?: ProductDetailDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfProductDto {
  /**  */
  items?: ProductDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfProductFromInventoryWithUnitDto {
  /**  */
  items?: ProductFromInventoryWithUnitDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfProductGroupDto {
  /**  */
  items?: ProductGroupDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfProductGroupOrderDto {
  /**  */
  items?: ProductGroupOrderDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfProductInventoryMoveDto {
  /**  */
  items?: ProductInventoryMoveDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfProductInventoryStockDto {
  /**  */
  items?: ProductInventoryStockDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfProductLotDto {
  /**  */
  items?: ProductLotDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfProductPriceListDetailDto {
  /**  */
  items?: ProductPriceListDetailDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfProductPriceListDto {
  /**  */
  items?: ProductPriceListDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfProductRevenueBookDto {
  /**  */
  items?: ProductRevenueBookDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfProductSearchWithUnitDto {
  /**  */
  items?: ProductSearchWithUnitDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfProductUnitViewDto {
  /**  */
  items?: ProductUnitViewDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfReleaseCardHistoryOutput {
  /**  */
  items?: ReleaseCardHistoryOutput[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfReportTaxDeclarationDto {
  /**  */
  items?: ReportTaxDeclarationDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfRoleDto {
  /**  */
  items?: RoleDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfRoleGetUserPagedDto {
  /**  */
  items?: RoleGetUserPagedDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfSaleInvoiceDto {
  /**  */
  items?: SaleInvoiceDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfSaleOrderDetailDto {
  /**  */
  items?: SaleOrderDetailDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfSaleOrderDto {
  /**  */
  items?: SaleOrderDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfSalesPromotionDto {
  /**  */
  items?: SalesPromotionDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfSellReportProductOutputDto {
  /**  */
  items?: SellReportProductOutputDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfSellReportRevenueDetailOutputDto {
  /**  */
  items?: SellReportRevenueDetailOutputDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfSellReportRevenueOutputDto {
  /**  */
  items?: SellReportRevenueOutputDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfSettingDto {
  /**  */
  items?: SettingDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfShopBankAccountDto {
  /**  */
  items?: ShopBankAccountDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfShopDiscountDto {
  /**  */
  items?: ShopDiscountDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfShopDto {
  /**  */
  items?: ShopDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfShopInfoDto {
  /**  */
  items?: ShopInfoDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfShopPackageRegistrationDto {
  /**  */
  items?: ShopPackageRegistrationDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfShopSettingDto {
  /**  */
  items?: ShopSettingDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfShopTemplateDto {
  /**  */
  items?: ShopTemplateDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfShopTemplatePrinterDto {
  /**  */
  items?: ShopTemplatePrinterDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfShopTemplateWithProductUnitDto {
  /**  */
  items?: ShopTemplateWithProductUnitDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfShopWorkCalendarDetailDto {
  /**  */
  items?: ShopWorkCalendarDetailDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfShopWorkCalendarDto {
  /**  */
  items?: ShopWorkCalendarDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfShopWorkShiftDto {
  /**  */
  items?: ShopWorkShiftDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfStockInventoryDto {
  /**  */
  items?: StockInventoryDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfStockInventoryMoveBaseDto {
  /**  */
  items?: StockInventoryMoveBaseDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfStockMovePagedOutputDto {
  /**  */
  items?: StockMovePagedOutputDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfStockReportCommodityExpiryOutputDto {
  /**  */
  items?: StockReportCommodityExpiryOutputDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfStockReportCommodityPlanOutputDto {
  /**  */
  items?: StockReportCommodityPlanOutputDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfSupplierDebtReportDto {
  /**  */
  items?: SupplierDebtReportDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfSupplierProductReportDto {
  /**  */
  items?: SupplierProductReportDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfTableGridDto {
  /**  */
  items?: TableGridDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfTemplatePrinterGroupDto {
  /**  */
  items?: TemplatePrinterGroupDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfTenantDto {
  /**  */
  items?: TenantDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfUserDto {
  /**  */
  items?: UserDto[];

  /**  */
  totalCount?: string;
}

export interface PagedResultDtoOfWardDto {
  /**  */
  items?: WardDto[];

  /**  */
  totalCount?: string;
}

export interface PagedTaxLiabilityBookResultDto {
  /**  */
  items?: TaxLiabilityBookDetailDto[];

  /**  */
  totalCount?: string;

  /**  */
  summaryData?: TaxLiabilityBookSummaryDto;
}

export interface PagedWorkCalenderDetailRequest {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  workCalendarId?: string;
}

export interface PagingBusinessHouseHoldBankBookInput {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  inventoryId?: string;
}

export interface PagingBusinessHouseHoldCashBookInput {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  inventoryId?: string;
}

export interface PagingCustomerRevenueReportDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  inventoryId?: string;

  /**  */
  productTypeId?: number;
}

export interface PagingDoctorRevenueReportDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  inventoryId?: string;
}

export interface PagingEmployeeSalaryPaymentBookInput {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  inventoryId?: string;
}

export interface PagingEmployeeTimekeepingRequest {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  dateRange?: DateRangeDto;

  /**  */
  employeeId?: string;

  /**  */
  status?: TIMEKEEPING_STATUS;
}

export interface PagingLogApiOfInvoiceRequest {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;
}

export interface PagingPharmacyLogReportMedicationSalesReportDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  inventoryId?: string;
}

export interface PagingPharmacyLogReportNonPrescriptionDrugSalesReportDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  inventoryId?: string;

  /**  */
  filterProduct?: string;

  /**  */
  productTypeId?: string;
}

export interface PagingPharmacyLogReportPatientInformationReportDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  inventoryId?: string;

  /**  */
  productTypeId?: string;
}

export interface PagingPharmacyLogReportPrescriptionDrugSalesReportDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  inventoryId?: string;

  /**  */
  filterProduct?: string;

  /**  */
  productTypeId?: string;
}

export interface PagingPharmacyLogReportQualityInspectionReportDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  inventoryId?: string;

  /**  */
  filterProduct?: string;
}

export interface PagingPharmacyLogtExpirationDateTrackingReportDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  inventoryId?: string;

  /**  */
  year?: number;
}

export interface PagingProductionBusinessCostBookInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  inventoryId?: string;

  /**  */
  reasonTypeIds?: string[];

  /**  */
  selectedInput?: ProductBusinessCostSelectedGroupInput[];
}

export interface PagingReportDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  inventoryId?: string;
}

export interface PagingTaxLiabilityBookInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  inventoryId?: string;

  /**  */
  reasonTypeIds?: string[];
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

export interface PartnerAccessCardDto {
  /**  */
  id?: string;

  /**  */
  accessCardId?: string;

  /**  */
  partnerId?: string;

  /**  */
  startDate?: Date;

  /**  */
  endDate?: Date;

  /**  */
  isReturned?: boolean;

  /**  */
  uid?: string;

  /**  */
  code?: string;

  /**  */
  accessCode?: string;

  /**  */
  printedNumber?: string;

  /**  */
  accessStatus?: AccessCardStatusEnum;

  /**  */
  cardType?: AccessCardTypeEnum;

  /**  */
  strAccessStatus?: string;

  /**  */
  strCardType?: string;

  /**  */
  isActived?: boolean;

  /**  */
  accessCardColorId?: string;

  /**  */
  cardColorName?: string;
}

export interface PartnerAccessCardOutputDto {
  /**  */
  id?: string;

  /**  */
  creationTime?: Date;

  /**  */
  creatorId?: string;

  /**  */
  lastModificationTime?: Date;

  /**  */
  lastModifierId?: string;

  /**  */
  isDeleted?: boolean;

  /**  */
  deleterId?: string;

  /**  */
  deletionTime?: Date;

  /**  */
  shopId?: number;

  /**  */
  tenantId?: string;

  /**  */
  code?: string;

  /**  */
  uid?: string;

  /**  */
  accessCode?: string;

  /**  */
  printedNumber?: string;

  /**  */
  description?: string;

  /**  */
  version?: string;

  /**  */
  accessStatus?: AccessCardStatusEnum;

  /**  */
  cardType?: AccessCardTypeEnum;

  /**  */
  accessCardColorId?: string;

  /**  */
  cardFee?: number;

  /**  */
  isActived?: boolean;

  /**  */
  startDate?: Date;

  /**  */
  endDate?: Date;
}

export interface PartnerDebtRequestDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  partnerId?: string;

  /**  */
  rangeDate?: DateRangeDto;
}

export interface PartnerDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  phone?: string;

  /**  */
  email?: string;

  /**  */
  street?: string;

  /**  */
  zone?: string;

  /**  */
  address?: string;

  /**  */
  gender?: GENDER;

  /**  */
  type?: PARTNER_TYPE;

  /**  */
  groupId?: string;

  /**  */
  categoryId?: PartnerCategoryEnum;

  /**  */
  debtAmount?: number;

  /**  */
  dateOfBirth?: Date;

  /**  */
  dateOfBirthCompare?: Date;

  /**  */
  yearOfBirth?: number;

  /**  */
  monthOfBirth?: number;

  /**  */
  placeOfBirth?: string;

  /**  */
  companyName?: string;

  /**  */
  taxCode?: string;

  /**  */
  taxBranch?: string;

  /**  */
  passport?: string;

  /**  */
  visaNo?: string;

  /**  */
  visaExpireDate?: Date;

  /**  */
  notes?: string;

  /**  */
  identityCardNumber?: string;

  /**  */
  identityCardIssueDate?: Date;

  /**  */
  identityCardIssuePlace?: string;

  /**  */
  imageUrl?: string;

  /**  */
  job?: string;

  /**  */
  jobCode?: string;

  /**  */
  title?: string;

  /**  */
  ethnic?: string;

  /**  */
  ethnicCode?: string;

  /**  */
  country?: string;

  /**  */
  countryCode?: string;

  /**  */
  religion?: string;

  /**  */
  marital?: number;

  /**  */
  childrenNumber?: number;

  /**  */
  districtCode?: string;

  /**  */
  cityCode?: string;

  /**  */
  wardCode?: string;

  /**  */
  bankCode?: string;

  /**  */
  bankAccountName?: string;

  /**  */
  bankAccountCode?: string;

  /**  */
  emergencyContact?: string;

  /**  */
  emergencyPhone?: string;

  /**  */
  countryId?: number;

  /**  */
  wardId?: number;

  /**  */
  creatorShopId?: number;

  /**  */
  isActived?: boolean;

  /**  */
  prefixCode?: string;

  /**  */
  strType?: string;

  /**  */
  genderStr?: string;

  /**  */
  groupName?: string;

  /**  */
  fullAddress?: string;

  /**  */
  groupIds?: string[];

  /**  */
  groupIdRel?: string;

  /**  */
  groupNames?: string;

  /**  */
  groupCodes?: string;

  /**  */
  weight?: number;

  /**  */
  height?: number;

  /**  */
  monthAge?: number;

  /**  */
  age?: number;

  /**  */
  cityName?: string;

  /**  */
  districtName?: string;

  /**  */
  wardName?: string;

  /**  */
  totalReturnAmount?: number;

  /**  */
  lstGroupNames?: string[];

  /**  */
  groupDiscountPercent?: number;

  /**  */
  loyaltyTierId?: string;

  /**  */
  loyaltyPoint?: number;

  /**  */
  totalAmount?: number;

  /**  */
  loyaltyCode?: string;
}

export interface PartnerGroupDto {
  /**  */
  id?: string;

  /**  */
  groupId?: string;

  /**  */
  groupName?: string;

  /**  */
  groupCode?: string;

  /**  */
  groupType?: PARTNER_TYPE;

  /**  */
  notes?: string;

  /**  */
  shopId?: string;

  /**  */
  isActived?: boolean;

  /**  */
  groupDiscountPercent?: number;
}

export interface PartnerGroupPagedRequestDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  tenantId?: string;

  /**  */
  priceListDetailId?: string;
}

export interface PartnerLoyaltyTierHistoryDto {
  /**  */
  id?: string;

  /**  */
  creationTime?: Date;

  /**  */
  creatorId?: string;

  /**  */
  lastModificationTime?: Date;

  /**  */
  lastModifierId?: string;

  /**  */
  isDeleted?: boolean;

  /**  */
  deleterId?: string;

  /**  */
  deletionTime?: Date;

  /**  */
  shopId?: number;

  /**  */
  tenantId?: string;

  /**  */
  partnerId?: string;

  /**  */
  loyaltyTierId?: string;

  /**  */
  upgradeDay?: Date;

  /**  */
  notes?: string;
}

export interface PartnerLoyaltyTierHistoryPagingDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  partnerId?: string;

  /**  */
  rangeDate?: DateRangeDto;
}

export interface PartnerLoyaltyTransactionDto {
  /**  */
  id?: string;

  /**  */
  creationTime?: Date;

  /**  */
  creatorId?: string;

  /**  */
  lastModificationTime?: Date;

  /**  */
  lastModifierId?: string;

  /**  */
  isDeleted?: boolean;

  /**  */
  deleterId?: string;

  /**  */
  deletionTime?: Date;

  /**  */
  shopId?: number;

  /**  */
  tenantId?: string;

  /**  */
  partnerId?: string;

  /**  */
  transactionId?: string;

  /**  */
  transactionCode?: string;

  /**  */
  transactionType?: MOVE_TYPE;

  /**  */
  transactionDate?: Date;

  /**  */
  point?: number;

  /**  */
  expiryDate?: Date;

  /**  */
  transactionName?: string;
}

export interface PartnerLoyaltyTransactionPagingDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  partnerId?: string;

  /**  */
  transactionCode?: string;

  /**  */
  rangeDate?: DateRangeDto;
}

export interface PartnerPagingInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  categoryId?: PartnerCategoryEnum;

  /**  */
  groupId?: string;
}

export interface PartnerSearchRequestDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  type?: number;
}

export interface PartnerSyncDataDto {
  /**  */
  newLastModificationTime?: Date;

  /**  */
  partners?: PartnerSyncDto[];
}

export interface PartnerSyncDto {
  /**  */
  id?: string;

  /**  */
  lastModificationTime?: Date;

  /**  */
  isDeleted?: boolean;

  /**  */
  fts?: string;

  /**  */
  name?: string;

  /**  */
  code?: string;

  /**  */
  phone?: string;

  /**  */
  email?: string;

  /**  */
  street?: string;

  /**  */
  zone?: string;

  /**  */
  address?: string;

  /**  */
  gender?: GENDER;

  /**  */
  type?: PARTNER_TYPE;

  /**  */
  groupId?: string;

  /**  */
  categoryId?: number;

  /**  */
  dateOfBirth?: Date;

  /**  */
  isActived?: boolean;

  /**  */
  taxCode?: string;
}

export interface PartnerTransactionDto {
  /**  */
  id?: string;

  /**  */
  partnerId?: string;

  /**  */
  transactionCode?: string;

  /**  */
  transactionType?: MOVE_TYPE;

  /**  */
  transactionName?: string;

  /**  */
  transactionDate?: Date;

  /**  */
  relatedMoveId?: string;

  /**  */
  relatedMoveType?: MOVE_TYPE;

  /**  */
  relatedMoveCode?: string;

  /**  */
  relatedTransactionId?: string;

  /**  */
  amount?: number;

  /**  */
  debt?: number;

  /**  */
  debtAmount?: number;

  /**  */
  strTransactionType?: string;

  /**  */
  creatorShopId?: number;

  /**  */
  creatorShopName?: string;
}

export interface PartnerTransactionEntity {
  /**  */
  id?: string;

  /**  */
  creationTime?: Date;

  /**  */
  creatorId?: string;

  /**  */
  lastModificationTime?: Date;

  /**  */
  lastModifierId?: string;

  /**  */
  isDeleted?: boolean;

  /**  */
  deleterId?: string;

  /**  */
  deletionTime?: Date;

  /**  */
  partnerId?: string;

  /**  */
  transactionCode?: string;

  /**  */
  transactionType?: MOVE_TYPE;

  /**  */
  transactionName?: string;

  /**  */
  transactionDate?: Date;

  /**  */
  accountMoveId?: string;

  /**  */
  relatedMoveId?: string;

  /**  */
  relatedMoveType?: MOVE_TYPE;

  /**  */
  relatedMoveCode?: string;

  /**  */
  relatedTransactionId?: string;

  /**  */
  amount?: number;

  /**  */
  debt?: number;

  /**  */
  tenantId?: string;

  /**  */
  creatorShopId?: number;
}

export interface PartnerTransactionPagedRequestDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  partnerId?: string;
}

export interface PayDebtDto {
  /**  */
  partnerType?: AccountMovePartnerTypeEnum;

  /**  */
  partnerId?: string;

  /**  */
  moveDate?: Date;

  /**  */
  amount?: number;

  /**  */
  paymentMethod?: PAYMENT_METHOD;

  /**  */
  notes?: string;
}

export interface PayEmployeePayrollInputDto {
  /**  */
  payRollId?: string;

  /**  */
  moveDate?: Date;

  /**  */
  paymentMethod?: PAYMENT_METHOD;

  /**  */
  notes?: string;

  /**  */
  partnerName?: string;

  /**  */
  lstPaySalaryEmployeeDetail?: PayEmployeeSalaryInputDto[];

  /**  */
  lstInsuranceDetail?: InsuranceDetailDto[];
}

export interface PayEmployeeSalaryInputDto {
  /**  */
  detailId?: string;

  /**  */
  payingAmount?: number;

  /**  */
  notes?: string;
}

export interface PaymentMethodObjDto {
  /**  */
  paymentMethod?: PAYMENT_METHOD;

  /**  */
  paymentMethodName?: string;

  /**  */
  shopBankAccountId?: string;

  /**  */
  paymentAmount?: number;
}

export interface PaymentOrderDetailInformationDto {
  /**  */
  productId?: string;

  /**  */
  productUnitId?: string;

  /**  */
  qty?: number;

  /**  */
  convertRate?: number;

  /**  */
  price?: number;

  /**  */
  isPriceIncludeTax?: boolean;

  /**  */
  discountType?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  notes?: string;
}

export interface PaymentOrderDto {
  /**  */
  isPaymentExistOrder?: boolean;

  /**  */
  paymentOrderInformation?: PaymentOrderInformationDto;

  /**  */
  orderCreateInformation?: CreateSaleOrderDto;

  /**  */
  orderUpdateInformation?: UpdateOrderDto;
}

export interface PaymentOrderInformationDto {
  /**  */
  shopBankAccountId?: string;

  /**  */
  orderChannelTypeId?: CHANNEL_TYPE;

  /**  */
  partnerId?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  discountType?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxDiscountPercent?: number;

  /**  */
  taxDiscountCode?: string;

  /**  */
  taxDiscountAmount?: number;

  /**  */
  taxPercent?: number;

  /**  */
  paymentAmount?: number;

  /**  */
  paymentMethod?: number;

  /**  */
  isShowInfoExportEInvoice?: boolean;

  /**  */
  notes?: string;

  /**  */
  details?: PaymentOrderDetailInformationDto[];
}

export interface PharmacyAdverseReactionDto {
  /**  */
  id?: number;

  /**  */
  createdTime?: Date;

  /**  */
  reportName?: string;

  /**  */
  reportCodeUnit?: string;

  /**  */
  reportCodeCenter?: string;

  /**  */
  patientFullName?: string;

  /**  */
  patientNation?: string;

  /**  */
  patientWeight?: number;

  /**  */
  patientHeight?: number;

  /**  */
  patientGender?: GENDER;

  /**  */
  patientAge?: number;

  /**  */
  dateStartReaction?: Date;

  /**  */
  descriptionReactAndComment?: string;

  /**  */
  informationMedicineCausingADRJson?: string;

  /**  */
  medicineInfoSameTime?: string;

  /**  */
  medicalHistory?: string;

  /**  */
  handlePauseADR?: EnumHandleADR;

  /**  */
  handleUseOtherADR?: EnumHandleADR;

  /**  */
  resultHandleADR?: EnumResultHandleADR;

  /**  */
  commentDoctor?: string;

  /**  */
  opinionMedicalUnitAppraisalADR?: EnumAppraisalADR;

  /**  */
  opinionExpertAppraisalADR?: EnumAppraisalADR;

  /**  */
  reviewBoardADR?: string;

  /**  */
  reporterName?: string;

  /**  */
  reporterLevel?: string;

  /**  */
  reporterPhoneNumber?: string;

  /**  */
  reporterNumberFax?: string;

  /**  */
  reporterEmail?: string;

  /**  */
  reporterSignature?: string;

  /**  */
  reportType?: EnumReport;

  /**  */
  informationMedicineCausingADRModel?: InformationMedicineCausingADRModel;
}

export interface PharmacyAdverseReactionGetPageInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  dateRange?: DateRangeDto;
}

export interface PharmacyComplaintLogDto {
  /**  */
  id?: number;

  /**  */
  createdTime?: Date;

  /**  */
  informationRecipient?: string;

  /**  */
  patientId?: string;

  /**  */
  address?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  email?: string;

  /**  */
  productRecalledId?: string;

  /**  */
  lotNumber?: string;

  /**  */
  qty?: number;

  /**  */
  basicUnitName?: string;

  /**  */
  complaintContent?: string;

  /**  */
  processingDirection?: string;

  /**  */
  notes?: string;

  /**  */
  informationRecipientName?: string;

  /**  */
  productName?: string;

  /**  */
  patientName?: string;
}

export interface PharmacyComplaintLogGetPageInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  dateRange?: DateRangeDto;
}

export interface PharmacyLogReportControlledDrugLossInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  inventoryId?: number;
}

export interface PharmacyLogReportControlledDrugLossOutputDto {
  /**  */
  productId?: string;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  errorLoss?: number;

  /**  */
  note?: string;

  /**  */
  moveDate?: Date;
}

export interface PharmacyLogReportControlledDrugStockInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  inventoryId?: number;
}

export interface PharmacyLogReportControlledDrugStockOutputDto {
  /**  */
  productId?: string;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  status?: number;

  /**  */
  endingBalanceQty?: number;

  /**  */
  beginningBalanceQty?: number;

  /**  */
  importQty?: number;

  /**  */
  exportQty?: number;

  /**  */
  errorLoss?: number;

  /**  */
  shrinkage?: number;
}

export interface PharmacyLogReportDrugStockInOutInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  inventoryId?: number;
}

export interface PharmacyLogReportDrugStockInOutOutputDto {
  /**  */
  productId?: string;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  status?: number;

  /**  */
  endingBalanceQty?: number;

  /**  */
  returnsQty?: number;

  /**  */
  beginningBalanceQty?: number;

  /**  */
  importQty?: number;

  /**  */
  exportQty?: number;

  /**  */
  transferQty?: number;

  /**  */
  inventoryCheckQty?: number;
}

export interface PharmacyLogReportExpirationDateTrackingOutputDto {
  /**  */
  productId?: string;

  /**  */
  productName?: string;

  /**  */
  productCode?: string;

  /**  */
  description?: string;

  /**  */
  strength?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  lotNumber?: string;

  /**  */
  qty?: number;

  /**  */
  expiryDate?: Date;

  /**  */
  monthInYear?: number;
}

export interface PharmacyLogReportMedicationSalesOutputDto {
  /**  */
  moveDate?: Date;

  /**  */
  moveCode?: string;

  /**  */
  partnerName?: string;

  /**  */
  items?: PharmacyLogReportMedicationSalesProductOutputDto[];
}

export interface PharmacyLogReportMedicationSalesProductOutputDto {
  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  qtyImport?: number;

  /**  */
  qtyExport?: number;

  /**  */
  productExtendInfo?: object;

  /**  */
  basicUnitName?: string;
}

export interface PharmacyLogReportNonPrescriptionDrugSalesOutputDto {
  /**  */
  invoiceCode?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  items?: PharmacyLogReportNonPrescriptionDrugSalesProductOutputDto[];
}

export interface PharmacyLogReportNonPrescriptionDrugSalesProductOutputDto {
  /**  */
  lotNumber?: string;

  /**  */
  qty?: number;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  activeIngredient?: string;

  /**  */
  strength?: string;

  /**  */
  note?: string;
}

export interface PharmacyLogReportPageListControlledDrugStockOutputDto {
  /**  */
  items?: PharmacyLogReportControlledDrugStockOutputDto[];

  /**  */
  totalCount?: string;

  /**  */
  endingBalanceQty?: number;

  /**  */
  beginningBalanceQty?: number;

  /**  */
  importQty?: number;

  /**  */
  exportQty?: number;

  /**  */
  errorLoss?: number;

  /**  */
  shrinkage?: number;
}

export interface PharmacyLogReportPageListDrugStockInOutOutputDto {
  /**  */
  items?: PharmacyLogReportDrugStockInOutOutputDto[];

  /**  */
  totalCount?: string;

  /**  */
  endingBalanceQty?: number;

  /**  */
  returnsQty?: number;

  /**  */
  beginningBalanceQty?: number;

  /**  */
  importQty?: number;

  /**  */
  exportQty?: number;

  /**  */
  transferQty?: number;

  /**  */
  inventoryCheckQty?: number;
}

export interface PharmacyLogReportPatientInformationOutputDto {
  /**  */
  moveCode?: string;

  /**  */
  moveDate?: Date;

  /**  */
  prescriptionId?: string;

  /**  */
  prescribingDoctorName?: string;

  /**  */
  patientName?: string;

  /**  */
  dateIssued?: Date;

  /**  */
  strAge?: string;

  /**  */
  address?: string;

  /**  */
  gender?: GENDER;

  /**  */
  diagnosis?: string;

  /**  */
  medicalFacility?: string;

  /**  */
  guardian?: string;

  /**  */
  genderStr?: string;

  /**  */
  items?: PharmacyLogReportPatientInformationProductOutputDto[];
}

export interface PharmacyLogReportPatientInformationProductOutputDto {
  /**  */
  lotNumber?: string;

  /**  */
  qty?: number;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  note?: string;

  /**  */
  productExtendInfo?: object;
}

export interface PharmacyLogReportPrescriptionDrugSalesOutputDto {
  /**  */
  moveCode?: string;

  /**  */
  moveDate?: Date;

  /**  */
  prescribingDoctorName?: string;

  /**  */
  patientName?: string;

  /**  */
  dateIssued?: Date;

  /**  */
  medicalFacility?: string;

  /**  */
  items?: PharmacyLogReportPrescriptionDrugSalesProductOutputDto[];
}

export interface PharmacyLogReportPrescriptionDrugSalesProductOutputDto {
  /**  */
  lotNumber?: string;

  /**  */
  qty?: number;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  activeIngredient?: string;

  /**  */
  strength?: string;

  /**  */
  note?: string;
}

export interface PharmacyLogReportQualityInspectionOutputDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  executionTime?: Date;

  /**  */
  timeType?: TimeTypeEnum;

  /**  */
  reportName?: string;

  /**  */
  note?: string;

  /**  */
  reason?: string;

  /**  */
  items?: PharmacyLogReportQualityInspectionProductOutputDto[];
}

export interface PharmacyLogReportQualityInspectionProductOutputDto {
  /**  */
  reportId?: string;

  /**  */
  productId?: string;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  qty?: number;

  /**  */
  unitId?: string;

  /**  */
  unitName?: string;

  /**  */
  reason?: string;

  /**  */
  remarks?: string;

  /**  */
  actionPlan?: string;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;
}

export interface PlayerCheckoutInfoDto {
  /**  */
  partnerId?: string;

  /**  */
  bookingPlayerId?: string;

  /**  */
  playerName?: string;

  /**  */
  isGuest?: boolean;

  /**  */
  isDefaultPlayer?: boolean;
}

export interface PlayerInfoByIdOutputDto {
  /**  */
  playerInfo?: PlayerInfoWithCardOutputDto;

  /**  */
  bookingInfo?: MemberInfoByCardBookingOutputDto;
}

export interface PlayerInfoWithCardOutputDto {
  /**  */
  id?: string;

  /**  */
  bookingGroupId?: string;

  /**  */
  bookingId?: string;

  /**  */
  partnerId?: string;

  /**  */
  isDefaultPlayer?: boolean;

  /**  */
  fullName?: string;

  /**  */
  accessCardId?: string;

  /**  */
  isGuest?: boolean;

  /**  */
  checkInStatus?: CheckinStatusEnum;

  /**  */
  checkInTime?: Date;

  /**  */
  checkOutTime?: Date;

  /**  */
  isNoShow?: boolean;

  /**  */
  bagTagNo?: string;

  /**  */
  bookingCaddyId?: string;

  /**  */
  caddyAssignedId?: string;

  /**  */
  bookingCaddyCode?: string;

  /**  */
  caddyAssignedCode?: string;

  /**  */
  rentalBuggyType?: ProductRentalBuggyType;

  /**  */
  isSharedCaddy?: boolean;

  /**  */
  order?: number;

  /**  */
  playerNo?: number;

  /**  */
  teeTime?: TimeSpan;

  /**  */
  partnerName?: string;

  /**  */
  partnerGroup?: string;

  /**  */
  phone?: string;

  /**  */
  gender?: GENDER;

  /**  */
  caddyAssignedName?: string;

  /**  */
  bookingCaddyName?: string;

  /**  */
  memberCard?: PartnerAccessCardOutputDto;

  /**  */
  tempCard?: PartnerAccessCardOutputDto;
}

export interface PrescriptionDetail {
  /**  */
  medicineCode?: string;

  /**  */
  tradeName?: string;

  /**  */
  medicineName?: string;

  /**  */
  unitName?: string;

  /**  */
  quantity?: number;

  /**  */
  soldQuantity?: number;

  /**  */
  usageInstructions?: string;
}

export interface PrescriptionHistoryDto {
  /**  */
  id?: string;

  /**  */
  invoiceId?: string;

  /**  */
  invoiceCode?: string;

  /**  */
  prescriptionId?: string;

  /**  */
  dateIssued?: Date;

  /**  */
  prescribingDoctorId?: string;

  /**  */
  prescribingDoctorName?: string;

  /**  */
  medicalFacility?: string;

  /**  */
  diagnosis?: string;

  /**  */
  patientName?: string;

  /**  */
  patientId?: string;

  /**  */
  dateOfBirth?: Date;

  /**  */
  yearOfBirth?: number;

  /**  */
  monthOld?: number;

  /**  */
  age?: number;

  /**  */
  weight?: number;

  /**  */
  address?: string;

  /**  */
  guardian?: string;

  /**  */
  identityCardNumber?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  healthInsuranceCard?: string;

  /**  */
  totalAmount?: number;

  /**  */
  customerName?: string;
}

export interface PrescriptionHistoryRequest {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  categoryId?: PartnerCategoryEnum;

  /**  */
  groupId?: string;

  /**  */
  doctorId?: string;

  /**  */
  rangeDate?: DateRangeDto;
}

export interface PriceListDetailGetPagedInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  priceListId?: string;

  /**  */
  priceListPublishViewId?: string;

  /**  */
  productGroupId?: string;

  /**  */
  isForAdd?: boolean;

  /**  */
  isNoPaged?: boolean;

  /**  */
  excludeProductIds?: string[];
}

export interface PriceListGetPagedInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  dateRange?: DateRangeDto;
}

export interface PrintBarcodeQuery {
  /**  */
  products?: BarcodeProductItemDto[];

  /**  */
  layoutSetting?: ProductBarCodeLayoutSettingDto;
}

export interface PrintStockOrderDto {
  /**  */
  stockOrderIdHash?: string;
}

export interface ProductBarCodeLayoutSettingDto {
  /**  */
  layoutType?: ProductBarcodeLayoutType;

  /**  */
  isDefault?: boolean;

  /**  */
  isPrintPriceWithTax?: boolean;

  /**  */
  shopName?: string;

  /**  */
  currencyName?: string;

  /**  */
  isShowShop?: boolean;

  /**  */
  isShowProductName?: boolean;

  /**  */
  isShowCurrencyName?: boolean;

  /**  */
  isShowUnitName?: boolean;

  /**  */
  isShowUnitName2?: boolean;

  /**  */
  isShowArrayPriceUnit?: boolean;

  /**  */
  isShowBarcodeText?: boolean;

  /**  */
  pageWidthMm?: number;

  /**  */
  pageHeightMn?: number;

  /**  */
  columnCount?: number;

  /**  */
  rowCount?: number;

  /**  */
  columnSpacing?: number;

  /**  */
  rowSpacing?: number;

  /**  */
  paddingTop?: number;

  /**  */
  paddingBottom?: number;

  /**  */
  paddingLeft?: number;

  /**  */
  paddingRight?: number;
}

export interface ProductBookReportDetailDto {
  /**  */
  moveLineDetailsId?: string;

  /**  */
  moveCode?: string;

  /**  */
  moveDate?: Date;

  /**  */
  moveDateStr?: string;

  /**  */
  note?: string;

  /**  */
  unitId?: string;

  /**  */
  unitName?: string;

  /**  */
  costPrice?: number;

  /**  */
  importQty?: number;

  /**  */
  importAmount?: number;

  /**  */
  exportQty?: number;

  /**  */
  exportAmount?: number;

  /**  */
  inventoryQty?: number;

  /**  */
  inventoryAmount?: number;
}

export interface ProductBookReportDto {
  /**  */
  productId?: string;

  /**  */
  productName?: string;

  /**  */
  basicUnitId?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  costPrice?: number;

  /**  */
  inventoryQty?: number;

  /**  */
  inventoryAmount?: number;

  /**  */
  details?: ProductBookReportDetailDto[];
}

export interface ProductBookReportGetPagedInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  listProductId?: string[];

  /**  */
  rangeDate?: DateRangeDto;
}

export interface ProductBusinessCostSelectedGroupInput {
  /**  */
  typeId?: number;

  /**  */
  name?: string;

  /**  */
  childSelectIds?: string[];
}

export interface ProductCounterStatusDto {
  /**  */
  totalTrue?: number;

  /**  */
  totalFalse?: number;

  /**  */
  total?: number;

  /**  */
  items?: CounterByIsActivedItem[];

  /**  */
  totalNotInBusiness?: number;
}

export interface ProductCreateImportResponseDtoOfProductImportDto {
  /**  */
  errorFile?: FileUploadDto;

  /**  */
  successFile?: FileUploadDto;

  /**  */
  data?: ProductImportDto[];
}

export interface ProductCreateImportResponseDtoOfProductImportKiotVietDto {
  /**  */
  errorFile?: FileUploadDto;

  /**  */
  successFile?: FileUploadDto;

  /**  */
  data?: ProductImportKiotVietDto[];
}

export interface ProductDetailDto {
  /**  */
  productDto?: ProductDto;

  /**  */
  listProductUnit?: ProductUnitDto[];

  /**  */
  lotNumbers?: StockInventoryLineDetailEntity[];
}

export interface ProductDrugDto {
  /**  */
  id?: string;

  /**  */
  registrationNumber?: string;

  /**  */
  mainIngredient?: string;

  /**  */
  concentration?: string;

  /**  */
  packagingSpecifications?: string;

  /**  */
  manufacturer?: string;

  /**  */
  countryOfManufacturer?: string;

  /**  */
  usage?: string;

  /**  */
  isConnectNationalDrugSystem?: boolean;

  /**  */
  nationalDrugCode?: string;

  /**  */
  extendInfo?: string;
}

export interface ProductDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  productTypeId?: number;

  /**  */
  productCategoryId?: number;

  /**  */
  productCategoryName?: string;

  /**  */
  productSubCategoryId?: number;

  /**  */
  productSubCategoryName?: string;

  /**  */
  productPriceWithTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  productPrice?: number;

  /**  */
  imageUrl?: string;

  /**  */
  imageUrl1?: string;

  /**  */
  imageUrl2?: string;

  /**  */
  imageUrl3?: string;

  /**  */
  imageUrl4?: string;

  /**  */
  description?: string;

  /**  */
  basicUnitId?: string;

  /**  */
  basicUnitCode?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  barcode?: string;

  /**  */
  monthExpiryDateWarning?: number;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  isProductChain?: boolean;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  isProductPriceIncludeTax?: boolean;

  /**  */
  inventoryQtyMin?: number;

  /**  */
  inventoryQtyMax?: number;

  /**  */
  pId?: string;

  /**  */
  isActived?: boolean;

  /**  */
  costPrice?: number;

  /**  */
  isProductUseAddOn?: boolean;

  /**  */
  listProductGroupId?: string[];

  /**  */
  unitItems?: ProductUnitDto[];

  /**  */
  inventoryCurrentQty?: number;

  /**  */
  inventoryCurrentCostPrice?: number;

  /**  */
  listInventoryByLot?: ProductLotNumberInitDto[];

  /**  */
  shopId?: number;

  /**  */
  isEditable?: boolean;

  /**  */
  productDrug?: ProductDrugDto;

  /**  */
  listShopId?: number[];

  /**  */
  listShopName?: string[];

  /**  */
  templateProductId?: string;

  /**  */
  processingAreaId?: string;

  /**  */
  productStockInventoryStatus?: ProductStockInventoryStatus;

  /**  */
  productPriceByPriceList?: number;

  /**  */
  productPriceWithTaxByPriceList?: number;

  /**  */
  personalIncomeTaxPercent?: number;

  /**  */
  personalIncomeTaxCode?: string;

  /**  */
  productUnitId?: string;

  /**  */
  productUnitName?: string;

  /**  */
  convertRate?: number;

  /**  */
  isFavorite?: boolean;

  /**  */
  isAllowSale?: boolean;

  /**  */
  isValid?: boolean;

  /**  */
  vatName?: string;

  /**  */
  productTypeName?: string;

  /**  */
  productGroupName?: string;

  /**  */
  displayProductGroup?: string[];

  /**  */
  expiryWarningDays?: Date;

  /**  */
  weight?: number;

  /**  */
  productGroupJson?: string;

  /**  */
  productUnitJson?: string;

  /**  */
  isTemplateProduct?: boolean;
}

export interface ProductForPlayerProductInputDto {
  /**  */
  id?: string;

  /**  */
  productName?: string;

  /**  */
  productCategoryId?: ProductTypeGolfServiceEnum;

  /**  */
  productPrice?: number;

  /**  */
  productPriceWithTax?: number;

  /**  */
  isProductPriceIncludeTax?: boolean;

  /**  */
  taxCode?: string;

  /**  */
  taxPercent?: number;

  /**  */
  basicUnitId?: string;

  /**  */
  qty?: number;
}

export interface ProductFromInventoryWithUnitDto {
  /**  */
  productId?: string;

  /**  */
  productUnitId?: string;

  /**  */
  unitCode?: string;

  /**  */
  unitName?: string;

  /**  */
  productTypeId?: ProductTypeEnum;

  /**  */
  productCategoryId?: number;

  /**  */
  productSubCategoryId?: number;

  /**  */
  convertRate?: number;

  /**  */
  isBasicUnit?: boolean;

  /**  */
  latestImportPrice?: number;

  /**  */
  taxPercent?: number;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  isProductPriceIncludeTax?: boolean;

  /**  */
  price?: number;

  /**  */
  costPrice?: number;

  /**  */
  inventoryQty?: number;

  /**  */
  productPriceByPriceList?: number;

  /**  */
  productPriceWithTaxByPriceList?: number;

  /**  */
  productCode?: string;

  /**  */
  imageUrl?: string;

  /**  */
  productName?: string;

  /**  */
  barcode?: string;

  /**  */
  productHashId?: string;

  /**  */
  qty?: number;

  /**  */
  shopId?: number;

  /**  */
  productPriceWithTax?: number;

  /**  */
  taxCode?: string;

  /**  */
  rowkey?: string;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;
}

export interface ProductGetBarCodeExtendProductDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  productTypeId?: number;

  /**  */
  productCategoryId?: number;

  /**  */
  productCategoryName?: string;

  /**  */
  productSubCategoryId?: number;

  /**  */
  productSubCategoryName?: string;

  /**  */
  productPriceWithTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  productPrice?: number;

  /**  */
  imageUrl?: string;

  /**  */
  imageUrl1?: string;

  /**  */
  imageUrl2?: string;

  /**  */
  imageUrl3?: string;

  /**  */
  imageUrl4?: string;

  /**  */
  description?: string;

  /**  */
  basicUnitId?: string;

  /**  */
  basicUnitCode?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  barcode?: string;

  /**  */
  monthExpiryDateWarning?: number;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  isProductChain?: boolean;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  isProductPriceIncludeTax?: boolean;

  /**  */
  inventoryQtyMin?: number;

  /**  */
  inventoryQtyMax?: number;

  /**  */
  pId?: string;

  /**  */
  isActived?: boolean;

  /**  */
  costPrice?: number;

  /**  */
  isProductUseAddOn?: boolean;

  /**  */
  listProductGroupId?: string[];

  /**  */
  unitItems?: ProductUnitDto[];

  /**  */
  inventoryCurrentQty?: number;

  /**  */
  inventoryCurrentCostPrice?: number;

  /**  */
  listInventoryByLot?: ProductLotNumberInitDto[];

  /**  */
  shopId?: number;

  /**  */
  isEditable?: boolean;

  /**  */
  productDrug?: ProductDrugDto;

  /**  */
  listShopId?: number[];

  /**  */
  listShopName?: string[];

  /**  */
  templateProductId?: string;

  /**  */
  processingAreaId?: string;

  /**  */
  productStockInventoryStatus?: ProductStockInventoryStatus;

  /**  */
  productPriceByPriceList?: number;

  /**  */
  productPriceWithTaxByPriceList?: number;

  /**  */
  personalIncomeTaxPercent?: number;

  /**  */
  personalIncomeTaxCode?: string;

  /**  */
  productUnitId?: string;

  /**  */
  productUnitName?: string;

  /**  */
  convertRate?: number;

  /**  */
  isFavorite?: boolean;

  /**  */
  isAllowSale?: boolean;

  /**  */
  isValid?: boolean;

  /**  */
  vatName?: string;

  /**  */
  productTypeName?: string;

  /**  */
  productGroupName?: string;

  /**  */
  displayProductGroup?: string[];

  /**  */
  expiryWarningDays?: Date;

  /**  */
  weight?: number;

  /**  */
  productGroupJson?: string;

  /**  */
  productUnitJson?: string;

  /**  */
  isTemplateProduct?: boolean;

  /**  */
  units?: ProductUnitMobieDto[];

  /**  */
  lotNumbers?: ProductLotDto[];
}

export interface ProductGetPagedInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  productTypeId?: number;

  /**  */
  listProductGroupId?: string[];

  /**  */
  moveType?: number;

  /**  */
  includeInventoryCurrentQty?: boolean;

  /**  */
  priceListId?: string;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  onlyGetProductUsingInventory?: boolean;

  /**  */
  productUnitIds?: string[];

  /**  */
  shopId?: number;

  /**  */
  isOutOfStock?: boolean;

  /**  */
  onlyInShop?: boolean;

  /**  */
  isAllowSale?: boolean;

  /**  */
  listProductUnitExcludeIds?: string[];

  /**  */
  excludeProductPriceListId?: string;
}

export interface ProductGroupDto {
  /**  */
  id?: string;

  /**  */
  groupCode?: string;

  /**  */
  groupName?: string;

  /**  */
  orderNumber?: number;

  /**  */
  type?: ProductGroupEnum;

  /**  */
  notes?: string;

  /**  */
  pId?: string;

  /**  */
  shopId?: number;

  /**  */
  isActived?: boolean;

  /**  */
  isProductGroupChain?: boolean;

  /**  */
  imageUrl?: string;
}

export interface ProductGroupGetPaged {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  isActive?: boolean;
}

export interface ProductGroupImportDto {
  /**  */
  id?: string;

  /**  */
  groupCode?: string;

  /**  */
  groupName?: string;

  /**  */
  orderNumber?: number;

  /**  */
  type?: ProductGroupEnum;

  /**  */
  notes?: string;

  /**  */
  pId?: string;

  /**  */
  shopId?: number;

  /**  */
  isActived?: boolean;

  /**  */
  isProductGroupChain?: boolean;

  /**  */
  imageUrl?: string;

  /**  */
  isProductGroupChainStr?: string;

  /**  */
  listErrorValidData?: ValidateErrorDetail[];

  /**  */
  isError?: boolean;
}

export interface ProductGroupImportOutputDto {
  /**  */
  errorImportList?: ProductGroupImportDto[];

  /**  */
  successImportList?: ProductGroupImportDto[];

  /**  */
  errorFile?: FileUploadDto;

  /**  */
  successFile?: FileUploadDto;
}

export interface ProductGroupOrderDto {
  /**  */
  productGroupId?: string;

  /**  */
  productGroupName?: string;

  /**  */
  notes?: string;
}

export interface ProductGroupOrderPagedDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;
}

export interface ProductHotSaleDto {
  /**  */
  productId?: string;

  /**  */
  productCount?: number;

  /**  */
  productName?: string;

  /**  */
  productPrice?: number;

  /**  */
  productCode?: string;

  /**  */
  imageUrl?: string;
}

export interface ProductImportDto {
  /**  */
  id?: string;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  productTypeId?: ProductTypeEnum;

  /**  */
  productTypeName?: string;

  /**  */
  productPriceWithTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  productPrice?: number;

  /**  */
  isProductPriceIncludeTax?: boolean;

  /**  */
  productPriceStr?: string;

  /**  */
  productPriceWithTaxStr?: string;

  /**  */
  basicUnitId?: string;

  /**  */
  basicUnitCode?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  barcode?: string;

  /**  */
  isProductChain?: boolean;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  inventoryQtyMin?: number;

  /**  */
  inventoryQtyMinStr?: string;

  /**  */
  inventoryQtyMax?: number;

  /**  */
  inventoryQtyMaxStr?: string;

  /**  */
  isActived?: boolean;

  /**  */
  costPrice?: number;

  /**  */
  costPriceStr?: string;

  /**  */
  isAllowSale?: boolean;

  /**  */
  weight?: number;

  /**  */
  weightStr?: string;

  /**  */
  inventoryCurrentQty?: number;

  /**  */
  inventoryCurrentQtyStr?: string;

  /**  */
  productDrug?: ProductDrugDto;

  /**  */
  units?: ProductUnitImportDto[];

  /**  */
  lotNumbers?: ProductImportLotNumberDto[];

  /**  */
  errors?: string[];

  /**  */
  isValid?: boolean;

  /**  */
  creationTime?: Date;

  /**  */
  creatorId?: string;

  /**  */
  productGroupIds?: string[];

  /**  */
  productGroupNames?: string;

  /**  */
  productCategoryName?: string;

  /**  */
  productCategoryId?: number;

  /**  */
  templateProductId?: string;
}

export interface ProductImportKiotVietDto {
  /**  */
  id?: string;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  productTypeId?: ProductTypeEnum;

  /**  */
  productTypeName?: string;

  /**  */
  productPriceWithTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  productPrice?: number;

  /**  */
  isProductPriceIncludeTax?: boolean;

  /**  */
  productPriceStr?: string;

  /**  */
  productPriceWithTaxStr?: string;

  /**  */
  basicUnitId?: string;

  /**  */
  basicUnitCode?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  barcode?: string;

  /**  */
  isProductChain?: boolean;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  inventoryQtyMin?: number;

  /**  */
  inventoryQtyMinStr?: string;

  /**  */
  inventoryQtyMax?: number;

  /**  */
  inventoryQtyMaxStr?: string;

  /**  */
  isActived?: boolean;

  /**  */
  costPrice?: number;

  /**  */
  costPriceStr?: string;

  /**  */
  isAllowSale?: boolean;

  /**  */
  weight?: number;

  /**  */
  weightStr?: string;

  /**  */
  inventoryCurrentQty?: number;

  /**  */
  inventoryCurrentQtyStr?: string;

  /**  */
  productDrug?: ProductDrugDto;

  /**  */
  units?: ProductUnitImportDto[];

  /**  */
  lotNumbers?: ProductImportLotNumberDto[];

  /**  */
  errors?: string[];

  /**  */
  isValid?: boolean;

  /**  */
  creationTime?: Date;

  /**  */
  creatorId?: string;

  /**  */
  productGroupId?: string;

  /**  */
  productGroupName?: string;

  /**  */
  convertRate?: number;

  /**  */
  convertRateStr?: string;

  /**  */
  productCodeRelated?: string;

  /**  */
  note?: string;

  /**  */
  description?: string;
}

export interface ProductImportLotNumberDto {
  /**  */
  productCode?: string;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  expiryDateStr?: string;

  /**  */
  qtyStr?: string;

  /**  */
  qty?: number;
}

export interface ProductInventoryAvailableDto {
  /**  */
  id?: string;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  productPrice?: number;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  inventoryCurrentQty?: number;
}

export interface ProductInventoryMoveDto {
  /**  */
  id?: string;

  /**  */
  inventoryId?: string;

  /**  */
  productId?: string;

  /**  */
  moveCode?: string;

  /**  */
  moveDate?: Date;

  /**  */
  moveId?: string;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  moveTypeStr?: string;

  /**  */
  moveHashId?: string;

  /**  */
  partnerType?: number;

  /**  */
  partnerId?: string;

  /**  */
  partnerName?: string;

  /**  */
  costPrice?: number;

  /**  */
  totalAmount?: number;

  /**  */
  totalCostAmount?: number;

  /**  */
  qtyConvert?: number;

  /**  */
  openingInventoryQty?: number;

  /**  */
  closingInventoryQty?: number;

  /**  */
  status?: number;
}

export interface ProductInventoryMovePagedInput {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  productHashId?: string;

  /**  */
  inventoryId?: string;

  /**  */
  moveType?: number;

  /**  */
  partnerId?: string;

  /**  */
  inventoryLineDetailId?: string;

  /**  */
  moveDateRange?: DateRangeDto;
}

export interface ProductInventoryMoveReponseDto {
  /**  */
  pageItems?: PagedResultDtoOfProductInventoryMoveDto;

  /**  */
  openingInventoryQty?: number;

  /**  */
  openingInventoryValue?: number;

  /**  */
  importQty?: number;

  /**  */
  importValue?: number;

  /**  */
  returnQty?: number;

  /**  */
  returnValue?: number;

  /**  */
  checkQty?: number;

  /**  */
  checkValue?: number;

  /**  */
  exportQty?: number;

  /**  */
  exportValue?: number;

  /**  */
  closingInventoryQty?: number;

  /**  */
  closingInventoryValue?: number;
}

export interface ProductInventoryStockDto {
  /**  */
  id?: string;

  /**  */
  inventoryId?: string;

  /**  */
  productId?: string;

  /**  */
  costPrice?: number;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  qty?: number;
}

export interface ProductInventoryStockPagedInput {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  productHashId?: string;

  /**  */
  inventoryId?: string;
}

export interface ProductLotDto {
  /**  */
  id?: string;

  /**  */
  productId?: string;

  /**  */
  inventoryId?: string;

  /**  */
  stockInventoryLineId?: string;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  qty?: number;
}

export interface ProductLotNumberDto {
  /**  */
  inventoryLineDetailsId?: string;

  /**  */
  lotNumber?: string;

  /**  */
  costPrice?: number;

  /**  */
  expiryDate?: Date;

  /**  */
  qty?: number;
}

export interface ProductLotNumberInitDto {
  /**  */
  productId?: string;

  /**  */
  inventoryId?: string;

  /**  */
  lotNumber?: string;

  /**  */
  qty?: number;

  /**  */
  expiryDate?: Date;

  /**  */
  costPrice?: number;
}

export interface ProductModelForGetInventoryCurrent {
  /**  */
  productId?: string;

  /**  */
  inventoryCurrentQty?: number;
}

export interface ProductMoveStockDto {
  /**  */
  id?: string;

  /**  */
  productId?: string;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  isProductPriceIncludeTax?: boolean;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  basicUnitId?: string;

  /**  */
  basicUnitCode?: string;

  /**  */
  basicUnitName?: string;
}

export interface ProductOrderDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  productTypeId?: number;

  /**  */
  productCategoryId?: number;

  /**  */
  productCategoryName?: string;

  /**  */
  productSubCategoryId?: number;

  /**  */
  productSubCategoryName?: string;

  /**  */
  productPriceWithTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  productPrice?: number;

  /**  */
  imageUrl?: string;

  /**  */
  imageUrl1?: string;

  /**  */
  imageUrl2?: string;

  /**  */
  imageUrl3?: string;

  /**  */
  imageUrl4?: string;

  /**  */
  description?: string;

  /**  */
  basicUnitId?: string;

  /**  */
  basicUnitCode?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  barcode?: string;

  /**  */
  monthExpiryDateWarning?: number;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  isProductChain?: boolean;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  isProductPriceIncludeTax?: boolean;

  /**  */
  inventoryQtyMin?: number;

  /**  */
  inventoryQtyMax?: number;

  /**  */
  pId?: string;

  /**  */
  isActived?: boolean;

  /**  */
  costPrice?: number;

  /**  */
  isProductUseAddOn?: boolean;

  /**  */
  listProductGroupId?: string[];

  /**  */
  unitItems?: ProductUnitDto[];

  /**  */
  inventoryCurrentQty?: number;

  /**  */
  inventoryCurrentCostPrice?: number;

  /**  */
  listInventoryByLot?: ProductLotNumberInitDto[];

  /**  */
  shopId?: number;

  /**  */
  isEditable?: boolean;

  /**  */
  productDrug?: ProductDrugDto;

  /**  */
  listShopId?: number[];

  /**  */
  listShopName?: string[];

  /**  */
  templateProductId?: string;

  /**  */
  processingAreaId?: string;

  /**  */
  productStockInventoryStatus?: ProductStockInventoryStatus;

  /**  */
  productPriceByPriceList?: number;

  /**  */
  productPriceWithTaxByPriceList?: number;

  /**  */
  personalIncomeTaxPercent?: number;

  /**  */
  personalIncomeTaxCode?: string;

  /**  */
  productUnitId?: string;

  /**  */
  productUnitName?: string;

  /**  */
  convertRate?: number;

  /**  */
  isFavorite?: boolean;

  /**  */
  isAllowSale?: boolean;

  /**  */
  isValid?: boolean;

  /**  */
  vatName?: string;

  /**  */
  productTypeName?: string;

  /**  */
  productGroupName?: string;

  /**  */
  displayProductGroup?: string[];

  /**  */
  expiryWarningDays?: Date;

  /**  */
  weight?: number;

  /**  */
  productGroupJson?: string;

  /**  */
  productUnitJson?: string;

  /**  */
  isTemplateProduct?: boolean;

  /**  */
  productId?: string;
}

export interface ProductPriceListDetailDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  priceListId?: string;

  /**  */
  productId?: string;

  /**  */
  productUnitId?: string;

  /**  */
  productPrice?: number;

  /**  */
  isProductPriceIncludeTax?: boolean;

  /**  */
  productPriceWithTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  isAutoUpdatePrice?: boolean;

  /**  */
  calculatePriceMethod?: number;

  /**  */
  calculatePriceType?: number;

  /**  */
  calculatePriceValue?: number;

  /**  */
  unitName?: string;

  /**  */
  unitCode?: string;

  /**  */
  convertRate?: number;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  costPrice?: number;

  /**  */
  generalPrice?: number;

  /**  */
  generalPriceWithTax?: number;

  /**  */
  isDefault?: boolean;

  /**  */
  key?: string;

  /**  */
  isApplyAll?: boolean;

  /**  */
  calculateUsePrice?: CALCULATE_USE_PRICE;

  /**  */
  productPriceListDto?: ProductPriceListDto;

  /**  */
  priceListIsAutoUpdatePrice?: boolean;

  /**  */
  priceListIsAutoAddProduct?: boolean;

  /**  */
  lstPartnerGroupRel?: ProductPriceListDetailPartnerGroupRelDto[];

  /**  */
  numberOfPartnerGroup?: number;
}

export interface ProductPriceListDetailPartnerGroupRelDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  priceListDetailsId?: string;

  /**  */
  partnerGroupId?: string;

  /**  */
  partnerGroupName?: string;
}

export interface ProductPriceListDetailSyncDto {
  /**  */
  id?: string;

  /**  */
  lastModificationTime?: Date;

  /**  */
  isDeleted?: boolean;

  /**  */
  priceListId?: string;

  /**  */
  productId?: string;

  /**  */
  productUnitId?: string;

  /**  */
  productPrice?: number;
}

export interface ProductPriceListDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  name?: string;

  /**  */
  startDate?: Date;

  /**  */
  endDate?: Date;

  /**  */
  isActive?: boolean;

  /**  */
  isMain?: boolean;

  /**  */
  isAutoUpdatePrice?: boolean;

  /**  */
  isAutoCreateProduct?: boolean;

  /**  */
  isEnableUpdateDetail?: boolean;

  /**  */
  calculatePriceMethod?: number;

  /**  */
  calculatePriceType?: number;

  /**  */
  calculatePriceValue?: number;

  /**  */
  isApplyPriceByPartnerGroup?: boolean;

  /**  */
  isOnlySelectProductInPriceList?: boolean;

  /**  */
  productPriceListDetailDtos?: ProductPriceListDetailDto[];

  /**  */
  isPriceListChain?: boolean;

  /**  */
  productUnitIds?: string[];

  /**  */
  shopId?: number;
}

export interface ProductPriceListSyncDataDto {
  /**  */
  newLastModificationTime?: Date;

  /**  */
  productPriceLists?: ProductPriceListSyncDto[];

  /**  */
  productPriceListDetails?: ProductPriceListDetailSyncDto[];
}

export interface ProductPriceListSyncDto {
  /**  */
  id?: string;

  /**  */
  lastModificationTime?: Date;

  /**  */
  isDeleted?: boolean;

  /**  */
  name?: string;

  /**  */
  startDate?: Date;

  /**  */
  endDate?: Date;

  /**  */
  isActive?: boolean;

  /**  */
  isMain?: boolean;

  /**  */
  isAutoUpdatePrice?: boolean;

  /**  */
  isAutoCreateProduct?: boolean;

  /**  */
  calculatePriceMethod?: number;

  /**  */
  calculatePriceType?: number;

  /**  */
  calculatePriceValue?: number;
}

export interface ProductReportDashboard {
  /**  */
  qty?: number;

  /**  */
  openingQuantity?: number;

  /**  */
  openingValue?: number;

  /**  */
  importQuantity?: number;

  /**  */
  importValue?: number;

  /**  */
  customerReturnQuantity?: number;

  /**  */
  customerReturnValue?: number;

  /**  */
  checkQuantity?: number;

  /**  */
  checkValue?: number;

  /**  */
  exportQuantity?: number;

  /**  */
  exportValue?: number;

  /**  */
  closingQuantity?: number;

  /**  */
  closingValue?: number;
}

export interface ProductRevenueBookDto {
  /**  */
  id?: string;

  /**  */
  saleInvoiceCode?: string;

  /**  */
  saleInvoiceDate?: Date;

  /**  */
  saleInvoiceDateStr?: string;

  /**  */
  notes?: string;

  /**  */
  distribution?: ProductRevenueGroupDto;

  /**  */
  distribution2?: ProductRevenueGroupDto;

  /**  */
  services?: ProductRevenueGroupDto;

  /**  */
  services2?: ProductRevenueGroupDto;

  /**  */
  services3?: ProductRevenueGroupDto;

  /**  */
  services4?: ProductRevenueGroupDto;

  /**  */
  transportation?: ProductRevenueGroupDto;

  /**  */
  transportation2?: ProductRevenueGroupDto;
}

export interface ProductRevenueBookPagedInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;
}

export interface ProductRevenueGroupDto {
  /**  */
  taxPercent?: number;

  /**  */
  personalIncomeTaxPercent?: number;

  /**  */
  totalAmount?: number;
}

export interface ProductSearchWithUnitAndQtyDto {
  /**  */
  productId?: string;

  /**  */
  productUnitId?: string;

  /**  */
  unitCode?: string;

  /**  */
  unitName?: string;

  /**  */
  productTypeId?: ProductTypeEnum;

  /**  */
  productCategoryId?: number;

  /**  */
  productSubCategoryId?: number;

  /**  */
  convertRate?: number;

  /**  */
  isBasicUnit?: boolean;

  /**  */
  latestImportPrice?: number;

  /**  */
  taxPercent?: number;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  isProductPriceIncludeTax?: boolean;

  /**  */
  price?: number;

  /**  */
  costPrice?: number;

  /**  */
  inventoryQty?: number;

  /**  */
  productPriceByPriceList?: number;

  /**  */
  productPriceWithTaxByPriceList?: number;

  /**  */
  productCode?: string;

  /**  */
  imageUrl?: string;

  /**  */
  productName?: string;

  /**  */
  barcode?: string;

  /**  */
  productHashId?: string;

  /**  */
  qty?: number;

  /**  */
  shopId?: number;

  /**  */
  productPriceWithTax?: number;

  /**  */
  taxCode?: string;
}

export interface ProductSearchWithUnitDto {
  /**  */
  productId?: string;

  /**  */
  productUnitId?: string;

  /**  */
  unitCode?: string;

  /**  */
  unitName?: string;

  /**  */
  productTypeId?: ProductTypeEnum;

  /**  */
  productCategoryId?: number;

  /**  */
  productSubCategoryId?: number;

  /**  */
  convertRate?: number;

  /**  */
  isBasicUnit?: boolean;

  /**  */
  latestImportPrice?: number;

  /**  */
  taxPercent?: number;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  isProductPriceIncludeTax?: boolean;

  /**  */
  price?: number;

  /**  */
  costPrice?: number;

  /**  */
  inventoryQty?: number;

  /**  */
  productPriceByPriceList?: number;

  /**  */
  productPriceWithTaxByPriceList?: number;

  /**  */
  productCode?: string;

  /**  */
  imageUrl?: string;

  /**  */
  productName?: string;

  /**  */
  barcode?: string;

  /**  */
  productHashId?: string;

  /**  */
  qty?: number;

  /**  */
  shopId?: number;

  /**  */
  productPriceWithTax?: number;

  /**  */
  taxCode?: string;
}

export interface ProductSelectCommand {
  /**  */
  inventoryId?: string;

  /**  */
  products?: ProductSelectInputDto[];
}

export interface ProductSelectDto {
  /**  */
  productId?: string;

  /**  */
  productName?: string;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  price?: number;

  /**  */
  taxPercent?: number;

  /**  */
  costPrice?: number;

  /**  */
  latestImportPrice?: number;

  /**  */
  productUnitId?: string;

  /**  */
  unitName?: string;

  /**  */
  convertRate?: number;

  /**  */
  units?: ProductSelectUnitDto[];

  /**  */
  lotNumbers?: ProductLotNumberDto[];

  /**  */
  inventoryId?: string;

  /**  */
  qty?: number;

  /**  */
  shopId?: number;

  /**  */
  shopName?: string;
}

export interface ProductSelectInputDto {
  /**  */
  productUnitId?: string;

  /**  */
  productId?: string;
}

export interface ProductSelectUnitDto {
  /**  */
  productUnitId?: string;

  /**  */
  isBasicUnit?: boolean;

  /**  */
  productId?: string;

  /**  */
  unitName?: string;

  /**  */
  convertRate?: number;

  /**  */
  price?: number;
}

export interface ProductStockViewDto {
  /**  */
  id?: string;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  isDeleted?: boolean;
}

export interface ProductSyncDataDto {
  /**  */
  newLastModificationTime?: Date;

  /**  */
  products?: ProductSyncDto[];

  /**  */
  productUnits?: ProductUnitSyncDto[];
}

export interface ProductSyncDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  productTypeId?: number;

  /**  */
  productCategoryId?: number;

  /**  */
  productCategoryName?: string;

  /**  */
  productSubCategoryId?: number;

  /**  */
  productSubCategoryName?: string;

  /**  */
  productPriceBeforeTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  productPrice?: number;

  /**  */
  imageUrl?: string;

  /**  */
  description?: string;

  /**  */
  basicUnitId?: string;

  /**  */
  basicUnitCode?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  barcode?: string;

  /**  */
  monthExpiryDateWarning?: number;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  isProductPriceIncludeTax?: boolean;

  /**  */
  inventoryQtyMin?: number;

  /**  */
  inventoryQtyMax?: number;

  /**  */
  pId?: string;

  /**  */
  isActived?: boolean;

  /**  */
  costPrice?: number;

  /**  */
  lastModificationTime?: Date;

  /**  */
  isDeleted?: boolean;

  /**  */
  fts?: string;

  /**  */
  listGroupProductId?: string[];

  /**  */
  productBasicUnitId?: string;
}

export interface ProductUnitBarCodeDto {
  /**  */
  id?: string;

  /**  */
  productId?: string;

  /**  */
  unitCode?: string;

  /**  */
  unitName?: string;

  /**  */
  convertRate?: number;

  /**  */
  latestImportPrice?: number;

  /**  */
  price?: number;

  /**  */
  priceWithTax?: number;

  /**  */
  barCode?: string;

  /**  */
  isBasicUnit?: boolean;
}

export interface ProductUnitDto {
  /**  */
  id?: string;

  /**  */
  productId?: string;

  /**  */
  unitCode?: string;

  /**  */
  unitName?: string;

  /**  */
  convertRate?: number;

  /**  */
  latestImportPrice?: number;

  /**  */
  price?: number;

  /**  */
  priceWithTax?: number;

  /**  */
  barcode?: string;

  /**  */
  isBasicUnit?: boolean;

  /**  */
  isActive?: boolean;

  /**  */
  pId?: string;

  /**  */
  shopId?: number;
}

export interface ProductUnitImportDto {
  /**  */
  id?: string;

  /**  */
  productId?: string;

  /**  */
  unitCode?: string;

  /**  */
  unitName?: string;

  /**  */
  convertRate?: number;

  /**  */
  convertRateStr?: string;

  /**  */
  price?: number;

  /**  */
  priceStr?: string;

  /**  */
  isBasicUnit?: boolean;

  /**  */
  isActive?: boolean;

  /**  */
  barcode?: string;

  /**  */
  barcodeTemplate?: string;

  /**  */
  productCode?: string;

  /**  */
  isProductPriceIncludeTax?: boolean;

  /**  */
  taxPercent?: number;

  /**  */
  creationTime?: Date;

  /**  */
  creatorId?: string;
}

export interface ProductUnitMobieDto {
  /**  */
  productId?: string;

  /**  */
  unitCode?: string;

  /**  */
  unitName?: string;

  /**  */
  convertRate?: number;

  /**  */
  latestImportPrice?: number;

  /**  */
  costPrice?: number;

  /**  */
  isBasicUnit?: boolean;

  /**  */
  productUnitId?: string;
}

export interface ProductUnitSelectDto {
  /**  */
  productId?: string;

  /**  */
  productUnitId?: string;

  /**  */
  unitName?: string;

  /**  */
  unitCode?: string;

  /**  */
  convertRate?: number;

  /**  */
  price?: number;

  /**  */
  latestImportPrice?: number;

  /**  */
  isBasicUnit?: boolean;

  /**  */
  barcode?: string;
}

export interface ProductUnitSyncDto {
  /**  */
  productId?: string;

  /**  */
  productUnitId?: string;

  /**  */
  unitCode?: string;

  /**  */
  unitName?: string;

  /**  */
  productTypeId?: ProductTypeEnum;

  /**  */
  productCategoryId?: number;

  /**  */
  productSubCategoryId?: number;

  /**  */
  convertRate?: number;

  /**  */
  isBasicUnit?: boolean;

  /**  */
  latestImportPrice?: number;

  /**  */
  taxPercent?: number;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  isProductPriceIncludeTax?: boolean;

  /**  */
  price?: number;

  /**  */
  costPrice?: number;

  /**  */
  inventoryQty?: number;

  /**  */
  productPriceByPriceList?: number;

  /**  */
  productPriceWithTaxByPriceList?: number;

  /**  */
  productCode?: string;

  /**  */
  imageUrl?: string;

  /**  */
  productName?: string;

  /**  */
  barcode?: string;

  /**  */
  productHashId?: string;

  /**  */
  qty?: number;

  /**  */
  shopId?: number;

  /**  */
  productPriceWithTax?: number;

  /**  */
  taxCode?: string;

  /**  */
  id?: string;

  /**  */
  lastModificationTime?: Date;

  /**  */
  isDeleted?: boolean;

  /**  */
  fts?: string;
}

export interface ProductUnitViewDto {
  /**  */
  productUnitId?: string;

  /**  */
  productId?: string;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  basicUnitId?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  unitCode?: string;

  /**  */
  unitName?: string;

  /**  */
  convertRate?: number;

  /**  */
  isBasicUnit?: boolean;

  /**  */
  latestImportPrice?: number;

  /**  */
  taxPercent?: number;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  isProductPriceIncludeTax?: boolean;

  /**  */
  price?: number;

  /**  */
  costPrice?: number;

  /**  */
  barCode?: string;

  /**  */
  imageUrl?: string;

  /**  */
  imageUrl1?: string;

  /**  */
  imageUrl2?: string;

  /**  */
  imageUrl3?: string;

  /**  */
  imageUrl4?: string;

  /**  */
  productTypeId?: ProductTypeEnum;

  /**  */
  inventoryQty?: number;

  /**  */
  images?: string[];
}

export interface ProductionBusinessCostBookDetailDto {
  /**  */
  accountMoveDate?: Date;

  /**  */
  accountMoveDateStr?: string;

  /**  */
  accountMoveCode?: string;

  /**  */
  notes?: string;

  /**  */
  amount?: number;

  /**  */
  reasonTypeId?: string;

  /**  */
  reasonTypeEnumId?: number;

  /**  */
  reasonTypeName?: string;

  /**  */
  descriptions?: string;

  /**  */
  chiPhi1?: number;

  /**  */
  chiPhi2?: number;

  /**  */
  chiPhi3?: number;

  /**  */
  chiPhi4?: number;

  /**  */
  chiPhi5?: number;

  /**  */
  chiPhi6?: number;

  /**  */
  chiPhi7?: number;
}

export interface ProductionBusinessCostSummaryDto {
  /**  */
  typeId?: number;

  /**  */
  name?: string;

  /**  */
  totalAmount?: number;
}

export interface PromotionConditionDto {
  /**  */
  totalAmountFrom?: number;

  /**  */
  productId?: string;

  /**  */
  quantityFrom?: number;
}

export interface PromotionDetailDto {
  /**  */
  condition?: PromotionConditionDto;

  /**  */
  type?: DISCOUNT_USE_TYPE;

  /**  */
  value?: PromotionValueDto;
}

export interface PromotionJson {
  /**  */
  promotionType?: string;

  /**  */
  details?: PromotionDetailDto[];
}

export interface PromotionValueDto {
  /**  */
  amount?: number;

  /**  */
  unit?: string;

  /**  */
  giftItems?: GiftItemDto[];

  /**  */
  voucherList?: VoucherDto[];
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

export interface QualityInspectionReportItemInputDto {
  /**  */
  export?: OrdExportPaged;

  /**  */
  hashId?: string;
}

export interface ReleaseCardHistoryOutput {
  /**  */
  accessCardId?: string;

  /**  */
  uid?: string;

  /**  */
  code?: string;

  /**  */
  startDate?: Date;

  /**  */
  endDate?: Date;

  /**  */
  gender?: GENDER;

  /**  */
  phone?: string;

  /**  */
  partnerId?: string;

  /**  */
  partnerName?: string;

  /**  */
  accessStatus?: AccessCardStatusEnum;

  /**  */
  bookingPlayerId?: string;

  /**  */
  strAccessStatus?: string;
}

export interface ReleaseCardHistoryPageReq {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  courseId?: string;

  /**  */
  playDate?: Date;
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

export interface RemoveUserCommand {
  /**  */
  id?: string;
}

export interface RemoveUserHostCommand {
  /**  */
  id?: string;
}

export interface ReportTaxDeclarationDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

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
  periodDate?: Date;

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
  authorizationDocumentDate?: Date;

  /**  */
  agentName?: string;

  /**  */
  agentTaxCode?: string;

  /**  */
  agentContractNumber?: string;

  /**  */
  agentContractDate?: Date;

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
}

export interface ResetPasswordCommand {
  /**  */
  userId?: string;

  /**  */
  newPassword?: string;

  /**  */
  mustChangePassword?: boolean;
}

export interface ResetRoleAdminTenantCommand {
  /**  */
  userId?: string;

  /**  */
  tenantId?: string;
}

export interface RetryCloseStockProductCommand {
  /**  */
  productHashId?: string;

  /**  */
  productId?: string;

  /**  */
  inventoryId?: string;
}

export interface RetryCostPriceCommand {
  /**  */
  productHashId?: string;

  /**  */
  productId?: string;
}

export interface ReturnItemAndLockerInputDto {
  /**  */
  bookingId?: string;

  /**  */
  bookingPlayerId?: string;

  /**  */
  bookingGroupId?: string;

  /**  */
  lockerIdCheckOut?: string;

  /**  */
  listReturnItem?: ReturnItemInputDto[];
}

export interface ReturnItemInputDto {
  /**  */
  productId?: string;

  /**  */
  productName?: string;

  /**  */
  productUnitId?: string;

  /**  */
  qty?: number;

  /**  */
  qtyReturn?: number;

  /**  */
  qtyLoss?: number;
}

export interface ReturnMoveStockDto {
  /**  */
  moveCode?: string;

  /**  */
  moveIdHash?: string;

  /**  */
  moveId?: string;

  /**  */
  moveDate?: Date;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  qty?: number;

  /**  */
  unitName?: string;
}

export interface ReturnValueApiDescriptionModel {
  /**  */
  type?: string;

  /**  */
  typeSimple?: string;
}

export interface RevenueComparisonByMonthDto {
  /**  */
  lastMonthRevenue?: number;

  /**  */
  currentMonthRevenue?: number;

  /**  */
  lastMonthSaleInvoice?: number;

  /**  */
  currentMonthSaleInvoice?: number;

  /**  */
  percentWithLastMonth?: number;
}

export interface RevenueComparisonDto {
  /**  */
  lastDayRevenue?: number;

  /**  */
  currentDayRevenue?: number;

  /**  */
  percentWithLastDay?: number;
}

export interface RevenueDataByChanelDto {
  /**  */
  amount?: number;

  /**  */
  percent?: number;

  /**  */
  saleChannelTypeId?: CHANNEL_TYPE;

  /**  */
  channelGroupName?: string;

  /**  */
  countInvoice?: string;
}

export interface RevenueDataInMonthDto {
  /**  */
  revenueInMonth?: number;

  /**  */
  listRevenueDetail?: DataRevenueByDaysDto[];
}

export interface RevokeCardByAccessCardIdCommand {
  /**  */
  accessCardId?: string;

  /**  */
  bookingPlayerId?: string;

  /**  */
  note?: string;

  /**  */
  endDate?: Date;
}

export interface RoleDto {
  /**  */
  id?: string;

  /**  */
  code?: string;

  /**  */
  rawCode?: string;

  /**  */
  name?: string;

  /**  */
  description?: string;

  /**  */
  isActived?: boolean;

  /**  */
  listPermissionName?: string[];

  /**  */
  isTemplateTenant?: boolean;
}

export interface RoleGetUserPagedDto {
  /**  */
  userId?: string;

  /**  */
  name?: string;

  /**  */
  userName?: string;

  /**  */
  email?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  isActived?: boolean;
}

export interface RolePagedRequestDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  isIncludeListPermission?: boolean;

  /**  */
  isTemplateTenant?: boolean;
}

export interface RoleSetPermissionCommand {
  /**  */
  roleId?: string;

  /**  */
  listOfPermission?: string[];

  /**  */
  isTemplateTenant?: boolean;
}

export interface SaleInvoiceComparisonDto {
  /**  */
  lastDaySaleInvoice?: number;

  /**  */
  currentDaySaleInvoice?: number;

  /**  */
  percentWithLastDay?: number;
}

export interface SaleInvoiceDetailDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  invoiceId?: string;

  /**  */
  invoiceCode?: string;

  /**  */
  productId?: string;

  /**  */
  productUnitId?: string;

  /**  */
  productTypeId?: number;

  /**  */
  productCategoryId?: number;

  /**  */
  productSubCategoryId?: number;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  qty?: number;

  /**  */
  convertRate?: number;

  /**  */
  price?: number;

  /**  */
  priceWithTax?: number;

  /**  */
  isPriceIncludeTax?: boolean;

  /**  */
  subTaxAmount?: number;

  /**  */
  subTotalAmount?: number;

  /**  */
  taxDiscountAmountAllocation?: number;

  /**  */
  promotionAmountAllocation?: number;

  /**  */
  taxPromotionAmountAllocation?: number;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  discountType?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  totalAmountAfterDiscount?: number;

  /**  */
  discountAmountAllocation?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  personalIncomeTaxPercent?: number;

  /**  */
  personalIncomeTaxCode?: string;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  notes?: string;

  /**  */
  status?: SaleInvoiceStatus;

  /**  */
  returnTotalAmount?: number;

  /**  */
  creatorEmployeeId?: string;

  /**  */
  isActived?: boolean;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  qtyConvert?: number;

  /**  */
  returnQtyConvert?: number;

  /**  */
  lotInventoryJson?: string;

  /**  */
  costPrice?: number;

  /**  */
  totalCostAmount?: number;

  /**  */
  productPriceWithTax?: number;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  imageUrl?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  productPrice?: number;

  /**  */
  purchasedQty?: number;

  /**  */
  qtyByUnit?: number;

  /**  */
  lotNumber?: string;

  /**  */
  lotNumberId?: string;

  /**  */
  lotExpiryDate?: Date;

  /**  */
  shopId?: number;

  /**  */
  shopName?: string;

  /**  */
  lotNumbers?: LotInventoryDto[];

  /**  */
  lotNumberSummary?: string;

  /**  */
  sReturnQtyConvert?: string;

  /**  */
  productUnitName?: string;

  /**  */
  orderDetailsId?: string;

  /**  */
  orderId?: string;

  /**  */
  extra?: string;
}

export interface SaleInvoiceDetailModel {
  /**  */
  drugCode?: string;

  /**  */
  drugName?: string;

  /**  */
  lotNumber?: string;

  /**  */
  productionDate?: string;

  /**  */
  expiryDate?: string;

  /**  */
  registrationNumber?: string;

  /**  */
  qty?: string;

  /**  */
  qtyConvert?: number;

  /**  */
  price?: number;

  /**  */
  productType?: number;

  /**  */
  unitName?: string;

  /**  */
  productCode?: string;

  /**  */
  totalAmount?: number;
}

export interface SaleInvoiceDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  invoiceCode?: string;

  /**  */
  partnerId?: string;

  /**  */
  creatorEmployeeId?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  status?: SaleInvoiceStatus;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  discountType?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxDiscountPercent?: number;

  /**  */
  taxDiscountCode?: string;

  /**  */
  taxDiscountAmount?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  totalAmountRound?: number;

  /**  */
  paymentAmount?: number;

  /**  */
  debtAmount?: number;

  /**  */
  paymentMethod?: number;

  /**  */
  paymentBankCode?: string;

  /**  */
  paymentBankAccountCode?: string;

  /**  */
  paymentBankAccountName?: string;

  /**  */
  paymentBankAccountVirtualName?: string;

  /**  */
  paymentStatus?: number;

  /**  */
  notes?: string;

  /**  */
  inventoryId?: string;

  /**  */
  canceledEmployeeId?: string;

  /**  */
  canceledDate?: Date;

  /**  */
  canceledReason?: string;

  /**  */
  totalQty?: number;

  /**  */
  totalReturnQty?: number;

  /**  */
  salePartnerId?: string;

  /**  */
  einvoiceNo?: string;

  /**  */
  einvoiceIssuedDate?: Date;

  /**  */
  einvoiceCanceledDate?: Date;

  /**  */
  einvoiceReservationCode?: string;

  /**  */
  einvoiceStatus?: EinvoiceStatus;

  /**  */
  einvoiceTransactionID?: string;

  /**  */
  eInvoiceBuyerName?: string;

  /**  */
  eInvoiceCompany?: string;

  /**  */
  eInvoiceTaxCode?: string;

  /**  */
  eInvoiceBuyerAddress?: string;

  /**  */
  eInvoiceBuyerPhone?: string;

  /**  */
  eInvoiceBuyerEmail?: string;

  /**  */
  einvoiceTransactionMerge?: boolean;

  /**  */
  eInvoiceSeri?: string;

  /**  */
  eInvoiceType?: string;

  /**  */
  einvoiceTaxAuthorityCode?: string;

  /**  */
  einvoiceNumber?: string;

  /**  */
  eInvoiceId?: string;

  /**  */
  isActived?: boolean;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  lotInventoryJson?: string;

  /**  */
  relatedInvoiceId?: string;

  /**  */
  relatedInvoiceCode?: string;

  /**  */
  totalQtyConvert?: number;

  /**  */
  totalReturnQtyConvert?: number;

  /**  */
  paymentMethodJson?: string;

  /**  */
  shopBankAccountId?: string;

  /**  */
  saleChannelTypeId?: CHANNEL_TYPE;

  /**  */
  prescriptionType?: PrescriptionTypeEnum;

  /**  */
  objectId?: string;

  /**  */
  objectType?: InvoiceObjectTypeEnum;

  /**  */
  saleChannelTypeName?: string;

  /**  */
  saleInvoiceDetails?: SaleInvoiceDetailDto[];

  /**  */
  prescriptionInfo?: SalesPrescriptionDto;

  /**  */
  partnerName?: string;

  /**  */
  customerPhone?: string;

  /**  */
  customerTaxCode?: string;

  /**  */
  taxCode?: string;

  /**  */
  email?: string;

  /**  */
  customerAddress?: string;

  /**  */
  customerState?: string;

  /**  */
  customerDistinct?: string;

  /**  */
  customerWard?: string;

  /**  */
  creatorEmployeeName?: string;

  /**  */
  creatorEmployeePhone?: string;

  /**  */
  creatorSalePartnerName?: string;

  /**  */
  invoiceTimeStr?: string;

  /**  */
  inventoryName?: string;

  /**  */
  relatedInvoiceIdHash?: string;

  /**  */
  paymentMethodObjDto?: PaymentMethodObjDto[];

  /**  */
  partnerCode?: string;

  /**  */
  parnerType?: PARTNER_TYPE;

  /**  */
  isShowInfoExportEInvoice?: boolean;

  /**  */
  deviceTokenId?: string;

  /**  */
  paymentMethodName?: string;

  /**  */
  shopId?: number;

  /**  */
  shopName?: string;

  /**  */
  orderId?: string;

  /**  */
  creatorId?: string;
}

export interface SaleInvoiceGetListDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  dateRange?: DateRangeDto;

  /**  */
  status?: SaleInvoiceStatus;

  /**  */
  paymentMethod?: PAYMENT_METHOD;

  /**  */
  saleChannelTypeId?: CHANNEL_TYPE;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  showUnexportedEInvoices?: boolean;

  /**  */
  einvoiceStatus?: number;
}

export interface SaleInvoiceReportDto {
  /**  */
  id?: string;

  /**  */
  invoiceCode?: string;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  status?: MOVE_STATUS;

  /**  */
  partnerId?: string;

  /**  */
  totalAmount?: number;

  /**  */
  paymentStatus?: number;

  /**  */
  totalQty?: number;

  /**  */
  creatorEmployeeId?: string;

  /**  */
  creatorEmployeeName?: string;

  /**  */
  creationTime?: Date;
}

export interface SaleOrderDeliveryDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  invoiceId?: string;

  /**  */
  orderId?: string;

  /**  */
  partnerId?: string;

  /**  */
  deliveryCode?: string;

  /**  */
  deliveryType?: DELIVERY_TYPE;

  /**  */
  receiver?: string;

  /**  */
  receiverPhone?: string;

  /**  */
  receiverPhone2?: string;

  /**  */
  receiverAddress?: string;

  /**  */
  receiverWardId?: string;

  /**  */
  receiverZone?: string;

  /**  */
  packageWeight?: number;

  /**  */
  packageHeight?: number;

  /**  */
  packageWidth?: number;

  /**  */
  packageLength?: number;

  /**  */
  deliveryExpectedDate?: Date;

  /**  */
  partnerDeliveryId?: string;

  /**  */
  partnerDeliveryType?: PARTNER_TYPE;

  /**  */
  partnerDeliveryAmount?: number;

  /**  */
  partnerDeliveryRemainAmount?: number;

  /**  */
  isUsingCOD?: boolean;

  /**  */
  codAmount?: number;

  /**  */
  codRemainAmount?: number;

  /**  */
  isActived?: boolean;
}

export interface SaleOrderDetailDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  orderId?: string;

  /**  */
  productId?: string;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  productUnitId?: string;

  /**  */
  productTypeId?: number;

  /**  */
  productCategoryId?: number;

  /**  */
  productSubCategoryId?: number;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  lotNumber?: string;

  /**  */
  orderQty?: number;

  /**  */
  qty?: number;

  /**  */
  qtyConvert?: number;

  /**  */
  convertRate?: number;

  /**  */
  price?: number;

  /**  */
  barcode?: string;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  discountType?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  totalAmountAfterDiscount?: number;

  /**  */
  discountAmountAllocation?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  notes?: string;

  /**  */
  status?: number;

  /**  */
  returnTotalAmount?: number;

  /**  */
  returnQtyConvert?: number;

  /**  */
  creatorEmployeeId?: string;

  /**  */
  inventoryLineDetailId?: string;

  /**  */
  isActived?: boolean;

  /**  */
  subTaxAmount?: number;

  /**  */
  subTotalAmount?: number;

  /**  */
  taxDiscountAmountAllocation?: number;

  /**  */
  promotionAmountAllocation?: number;

  /**  */
  taxPromotionAmountAllocation?: number;

  /**  */
  imageUrl?: string;

  /**  */
  productGroupName?: string;

  /**  */
  description?: string;

  /**  */
  productPriceWithTax?: string;

  /**  */
  isProductPriceIncludeTax?: boolean;

  /**  */
  productPrice?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  currencyUnit?: string;

  /**  */
  inventoryCurrentQty?: number;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  priceListId?: string;

  /**  */
  units?: ComboOptionDto[];
}

export interface SaleOrderDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  orderCode?: string;

  /**  */
  partnerId?: string;

  /**  */
  partnerName?: string;

  /**  */
  partnerAddress?: string;

  /**  */
  partnerPhone?: string;

  /**  */
  partnerEmail?: string;

  /**  */
  partnerDob?: Date;

  /**  */
  creatorEmployeeId?: string;

  /**  */
  orderDate?: Date;

  /**  */
  status?: ORDER_STATUS;

  /**  */
  isActived?: boolean;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  discountType?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  depositAmount?: number;

  /**  */
  paymentAmount?: number;

  /**  */
  debtAmount?: number;

  /**  */
  deliveryAmount?: number;

  /**  */
  paymentMethod?: PAYMENT_METHOD;

  /**  */
  paymentStatus?: PAYMENT_STATUS;

  /**  */
  shopBankAccountId?: string;

  /**  */
  notes?: string;

  /**  */
  canceledEmployeeId?: string;

  /**  */
  canceledDate?: Date;

  /**  */
  canceledReason?: string;

  /**  */
  saleInvoiceId?: string;

  /**  */
  orderChannelTypeId?: number;

  /**  */
  deliveryExpectedDate?: Date;

  /**  */
  printingCount?: number;

  /**  */
  codAmount?: number;

  /**  */
  isUsingCOD?: boolean;

  /**  */
  internalNotes?: string;

  /**  */
  saleOrderDetails?: SaleOrderDetailDto[];

  /**  */
  saleOrderDeliveryDto?: SaleOrderDeliveryDto;
}

export interface SaleOrderGetPagedInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  status?: number;
}

export interface SaleOrderStatusDto {
  /**  */
  status?: number;

  /**  */
  totalCount?: number;
}

export interface SaleWorkShiftDetailDto {
  /**  */
  id?: string;

  /**  */
  saleWorkShiftId?: string;

  /**  */
  detailsType?: number;

  /**  */
  detailsPaymentMethod?: number;

  /**  */
  detailsAmount?: number;

  /**  */
  notes?: string;
}

export interface SalesPrescriptionDto {
  /**  */
  id?: string;

  /**  */
  invoiceId?: string;

  /**  */
  invoiceCode?: string;

  /**  */
  prescriptionId?: string;

  /**  */
  dateIssued?: Date;

  /**  */
  prescribingDoctorId?: string;

  /**  */
  prescribingDoctorName?: string;

  /**  */
  medicalFacility?: string;

  /**  */
  diagnosis?: string;

  /**  */
  patientName?: string;

  /**  */
  patientId?: string;

  /**  */
  dateOfBirth?: Date;

  /**  */
  yearOfBirth?: number;

  /**  */
  monthOld?: number;

  /**  */
  age?: number;

  /**  */
  weight?: number;

  /**  */
  address?: string;

  /**  */
  guardian?: string;

  /**  */
  identityCardNumber?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  healthInsuranceCard?: string;
}

export interface SalesPromotionDto {
  /**  */
  id?: number;

  /**  */
  name?: string;

  /**  */
  code?: string;

  /**  */
  description?: string;

  /**  */
  tenantId?: string;

  /**  */
  startDate?: Date;

  /**  */
  endDate?: Date;

  /**  */
  shopId?: number;

  /**  */
  promotionType?: string;

  /**  */
  promotionDetail?: string;

  /**  */
  applyDays?: string;

  /**  */
  isActived?: boolean;
}

export interface SellReportDashboardDto {
  /**  */
  revenueComparisonDay?: RevenueComparisonDto;

  /**  */
  revenueComparisonMonth?: ComparisonRevenueMonthDto;

  /**  */
  revenueInMonth?: RevenueDataInMonthDto;
}

export interface SellReportProductOutputDto {
  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  qtyConvert?: number;

  /**  */
  lotExpiryDate?: Date;

  /**  */
  lotNumber?: string;

  /**  */
  costPrice?: number;

  /**  */
  totalPrice?: number;

  /**  */
  totalPriceBeforeTax?: number;

  /**  */
  totalAmount?: number;

  /**  */
  totalDiscountAmount?: number;

  /**  */
  taxAmount?: number;

  /**  */
  returnQtyConvert?: number;

  /**  */
  returnTotalAmount?: number;

  /**  */
  revenueAmount?: number;
}

export interface SellReportProductPagingInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  productTypeId?: number;
}

export interface SellReportProfitByBillOutputDto {
  /**  */
  invoiceCode?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  partnerName?: string;

  /**  */
  totalAmount?: number;

  /**  */
  totalCostAmount?: number;

  /**  */
  totalProfit?: number;
}

export interface SellReportProfitByMoneyOutputDto {
  /**  */
  invoiceDate?: Date;

  /**  */
  totalAmount?: number;

  /**  */
  totalRefund?: number;

  /**  */
  totalRevenue?: number;

  /**  */
  totalCostAmount?: number;

  /**  */
  totalProfit?: number;
}

export interface SellReportProfitByProductOutputDto {
  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  lotNumber?: string;

  /**  */
  lotExpiryDate?: Date;

  /**  */
  costPrice?: number;

  /**  */
  unitName?: string;

  /**  */
  totalQty?: number;

  /**  */
  totalAmount?: number;

  /**  */
  totalQtyReturn?: number;

  /**  */
  totalRefund?: number;

  /**  */
  totalRevenue?: number;

  /**  */
  totalCostAmount?: number;

  /**  */
  totalProfit?: number;
}

export interface SellReportRevenueDetailOutputDto {
  /**  */
  partnerName?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  invoiceCode?: string;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  discountAmount?: number;

  /**  */
  discountAmountAllocation?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  debtAmount?: number;

  /**  */
  returnTotalAmount?: number;

  /**  */
  paymentAmount?: number;

  /**  */
  revenueAmount?: number;

  /**  */
  children?: SellReportRevenueDetailProductOutputDto[];
}

export interface SellReportRevenueDetailProductOutputDto {
  /**  */
  productName?: string;

  /**  */
  productCode?: string;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  discountAmount?: number;

  /**  */
  discountAmountAllocation?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  debtAmount?: number;

  /**  */
  returnTotalAmount?: number;

  /**  */
  paymentAmount?: number;

  /**  */
  revenueAmount?: number;
}

export interface SellReportRevenueDetailtPagingInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;
}

export interface SellReportRevenueOutputDto {
  /**  */
  invoiceDate?: Date;

  /**  */
  invoiceDateStr?: string;

  /**  */
  debtAmount?: number;

  /**  */
  paymentAmount?: number;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  discountAmount?: number;

  /**  */
  discountAmountAllocation?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  returnTotalAmount?: number;

  /**  */
  revenueAmount?: number;
}

export interface SellReportRevenuePagingInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;
}

export interface SendEmailForgotPasswordQuery {
  /**  */
  userName?: string;

  /**  */
  email?: string;
}

export interface ServiceInitDefaultByFilterOutputDto {
  /**  */
  discountMainPercent?: number;

  /**  */
  saleInvoiceDetails?: SaleInvoiceDetailDto[];
}

export interface SetValueSettingCommand {
  /**  */
  name?: string;

  /**  */
  value?: string;

  /**  */
  fileIdAssFromValue?: string;

  /**  */
  mustEncrypt?: boolean;

  /**  */
  isActived?: boolean;

  /**  */
  isJsonValue?: boolean;

  /**  */
  type?: SettingType;
}

export interface SettingDto {
  /**  */
  id?: string;

  /**  */
  tenantId?: string;

  /**  */
  userId?: string;

  /**  */
  name?: string;

  /**  */
  value?: string;

  /**  */
  rawValue?: string;

  /**  */
  mustEncrypt?: boolean;

  /**  */
  isActived?: boolean;

  /**  */
  type?: SettingType;
}

export interface SettingPagedRequestDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: SettingType;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;
}

export interface ShopBankAccountDto {
  /**  */
  id?: string;

  /**  */
  bankCode?: string;

  /**  */
  accountCode?: string;

  /**  */
  accountName?: string;

  /**  */
  notes?: string;

  /**  */
  qrCodeStatic?: string;

  /**  */
  virtualUserName?: string;

  /**  */
  isActived?: boolean;

  /**  */
  isDefault?: boolean;
}

export interface ShopComboInputDto {
  /**  */
  disableTenant?: boolean;

  /**  */
  excludeShopIds?: string[];
}

export interface ShopDiscountDto {
  /**  */
  id?: string;

  /**  */
  code?: string;

  /**  */
  discountUseType?: DISCOUNT_USE_TYPE;

  /**  */
  userId?: string;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountValue?: number;

  /**  */
  startDate?: Date;

  /**  */
  endDate?: Date;

  /**  */
  discountStatus?: DISCOUNTSTATUS;

  /**  */
  usageLimit?: number;

  /**  */
  usageCount?: number;

  /**  */
  barcode?: string;

  /**  */
  qtyPrint?: number;

  /**  */
  startDateFormatted?: string;

  /**  */
  endDateFormatted?: string;
}

export interface ShopDto {
  /**  */
  id?: number;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  address?: string;

  /**  */
  taxCode?: string;

  /**  */
  phone?: string;

  /**  */
  email?: string;

  /**  */
  logoUrl?: string;

  /**  */
  logoId?: string;

  /**  */
  provinceCode?: string;

  /**  */
  districtCode?: string;

  /**  */
  communeCode?: string;

  /**  */
  isActived?: boolean;

  /**  */
  isMain?: boolean;

  /**  */
  type?: ShopType;

  /**  */
  businessType?: BUSINESS_TYPE_ENUM;

  /**  */
  inventoryMainId?: string;

  /**  */
  cashBookMainId?: string;

  /**  */
  productPriceListMainId?: string;

  /**  */
  packageRegistrationType?: ShopPackageRegistrationType;

  /**  */
  packageRegistrationAccountNumber?: number;

  /**  */
  packageRegistrationCode?: string;

  /**  */
  packageRegistrationExpiryDate?: Date;

  /**  */
  ownerIdentityNumber?: string;

  /**  */
  ownerPhone?: string;

  /**  */
  ownerName?: string;

  /**  */
  tenantId?: string;

  /**  */
  packageRegistrationId?: number;

  /**  */
  userNameAdminShop?: string;

  /**  */
  passwordAdminShop?: string;
}

export interface ShopInfoDto {
  /**  */
  id?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  address?: string;

  /**  */
  taxCode?: string;

  /**  */
  phone?: string;

  /**  */
  email?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: ShopType;

  /**  */
  businessType?: number;

  /**  */
  tenantId?: string;

  /**  */
  tenantCode?: string;

  /**  */
  packageRegistrationCode?: string;

  /**  */
  idHash?: string;

  /**  */
  tenant?: TenantDto;
}

export interface ShopPackageRegistrationDto {
  /**  */
  id?: string;

  /**  */
  packageRegistrationId?: string;

  /**  */
  packageRegistrationType?: ShopPackageRegistrationType;

  /**  */
  packageRegistrationCode?: string;

  /**  */
  packageRegistrationName?: string;

  /**  */
  packageRegistrationDate?: Date;

  /**  */
  chargeTime?: number;

  /**  */
  freeTime?: number;

  /**  */
  totalTime?: number;

  /**  */
  timeUnit?: TimeUnit;

  /**  */
  packageAccountNumber?: number;

  /**  */
  packageShopNumber?: number;

  /**  */
  packageRegistrationStartDate?: Date;

  /**  */
  packageRegistrationExpiryDate?: Date;

  /**  */
  price?: number;

  /**  */
  qty?: number;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  discountAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  notes?: string;

  /**  */
  salePartnerId?: string;

  /**  */
  status?: ShopPackageRegistrationStatus;

  /**  */
  tenantId?: string;

  /**  */
  tenantName?: string;

  /**  */
  shopId?: number;

  /**  */
  shopName?: string;

  /**  */
  shopCode?: string;
}

export interface ShopPackageRegistrationGetPagedDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  shopId?: number;

  /**  */
  tenantId?: string;

  /**  */
  status?: ShopPackageRegistrationStatus;
}

export interface ShopPagedRequestDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  tenantId?: string;
}

export interface ShopSettingDto {
  /**  */
  id?: string;

  /**  */
  name?: string;

  /**  */
  value?: string;

  /**  */
  userId?: string;

  /**  */
  tenantId?: string;

  /**  */
  shopId?: number;
}

export interface ShopSettingPagingInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  userId?: string;
}

export interface ShopTemplateDetailsDto {
  /**  */
  id?: string;

  /**  */
  templateId?: string;

  /**  */
  productId?: string;

  /**  */
  productUnitId?: string;

  /**  */
  qty?: number;

  /**  */
  notes?: string;

  /**  */
  productName?: string;

  /**  */
  productCode?: string;

  /**  */
  productUnitName?: string;
}

export interface ShopTemplateDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  type?: ShopTemplateTypeEnum;

  /**  */
  name?: string;

  /**  */
  notes?: string;

  /**  */
  isActived?: boolean;

  /**  */
  strType?: string;

  /**  */
  details?: ShopTemplateDetailsDto[];
}

export interface ShopTemplatePagedRequestDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: ShopTemplateTypeEnum;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;
}

export interface ShopTemplatePrinterDto {
  /**  */
  id?: string;

  /**  */
  templatePrintId?: string;

  /**  */
  templatePrintEnumId?: TEMPLATE_PRINTER;

  /**  */
  staticName?: string;

  /**  */
  templatePrinterName?: string;

  /**  */
  name?: string;

  /**  */
  fileName?: string;

  /**  */
  documentId?: string;

  /**  */
  notes?: string;

  /**  */
  isActived?: boolean;

  /**  */
  isDefault?: boolean;

  /**  */
  fileInfo?: TplFileInfo;
}

export interface ShopTemplatePrinterPagingInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;
}

export interface ShopTemplateWithProductUnitDto {
  /**  */
  id?: string;

  /**  */
  type?: ShopTemplateTypeEnum;

  /**  */
  name?: string;

  /**  */
  notes?: string;

  /**  */
  isActived?: boolean;

  /**  */
  strType?: string;

  /**  */
  products?: ProductSearchWithUnitAndQtyDto[];
}

export interface ShopWeatherDataDto {
  /**  */
  id?: string;

  /**  */
  measureDate?: Date;

  /**  */
  tempAt9AM?: number;

  /**  */
  tempAt3PM?: number;

  /**  */
  humidityAt9AM?: number;

  /**  */
  humidityAt3PM?: number;

  /**  */
  executorId?: string;

  /**  */
  reviewerId?: string;

  /**  */
  notes?: string;
}

export interface ShopWorkCalendarDetailDto {
  /**  */
  id?: string;

  /**  */
  workCalendarId?: string;

  /**  */
  name?: string;

  /**  */
  dayOfWeek?: number;

  /**  */
  hourFrom?: string;

  /**  */
  hourBreakTimeFrom?: string;

  /**  */
  hourBreakTimeTo?: string;

  /**  */
  hourTo?: string;

  /**  */
  workCalendarName?: string;

  /**  */
  dayOfWeekEnum?: DAY_OF_WEEK;

  /**  */
  isNightShift?: boolean;
}

export interface ShopWorkCalendarDto {
  /**  */
  id?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  hourPerDay?: number;

  /**  */
  hourFrom?: string;

  /**  */
  hourBreakTimeFrom?: string;

  /**  */
  hourBreakTimeTo?: string;

  /**  */
  hourTo?: string;

  /**  */
  listDayOfWeek?: string;

  /**  */
  notes?: string;

  /**  */
  isActived?: boolean;

  /**  */
  isNightShift?: boolean;

  /**  */
  listDayOfWeekEnum?: DayOfWeek[];

  /**  */
  details?: ShopWorkCalendarDetailDto[];
}

export interface ShopWorkShiftDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  name?: string;

  /**  */
  startDate?: Date;

  /**  */
  endDate?: Date;

  /**  */
  openingCash?: number;

  /**  */
  employeeId?: string;

  /**  */
  openingEmployeeId?: string;

  /**  */
  invoiceQty?: number;

  /**  */
  invoiceAmount?: number;

  /**  */
  returnInvoiceQty?: number;

  /**  */
  returnInvoiceAmount?: number;

  /**  */
  importStockQty?: number;

  /**  */
  importStockAmount?: number;

  /**  */
  returnImportStockQty?: number;

  /**  */
  returnImportStockAmount?: number;

  /**  */
  otherReceiptAmount?: number;

  /**  */
  otherPaymentAmount?: number;

  /**  */
  differenceCash?: number;

  /**  */
  expectedCash?: number;

  /**  */
  closingCash?: number;

  /**  */
  closingEmployeeId?: string;

  /**  */
  notes?: string;

  /**  */
  status?: SHOP_WORKSHIFT_STATUS;

  /**  */
  openingEmployeeName?: string;

  /**  */
  closingEmployeeName?: string;

  /**  */
  details?: SaleWorkShiftDetailDto[];
}

export interface ShopWorkShiftGetPagedInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  dateRange?: DateRangeDto;

  /**  */
  status?: SHOP_WORKSHIFT_STATUS;
}

export interface SpendingInformationOutputDto {
  /**  */
  accountClass?: number;

  /**  */
  spentAmount?: number;

  /**  */
  spentAmountNeedUpgrade?: number;

  /**  */
  percentSpentAmount?: number;

  /**  */
  numberOfOrders?: number;

  /**  */
  numberOfOrdersNeedUpgrade?: number;

  /**  */
  percentNumberOfOrders?: number;
}

export interface StockDisposalReportOutputDto {
  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  numberOfDestruction?: number;

  /**  */
  valueOfDestruction?: number;
}

export interface StockDisposalReportPagingInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  inventoryId?: number;
}

export interface StockDisposalReportPagingOutputDto {
  /**  */
  items?: StockDisposalReportOutputDto[];

  /**  */
  totalCount?: string;

  /**  */
  numberOfDestruction?: number;

  /**  */
  valueOfDestruction?: number;
}

export interface StockInventoryDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  inventoryType?: number;

  /**  */
  inventoryCode?: string;

  /**  */
  inventoryName?: string;

  /**  */
  inventoryAddress?: string;

  /**  */
  inventoryTel?: string;

  /**  */
  inventoryEmail?: string;

  /**  */
  isActived?: boolean;

  /**  */
  listEmployeeId?: string[];

  /**  */
  strListEmployeeId?: string;
}

export interface StockInventoryLineDetailEntity {
  /**  */
  id?: string;

  /**  */
  creationTime?: Date;

  /**  */
  creatorId?: string;

  /**  */
  lastModificationTime?: Date;

  /**  */
  lastModifierId?: string;

  /**  */
  isDeleted?: boolean;

  /**  */
  deleterId?: string;

  /**  */
  deletionTime?: Date;

  /**  */
  shopId?: number;

  /**  */
  tenantId?: string;

  /**  */
  qty?: number;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  inventoryId?: string;

  /**  */
  stockInventoryRootDetailId?: string;

  /**  */
  productId?: string;

  /**  */
  costPrice?: number;
}

export interface StockInventoryMoveBaseDto {
  /**  */
  moveId?: string;

  /**  */
  moveHashId?: string;

  /**  */
  inventoryId?: string;

  /**  */
  inventoryName?: string;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  moveStatus?: MOVE_STATUS;

  /**  */
  moveCode?: string;

  /**  */
  moveDate?: Date;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountValue?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxDiscountPercent?: number;

  /**  */
  taxDiscountCode?: string;

  /**  */
  taxDiscountName?: string;

  /**  */
  taxDiscountAmount?: number;

  /**  */
  discountAmountCaculate?: number;

  /**  */
  discountAmountDisplay?: number;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  totalAmountRound?: number;

  /**  */
  paymentAmount?: number;

  /**  */
  debtAmount?: number;

  /**  */
  paymentStatus?: number;

  /**  */
  paymentMethod?: number;

  /**  */
  paymentMethodName?: string;

  /**  */
  totalQty?: number;

  /**  */
  invoiceId?: string;

  /**  */
  invoiceCode?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  note?: string;

  /**  */
  partnerId?: string;

  /**  */
  partnerName?: string;

  /**  */
  partnerType?: number;

  /**  */
  relatedMoveId?: string;

  /**  */
  relatedMoveIdHash?: string;

  /**  */
  relatedMoveCode?: string;

  /**  */
  relatedMoveDate?: Date;

  /**  */
  relatedMoveType?: MOVE_TYPE;

  /**  */
  relatedMoveStatus?: MOVE_STATUS;

  /**  */
  totalReturnQty?: number;

  /**  */
  cancelReason?: string;

  /**  */
  creatorId?: string;

  /**  */
  partnerInvoiceCode?: string;

  /**  */
  partnerInvoiceDate?: Date;
}

export interface StockInventoryMoveEntity {
  /**  */
  id?: string;

  /**  */
  creationTime?: Date;

  /**  */
  creatorId?: string;

  /**  */
  lastModificationTime?: Date;

  /**  */
  lastModifierId?: string;

  /**  */
  isDeleted?: boolean;

  /**  */
  deleterId?: string;

  /**  */
  deletionTime?: Date;

  /**  */
  shopId?: number;

  /**  */
  tenantId?: string;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  moveCode?: string;

  /**  */
  moveDate?: Date;

  /**  */
  relatedMoveId?: string;

  /**  */
  relatedMoveType?: MOVE_TYPE;

  /**  */
  relatedMoveCode?: string;

  /**  */
  relatedMoveDate?: Date;

  /**  */
  relatedMoveStatus?: MOVE_STATUS;

  /**  */
  invoiceId?: string;

  /**  */
  invoiceCode?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  partnerId?: string;

  /**  */
  partnerType?: PARTNER_TYPE;

  /**  */
  creatorEmployeeName?: string;

  /**  */
  creatorEmployeeId?: string;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxDiscountPercent?: number;

  /**  */
  taxDiscountCode?: string;

  /**  */
  taxDiscountAmount?: number;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  totalAmountRound?: number;

  /**  */
  paymentAmount?: number;

  /**  */
  debtAmount?: number;

  /**  */
  totalQty?: number;

  /**  */
  totalReturnQty?: number;

  /**  */
  cancelDate?: Date;

  /**  */
  cancelEmployeeId?: string;

  /**  */
  cancelReason?: string;

  /**  */
  paymentStatus?: number;

  /**  */
  paymentMethod?: PAYMENT_METHOD;

  /**  */
  moveStatus?: MOVE_STATUS;

  /**  */
  inventoryId?: string;

  /**  */
  relatedShopId?: string;

  /**  */
  relatedInventoryId?: string;

  /**  */
  salePartnerId?: string;

  /**  */
  note?: string;

  /**  */
  connectNationalDrugSystemDate?: Date;

  /**  */
  debtDueDate?: Date;

  /**  */
  totalReturnPayment?: number;

  /**  */
  totalReturnAmount?: number;

  /**  */
  partnerInvoiceCode?: string;

  /**  */
  partnerInvoiceDate?: Date;
}

export interface StockMoveItemShortDto {
  /**  */
  productName?: string;

  /**  */
  qty?: number;

  /**  */
  unitName?: string;

  /**  */
  price?: number;
}

export interface StockMovePagedCountDto {
  /**  */
  moveStatus?: number;

  /**  */
  totalCount?: number;
}

export interface StockMovePagedOutputDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  moveTypeStr?: string;

  /**  */
  moveCode?: string;

  /**  */
  moveDate?: Date;

  /**  */
  partnerId?: string;

  /**  */
  partnerName?: string;

  /**  */
  totalAmount?: number;

  /**  */
  totalAmountRound?: number;

  /**  */
  paymentAmount?: number;

  /**  */
  debtAmount?: number;

  /**  */
  moveStatus?: MOVE_STATUS;

  /**  */
  moveStatusStr?: string;

  /**  */
  note?: string;

  /**  */
  relatedInventoryId?: string;

  /**  */
  relatedInventoryName?: string;

  /**  */
  relatedShopId?: string;

  /**  */
  relatedShopName?: string;

  /**  */
  relatedMoveStatus?: MOVE_STATUS;

  /**  */
  inventoryId?: string;

  /**  */
  inventoryName?: string;

  /**  */
  shopId?: number;

  /**  */
  shopName?: string;

  /**  */
  isReadOnly?: boolean;
}

export interface StockMovePagedRequestDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  moveDateRange?: DateRangeDto;

  /**  */
  inventoryId?: string;

  /**  */
  partnerId?: string;

  /**  */
  moveStatus?: number;

  /**  */
  moveType?: number;

  /**  */
  desiredDeliveryDate?: Date;

  /**  */
  shopId?: number;

  /**  */
  listMoveType?: MOVE_TYPE[];

  /**  */
  paymentMethod?: PAYMENT_METHOD;
}

export interface StockProductSelectCommand {
  /**  */
  products?: StockProductSelectProductInput[];

  /**  */
  inventoryId?: string;

  /**  */
  moveType?: number;
}

export interface StockProductSelectDto {
  /**  */
  uuid?: string;

  /**  */
  productId?: string;

  /**  */
  productName?: string;

  /**  */
  isProductUseInventory?: boolean;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  price?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  costPrice?: number;

  /**  */
  latestImportPrice?: number;

  /**  */
  productUnitId?: string;

  /**  */
  unitName?: string;

  /**  */
  convertRate?: number;

  /**  */
  units?: StockProductSelectUnitDto[];

  /**  */
  lotNumbers?: StockProductUnitDto[];

  /**  */
  inventoryId?: string;

  /**  */
  qty?: number;

  /**  */
  subTaxAmount?: number;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  totalAmountAfterDiscount?: number;
}

export interface StockProductSelectProductInput {
  /**  */
  productUnitId?: string;

  /**  */
  productId?: string;
}

export interface StockProductSelectUnitDto {
  /**  */
  productUnitId?: string;

  /**  */
  isBasicUnit?: boolean;

  /**  */
  productId?: string;

  /**  */
  unitName?: string;

  /**  */
  convertRate?: number;

  /**  */
  costPrice?: number;

  /**  */
  latestImportPrice?: number;
}

export interface StockProductUnitDto {
  /**  */
  inventoryLineDetailsId?: string;

  /**  */
  lotNumber?: string;

  /**  */
  costPrice?: number;

  /**  */
  expiryDate?: Date;

  /**  */
  qty?: number;
}

export interface StockReportCommodityExpiryOutputDto {
  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  lotNumber?: string;

  /**  */
  qty?: number;

  /**  */
  daysRemaining?: number;

  /**  */
  expiryDate?: Date;
}

export interface StockReportCommodityExpiryPagingInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  expiryDay?: Date;

  /**  */
  inventoryId?: number;

  /**  */
  status?: number;
}

export interface StockReportCommodityPlanOutputDto {
  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  inventoryQtyMax?: number;

  /**  */
  inventoryQty?: number;

  /**  */
  forecast?: number;
}

export interface StockReportCommodityPlanPagingInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  inventoryId?: number;

  /**  */
  productType?: ProductTypeEnum;

  /**  */
  listProductGroup?: number[];
}

export interface StockReportImportExportInventoryInputDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  rangeDate?: DateRangeDto;

  /**  */
  inventoryId?: number;
}

export interface StockReportImportExportInventoryOutputDto {
  /**  */
  productId?: string;

  /**  */
  productCode?: string;

  /**  */
  productName?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  qty?: number;

  /**  */
  openingQuantity?: number;

  /**  */
  openingValue?: number;

  /**  */
  importQuantity?: number;

  /**  */
  importValue?: number;

  /**  */
  customerReturnQuantity?: number;

  /**  */
  customerReturnValue?: number;

  /**  */
  checkQuantity?: number;

  /**  */
  checkValue?: number;

  /**  */
  exportQuantity?: number;

  /**  */
  exportValue?: number;

  /**  */
  closingQuantity?: number;

  /**  */
  closingValue?: number;

  /**  */
  isActived?: boolean;

  /**  */
  isActivedStr?: string;
}

export interface StockReportPageListImportExportInventoryOutputDto {
  /**  */
  items?: StockReportImportExportInventoryOutputDto[];

  /**  */
  totalCount?: string;

  /**  */
  qty?: number;

  /**  */
  openingQuantity?: number;

  /**  */
  openingValue?: number;

  /**  */
  importQuantity?: number;

  /**  */
  importValue?: number;

  /**  */
  customerReturnQuantity?: number;

  /**  */
  customerReturnValue?: number;

  /**  */
  checkQuantity?: number;

  /**  */
  checkValue?: number;

  /**  */
  exportQuantity?: number;

  /**  */
  exportValue?: number;

  /**  */
  closingQuantity?: number;

  /**  */
  closingValue?: number;
}

export interface StockSearchWithUnitCommand {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  productTypeId?: ProductTypeEnum;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  inventoryId?: string;

  /**  */
  listProductGroupId?: string[];
}

export interface SummaryPaggingAcountMove {
  /**  */
  status?: MOVE_STATUS;

  /**  */
  strStatus?: string;

  /**  */
  count?: number;
}

export interface SummaryStockReportCommodityExpiryOutputDto {
  /**  */
  status?: number;

  /**  */
  strStatus?: string;

  /**  */
  count?: number;
}

export interface SummaryTotalClosingShiftDto {
  /**  */
  id?: string;

  /**  */
  startDate?: Date;

  /**  */
  endDate?: Date;

  /**  */
  name?: string;

  /**  */
  openingCash?: number;

  /**  */
  openingEmployeeId?: string;

  /**  */
  closingEmployeeId?: string;

  /**  */
  invoiceQty?: number;

  /**  */
  invoiceAmount?: number;

  /**  */
  returnInvoiceQty?: number;

  /**  */
  returnInvoiceAmount?: number;

  /**  */
  importStockQty?: number;

  /**  */
  importStockAmount?: number;

  /**  */
  returnImportStockQty?: number;

  /**  */
  returnImportStockAmount?: number;

  /**  */
  otherReceiptAmount?: number;

  /**  */
  otherPaymentAmount?: number;

  /**  */
  differenceCash?: number;

  /**  */
  expectedCash?: number;

  /**  */
  closingCash?: number;

  /**  */
  details?: SaleWorkShiftDetailDto[];
}

export interface SummaryTotalClosingShiftQuery {
  /**  */
  shopWorkShiftId?: string;

  /**  */
  endDate?: Date;
}

export interface SupplierDebtReportDto {
  /**  */
  customerName?: string;

  /**  */
  customerCode?: string;

  /**  */
  beginingDebtPeriod?: number;

  /**  */
  endingDebtPeriod?: number;

  /**  */
  duringDebtPeriod?: number;

  /**  */
  totalPurchase?: number;

  /**  */
  totalPayment?: number;
}

export interface SupplierProductReportDto {
  /**  */
  supplierName?: string;

  /**  */
  supplierCode?: string;

  /**  */
  productName?: string;

  /**  */
  productCode?: string;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  unitName?: string;

  /**  */
  moveCode?: string;

  /**  */
  totalAmount?: number;

  /**  */
  returnTotalAmount?: number;

  /**  */
  moveQty?: number;

  /**  */
  returnQty?: number;

  /**  */
  price?: number;

  /**  */
  totalMove?: number;

  /**  */
  transactionDate?: Date;

  /**  */
  productCount?: number;
}

export interface SuspectedDrug {
  /**  */
  drugName?: string;

  /**  */
  concentration?: string;

  /**  */
  singleDose?: string;

  /**  */
  dosageFrequency?: string;

  /**  */
  administrationRoute?: string;

  /**  */
  treatmentStartDate?: Date;

  /**  */
  treatmentEndDate?: Date;

  /**  */
  batchNumber?: string;

  /**  */
  expiryDate?: string;

  /**  */
  manufacturer?: string;
}

export interface SyncDataRequestInputDto {
  /**  */
  listId?: string[];

  /**  */
  lastModificationTime?: Date;

  /**  */
  shopId?: number;
}

export interface SyncNationalDrugModel {
  /**  */
  facilityCode?: string;

  /**  */
  drugCode?: string;

  /**  */
  lotNumber?: string;

  /**  */
  qty?: string;

  /**  */
  expiryDate?: string;

  /**  */
  registrationNumber?: string;

  /**  */
  productName?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  manufacturer?: string;

  /**  */
  strength?: string;
}

export interface SystemShopLoyaltyDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  name?: string;

  /**  */
  isActive?: boolean;

  /**  */
  accumulateValue?: number;

  /**  */
  redeemValue?: number;

  /**  */
  isConvertPointWithInvoiceDiscount?: boolean;

  /**  */
  isConvertPointWithInvoiceUsePoint?: boolean;

  /**  */
  isUsePointAfterNumberOfInvoice?: boolean;

  /**  */
  usePointAfterNumberOfInvoice?: number;

  /**  */
  upgradeTierType?: number;

  /**  */
  listTier?: SystemShopLoyaltyTierDto[];
}

export interface SystemShopLoyaltyTierDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  loyaltyId?: string;

  /**  */
  code?: string;

  /**  */
  name?: string;

  /**  */
  isActive?: boolean;

  /**  */
  accumulateValue?: number;

  /**  */
  redeemValue?: number;

  /**  */
  upgradeValue?: number;

  /**  */
  notes?: string;

  /**  */
  level?: number;
}

export interface TableGridDto {
  /**  */
  tableId?: string;

  /**  */
  tableName?: string;

  /**  */
  tableCode?: string;

  /**  */
  orderCode?: string;

  /**  */
  orderDate?: Date;

  /**  */
  orderDateStr?: string;

  /**  */
  status?: TABLE_STATUS_ENUM;

  /**  */
  statusStr?: string;

  /**  */
  areaId?: string;

  /**  */
  areaName?: string;

  /**  */
  numberOfAdult?: number;

  /**  */
  numberOfChildren?: number;

  /**  */
  numberOfCustomer?: number;

  /**  */
  numberOfReservation?: number;

  /**  */
  numberOfOrder?: number;

  /**  */
  reservationId?: string;

  /**  */
  reservationDate?: Date;

  /**  */
  reservationDateStr?: string;

  /**  */
  totalAmountOrder?: number;

  /**  */
  totalMinutesOrder?: number;

  /**  */
  totalDateDisplay?: string;

  /**  */
  partnerPhone?: string;

  /**  */
  partnerName?: string;

  /**  */
  checked?: boolean;
}

export interface TableGridPagedDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  areaId?: string;
}

export interface TableStatusCounterDetailDto {
  /**  */
  status?: TABLE_STATUS_ENUM;

  /**  */
  statusName?: string;

  /**  */
  count?: number;
}

export interface TableStatusCounterDto {
  /**  */
  id?: string;

  /**  */
  areaCode?: string;

  /**  */
  areaName?: string;

  /**  */
  tables?: TableStatusCounterDetailDto[];
}

export interface TableStatusCounterInputDto {
  /**  */
  filter?: string;
}

export interface TableTreeDto {
  /**  */
  title?: string;

  /**  */
  value?: any | null;

  /**  */
  disabled?: boolean;

  /**  */
  children?: TableTreeDto[];
}

export interface TaxLiabilityBookDetailDto {
  /**  */
  descriptions?: string;

  /**  */
  moveCode?: string;

  /**  */
  moveDate?: Date;

  /**  */
  moveDateStr?: string;

  /**  */
  notes?: string;

  /**  */
  taxMustPay?: number;

  /**  */
  taxPaid?: number;
}

export interface TaxLiabilityBookSummaryDto {
  /**  */
  openingBalance?: number;

  /**  */
  taxMustPay?: number;

  /**  */
  taxPaid?: number;

  /**  */
  closingBalance?: number;
}

export interface TaxLiabilityGroupTypeDto {
  /**  */
  typeId?: number;

  /**  */
  name?: string;

  /**  */
  children?: TaxLiabilitySubGroupTypeDto[];
}

export interface TaxLiabilitySubGroupTypeDto {
  /**  */
  id?: string;

  /**  */
  name?: string;
}

export interface TeeTimeAvailabilityDto {
  /**  */
  teeTimeConfigId?: string;

  /**  */
  teeTimeId?: string;

  /**  */
  courseId?: string;

  /**  */
  playDate?: Date;

  /**  */
  teeTimeType?: TeetimeTypeEnum;

  /**  */
  startTime?: TimeSpan;

  /**  */
  endTime?: TimeSpan;

  /**  */
  maxGroupPerFlight?: number;

  /**  */
  availableSlots?: number;

  /**  */
  sourceType?: string;

  /**  */
  listAvailableSlots?: string;

  /**  */
  isAvailable?: boolean;
}

export interface TeeTimeBookingInputDto {
  /**  */
  courseId?: string;

  /**  */
  playDate?: Date;
}

export interface TemplatePrinterDto {
  /**  */
  id?: string;

  /**  */
  templatePrintEnumId?: TEMPLATE_PRINTER;

  /**  */
  name?: string;

  /**  */
  fileName?: string;

  /**  */
  documentId?: string;

  /**  */
  notes?: string;

  /**  */
  isActived?: boolean;

  /**  */
  isDefault?: boolean;

  /**  */
  dictionaryPath?: string;

  /**  */
  fileInfo?: TplFileInfo;
}

export interface TemplatePrinterGroupDto {
  /**  */
  templatePrintEnumId?: TEMPLATE_PRINTER;

  /**  */
  staticName?: string;

  /**  */
  details?: TemplatePrinterDto[];

  /**  */
  itemDefaultByDev?: TemplatePrinterDto;
}

export interface TenantCreateCommand {
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

  /**  */
  isStock?: boolean;

  /**  */
  type?: TenantType;

  /**  */
  userNameAdminTenant?: string;

  /**  */
  passwordAdminTenant?: string;

  /**  */
  emailAdminTenant?: string;

  /**  */
  mainShopName?: string;

  /**  */
  mainShopAddress?: string;

  /**  */
  ownerIdentityNumber?: string;

  /**  */
  ownerPhone?: string;

  /**  */
  ownerName?: string;

  /**  */
  packageRegistrationId?: number;

  /**  */
  shopType?: ShopType;

  /**  */
  businessType?: number;
}

export interface TenantDto {
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

  /**  */
  isStock?: boolean;

  /**  */
  type?: TenantType;
}

export interface TimeRange {
  /**  */
  startTime?: TimeSpan;

  /**  */
  endTime?: TimeSpan;
}

export interface TimeSpan {
  /**  */
  ticks?: string;

  /**  */
  days?: number;

  /**  */
  hours?: number;

  /**  */
  milliseconds?: number;

  /**  */
  microseconds?: number;

  /**  */
  nanoseconds?: number;

  /**  */
  minutes?: number;

  /**  */
  seconds?: number;

  /**  */
  totalDays?: number;

  /**  */
  totalHours?: number;

  /**  */
  totalMilliseconds?: number;

  /**  */
  totalMicroseconds?: number;

  /**  */
  totalNanoseconds?: number;

  /**  */
  totalMinutes?: number;

  /**  */
  totalSeconds?: number;
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

export interface TplFileInfo {
  /**  */
  templatePrintId?: string;

  /**  */
  name?: string;

  /**  */
  templatePrintEnumId?: TEMPLATE_PRINTER;

  /**  */
  fileName?: string;

  /**  */
  isDefault?: boolean;

  /**  */
  fileId?: string;

  /**  */
  mimeType?: string;

  /**  */
  blobContainerPath?: string;

  /**  */
  absPath?: string;
}

export interface TrackingItemsInput {
  /**  */
  trackingItems?: ShopWeatherDataDto[];
}

export interface TransferStockMoveDetailDto {
  /**  */
  uuid?: string;

  /**  */
  inventoryId?: string;

  /**  */
  inventoryRootDetailId?: string;

  /**  */
  inventoryLineDetailId?: string;

  /**  */
  moveId?: string;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  moveCode?: string;

  /**  */
  moveDate?: Date;

  /**  */
  productId?: string;

  /**  */
  productHashId?: string;

  /**  */
  productName?: string;

  /**  */
  productUnitId?: string;

  /**  */
  unitName?: string;

  /**  */
  productTypeId?: number;

  /**  */
  productCategoryId?: number;

  /**  */
  productSubCategoryId?: number;

  /**  */
  isProductUseLotNumber?: boolean;

  /**  */
  lotNumberId?: string;

  /**  */
  lotNumber?: string;

  /**  */
  expiryDate?: Date;

  /**  */
  invoiceId?: string;

  /**  */
  qty?: number;

  /**  */
  qtyConvert?: number;

  /**  */
  convertRate?: number;

  /**  */
  returnQty?: number;

  /**  */
  price?: number;

  /**  */
  latestImportPrice?: number;

  /**  */
  priceWithTax?: number;

  /**  */
  isPriceIncludeTax?: boolean;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountValue?: number;

  /**  */
  subTaxAmount?: number;

  /**  */
  subTotalAmount?: number;

  /**  */
  taxDiscountAmountAllocation?: number;

  /**  */
  discountAmountCaculate?: number;

  /**  */
  discountAmount?: number;

  /**  */
  totalAmountAfterDiscount?: number;

  /**  */
  discountAmountAllocation?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  taxAmount?: number;

  /**  */
  taxName?: string;

  /**  */
  totalAmount?: number;

  /**  */
  status?: MOVE_STATUS;

  /**  */
  costPrice?: number;

  /**  */
  totalCostAmount?: number;

  /**  */
  partnerId?: string;

  /**  */
  partnerType?: number;

  /**  */
  relatedMoveId?: string;

  /**  */
  relatedMoveRootDetailId?: string;

  /**  */
  relatedMoveLineDetailId?: string;

  /**  */
  productDetail?: ProductStockViewDto;

  /**  */
  moveLineDetailId?: string;

  /**  */
  moveRootDetailId?: string;

  /**  */
  lotNumbers?: StockProductUnitDto[];

  /**  */
  units?: StockProductSelectUnitDto[];

  /**  */
  maxQtyEnable?: number;

  /**  */
  inventoryQty?: number;

  /**  */
  shopId?: number;

  /**  */
  note?: string;
}

export interface TransferStockMoveDto {
  /**  */
  moveId?: string;

  /**  */
  moveHashId?: string;

  /**  */
  inventoryId?: string;

  /**  */
  inventoryName?: string;

  /**  */
  moveType?: MOVE_TYPE;

  /**  */
  moveStatus?: MOVE_STATUS;

  /**  */
  moveCode?: string;

  /**  */
  moveDate?: Date;

  /**  */
  discountType?: DiscountTypeEnum;

  /**  */
  discountValue?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxDiscountPercent?: number;

  /**  */
  taxDiscountCode?: string;

  /**  */
  taxDiscountName?: string;

  /**  */
  taxDiscountAmount?: number;

  /**  */
  discountAmountCaculate?: number;

  /**  */
  discountAmountDisplay?: number;

  /**  */
  totalAmountBeforeDiscount?: number;

  /**  */
  totalAmountBeforeTax?: number;

  /**  */
  taxAmount?: number;

  /**  */
  totalAmount?: number;

  /**  */
  totalAmountRound?: number;

  /**  */
  paymentAmount?: number;

  /**  */
  debtAmount?: number;

  /**  */
  paymentStatus?: number;

  /**  */
  paymentMethod?: number;

  /**  */
  paymentMethodName?: string;

  /**  */
  totalQty?: number;

  /**  */
  invoiceId?: string;

  /**  */
  invoiceCode?: string;

  /**  */
  invoiceDate?: Date;

  /**  */
  note?: string;

  /**  */
  partnerId?: string;

  /**  */
  partnerName?: string;

  /**  */
  partnerType?: number;

  /**  */
  relatedMoveId?: string;

  /**  */
  relatedMoveIdHash?: string;

  /**  */
  relatedMoveCode?: string;

  /**  */
  relatedMoveDate?: Date;

  /**  */
  relatedMoveType?: MOVE_TYPE;

  /**  */
  relatedMoveStatus?: MOVE_STATUS;

  /**  */
  totalReturnQty?: number;

  /**  */
  cancelReason?: string;

  /**  */
  creatorId?: string;

  /**  */
  partnerInvoiceCode?: string;

  /**  */
  partnerInvoiceDate?: Date;

  /**  */
  toShopId?: number;

  /**  */
  toInventoryId?: string;

  /**  */
  relatedInventoryId?: string;

  /**  */
  relatedShopId?: string;

  /**  */
  relatedShopName?: string;

  /**  */
  shopId?: number;

  /**  */
  shopName?: string;
}

export interface TransferStockTicketDto {
  /**  */
  productInTicket?: ProductMoveStockDto[];

  /**  */
  moveDto?: TransferStockMoveDto;

  /**  */
  items?: TransferStockMoveDetailDto[];

  /**  */
  moveDateOld?: Date;

  /**  */
  isDraft?: boolean;

  /**  */
  totalCostPriceInMove?: number;

  /**  */
  receiveRelatedMoveId?: string;
}

export interface TreeUserHostAssignDto {
  /**  */
  roleTreeData?: TreeUserHostAssignNote[];

  /**  */
  listRoleAssignId?: string[];
}

export interface TreeUserHostAssignNote {
  /**  */
  id?: string;

  /**  */
  name?: string;

  /**  */
  code?: string;
}

export interface TreeUserShopAssignDto {
  /**  */
  shopAssigned?: string[];

  /**  */
  treeData?: TreeUserShopNode[];
}

export interface TreeUserShopNode {
  /**  */
  title?: string;

  /**  */
  key?: string;

  /**  */
  children?: TreeUserShopNode[];
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

export interface UnBlockTeeTimeInputDto {
  /**  */
  teeTimeBookingIds?: string[];
}

export interface UnassignUserCommand {
  /**  */
  userId?: string;

  /**  */
  roleId?: string;

  /**  */
  isTemplateTenant?: boolean;
}

export interface UpdateCommand {
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
  dynamicInformation?: object;

  /**  */
  listRoleId?: string[];

  /**  */
  listPermission?: string[];

  /**  */
  extendData?: any | null;

  /**  */
  mustChangePassword?: boolean;

  /**  */
  lastModificationTime?: Date;

  /**  */
  birthDay?: Date;

  /**  */
  id?: string;

  /**  */
  password?: string;

  /**  */
  listShopRole?: string[];

  /**  */
  employeeId?: string;
}

export interface UpdateEmployeePayrollDetailDto {
  /**  */
  id?: string;

  /**  */
  idHash?: string;

  /**  */
  publishViewId?: string;

  /**  */
  payrollId?: string;

  /**  */
  employeeId?: string;

  /**  */
  employeeName?: string;

  /**  */
  timesheetId?: string;

  /**  */
  totalWorkDay?: number;

  /**  */
  actualWorkDay?: number;

  /**  */
  salaryAmount?: number;

  /**  */
  actualSalaryAmount?: number;

  /**  */
  taxableAllowanceAmount?: number;

  /**  */
  allowanceAmount?: number;

  /**  */
  insuranceAllowanceAmount?: number;

  /**  */
  socialInsuranceAmount?: number;

  /**  */
  healthInsuranceAmount?: number;

  /**  */
  unemploymentInsuranceAmount?: number;

  /**  */
  totalInsuranceDeduction?: number;

  /**  */
  companySocialInsuranceAmount?: number;

  /**  */
  companyHealthInsuranceAmount?: number;

  /**  */
  companyUnemploymentInsuranceAmount?: number;

  /**  */
  totalCompanyInsuranceAmount?: number;

  /**  */
  insuranceSalaryAmount?: number;

  /**  */
  personalDeductionAmount?: number;

  /**  */
  dependentDeductionAmount?: number;

  /**  */
  numberOfDependentPerson?: number;

  /**  */
  totalDependentDeductionAmount?: number;

  /**  */
  totalOtherDeductionAmount?: number;

  /**  */
  totalDeductionAmount?: number;

  /**  */
  totalTaxableIncome?: number;

  /**  */
  taxableIncome?: number;

  /**  */
  personalIncomeTaxAmount?: number;

  /**  */
  totalAfterTaxIncome?: number;

  /**  */
  takeHomeSalary?: number;

  /**  */
  totalSalaryAmount?: number;

  /**  */
  status?: PAYROLL_DETAIL_STATUS;

  /**  */
  paymentTotalSalary?: number;

  /**  */
  payingAmount?: number;

  /**  */
  notes?: string;

  /**  */
  allowances?: EmployeePayrollDetailPayslipDto[];
}

export interface UpdateImgUrlProductCommand {
  /**  */
  idHash?: string;

  /**  */
  imgUrl?: string;

  /**  */
  imgIndex?: number;
}

export interface UpdateIntegratedDrugExpiryModel {
  /**  */
  facilityCode?: string;

  /**  */
  expiryDate?: string;

  /**  */
  lotNumber?: string;

  /**  */
  drugCode?: string;
}

export interface UpdateListUnitCommand {
  /**  */
  isProductPriceIncludeTax?: boolean;

  /**  */
  taxPercent?: number;

  /**  */
  productIdHash?: string;

  /**  */
  productId?: string;

  /**  */
  basicUnitId?: string;

  /**  */
  basicUnitCode?: string;

  /**  */
  basicUnitName?: string;

  /**  */
  basicUnitPrice?: number;

  /**  */
  basicUnitPriceWithTax?: number;

  /**  */
  unitItems?: ProductUnitDto[];
}

export interface UpdateLotNumberDto {
  /**  */
  id?: string;

  /**  */
  expiryDate?: Date;
}

export interface UpdateOrderDetailDto {
  /**  */
  id?: string;

  /**  */
  orderId?: string;

  /**  */
  productId?: string;

  /**  */
  productUnitId?: string;

  /**  */
  qty?: number;

  /**  */
  qtyConvert?: number;

  /**  */
  convertRate?: number;

  /**  */
  price?: number;

  /**  */
  discountType?: number;

  /**  */
  discountPercent?: number;

  /**  */
  discountAmount?: number;

  /**  */
  taxPercent?: number;

  /**  */
  taxCode?: string;

  /**  */
  notes?: string;
}

export interface UpdateOrderDto {
  /**  */
  id?: string;

  /**  */
  orderCode?: string;

  /**  */
  partnerId?: string;

  /**  */
  orderDate?: Date;

  /**  */
  status?: ORDER_STATUS;

  /**  */
  tableId?: string;

  /**  */
  notes?: string;

  /**  */
  details?: UpdateOrderDetailDto[];
}

export interface UpdateUserHostCommand {
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
  dynamicInformation?: object;

  /**  */
  listRoleId?: string[];

  /**  */
  listPermission?: string[];

  /**  */
  extendData?: any | null;

  /**  */
  mustChangePassword?: boolean;

  /**  */
  lastModificationTime?: Date;

  /**  */
  birthDay?: Date;

  /**  */
  id?: string;

  /**  */
  employeeId?: string;

  /**  */
  password?: string;
}

export interface UpdateUserInformationCommand {
  /**  */
  name?: string;

  /**  */
  email?: string;

  /**  */
  phoneNumber?: string;

  /**  */
  extendData?: any | null;
}

export interface UserAssignOrUnassignOneRoleCommand {
  /**  */
  userId?: string;

  /**  */
  roleId?: string;

  /**  */
  isNewAssign?: boolean;
}

export interface UserAssignRoleCommand {
  /**  */
  userId?: string;

  /**  */
  listRoleId?: string[];

  /**  */
  listPermission?: string[];
}

export interface UserBaseDto {
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
  dynamicInformation?: object;

  /**  */
  listRoleId?: string[];

  /**  */
  listPermission?: string[];

  /**  */
  extendData?: any | null;

  /**  */
  mustChangePassword?: boolean;

  /**  */
  lastModificationTime?: Date;

  /**  */
  birthDay?: Date;
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

export interface UserDto {
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
  dynamicInformation?: object;

  /**  */
  listRoleId?: string[];

  /**  */
  listPermission?: string[];

  /**  */
  extendData?: any | null;

  /**  */
  mustChangePassword?: boolean;

  /**  */
  lastModificationTime?: Date;

  /**  */
  birthDay?: Date;

  /**  */
  id?: string;

  /**  */
  employeeId?: string;
}

export interface UserFireBaseTokenDto {
  /**  */
  id?: string;

  /**  */
  fireBaseToken?: string;

  /**  */
  userId?: string;

  /**  */
  platform?: string;

  /**  */
  version?: string;
}

export interface UserGetPagedQuery {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  extendFilter?: any | null;

  /**  */
  level?: string;

  /**  */
  userName?: string;

  /**  */
  birthDay?: DateRangeDto;
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
  dynamicInformation?: object;

  /**  */
  listRoleId?: string[];

  /**  */
  listPermission?: string[];

  /**  */
  extendData?: any | null;

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
  tenantDto?: any | null;

  /**  */
  isSuperAdmin?: boolean;

  /**  */
  packageRegistrationCode?: string;
}

export interface ValetGetCustomerInforReq {
  /**  */
  bookingId?: string;

  /**  */
  bookingPlayerId?: string;

  /**  */
  bookingGroupId?: string;
}

export interface ValidateErrorDetail {
  /**  */
  error?: string;

  /**  */
  data?: any | null;
}

export interface ValidateInputDto {
  /**  */
  propertyName?: string;

  /**  */
  errorMessage?: string;

  /**  */
  errorCode?: string;
}

export interface ValidateProductImportResultOfProductImportDto {
  /**  */
  errorFile?: FileUploadDto;

  /**  */
  successFile?: FileUploadDto;

  /**  */
  listSuccess?: ProductImportDto[];

  /**  */
  listError?: ProductImportDto[];
}

export interface ValidateProductImportResultOfProductImportKiotVietDto {
  /**  */
  errorFile?: FileUploadDto;

  /**  */
  successFile?: FileUploadDto;

  /**  */
  listSuccess?: ProductImportKiotVietDto[];

  /**  */
  listError?: ProductImportKiotVietDto[];
}

export interface ValueTupleOfStringString {}

export interface Version {
  /**  */
  major?: number;

  /**  */
  minor?: number;

  /**  */
  build?: number;

  /**  */
  revision?: number;

  /**  */
  majorRevision?: number;

  /**  */
  minorRevision?: number;
}

export interface VietQrBaseResOfVietQrImgOutputDto {
  /**  */
  code?: string;

  /**  */
  desc?: string;

  /**  */
  data?: VietQrImgOutputDto;
}

export interface VietQrImgInputDto {
  /**  */
  totalAmount?: number;

  /**  */
  noidungthu?: string;

  /**  */
  template?: string;

  /**  */
  format?: string;

  /**  */
  sotk?: string;

  /**  */
  tentk?: string;

  /**  */
  bankcode?: string;
}

export interface VietQrImgOutputDto {
  /**  */
  qrCode?: string;

  /**  */
  qrDataUrl?: string;
}

export interface VoucherAvailableDto {
  /**  */
  code?: string;

  /**  */
  id?: number;

  /**  */
  shopId?: string;
}

export interface VoucherDto {
  /**  */
  quantity?: number;

  /**  */
  code?: string;

  /**  */
  name?: string;
}

export interface WardDto {
  /**  */
  id?: number;

  /**  */
  countryId?: number;

  /**  */
  countryCode?: string;

  /**  */
  countryName?: string;

  /**  */
  stateId?: number;

  /**  */
  stateCode?: string;

  /**  */
  stateName?: string;

  /**  */
  districtId?: number;

  /**  */
  districtCode?: string;

  /**  */
  districtName?: string;

  /**  */
  wardCode?: string;

  /**  */
  wardName?: string;

  /**  */
  wardLevel?: string;

  /**  */
  areaFullName?: string;

  /**  */
  areaShortName?: string;

  /**  */
  acronyms?: string;
}

export interface WarningExpiryProductDto {
  /**  */
  countWarningExpiry?: number;

  /**  */
  countExpiried?: number;

  /**  */
  countOutOfStock?: number;
}

export interface WeatherGetPagedDto {
  /**  */
  maxResultCount?: number;

  /**  */
  skipCount?: number;

  /**  */
  sorting?: string;

  /**  */
  filter?: string;

  /**  */
  filter2?: string;

  /**  */
  isActived?: boolean;

  /**  */
  type?: number;

  /**  */
  export?: OrdExportPaged;

  /**  */
  filters?: OrdColumnFilter;

  /**  */
  maxGetAllSize?: number;

  /**  */
  executorId?: string;

  /**  */
  reviewerId?: string;

  /**  */
  notes?: string;

  /**  */
  rangeDate?: DateRangeDto;
}

export interface WindowsTimeZone {
  /**  */
  timeZoneId?: string;
}

export type ACCOUNT_MOVE_TYPE = 1 | 2;

export type ALOWANCE_TYPE = 1 | 2;

export type AccessCardStatusEnum = 1 | 2 | 3;

export type AccessCardTypeEnum = 1 | 2 | 3 | 4;

export type AccountMovePartnerTypeEnum = 1 | 2 | 4 | 6 | 999;

export type ApplyDayModeEnum = 1 | 2;

export type BUSINESS_TYPE_ENUM = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type BarCodeLayoutType = 1 | 2;

export type BatteryTypeEnum = 1 | 2 | 3 | 4 | 5;

export type BookingSourceEnum = 1 | 2 | 3;

export type BookingStatusEnum = 1 | 2 | 3 | 4 | 5;

export type BuggyCurrentStatusEnum = 1 | 2 | 3 | 4 | 5;

export type BuggyTypeEnum = 1 | 2 | 3 | 4 | 5;

export type CALCULATE_USE_PRICE = 1 | 2 | 3;

export type CHANNEL_TYPE = 0 | 1 | 2 | 3 | 101 | 102 | 201 | 999;

export type CheckinStatusEnum = 1 | 2 | 3 | 4;

export type CourseTypeEnum = 1 | 2 | 3 | 4;

export type DAY_OF_WEEK = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type DELIVERY_TYPE = 100 | 200 | 300;

export type DISCOUNTSTATUS = 1 | 2 | 3;

export type DISCOUNT_USE_TYPE = 1 | 2 | 3 | 4;

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type DictionaryTypeEnum = 1 | 2 | 3 | 4 | 5;

export type DiscountTypeEnum = 1 | 2;

export type EinvoiceStatus = 1 | 2 | 3;

export type EnumAppraisalADR = 1 | 2 | 3 | 4;

export type EnumHandleADR = 1 | 2 | 3 | 4;

export type EnumReport = 1 | 2;

export type EnumResultHandleADR = 1 | 2 | 3 | 4 | 5 | 6;

export type EnumReuseDrugs = 1 | 2;

export type FieldStatusEnum = 1 | 2 | 3 | 4;

export type GENDER = 1 | 2;

export type GameTypeEnum = 1 | 2 | 3 | 4 | 5;

export type GolfLockerGroupTypeEnum = 1 | 2;

export type GolfLockerStatusEnum = 1 | 2 | 3 | 4;

export type GolfUserBlockTypeEnum = 1 | 2;

export type GolferMemberTypeEnum = 1 | 2;

export type HttpStatusCode =
  | 100
  | 101
  | 102
  | 103
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 208
  | 226
  | 300
  | 301
  | 302
  | 303
  | 304
  | 305
  | 306
  | 307
  | 308
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 421
  | 422
  | 423
  | 424
  | 426
  | 428
  | 429
  | 431
  | 451
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 510
  | 511;

export type HttpVersionPolicy = 0 | 1 | 2;

export type IntegrateStatusTypeEnum = 0 | 1;

export type InvoiceObjectTypeEnum = 100 | 200;

export type LOG_STATUS = 1 | 2 | 3;

export type LOG_TYPE = 1 | 2 | 300 | 301 | 302 | 303 | 401 | 402 | 403 | 404 | 500 | 501 | 504;

export type MOVE_STATUS = 1 | 2 | 3 | 4 | 5 | 6;

export type MOVE_TYPE = 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 109 | 111 | 112 | 113 | 114 | 115 | 1081;

export type ORDER_STATUS =
  | 0
  | 1
  | 2
  | 4
  | 5
  | 6
  | 100
  | 200
  | 300
  | 399
  | 400
  | 401
  | 499
  | 500
  | 501
  | 599
  | 600
  | 700
  | 701
  | 799
  | 100000;

export type PARTNER_TYPE = 1 | 2 | 3 | 4 | 5 | 6 | 999;

export type PAYMENT_METHOD = 1 | 2 | 3 | 5 | 6;

export type PAYMENT_STATUS = 1 | 2 | 3;

export type PAYROLL_DETAIL_STATUS = 1 | 2 | 3 | 4;

export type PAYROLL_STATUS = 1 | 2 | 3 | 4;

export type PartnerCategoryEnum =
  | 1
  | 2
  | 4000
  | 4001
  | 4002
  | 4003
  | 4004
  | 4005
  | 4006
  | 4007
  | 4008
  | 4009
  | 4010
  | 4011
  | 4012
  | 4013
  | 4014
  | 4015;

export type PaymentModeEnum = 1 | 2 | 3;

export type PrescriptionTypeEnum = 1 | 2;

export type ProductBarcodeLayoutType = 1 | 2;

export type ProductGroupEnum =
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
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 99;

export type ProductInventoryStatus = 1 | 2 | 3;

export type ProductRentalBuggyType = 6011 | 6012;

export type ProductStockInventoryStatus = 0 | 1;

export type ProductTypeEnum = 1 | 2 | 4;

export type ProductTypeGolfServiceEnum = 600 | 601 | 602 | 604 | 605;

export type PromotionType = 1 | 2;

export type REASON_TYPE =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 999
  | 1001
  | 1002
  | 1003
  | 1004
  | 1005
  | 1500
  | 1501
  | 1502
  | 1503
  | 1504
  | 1505
  | 1506
  | 1521
  | 1522
  | 1523
  | 1524
  | 1550
  | 1999;

export type RESERVATION_STATUS = 0 | 100 | 200 | 300 | 900 | 100000;

export type SHOP_WORKSHIFT_STATUS = 1 | 2;

export type SaleInvoiceStatus = 1 | 3 | 4;

export type SettingType = 1 | 2 | 3;

export type ShopPackageRegistrationStatus = 1 | 2 | 3 | 4;

export type ShopPackageRegistrationType = 1 | 2 | 3 | 4 | 5;

export type ShopTemplateTypeEnum = 1 | 2;

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

export type SupplierInvoice = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type TABLE_STATUS_ENUM = 100 | 200 | 300 | 400;

export type TEMPLATE_PRINTER = 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export type TIMEKEEPING_STATUS = 1 | 2 | 3 | 4;

export type TIMESHEET_STATUS = 1 | 2 | 3 | 4;

export type TeetimeSlotEnum = 1 | 2 | 3 | 4 | 9 | 10;

export type TeetimeTypeEnum = 1 | 2 | 3 | 4;

export type TenantType = 0 | 100;

export type TimeTypeEnum = 1 | 2;

export type TimeUnit = 1 | 2 | 3 | 4;

export type TimeUnitFilterEnum = 1 | 2 | 3 | 4 | 5 | 6 | 7;
