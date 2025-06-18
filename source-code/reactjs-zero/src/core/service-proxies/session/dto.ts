import {OrdThemeDto, UserCurrentShopAssign} from "@api/index.defs";
import {ShopTypeEnum} from "@ord-store/sessionStore";

export class AppBootstrapDto implements AppBootstrapDto {
    isLogined: boolean;
    user?: UserInformationDto;
    permissionGranted?: any;
    setting?: { [key: string]: any; } | undefined;
    listAssignedShop?: UserCurrentShopAssign[];
    currentShop?: number;
    currentShopHashId?: string;
    theme: OrdThemeDto;
    currentShopType: ShopTypeEnum;
    businessType: BusinessTypeEnum;
    isShopMain: boolean;
    eInvoiceMethod?: string;
    // themeInfo?: string;
    // logoFull?: string;
    // logoSimple?: string;
    // copyright?: string;
    // systemName?: string;
    // faviconIco?: string;


    constructor() {
        this.isLogined = false;
    }

    isGrantedPermission(permissionName: string) {
        if (!this.user) {
            return false;
        }
        if (this.user?.isSuperAdmin === true) {
            return true;
        }
        return this.permissionGranted && this.permissionGranted[permissionName] === true;
    }
}

export interface UserInformationDto {
    userName?: string | undefined;
    email?: string | undefined;
    phoneNumber?: string | undefined;
    name?: string | undefined;
    isActived?: boolean;
    level?: string | undefined;
    isLockoutEnabled?: boolean;
    dynamicInformation?: { [key: string]: string; } | undefined;
    listRoleId?: string[] | undefined;
    extendData?: any | undefined;
    mustChangePassword?: boolean;
    id?: string;
    tenantId?: string | undefined;
    tenantDto?: any | undefined;
    isSuperAdmin?: boolean;
    listPermission?: string[] | undefined;
    tenantType: TenantTypeEnum,
    packageRegistrationCode?: string
}

export interface UserLoginInfoDto {
    name?: string;
    surname?: string;
    userName?: string;
    emailAddress?: string;
}

export enum TenantTypeEnum {
    Other = 0,
    Golf = 100,
}

export enum BusinessTypeEnum {
    //Doanh nghiệp tư nhân
    PrivateEnterprise = 1,

    // Doanh nghiệp nhà nước
    StateOwnedEnterprise = 2,

    // Doanh nghiệp liên doanh
    JointVentureCompany = 3,

    // Doanh nghiệp vốn nước ngoài
    ForeignOwnedEnterprise = 4,

    // Công ty trách nhiệm hữu hạn
    LimitedLiabilityCompany = 5,

    // Công ty cổ phần
    JointStockCompany = 6,

    // Công ty hợp danh
    PartnershipCompany = 7,

    // Hộ kinh doanh
    BusinessHouseholds = 8,

    // Hợp tác xã
    Cooperative = 9,
}