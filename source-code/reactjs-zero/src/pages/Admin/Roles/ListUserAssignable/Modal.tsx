import {createModalStore} from "@ord-components/paged-table/hooks/useModalStoreFactory";
import {GenericModalForm} from "@ord-components/paged-table/components/GenericModalForm";
import {SearchablePagedTable} from "@ord-components/paged-table/components/SearchablePagedTable";
import React, {useEffect, useMemo} from "react";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {RoleService} from "@api/base/RoleService";
import {RolePagedDto} from "@api/base/index.defs";
import {useTranslation} from "react-i18next";
import TableUtil from "@ord-core/utils/table.util";
import {UserDto} from "@api/index.defs";
import {UserDataColumns} from "@pages/Admin/Users/UserDataColumns";
import {useUserListAssignableRoleLogic} from "@pages/Admin/Roles/ListUserAssignable/useLogic";
import {OrdModalFooter} from "@ord-components/modal/footer/OrdModalFooter";
import {UserListBulkAssignableToRoleActionToolbar} from "@pages/Admin/Roles/ListUserAssignable/BulkActionToolbar";

export const userListModalAssignableRoleStore = createModalStore<RolePagedDto>();

export const UserListAssignableRoleModal = () => {
    const {open, dataItem, close, handler} = userListModalAssignableRoleStore();
    const {t} = useTranslation("modal");
    const {
        searchForm,
        rowSelection,
        selectedRowKeys,
        handleBulkAssign
    } = useUserListAssignableRoleLogic(dataItem);
    const title = useMemo(() => t('usersAssignableToRole.title', {...dataItem}), [dataItem]);
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
    const onBulkAssign = () => {
        const callBack = () => {
            if (handler?.onAfterSuccess) {
                handler.onAfterSuccess();
            }
        }
        handleBulkAssign(callBack);
    }
    const SearchFormFields = <>
        <SearchFilterText span={12}/>
    </>;
    return (
        <>
            <GenericModalForm
                modalStore={userListModalAssignableRoleStore}
                width={1200}
                hiddenOk
                title={title}
                footer={<OrdModalFooter onClose={() => {
                    close();
                }}
                                        left={<UserListBulkAssignableToRoleActionToolbar
                                            onClick={onBulkAssign}
                                            selectedCount={selectedRowKeys.length}
                                        />}

                />}
            >
                <SearchablePagedTable searchForm={searchForm}
                                      searchFields={SearchFormFields}
                                      apiService={{
                                          getPaged: (params, options) => {
                                              const body = params?.body;
                                              return RoleService.getUsersAssignableToRole({
                                                  body: {
                                                      encodedId: dataItem?.encodedId,
                                                      ...body
                                                  }
                                              })
                                          }
                                      }}
                                      rowKey={'userId'}
                                      columns={columns}
                                      rowSelection={rowSelection}
                />
            </GenericModalForm>
        </>
    );
}