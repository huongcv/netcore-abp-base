class PermissionUtil {
    crudPermission(baseEntityPermission: string) {
        return {
            base: baseEntityPermission,
            getPaged: baseEntityPermission + '.GetPaged',
            getDetail: baseEntityPermission + '.GetDetail',
            create: baseEntityPermission + '.Create',
            edit: baseEntityPermission + '.Update',
            remove: baseEntityPermission + '.Delete',
            delete: baseEntityPermission + '.Delete',
            import: baseEntityPermission + '.Import',
            export: baseEntityPermission + '.Export',
        }
    }
}

export default new PermissionUtil();
