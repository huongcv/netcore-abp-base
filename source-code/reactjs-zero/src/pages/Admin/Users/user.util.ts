import {UserDto} from "@api/index.defs";
import {isAfter} from "date-fns";
import {LWithNs} from "@ord-core/language/lang.utils";

export namespace UserUtil {
    export function isLocked(value: UserDto) {
        return !!value && !!value.isLockoutEnabled && !!value.lockoutEnd && isAfter(value.lockoutEnd, new Date());
    }
}

export const UserNS = 'user-list';

export const UserL = new LWithNs(UserNS);
