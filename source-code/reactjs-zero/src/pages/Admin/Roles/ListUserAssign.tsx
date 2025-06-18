import {observer} from "mobx-react-lite";
import {DataTableWithSearch} from "@ord-components/table/DataTableWithSearch";
import React, {useState} from "react";
import {UserDataColumns} from "@pages/Admin/Users/UserDataColumns";
import {UserSearchForm} from "@pages/Admin/Users/UserSearchForm";
import {RoleService} from "@api/RoleService";
import {RoleGetUserPagedDto, UserDto} from "@api/index.defs";
import {DeleteOutlined} from "@ant-design/icons";
import UiUtils from "@ord-core/utils/ui.utils";
import {Trans, useTranslation} from "react-i18next";
import {RoleNS} from "@pages/Admin/Roles/role.util";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";
import TableUtil from "@ord-core/utils/table.util";


const ListUserAssign = (props: { roleId: string | undefined, roleName: string | undefined }) => {
    const {t} = useTranslation(RoleNS);
    const [refresh, doRefresh] = useState(0);
    const columns = TableUtil.getColumns<UserDto>(UserDataColumns, {
        actions: [
            {
                title: 'removeRoleForUser',
                icon: <DeleteOutlined></DeleteOutlined>,
                onClick: (user) => {
                    const lPrm = {
                        ...user, roleName: props.roleName
                    }
                    UiUtils.showConfirm({
                        data: {
                            ...user
                        },
                        title: t('confirmUnassignRoleForUserTitle'),
                        content: (<Trans ns={RoleNS}
                                         i18nKey="confirmUnassignRoleForUser"
                                         values={lPrm}
                                         components={{italic: <i/>, bold: <strong/>}}></Trans>),
                        onOk: (d) => {
                            unAssign(d);
                        }
                    });
                }
            }
        ]
    });
    const getPageResult = (input: any) => {
        return RoleService.getListUserAssignByRole({
            body: {
                ...input,
                roleId: props.roleId
            }
        });
    }
    const unAssign = async (userSelected: RoleGetUserPagedDto) => {
        UiUtils.setBusy();
        try {
            const result = await RoleService.unassignUser({
                body: {
                    userId: userSelected.userId,
                    roleId: props.roleId
                }
            });
            if (result.isSuccessful) {
                const content = t("unassignRoleSuccess", {
                    ...userSelected,
                    roleName: props.roleName
                }) as string;
                UiUtils.showSuccess(content);
                doRefresh(pre => pre + 1);
            } else {
                ServiceProxyUtils.notifyErrorResultApi(result);
            }
        } catch {

        } finally {
            UiUtils.clearBusy();
        }
    }

    return (<>
        <DataTableWithSearch columns={columns}
                             searchBox={{
                                 searchForm: (form) => (<UserSearchForm searchFormRef={form}/>)
                             }}
                             getPageResult={getPageResult}
                             rowKey="userId"
                             refreshData={refresh}
        ></DataTableWithSearch>
    </>);
}
export default observer(ListUserAssign);
