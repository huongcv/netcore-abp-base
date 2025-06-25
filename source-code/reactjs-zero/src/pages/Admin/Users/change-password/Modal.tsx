import {createModalStore} from "@ord-components/paged-table/hooks/useModalStoreFactory";
import {useTranslation} from "react-i18next";
import {ResetPasswordUserDto} from "@api/base/index.defs";
import UiUtils from "@ord-core/utils/ui.utils";
import {GenericModalForm} from "@ord-components/paged-table/components/GenericModalForm";
import React from "react";
import {ChangePasswordForm} from "@pages/Admin/Users/change-password/Form";
import {UserService} from "@api/base/UserService";

export const changePasswordUserModalStore = createModalStore();
export const ChangePasswordUserModal = () => {
    const {t} = useTranslation('modal');
    const handleSave = async (bodyData: ResetPasswordUserDto) => {
        UiUtils.setBusy();
        try {
            const res = await UserService.resetPassword({
                body: {
                    ...bodyData
                }
            }) || {};
            const {data, isSuccessful, message} = res;
            if (isSuccessful != true && !!message) {
                UiUtils.showError(t(message, {...bodyData}));
            }
            if (isSuccessful == true) {
                UiUtils.showSuccess(t('changePasswordUserModal.success', {...bodyData}));
            }
            return data || false;
        } catch {

        } finally {
            UiUtils.clearBusy();
        }
        return false;
    }

    return (<GenericModalForm modalStore={changePasswordUserModalStore}
                              title={t('changePasswordUserModal.title')}
                              formFields={<ChangePasswordForm/>}
                              onSave={handleSave}/>);
}