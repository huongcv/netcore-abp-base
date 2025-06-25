import {createModalStore} from "@ord-components/paged-table/hooks/useModalStoreFactory";
import {useTranslation} from "react-i18next";
import {GenericModalForm} from "@ord-components/paged-table/components/GenericModalForm";
import React, {useEffect, useMemo, useState} from "react";
import {UserAccessTokenService} from "@api/base/UserAccessTokenService";
import {UserDto} from "@api/index.defs";
import TableUtil from "@ord-core/utils/table.util";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {UserPagedDto} from "@api/base/index.defs";
import {UserAccessTokenColumns} from "@pages/Admin/Users/access-token/Columns";
import {ConfirmRevokeModal} from "@pages/Admin/Users/access-token/ConfirmRevokeModal";
import {useAccessTokenModalLogic} from "@pages/Admin/Users/access-token/useAccessTokenModalLogic";
import {SearchablePagedTable} from "@ord-components/paged-table/components/SearchablePagedTable";
import {UserAccessTokenBulkActionToolbar} from "@pages/Admin/Users/access-token/UserAccessTokenBulkActionToolbar";

export const userAccessTokenListModalStore = createModalStore();
export const UserAccessTokenListModal = () => {
    const {t} = useTranslation("modal");
    const {t: tCommon} = useTranslation();
    const {open, dataItem} = userAccessTokenListModalStore();
    const [user, setUser] = useState<UserPagedDto>();
    const {
        searchForm,
        rowSelection,
        selectedRowKeys,
        revokeReason,
        setRevokeReason,
        openConfirm,
        setOpenConfirm,
        handleBulkRevoke,
        clearSelection
    } = useAccessTokenModalLogic(user);
    useEffect(() => {
        if (open) {
            searchForm.resetFields();
            if (dataItem) {
                setUser(dataItem);
            }
        } else {
            clearSelection();
        }
    }, [open]);
    useEffect(() => {
        if (user) {
            searchForm.setFieldsValue({
                userEncodedId: user.encodedId
            });
        }
    }, [user]);
    const title = useMemo(() => t('userAccessTokenListModal.title', {...user}), [user]);

    const handleSave = async () => {
        return true;
    }
    const columns = TableUtil.getColumns<UserDto>([
        ...UserAccessTokenColumns
    ], {
        actions: []
    });
    const SearchFormFields = <>
        <SearchFilterText span={12}/>
    </>;
    return (
        <>
            <GenericModalForm
                modalStore={userAccessTokenListModalStore}
                width={1200}
                hiddenOk
                title={title}
                onSave={handleSave}
            >
                <SearchablePagedTable searchForm={searchForm}
                                      searchFields={SearchFormFields}
                                      apiService={UserAccessTokenService}
                                      rowKey={'tokenId'}
                                      columns={columns}
                                      rowSelection={rowSelection}
                                      initialSearchParams={{
                                          isActived: true,
                                          userEncodedId: user?.encodedId,
                                      }}
                                      counterByStatus={{
                                          statusFieldName: 'isActived',
                                          initialValueStatus: true,
                                          fetcher: UserAccessTokenService.getCountByStatus
                                      }}
                                      bulkActionToolbar={<UserAccessTokenBulkActionToolbar
                                          selectedCount={selectedRowKeys.length}
                                          onRevokeClick={() => setOpenConfirm(true)}
                                      />}
                />
                <ConfirmRevokeModal
                    open={openConfirm}
                    onCancel={() => setOpenConfirm(false)}
                    onConfirm={async () => {
                        await handleBulkRevoke();
                        setOpenConfirm(false);
                    }}
                    count={selectedRowKeys.length}
                    userName={user?.userName}
                    reason={revokeReason}
                    setReason={setRevokeReason}
                />
            </GenericModalForm>
        </>
    );
}