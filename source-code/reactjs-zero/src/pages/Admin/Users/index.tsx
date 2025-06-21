import React, {lazy} from "react";
import {useStore} from "@ord-store/index";
import {CountryDto, UserDto} from "@api/index.defs";
import {UnlockOutlined} from "@ant-design/icons";
import {UserDataColumns} from "@pages/Admin/Users/UserDataColumns";
import {UserSearchForm} from "@pages/Admin/Users/UserSearchForm";
import TableUtil from "@ord-core/utils/table.util";
import UnlockAction from "@pages/Admin/Users/actions/unlockAction";
import {PagedTable} from "@ord-components/paged-table";
import {PageLayoutWithTable} from "@ord-components/paged-table/PageLayoutWithTable";
import {ModifyModalForm} from "@ord-components/paged-table/ModifyModalForm";
import {UserService} from "@api/base/UserService";
import {OrdCounterByStatusSegmented} from "@ord-components/crud/counter-list/OrdCounterByStatusSegmented";
import UserEntityForm from "@pages/Admin/Users/EntityForm";
import {useUserLogic} from "@pages/Admin/Users/useUserLogic";
import {USER_POLICIES} from "@pages/Admin/Users/user.constants";
import {UserUtilities} from "@pages/Admin/Users/user.util";
import {createNotificationTransform} from "@ord-components/paged-table/utils/notificationUtils";


const User: React.FC = () => {
    const {
        topActions,
        modalStore,
        tableStore,
        crudActions
    } = useUserLogic();
    const {sessionStore} = useStore();
    const columns = TableUtil.getColumns<UserDto>(UserDataColumns, {
        actions: [
            {
                title: 'view',
                onClick: (d) => {
                    crudActions.openView(d);
                }
            },
            {
                title: 'edit',
                onClick: (d) => {
                    crudActions.openEdit(d);
                }
            },
            {
                title: 'changePassword',
                permission: USER_POLICIES.RESET_PASSWORD,
                contentLazy: lazy(() => import("./actions/changePwdAction")),
                hiddenIf: (u: UserDto) => {
                    return UserUtilities.isUserCurrentLogin(u, sessionStore.userId);
                }
            },
            {
                title: 'unlockUser',
                icon: <UnlockOutlined/>,
                permission: USER_POLICIES.UPDATE,
                content: (user) => <UnlockAction user={user}/>,
                hiddenIf: (value: UserDto) => {
                    return !UserUtilities.isLocked(value);
                },
            },
            {
                title: 'loginWithAccount',
                permission: USER_POLICIES.LOGIN_WITH_ACCOUNT,
                contentLazy: lazy(() => import("./actions/loginWithAccount")),
                hiddenIf: (u: UserDto) => {
                    return UserUtilities.isUserCurrentLogin(u, sessionStore.userId);
                }
            },
            {
                title: 'remove',
                onClick: (d) => {
                    crudActions.openDelete(d);
                },
                permission: USER_POLICIES.REMOVE,
                hiddenIf: (u: UserDto) => {
                    return UserUtilities.isUserCurrentLogin(u, sessionStore.userId);
                }
            }
        ]
    });
    return (
        <>
            <PageLayoutWithTable
                topActions={topActions}
                searchFields={<UserSearchForm/>}
                tableStore={tableStore}>
                <OrdCounterByStatusSegmented tableStore={tableStore} statusFieldName={'isActived'}
                                             fetcher={UserService.getCountByActive}/>
                <PagedTable columns={columns} tableStore={tableStore}/>
            </PageLayoutWithTable>
            <ModifyModalForm
                width={680}
                modalStore={modalStore}
                tableStore={tableStore}
                entityTranslationNs="user"
                formFields={<UserEntityForm/>}
                transformNotificationParameter={createNotificationTransform.fromMapping({
                    name: 'userName'
                })}
            />

        </>)
        ;
}
export default User;

