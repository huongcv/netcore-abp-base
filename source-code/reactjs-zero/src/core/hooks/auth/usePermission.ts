import {useMemo} from 'react';
import {checkPermissionUser} from "@ord-core/utils/auth.utils";
import {useStore} from "@ord-store/index";
import {PermissionResult} from "@ord-core/hooks/auth/types";

/**
 * Custom hook để kiểm tra permission
 * @param permission - Permission cần kiểm tra (string hoặc array of strings)
 * @returns PermissionResult object với các utility functions
 */
export const usePermission = (permission?: string | string[]): PermissionResult => {
    const {sessionStore} = useStore();

    const result = useMemo(() => {
        const currentSession = sessionStore.appSession;

        // Function để check một permission cụ thể
        const checkPermission = (perm?: string | string[]): boolean => {
            if (!perm) return true; // Nếu không có permission thì cho phép
            return checkPermissionUser(currentSession, perm);
        };

        // Function để check tất cả permissions (AND logic)
        const checkAllPermissions = (permissions: (string | string[])[]): boolean => {
            return permissions.every(perm => checkPermission(perm));
        };

        // Function để check bất kỳ permission nào (OR logic)
        const checkAnyPermission = (permissions: (string | string[])[]): boolean => {
            return permissions.some(perm => checkPermission(perm));
        };

        // Check permission chính được truyền vào
        const hasPermission = checkPermission(permission);

        return {
            hasPermission,
            currentSession,
            checkPermission,
            checkAllPermissions,
            checkAnyPermission
        };
    }, [sessionStore.appSession, permission]);

    return result;
};