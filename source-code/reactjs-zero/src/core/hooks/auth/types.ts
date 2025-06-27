/**
 * Interface cho permission check result
 */
export interface PermissionResult {
    /** Có quyền hay không */
    hasPermission: boolean;
    /** Session hiện tại */
    currentSession: any;
    /** Function để check permission cho một quyền cụ thể */
    checkPermission: (permission?: string | string[]) => boolean;
    /** Function để check multiple permissions với logic AND */
    checkAllPermissions: (permissions: (string | string[])[]) => boolean;
    /** Function để check multiple permissions với logic OR */
    checkAnyPermission: (permissions: (string | string[])[]) => boolean;
}