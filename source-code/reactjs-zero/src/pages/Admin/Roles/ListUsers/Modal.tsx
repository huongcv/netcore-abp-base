import {createModalStore} from "@ord-components/paged-table/hooks/useModalStoreFactory";
import {GenericModalForm} from "@ord-components/paged-table/components/GenericModalForm";
import {SearchablePagedTable} from "@ord-components/paged-table/components/SearchablePagedTable";
import {UserAccessTokenBulkActionToolbar} from "@pages/Admin/Users/access-token/UserAccessTokenBulkActionToolbar";
import React, {useEffect, useMemo} from "react";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {RoleService} from "@api/base/RoleService";
import {RolePagedDto} from "@api/base/index.defs";
import {useTranslation} from "react-i18next";
import {useUserListOfRoleLogic} from "@pages/Admin/Roles/ListUsers/useLogic";
import TableUtil from "@ord-core/utils/table.util";
import {UserDto} from "@api/index.defs";
import {UserDataColumns} from "@pages/Admin/Users/UserDataColumns";

export const roleUserListModalStore = createModalStore<RolePagedDto>();

export const UserListModal = () => {
    const {open, dataItem} = roleUserListModalStore();
    const {t} = useTranslation("modal");
    const {
        searchForm,
        rowSelection,
        selectedRowKeys,
        openConfirm,
        setOpenConfirm,
        handleBulkRevoke,
        clearSelection
    } = useUserListOfRoleLogic(dataItem);
    const title = useMemo(() => t('roleListUser.title', {...dataItem}), [dataItem]);
    useEffect(() => {
        if (open) {
            searchForm.resetFields();
        }
    }, [open]);
    const columns = TableUtil.getColumns<UserDto>([
        ...UserDataColumns
    ], {
        actions: []
    });
    const SearchFormFields = <>
        <SearchFilterText span={12}/>
    </>;
    return (
        <>
            <GenericModalForm
                modalStore={roleUserListModalStore}
                width={1200}
                hiddenOk
                title={title}
            >
                <SearchablePagedTable searchForm={searchForm}
                                      searchFields={SearchFormFields}
                                      apiService={{
                                          getPaged: (params, options) => {
                                              const body = params?.body;
                                              return RoleService.getUsersInRole({
                                                  body: {
                                                      encodedId: dataItem?.encodedId,
                                                      ...body
                                                  }
                                              })
                                          }
                                      }}
                                      rowKey={'userEncodedId'}
                                      columns={columns}
                                      rowSelection={rowSelection}
                    // counterByStatus={{
                    //     statusFieldName: 'isActived',
                    //     initialValueStatus: true,
                    //     fetcher: UserAccessTokenService.getCountByStatus
                    // }}
                                      bulkActionToolbar={<UserAccessTokenBulkActionToolbar
                                          selectedCount={selectedRowKeys.length}
                                          onRevokeClick={() => setOpenConfirm(true)}
                                      />}
                />
            </GenericModalForm>
        </>
    );
}