import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';

import {useStore} from "@ord-store/index";
import {observer} from "mobx-react-lite";
import {AppExtendCode} from "@ord-core/AppConst";
import {usePermission} from "@ord-core/hooks/auth/usePermission";

interface IProtectedRouteProp {
    permission?: string | string[];
    children: React.ReactNode;
    /** Có kiểm tra cả GetPaged permission không (default: true) */
    checkGetPaged?: boolean;
    /** Custom fallback route khi không có quyền (default: "/not-permission") */
    fallbackRoute?: string;
    /** Có redirect về login nếu chưa login không (default: true) */
    requireAuth?: boolean;
}

function isInAppExtendCode(key: string): key is keyof typeof AppExtendCode {
    return key in AppExtendCode;
}

const ProtectedRoute = (props: IProtectedRouteProp) => {
    const {sessionStore} = useStore();
    const {
        permission,
        children,
        checkGetPaged = true,
        fallbackRoute = "/not-permission",
        requireAuth = true
    } = props;
    const {checkAnyPermission} = usePermission();
    const location = useLocation();
    // useCheckVersion();
    // Kiểm tra đăng nhập
    if (requireAuth && sessionStore.appSession?.isLogined !== true) {
        return <Navigate to="/auth/login"/>;
    }
    // Nếu không có permission thì cho phép truy cập
    if (!permission) {
        return <>{children}</>;
    }

    // Tạo danh sách permissions cần check
    // Bổ sung thêm check .GetPaged có trong list quyền hay không?
    const permissionsToCheck = React.useMemo(() => {
        console.log('permission', permission);
        const basePermissions = Array.isArray(permission) ? permission : [permission];
        const allPermissions = [...basePermissions];
        const perm = allPermissions[0];
        // Thêm GetPaged permissions nếu checkGetPaged = true
        if (checkGetPaged && perm) {
            allPermissions.push(`${perm}.GetPaged`);
        }
        return allPermissions;
    }, [permission, checkGetPaged]);

    // Kiểm tra quyền với hook
    const hasPermission = checkAnyPermission(permissionsToCheck);
    return hasPermission ? (
        <>{children}</>
    ) : (
        <Navigate to={fallbackRoute} replace/>
    );
}

export default observer(ProtectedRoute);
