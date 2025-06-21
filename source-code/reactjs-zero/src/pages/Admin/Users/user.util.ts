import {UserDto} from "@api/index.defs";
import {isAfter} from "date-fns";
import {LWithNs} from "@ord-core/language/lang.utils";

export class UserUtilities {
    static isLocked(user: UserDto): boolean {
        return !!(user?.isLockoutEnabled && user?.lockoutEnd && isAfter(user.lockoutEnd, new Date()));
    }

    static canEditUser(user: UserDto, currentUserId?: string): boolean {
        return user?.id !== currentUserId;
    }

    static canDeleteUser(user: UserDto, currentUserId?: string): boolean {
        return user?.id !== currentUserId;
    }

    static formatUserDisplay(user: UserDto): string {
        return `${user.name} (${user.userName})`;
    }

    static getUserStatusText(user: UserDto): string {
        if (this.isLocked(user)) return 'Đang bị khóa';
        return user.isActived ? 'Hoạt động' : 'Không hoạt động';
    }

    static isUserCurrentLogin(user: UserDto, currentUserId?: string | null) {
        return user?.id == currentUserId;
    }
}

export const UserNS = 'user-list';

export const UserL = new LWithNs(UserNS);
