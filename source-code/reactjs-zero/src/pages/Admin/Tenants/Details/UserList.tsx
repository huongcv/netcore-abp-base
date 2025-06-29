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

interface IProps {
    tenantDto?: TenantPagedDto | null;
}

export const TenantUserList: React.FC<IProps> = ({tenantDto}) => {
    const [searchForm] = Form.useForm();
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
        actions: []
    });

    return <SearchablePagedTable searchForm={searchForm}
                                 searchFields={SearchFormFields}
                                 apiService={apiService}
                                 rowKey={'userId'}
                                 columns={columns}
    />;
}