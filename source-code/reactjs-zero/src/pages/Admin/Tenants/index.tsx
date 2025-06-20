import React from "react";
import OrdCrudPage, {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useStore} from "@ord-store/index";
import {ShopInfoDto} from "@api/index.defs";
import {l} from "@ord-core/language/lang.utils";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import PermissionUtil from "@ord-core/config/permissions/permission.util";
import TableUtil from "@ord-core/utils/table.util";
import {SearchFilterAndIsActived} from "@ord-components/forms/search/SearchFilterAndIsActived";
import {IsActivedColumn} from "@ord-components/table/columns/IsActivedColumn";
import TenantCreateOrUpdateForm from "@pages/Admin/Tenants/CreateOrUpdateForm";
import {useNavigate} from "react-router-dom";

const Tenants: React.FC = () => {
    const {tenantListStore: mainStore} = useStore();
    const navigate = useNavigate();
    const policies = PermissionUtil.crudPermission(PERMISSION_APP.admin.tenant);
    const columns = TableUtil.getColumns<ShopInfoDto>([
        {
            title: 'tenantCode',
            dataIndex: 'tenantCode',
            width: 100,
        },
        {
            title: 'shopCode',
            dataIndex: 'code',
            width: 140,
        },
        {
            title: 'name',
            dataIndex: 'name',
            width: 200,
        },
        {
            title: l.transCommon('PhoneNumber'),
            dataIndex: 'phoneNumber',
            width: 160

        }, {
            title: l.transCommon('Email'),
            dataIndex: 'email',
            width: 100
        },
        {
            title: l.transCommon('Address'),
            dataIndex: 'address',
            width: 200
        },
        {
            title: l.transCommon('Gói cước'),
            dataIndex: 'packageRegistrationCode',
            width: 150
        },
        IsActivedColumn()
    ], {
        actions: [
            // {
            //     title: 'view',
            //     onClick: (d) => {
            //         return navigate('/admin/tenant-detail/' + d.id);
            //     },
            //     permission: PERMISSION_APP.admin.role
            // },
            // {
            //     title: 'edit',
            //     onClick: (d) => {
            //         mainStore.openUpdateModal(d);
            //     },
            //     permission: policies.edit
            // },
            {
                title: 'remove',
                onClick: async (d) => {
                    await mainStore.openRemoveByHashId(d);
                },
                permission: policies.remove
            }
        ],
        viewAction: (d) => {
            return navigate('/admin/tenant-detail/' + d.idHash);
        },
        viewActionPermission: PERMISSION_APP.admin.role,
        ns: mainStore.getNamespaceLocale()
    })

    const remove = async () => {

    }

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
                         entityForm={f => <TenantCreateOrUpdateForm
                             isCreateNew={mainStore.createOrUpdateModal.mode === 'addNew'}/>}
            ></OrdCrudPage>
            {/*{*/}
            {/*    viewModel === 'listShop' && <ShopListModal tenant={tenant}></ShopListModal>*/}
            {/*}*/}

        </>)
        ;
}
export default Tenants;

