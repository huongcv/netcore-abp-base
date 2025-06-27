import {AppBootstrapDto} from "@ord-core/service-proxies/session/dto";
import {PERMISSION_TREE_TYPE} from "@ord-core/config/permissions/types";
import {TENANT_PERMISSION_TREE} from "@ord-core/config/permissions/tree-data/tenant-user";
import {HOST_PERMISSION_TREE} from "@ord-core/config/permissions/tree-data/host-user";

export const getFullPermissionTreeData = (session?: AppBootstrapDto | null): PERMISSION_TREE_TYPE[] => {
    if (!session) {
        return [];
    }
    if (!session?.user) {
        return [];
    }
    const isTenantAccount = session.user && session.user?.tenantId && session.user?.tenantDto;
    if (isTenantAccount) {
        return [...TENANT_PERMISSION_TREE];
    }
    return [...HOST_PERMISSION_TREE];
}