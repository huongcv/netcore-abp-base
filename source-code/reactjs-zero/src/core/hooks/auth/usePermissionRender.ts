import {usePermission} from "@ord-core/hooks/auth/usePermission";
import React from "react";

/**
 * Hook kết hợp permission với conditional rendering
 * @param permission - Permission cần kiểm tra
 * @param fallback - Component hiển thị khi không có quyền
 * @returns Object với hasPermission và renderWithPermission function
 */
export const usePermissionRender = (
    permission?: string | string[],
    fallback?: React.ReactNode
) => {
    const {hasPermission, checkPermission} = usePermission(permission);

    const renderWithPermission = (
        component: React.ReactNode,
        specificPermission?: string | string[]
    ): React.ReactNode => {
        const permToCheck = specificPermission || permission;
        const hasAccess = checkPermission(permToCheck);

        if (hasAccess) {
            return component;
        }

        return fallback || null;
    };

    return {
        hasPermission,
        renderWithPermission,
        checkPermission
    };
};