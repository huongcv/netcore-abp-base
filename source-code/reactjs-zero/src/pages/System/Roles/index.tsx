import React from "react";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { useStore } from "@ord-store/index";
import { RoleDto } from "@api/index.defs";
import { useTranslation } from "react-i18next";
import { PERMISSION_APP } from "@ord-core/config/permissions";
import PermissionUtil from "@ord-core/config/permissions/permission.util";
import RoleCreateOrUpdateForm from "@pages/System/Roles/CreateOrUpdateForm";
import { RoleService } from "@api/RoleService";
import { UserOutlined } from "@ant-design/icons";
import { RoleNS } from "@pages/System/Roles/role.util";
import ListUserAssign from "@pages/System/Roles/ListUserAssign";
import TableUtil from "@ord-core/utils/table.util";
import { SearchFilterAndIsActived } from "@ord-components/forms/search/SearchFilterAndIsActived";
import { IsActivedColumn } from "@ord-components/table/columns/IsActivedColumn";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { IsActiveStatusCounter } from "@ord-components/crud/counter-list/IsActiveStatusCounter";

const Roles: React.FC = () => {
    const { roleListStore: mainStore, entityModalStore } = useStore();
    const { t } = useTranslation(RoleNS);
    const policies = PermissionUtil.crudPermission(PERMISSION_APP.system.role);
    const columns = TableUtil.getColumns<RoleDto>([
        {
            title: 'code',
            dataIndex: 'code',
            width: 200,
        },
        {
            title: 'name',
            dataIndex: 'name',
            width: 200,
        }, {
            title: 'description',
            dataIndex: 'description'
        },
        IsActivedColumn()
    ], {
        actions: [
            {
                title: 'ListUserAssign',
                icon: <UserOutlined />,
                permission: policies.edit,
                onClick: (d) => {
                    entityModalStore.openModalView({
                        modal: {
                            title: t('ListUserAssignTitleModal', { ...d }),
                            width: '90vw',
                            style: {
                                maxWidth: 1100
                            },
                            hiddenOk: true
                        },
                        modalContent: <ListUserAssign roleId={d.id} roleName={d.name} />
                    });
                },
            },
            {
                title: 'remove',
                onClick: (d) => {
                    mainStore.openRemoveById(d);
                },
                hiddenIf: (d: RoleDto) => {
                    return !!d.code && d.code?.indexOf('ADMIN_TENANT') > -1;
                },
                permission: policies.remove,
            }
        ],
        viewAction: (d) => {
            RoleService.getById({
                findId: d.id || ''
            }).then(roleDto => {
                mainStore.openUpdateModal(roleDto);
            });
        },
        viewActionPermission: policies.edit,
        ns: mainStore.getNamespaceLocale()
    })

    const topActions: IActionBtn[] = [{
        title: 'exportExcel',
        permission: policies.base,
        onClick: () => {
            mainStore.exportExcelPagedResult().then();
        }
    },
    {
        title: 'addNew',
        permission: policies.create,
        onClick: () => {
            mainStore.openCreateModal();
        },
    }];
    return (
        <>
            <OrdCrudPage stored={mainStore}
                contentTopTable={
                    <IsActiveStatusCounter getCountApi={RoleService.getCount} />
                }
                topActions={topActions}
                columns={columns}
                searchForm={f => <SearchFilterText />}
                entityForm={f => <RoleCreateOrUpdateForm form={f} />}
            ></OrdCrudPage>
        </>)
        ;
}
export default Roles;

