import {observer} from "mobx-react-lite";
import {TenantDto, UserDto} from "@api/index.defs";
import React, {lazy, useState} from "react";
import TableUtil from "@ord-core/utils/table.util";
import {UserDataColumns} from "@pages/Admin/Users/UserDataColumns";
import {DataTableWithSearch} from "@ord-components/table/DataTableWithSearch";
import {UserSearchForm} from "@pages/Admin/Users/UserSearchForm";
import {TenantService} from "@api/TenantService";
import UiUtils from "@ord-core/utils/ui.utils";
import {useTranslation} from "react-i18next";

const UserListOfTenant = (props: {
    tenant: TenantDto
}) => {
    const [refresh, doRefresh] = useState(0);
    const {t} = useTranslation('tenant-list');
    const columns = TableUtil.getColumns<UserDto>(UserDataColumns, {
        actions: [
            {
                title: 'loginWithAccount',
                permission: 'AuthPlugin.User.LoginPasswordless',
                contentLazy: lazy(() => import("@pages/Admin/Users/actions/loginWithAccount"))
            },
            {
                title: t('resetRoleAdmin'),
                // permission: policies.assignRole,
                content: (d: UserDto)=>{
                    return <div onClick={()=>{
                        TenantService.resetRoleAdminTenant({
                            body:{
                                userId: d.id,
                                tenantId: props.tenant.id || ''
                            }
                        }).then(res=>{
                            if(res.isSuccessful){
                                UiUtils.showSuccess(t("resetSuccess"));
                            }
                        })
                    }}>
                        { t('resetRoleAdmin')}
                    </div>
                }
            }
        ]
    });
    const getPageResult = (input: any) => {
        return TenantService.getUserList({
            tenantId: props.tenant.id || '',
            body: {
                ...input
            }
        });
    }
    return (<>
        <DataTableWithSearch columns={columns}
                             searchBox={{
                                 searchForm: (form) =>
                                     (<UserSearchForm searchFormRef={form}/>)
                             }}
                             getPageResult={getPageResult}
                             refreshData={refresh}
        ></DataTableWithSearch>
    </>);
}
export default observer(UserListOfTenant);
