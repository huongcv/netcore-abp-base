import {useStore} from "@ord-store/index";
import {checkPermissionUser} from "@ord-core/utils/auth.utils";
/// dùng để check permission
/// nếu có quyền thì render ra children
export const RequiredPermission = (props: {
    permissionName: string,
    children?: any
}) => {
    const {sessionStore} = useStore();
    return (<>
        {
            checkPermissionUser(sessionStore.appSession, props.permissionName) ? props?.children : null
        }
    </>);
}
