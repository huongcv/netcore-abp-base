import {AppBootstrapDto} from "@ord-core/service-proxies/session/dto";
import {PERMISSION_TREE_TYPE} from "@ord-core/config/permissions/types";
import {TENANT_PERMISSION_TREE} from "@ord-core/config/permissions/tree-data/tenant-user";
import {HOST_PERMISSION_TREE} from "@ord-core/config/permissions/tree-data/host-user";

export type IUserLevelType = 'host' | 'tenant';

export const getFullPermissionTreeDataForUser = (session?: AppBootstrapDto | null): PERMISSION_TREE_TYPE[] => {
    if (!session) {
        return [];
    }
    if (!session?.user) {
        return [];
    }
    const isTenantAccount = session.user && session.user?.tenantId && session.user?.tenantDto;
    if (isTenantAccount) {
        return getFullPermissionByUserType('tenant');
    }
    return getFullPermissionByUserType('host');
}


export const getFullPermissionByUserType = (userType: IUserLevelType) => {
    if (userType == 'tenant') {
        return [...TENANT_PERMISSION_TREE];
    }
    if (userType == 'host') {
        return [...HOST_PERMISSION_TREE];
    }
    return [];
}