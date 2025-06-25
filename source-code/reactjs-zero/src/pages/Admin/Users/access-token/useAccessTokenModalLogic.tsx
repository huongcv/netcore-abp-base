import {useState} from "react";
import {UserAccessTokenService} from "@api/base/UserAccessTokenService";
import {UserAccessTokenDto, UserPagedDto} from "@api/base/index.defs";
import UiUtils from "@ord-core/utils/ui.utils";
import {useTranslation} from "react-i18next";
import {useRowSelectionStore} from "@ord-components/paged-table/hooks/useRowSelectionStore";
import {Form} from "antd";
import {formSignalUtils} from "@ord-components/paged-table/utils/formSignal.utils";

export const useAccessTokenModalLogic = (user?: UserPagedDto) => {
    const {t: tConfirm} = useTranslation("confirm");
    const [revokeReason, setRevokeReason] = useState('');
    const [openConfirm, setOpenConfirm] = useState(false);
    const [searchForm] = Form.useForm();
    const {
        rowSelection,
        selectedRowKeys,
        selectedRows,
        clearSelection,
    } = useRowSelectionStore<UserAccessTokenDto>({
        isRowDisabled: (record) => !record?.isActived || !!record?.isCurrentToken
    });

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
                formSignalUtils.reloadTableAndCounter(searchForm);
            } else {
                UiUtils.showError(result.message);
            }
        } catch {
            // xử lý lỗi nếu cần
        } finally {
            UiUtils.clearBusy();
        }
    };

    return {
        rowSelection,
        selectedRowKeys,
        selectedRows,
        clearSelection,
        revokeReason,
        setRevokeReason,
        openConfirm,
        setOpenConfirm,
        handleBulkRevoke,
        searchForm
    };
};
