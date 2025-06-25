import {createModalStore} from "@ord-components/paged-table/useModalStoreFactory";
import {useTranslation} from "react-i18next";
import {GenericModalForm} from "@ord-components/paged-table/GenericModalForm";
import React, {useEffect, useMemo, useState} from "react";
import {createTableStore, PagedTable} from "@ord-components/paged-table";
import {UserAccessTokenService} from "@api/base/UserAccessTokenService";
import {UserDto} from "@api/index.defs";
import TableUtil from "@ord-core/utils/table.util";
import {PagedTableSearchForm} from "@ord-components/paged-table/PagedTableSearchForm";
import {Button, Form, Space} from "antd";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {GetUserAccessTokenPagedInput, UserAccessTokenDto, UserPagedDto} from "@api/base/index.defs";
import {UserAccessTokenColumns} from "@pages/Admin/Users/access-token/Columns";
import {OrdCounterByStatusSegmented} from "@ord-components/crud/counter-list/OrdCounterByStatusSegmented";
import {createRowSelectionHook} from "@ord-components/paged-table/useRowSelectionStore";
import {DeleteOutlined} from "@ant-design/icons";
import UiUtils from "@ord-core/utils/ui.utils";
import {ConfirmRevokeModal} from "@pages/Admin/Users/access-token/ConfirmRevokeModal";
import {TableSearchForm} from "@ord-components/paged-table/TableSearchForm";

export const userAccessTokenListModalStore = createModalStore();
export const userAccessTokenTableStore = createTableStore({
    getPaged: params => {
        // @ts-ignore
        const body: GetUserAccessTokenPagedInput = params?.body;
        if (body?.isActived == null) {
            body.isActived = true;
        }
        return UserAccessTokenService.getPaged({
            body
        });
    }
});
const rowSelectionStore = createRowSelectionHook<UserAccessTokenDto>({
    isRowDisabled: (record) => {
        return !record?.isActived || !!record?.isCurrentToken;
    }
});

export const UserAccessTokenListModal = () => {
    const {t} = useTranslation("modal");
    const {t: tCommon} = useTranslation();
    const {t: tConfirm} = useTranslation("confirm");
    const {open, dataItem} = userAccessTokenListModalStore();
    const [searchForm] = Form.useForm();
    const [user, setUser] = useState<UserPagedDto>();
    const [revokeReason, setRevokeReason] = useState('');
    const [openConfirm, setOpenConfirm] = useState(false);
    const {
        rowSelection,
        selectedRowKeys,
        selectedRows,
        clearSelection,
    } = rowSelectionStore();
    const {onLoadData, setReloadStatusCounter, reset} = userAccessTokenTableStore();

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
    const handleBulkRevoke = async () => {
        UiUtils.setBusy();
        try {

            const result = await UserAccessTokenService.revokeTokens({
                body: {
                    userEncodedId: user?.encodedId,
                    reason: revokeReason,
                    // @ts-ignore
                    tokenIds: [...selectedRowKeys]
                }
            });
            if (result.isSuccessful) {
                UiUtils.showSuccess(tConfirm('revokeToken.success', {
                    count: selectedRowKeys.length
                }));
                setRevokeReason('');
                clearSelection();
                onLoadData().then();
                setReloadStatusCounter();
            } else {
                UiUtils.showError(result.message);
            }
        } catch {

        } finally {
            UiUtils.clearBusy();
        }

    }

    const columns = TableUtil.getColumns<UserDto>([
        ...UserAccessTokenColumns
    ], {
        actions: []
    });
    // Bulk action toolbar (only show when tokens are selected and on active tab)
    const BulkActionToolbar = () => {
        if (selectedRowKeys.length === 0) {
            return null;
        }

        return (
            <div style={{
                marginBottom: 16,
                padding: '12px 16px',
                background: '#e6f7ff',
                border: '1px solid #91d5ff',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Space>
                    <span style={{fontWeight: 500}}>
                        {tCommon('selectedItems', {count: selectedRowKeys.length})}
                    </span>
                </Space>

                <Space>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined/>}
                        disabled={selectedRowKeys.length === 0}
                        onClick={() => {
                            setOpenConfirm(true);
                        }}
                    >
                        {tCommon('revokeSelected', {count: selectedRowKeys.length})}
                    </Button>


                </Space>
            </div>
        );
    };

    return (
        <>
            <GenericModalForm
                modalStore={userAccessTokenListModalStore}
                width={1200}
                hiddenOk
                title={title}
                onSave={handleSave}
            >
                <TableSearchForm
                    form={searchForm}
                    tableStore={userAccessTokenTableStore}>
                    <SearchFilterText span={12}/>
                </TableSearchForm>

                <div className={'mt-5'}>
                    <OrdCounterByStatusSegmented
                        tableStore={userAccessTokenTableStore}
                        statusFieldName={'isActived'}
                        initialValueStatus={true}
                        fetcher={UserAccessTokenService.getCountByStatus}
                    />
                </div>

                {/* Bulk Action Toolbar - only show on active tab */}
                <BulkActionToolbar/>
                <PagedTable
                    rowKey={'tokenId'}
                    columns={columns}
                    tableStore={userAccessTokenTableStore}
                    rowSelection={rowSelection}
                    initialSearchParams={{
                        isActived: true,
                        userEncodedId: user?.encodedId,
                    }}
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