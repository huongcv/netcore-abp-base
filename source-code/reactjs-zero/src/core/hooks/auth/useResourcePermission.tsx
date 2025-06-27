import {useMemo} from 'react';
import {checkPermissionUser} from "@ord-core/utils/auth.utils";
import {useStore} from "@ord-store/index";

/**
 * Các action permissions chuẩn
 */
export type PermissionAction =
    | 'Create'
    | 'Read'
    | 'GetPaged'
    | 'GetDetail'
    | 'Update'
    | 'Delete'
    | 'Import'
    | 'Export'
    | 'List'
    | 'Approve'
    | 'Reject'
    | 'Publish'
    | 'Archive'
    | string; // Allow custom actions

/**
 * Result interface cho resource permission
 */
export interface ResourcePermissionResult {
    /** Resource prefix (VD: 'MasterData.Country') */
    resource: string;

    /** Check một action cụ thể */
    can: (action: PermissionAction) => boolean;

    /** Check multiple actions với AND logic */
    canAll: (actions: PermissionAction[]) => boolean;

    /** Check multiple actions với OR logic */
    canAny: (actions: PermissionAction[]) => boolean;

    /** Các shorthand methods cho actions chuẩn */
    canCreate: boolean;
    canRead: boolean;
    canGetPaged: boolean;
    canGetDetail: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canImport: boolean;
    canExport: boolean;
    canList: boolean;
    canApprove: boolean;
    canReject: boolean;
    canPublish: boolean;
    canArchive: boolean;

    /** Get full permission string */
    getPermission: (action: PermissionAction) => string;

    /** Get all available permissions for this resource */
    getAllPermissions: (actions: PermissionAction[]) => string[];

    /** Current session */
    currentSession: any;
}

/**
 * Hook để kiểm tra quyền theo pattern: Resource.Action
 * @param resourcePrefix - Prefix của resource (VD: 'MasterData.Country')
 * @param separator - Ký tự phân cách (mặc định: '.')
 * @returns ResourcePermissionResult với các utility methods
 */
export const useResourcePermission = (
    resourcePrefix: string,
    separator: string = '.'
): ResourcePermissionResult => {
    const {sessionStore} = useStore();

    const result = useMemo(() => {
        const currentSession = sessionStore.appSession;

        // Helper function để tạo permission string
        const getPermission = (action: PermissionAction): string => {
            return `${resourcePrefix}${separator}${action}`;
        };

        // Helper function để check một permission
        const checkSinglePermission = (permission: string): boolean => {
            return checkPermissionUser(currentSession, permission);
        };

        // Check một action cụ thể
        const can = (action: PermissionAction): boolean => {
            const permission = getPermission(action);
            return checkSinglePermission(permission);
        };

        // Check multiple actions với AND logic
        const canAll = (actions: PermissionAction[]): boolean => {
            return actions.every(action => can(action));
        };

        // Check multiple actions với OR logic
        const canAny = (actions: PermissionAction[]): boolean => {
            return actions.some(action => can(action));
        };

        // Get all permissions for given actions
        const getAllPermissions = (actions: PermissionAction[]): string[] => {
            return actions.map(action => getPermission(action));
        };

        // Pre-compute common permissions
        const canCreate = can('Create');
        const canRead = can('Read');
        const canGetPaged = can('GetPaged');
        const canGetDetail = can('GetDetail');
        const canUpdate = can('Update');
        const canDelete = can('Delete');
        const canImport = can('Import');
        const canExport = can('Export');
        const canList = can('List');
        const canApprove = can('Approve');
        const canReject = can('Reject');
        const canPublish = can('Publish');
        const canArchive = can('Archive');

        return {
            resource: resourcePrefix,
            can,
            canAll,
            canAny,
            canCreate,
            canRead,
            canGetPaged,
            canGetDetail,
            canUpdate,
            canDelete,
            canImport,
            canExport,
            canList,
            canApprove,
            canReject,
            canPublish,
            canArchive,
            getPermission,
            getAllPermissions,
            currentSession
        };
    }, [resourcePrefix, separator, sessionStore.appSession]);

    return result;
};

/**
 * Hook đơn giản để check một action cụ thể
 * @param resourcePrefix - Resource prefix
 * @param action - Action cần check
 * @param separator - Ký tự phân cách
 * @returns boolean
 */
export const useCanAction = (
    resourcePrefix: string,
    action: PermissionAction,
    separator: string = '.'
): boolean => {
    const {can} = useResourcePermission(resourcePrefix, separator);
    return can(action);
};

/**
 * Hook để tạo permissions object cho một resource
 * @param resourcePrefix - Resource prefix
 * @param actions - Danh sách actions cần check
 * @param separator - Ký tự phân cách
 * @returns Object với key là action, value là boolean
 */
export const useResourcePermissions = <T extends PermissionAction>(
    resourcePrefix: string,
    actions: T[],
    separator: string = '.'
): Record<T, boolean> => {
    const {can} = useResourcePermission(resourcePrefix, separator);

    return useMemo(() => {
        const permissions = {} as Record<T, boolean>;
        actions.forEach(action => {
            permissions[action] = can(action);
        });
        return permissions;
    }, [actions, can]);
};

/**
 * Hook để filter actions dựa trên permissions
 * @param resourcePrefix - Resource prefix
 * @param actions - Array actions cần filter
 * @param separator - Ký tự phân cách
 * @returns Array actions được phép thực hiện
 */
export const useAllowedActions = (
    resourcePrefix: string,
    actions: PermissionAction[],
    separator: string = '.'
): PermissionAction[] => {
    const {can} = useResourcePermission(resourcePrefix, separator);

    return useMemo(() => {
        return actions.filter(action => can(action));
    }, [actions, can]);
};

/**
 * Hook kết hợp resource permission với conditional rendering
 * @param resourcePrefix - Resource prefix
 * @param fallback - Component hiển thị khi không có quyền
 * @param separator - Ký tự phân cách
 * @returns Object với utility methods cho conditional rendering
 */
export const useResourcePermissionRender = (
    resourcePrefix: string,
    fallback?: React.ReactNode,
    separator: string = '.'
) => {
    const permissions = useResourcePermission(resourcePrefix, separator);

    const renderWithAction = (
        component: React.ReactNode,
        action: PermissionAction
    ): React.ReactNode => {
        return permissions.can(action) ? component : (fallback || null);
    };

    const renderWithActions = (
        component: React.ReactNode,
        actions: PermissionAction[],
        mode: 'all' | 'any' = 'any'
    ): React.ReactNode => {
        const hasPermission = mode === 'all'
            ? permissions.canAll(actions)
            : permissions.canAny(actions);

        return hasPermission ? component : (fallback || null);
    };

    return {
        ...permissions,
        renderWithAction,
        renderWithActions
    };
};

/**
 * Hook để lấy permission strings của các actions
 * @param resourcePrefix - Resource prefix (VD: 'MasterData.Country')
 * @param separator - Ký tự phân cách (mặc định: '.')
 * @returns Object với các utility methods để lấy permission strings
 */
export const usePermissionStrings = (
    resourcePrefix: string,
    separator: string = '.'
) => {
    const result = useMemo(() => {
        // Helper function để tạo permission string
        const getPermission = (action: PermissionAction): string => {
            return `${resourcePrefix}${separator}${action}`;
        };

        // Get permission cho một action
        const getActionPermission = (action: PermissionAction): string => {
            return getPermission(action);
        };

        // Get permissions cho multiple actions
        const getActionsPermissions = (actions: PermissionAction[]): string[] => {
            return actions.map(action => getPermission(action));
        };

        // Get permissions object với key là action, value là permission string
        const getPermissionsMap = <T extends PermissionAction>(
            actions: T[]
        ): Record<T, string> => {
            const map = {} as Record<T, string>;
            actions.forEach(action => {
                map[action] = getPermission(action);
            });
            return map;
        };

        // Pre-built permission strings cho các actions chuẩn
        const permissions = {
            create: getPermission('Create'),
            read: getPermission('Read'),
            getPaged: getPermission('GetPaged'),
            getDetail: getPermission('GetDetail'),
            update: getPermission('Update'),
            delete: getPermission('Delete'),
            import: getPermission('Import'),
            export: getPermission('Export'),
            list: getPermission('List'),
            approve: getPermission('Approve'),
            reject: getPermission('Reject'),
            publish: getPermission('Publish'),
            archive: getPermission('Archive')
        };

        return {
            // Single action
            getActionPermission,

            // Multiple actions
            getActionsPermissions,
            getPermissionsMap,

            // Pre-built strings
            permissions,

            // Resource info
            resourcePrefix,
            separator,

            // Utility
            getAllStandardPermissions: () => Object.values(permissions),
            getAllStandardActions: () => [
                'Create', 'Read', 'GetPaged', 'GetDetail', 'Update',
                'Delete', 'Import', 'Export', 'List', 'Approve',
                'Reject', 'Publish', 'Archive'
            ] as PermissionAction[]
        };
    }, [resourcePrefix, separator]);

    return result;
};

/**
 * Hook đơn giản để lấy permission string của một action
 * @param resourcePrefix - Resource prefix
 * @param action - Action cần lấy permission string
 * @param separator - Ký tự phân cách
 * @returns Permission string
 */
export const useActionPermissionString = (
    resourcePrefix: string,
    action: PermissionAction,
    separator: string = '.'
): string => {
    const {getActionPermission} = usePermissionStrings(resourcePrefix, separator);
    return getActionPermission(action);
};

/**
 * Hook để tạo permission constants cho một resource
 * @param resourcePrefix - Resource prefix
 * @param separator - Ký tự phân cách
 * @returns Object constants với tất cả permission strings
 */
export const useResourcePermissionConstants = (
    resourcePrefix: string,
    separator: string = '.'
) => {
    const {permissions, getAllStandardPermissions} = usePermissionStrings(resourcePrefix, separator);

    const constants = useMemo(() => ({
        // Individual permissions
        CREATE: permissions.create,
        READ: permissions.read,
        GET_PAGED: permissions.getPaged,
        GET_DETAIL: permissions.getDetail,
        UPDATE: permissions.update,
        DELETE: permissions.delete,
        IMPORT: permissions.import,
        EXPORT: permissions.export,
        LIST: permissions.list,
        APPROVE: permissions.approve,
        REJECT: permissions.reject,
        PUBLISH: permissions.publish,
        ARCHIVE: permissions.archive,

        // Arrays for common use cases
        ALL_PERMISSIONS: getAllStandardPermissions(),
        READ_PERMISSIONS: [permissions.read, permissions.getPaged, permissions.getDetail, permissions.list],
        WRITE_PERMISSIONS: [permissions.create, permissions.update, permissions.delete],
        DATA_PERMISSIONS: [permissions.import, permissions.export],
        WORKFLOW_PERMISSIONS: [permissions.approve, permissions.reject, permissions.publish, permissions.archive],

        // Resource info
        RESOURCE_PREFIX: resourcePrefix
    }), [permissions, getAllStandardPermissions, resourcePrefix]);

    return constants;
};