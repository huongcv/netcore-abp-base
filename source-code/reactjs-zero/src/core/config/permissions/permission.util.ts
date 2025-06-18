class PermissionUtil {
    crudPermission(baseEntityPermission: string) {
        return {
            base: baseEntityPermission,
            create: baseEntityPermission + '.Create', 
            edit: baseEntityPermission + '.Update',
            remove: baseEntityPermission + '.Remove',
        }
    }
}

export default new PermissionUtil();
