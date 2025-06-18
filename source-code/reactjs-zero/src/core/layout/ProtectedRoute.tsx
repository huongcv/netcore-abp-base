import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';

import {useStore} from "@ord-store/index";
import {checkPermissionUser} from "@ord-core/utils/auth.utils";
import {observer} from "mobx-react-lite";
import {AppExtendCode, DefaultAppPrefixUrl, DefaultHostPrefixUrl} from "@ord-core/AppConst";
import { useCheckVersion } from '@ord-core/hooks/useCheckVersion';

interface IProtectedRouteProp {
    children: any,
    permission?: string
}
function isInAppExtendCode(key: string): key is keyof typeof AppExtendCode {
    return key in AppExtendCode;
}
// Hàm lấy systemCode từ URL
function getSystemCodeFromPath(pathname: string): string | null {
    const parts = pathname.split('/').filter(Boolean); // ["app", "golf", "booking"]
    return parts.length >= 2 ? parts[1] : null; // parts[1] là "golf"
}
const ProtectedRoute = (prop: IProtectedRouteProp) => {
    const {sessionStore} = useStore();
    // useCheckVersion();
    if (sessionStore.appSession?.isLogined !== true) {
        // return <Navigate to="/auth/login"/>;
    }

    const location = useLocation();
    const systemCodeInPath = getSystemCodeFromPath(location.pathname);

    // Nếu systemCodeInPath tồn tại và hợp lệ
    if (systemCodeInPath && isInAppExtendCode(systemCodeInPath)) {
        // Nếu systemCodeInPath khác với quyền user đang có (sessionStore.systemCode)
        if (systemCodeInPath !== sessionStore.systemCode) {
            return <Navigate to="/not-permission" replace />;
        }
    }

    return checkPermissionUser(sessionStore.appSession, prop.permission) ? prop.children :
        <Navigate to="/not-permission"/>;
}

export default observer(ProtectedRoute);
