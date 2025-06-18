import {AppBootstrapDto} from "@ord-core/service-proxies/session/dto";


export const checkPermissionUser = (session: AppBootstrapDto, permissionName?: string) => {
    if (session?.isLogined !== true) {
        return false;
    }
    if (!permissionName) {
        return true;
    }
    const {user} = session;
    if (user?.isSuperAdmin === true) {
        return true;
    }

    return checkPermission(session.permissionGranted, permissionName);
    // return session.permissionGranted[permissionName] === true;
}
function checkPermission(userPermissions: Record<string, boolean>, condition: string): boolean {
    // Chuẩn hóa điều kiện: thay "or" thành "||", "and" thành "&&"
    let expression: string = condition.replace(/ or /g, " || ").replace(/ and /g, " && ");

    // Tạo danh sách các quyền từ điều kiện
    const permissions: string[] = condition.split(/ or | and /).map(p => p.trim());

    // Thay thế quyền trong biểu thức bằng `true` hoặc `false` dựa trên userPermissions
    permissions.forEach(permission => {
        let hasPermission: boolean = userPermissions[permission] ?? false; // Mặc định false nếu không có key
        expression = expression.replace(new RegExp(`\\b${permission}\\b`, "g"), String(hasPermission));
    });

    // Đánh giá biểu thức logic
    return eval(expression);
}
