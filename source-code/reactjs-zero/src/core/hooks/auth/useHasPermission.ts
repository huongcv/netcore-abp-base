import {usePermission} from "./usePermission";
import {useMemo} from "react";

/**
 * Hook đơn giản chỉ trả về boolean cho một permission
 * @param permission - Permission cần kiểm tra
 * @returns boolean - có quyền hay không
 */
export const useHasPermission = (permission?: string | string[]): boolean => {
    const {hasPermission} = usePermission(permission);
    return hasPermission;
};


/**
 * Hook để filter array dựa trên permission
 * @param items - Array items cần filter
 * @param getPermission - Function để lấy permission từ item
 * @returns Array items đã được filter theo permission
 */
export const usePermissionFilter = <T>(
    items: T[],
    getPermission: (item: T) => string | string[] | undefined
): T[] => {
    const {checkPermission} = usePermission();

    return useMemo(() => {
        return items.filter(item => {
            const itemPermission = getPermission(item);
            return checkPermission(itemPermission);
        });
    }, [items, checkPermission, getPermission]);
};