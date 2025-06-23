import {createModalStore} from "@ord-components/paged-table/useModalStoreFactory";
import {useTranslation} from "react-i18next";
import {AssignRolesToUserDto, ResetPasswordUserDto} from "@api/base/index.defs";
import UiUtils from "@ord-core/utils/ui.utils";
import {GenericModalForm} from "@ord-components/paged-table/GenericModalForm";
import React, {useEffect} from "react";
import {UserService} from "@api/base/UserService";
import {AssignRoleForm} from "@pages/Admin/Users/assign-role/Form";

export const assignRoleUserModalStore = createModalStore();
export const AssignRoleUserModal = () => {
    const {t} = useTranslation('modal');
    const handleSave = async (bodyData: AssignRolesToUserDto) => {
        UiUtils.setBusy();
        try {
            const res = await UserService.assignRoles({
                body: {
                    ...bodyData
                }
            }) || {};
            const {data, isSuccessful, message} = res;
            if (isSuccessful != true && !!message) {
                UiUtils.showError(t(message, {...bodyData}));
            }
            if (isSuccessful == true) {
                UiUtils.showSuccess(t('userAssignRole.success', {...bodyData}));
            }
            return data || false;
        } catch {

        } finally {
            UiUtils.clearBusy();
        }
        return false;
    }

    return (<GenericModalForm modalStore={assignRoleUserModalStore}
                              width={690}
                              title={t('userAssignRole.title')}
                              formFields={<AssignRoleForm/>}
                              onSave={handleSave}/>);
}