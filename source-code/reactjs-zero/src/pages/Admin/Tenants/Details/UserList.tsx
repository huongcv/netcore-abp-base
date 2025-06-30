import {SearchablePagedTable} from "@ord-components/paged-table/components/SearchablePagedTable";
import {Form} from "antd";
import {TenantPagedDto} from "@api/base/index.defs";
import {useMemo} from "react";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import TableUtil from "@ord-core/utils/table.util";
import {UserDto} from "@api/index.defs";
import {UserDataColumns} from "@pages/Admin/Users/UserDataColumns";
import {TenantService} from "@api/base/TenantService";
import {SearchIsActived} from "@ord-components/forms/search/SearchIsActived";
import {UndoOutlined} from "@ant-design/icons";
import PermissionUtil from "@ord-core/config/permissions/permission.util";
import {PERMISSION_NAME_APP} from "@ord-core/config/permissions/permission-name";
import {useChangePasswordTenantUserModal} from "@pages/Admin/Tenants/Details/useChangePasswordTenantUserModal";

interface IProps {
    tenantDto?: TenantPagedDto | null;
}

export const TenantUserList: React.FC<IProps> = ({tenantDto}) => {
    const [searchForm] = Form.useForm();
    const userTenantChangePasswordModal = useChangePasswordTenantUserModal();
    const policies = PermissionUtil.crudPermission(PERMISSION_NAME_APP.admin.tenant);
    const apiService = useMemo(() => ({
        getPaged: (params: any, options?: any) => {
            const body = params?.body;
            return TenantService.getUserPaged({
                body: {
                    encodedId: tenantDto?.encodedId,
                    ...body
                }
            });
        }
    }), [tenantDto?.encodedId]);
    const SearchFormFields = <>
        <SearchIsActived/>
        <SearchFilterText span={12}/>
    </>;
    const columns = TableUtil.getColumns<UserDto>([
        ...UserDataColumns
    ], {
        actions: [
            {
                title: 'changePassword',
                permission: policies.edit,
                icon: <UndoOutlined/>,
                onClick: (user) => {
                    userTenantChangePasswordModal.open(user, tenantDto || {});
                }
            },
        ]
    });

    return (<>
        <SearchablePagedTable searchForm={searchForm}
                              searchFields={SearchFormFields}
                              apiService={apiService}
                              rowKey={'encodedId'}
                              columns={columns}
        />
    </>);
}