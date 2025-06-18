import React from "react";
import OrdCrudPage, {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useStore} from "@ord-store/index";
import {RoleDto} from "@api/index.defs";
import {useTranslation} from "react-i18next";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import PermissionUtil from "@ord-core/config/permissions/permission.util";
import RoleCreateOrUpdateForm from "@pages/Admin/Roles/CreateOrUpdateForm";
import {RoleService} from "@api/RoleService";
import {UserOutlined} from "@ant-design/icons";
import {RoleNS} from "@pages/Admin/Roles/role.util";
import ListUserAssign from "@pages/Admin/Roles/ListUserAssign";
import TableUtil from "@ord-core/utils/table.util";
import {SearchFilterAndIsActived} from "@ord-components/forms/search/SearchFilterAndIsActived";
import {IsActivedColumn} from "@ord-components/table/columns/IsActivedColumn";

const Packages: React.FC = () => {
    const {roleListStore: mainStore, entityModalStore} = useStore();
    const {t} = useTranslation(RoleNS);
    const policies = PermissionUtil.crudPermission(PERMISSION_APP.admin.role);
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
                title: 'view',
                onClick: (d) => {
                    RoleService.getById({
                        findId: d.id || ''
                    }).then(roleDto => {
                        mainStore.openViewDetailModal(roleDto);
                    });
                },
                permission: PERMISSION_APP.admin.role
            },
            {
                title: 'edit',
                onClick: (d) => {
                    RoleService.getById({
                        findId: d.id || ''
                    }).then(roleDto => {
                        mainStore.openUpdateModal(roleDto);
                    });
                },
                permission: policies.edit
            },
            {
                title: 'ListUserAssign',
                icon: <UserOutlined/>,
                permission: policies.edit,
                onClick: (d) => {
                    entityModalStore.openModalView({
                        modal: {
                            title: t('ListUserAssignTitleModal', {...d}),
                            width: '90vw',
                            style: {
                                maxWidth: 1100
                            },
                            hiddenOk: true
                        },
                        modalContent: <ListUserAssign roleId={d.id} roleName={d.name}/>
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
                permission: policies.remove
            }
        ],
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
                         topActions={topActions}
                         columns={columns}
                         searchForm={f => <SearchFilterAndIsActived/>}
                         entityForm={f => <RoleCreateOrUpdateForm form={f}/>}
            ></OrdCrudPage>
        </>)
        ;
}
export default Packages;

