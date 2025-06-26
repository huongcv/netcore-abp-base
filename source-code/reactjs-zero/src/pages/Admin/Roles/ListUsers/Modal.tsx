import {createModalStore} from "@ord-components/paged-table/hooks/useModalStoreFactory";
import {GenericModalForm} from "@ord-components/paged-table/components/GenericModalForm";
import {SearchablePagedTable} from "@ord-components/paged-table/components/SearchablePagedTable";
import React, {useEffect, useMemo} from "react";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {RoleService} from "@api/base/RoleService";
import {RolePagedDto} from "@api/base/index.defs";
import {useTranslation} from "react-i18next";
import {useUserListOfRoleLogic} from "@pages/Admin/Roles/ListUsers/useLogic";
import TableUtil from "@ord-core/utils/table.util";
import {UserDto} from "@api/index.defs";
import {UserDataColumns} from "@pages/Admin/Users/UserDataColumns";
import {UserListBulkActionToolbar} from "@pages/Admin/Roles/ListUsers/BulkActionToolbar";
import {OrdModalFooter} from "@ord-components/modal/footer/OrdModalFooter";

export const roleUserListModalStore = createModalStore<RolePagedDto>();

export const UserListModal = () => {
    const {open, dataItem: roleDto, close, handler} = roleUserListModalStore();
    const {t} = useTranslation("modal");
    const {
        apiService,
        searchForm,
        rowSelection,
        selectedRowKeys,
        handleBulkRevoke,
    } = useUserListOfRoleLogic(roleDto);
    const title = useMemo(() => t('roleListUser.title', {...roleDto}), [roleDto]);
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

    const onRevoke = () => {
        const callBack = () => {
            if (handler?.onAfterSuccess) {
                handler.onAfterSuccess();
            }
        }
        handleBulkRevoke(callBack).then();
    }

    return (
        <>
            <GenericModalForm
                modalStore={roleUserListModalStore}
                width={1200}
                hiddenOk
                title={title}
                footer={<OrdModalFooter onClose={() => {
                    close();
                }}
                                        left={<UserListBulkActionToolbar
                                            onRevokeClick={onRevoke}
                                            selectedCount={selectedRowKeys.length}
                                        />}

                />}
            >
                <SearchablePagedTable searchForm={searchForm}
                                      searchFields={SearchFormFields}
                                      apiService={apiService}
                                      rowKey={'userId'}
                                      columns={columns}
                                      rowSelection={rowSelection}
                />
            </GenericModalForm>
        </>
    );
}