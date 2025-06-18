import {Navigate} from "react-router-dom";
import {useStore} from "@ord-store/index";
import {DefaultAppPrefixUrl, DefaultHostPrefixUrl} from "@ord-core/AppConst"; // 🚀 Lấy auth info từ Store

export default function DynamicRedirectWrapper() {
    const {sessionStore} = useStore();
    let redirectPath = '/auth/login'; // Default nếu không có quyền
    if (sessionStore.isLogined) {
        if (sessionStore.user?.isSuperAdmin) {
            redirectPath = DefaultHostPrefixUrl + "tenant";
        } else {
            redirectPath = DefaultAppPrefixUrl + sessionStore.systemCode
        }
    }
    return <Navigate to={redirectPath} replace/>;
}
