import {UserDto} from "@api/index.defs";
import {isAfter} from "date-fns";

export class UserUtilities {
    static isLocked(user: UserDto): boolean {
        return !!(user?.isLockoutEnabled && user?.lockoutEnd && isAfter(user.lockoutEnd, new Date()));
    }

    static isUserCurrentLogin(user: UserDto, currentUserId?: string | null) {
        return user?.id == currentUserId;
    }
}