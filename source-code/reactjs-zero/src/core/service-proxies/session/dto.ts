import {AppBootstrapExtendDto, AppUserCurrentDto, UserInformationDto} from "@api/base/index.defs";
import {OrdThemeDto} from "@api/index.defs";

export class AppBootstrapDto {
    setting?: { [key: string]: any; } | undefined;
    isLogined: boolean;
    user?: UserInformationDto;
    extend?: AppBootstrapExtendDto;
    userCurrent?: AppUserCurrentDto;

    isGrantedPermission(permissionName: string) {
        if (!this.user) {
            return false;
        }
        if (this.user?.isSuperAdmin === true) {
            return true;
        }
        const granted: string[] = this.permissionGranted;
        if (granted.length === 0) {
            return false;
        }
        return granted.includes(permissionName);
    }

    get permissionGranted() {
        return this?.user?.listPermission || [];
    }

    get listAssignedShop() {
        return this?.userCurrent?.availableShops || [];
    }

    get theme(): OrdThemeDto {
        return this?.extend?.theme || {};
    }
}
