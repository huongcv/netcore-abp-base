// hooks/useUserTypeFromRoleCode.ts
import {useMemo} from "react";
import {StringUtil} from "@ord-core/utils/string.util";
import {IUserLevelType} from "@ord-core/config/permissions/tree-data";

export const useUserTypeFromRoleCode = (roleCode?: string): IUserLevelType | null => {
    return useMemo(() => {
        if (!roleCode) return null;
        if (StringUtil.contains(roleCode, "tenant")) {
            return 'tenant'
        }
        return null;
    }, [roleCode]);
};
