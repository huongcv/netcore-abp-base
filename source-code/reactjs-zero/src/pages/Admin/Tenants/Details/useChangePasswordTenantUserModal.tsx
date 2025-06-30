import {useGlobalModalStore} from "@ord-components/modal/GlobalModalManager/hook/useGlobalModalStore";
import {TenantPagedDto, TenantUserChangePassword, UserPagedDto} from "@api/base/index.defs";
import {FormBuilder} from "@ord-components/forms/form-builder/builder";
import {OrdFormBuilder} from "@ord-components/forms/form-builder";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {useTranslation} from "react-i18next";
import {TenantService} from "@api/base/TenantService";
import {ApiActionHandler} from "@ord-core/utils/api/api-action.handler";

export const useChangePasswordTenantUserModal = () => {
    const {t} = useTranslation('modal');
    const {openModal} = useGlobalModalStore();
    const formConfig = new FormBuilder()
        .addText({
            name: 'code',
            maxLength: 50,
            disabled: true,
        })
        .addText({
            name: 'name',
            label: 'tenant_name',
            maxLength: 200,
            disabled: true,
        })
        .addText({
            name: 'name',
            label: 'full_name',
            maxLength: 50,
            disabled: true,
        })
        .addText({
            name: 'userName',
            label: 'UserName',
            maxLength: 200,
            disabled: true,
        })
        .addPassword({
            name: 'newPassword',
            label: 'Password',
            rules: [ValidateUtils.password],
            required: true,
            maxLength: 200
        })
        .addCheckbox({
            name: 'mustChangePassword'
        })
        .build();
    const open = (userDto: UserPagedDto, tenantDto?: TenantPagedDto | null) => {
        const modalData = {
            ...tenantDto,
            userName: userDto.userName,
        }
        openModal({
            title: t('changePasswordUserModal.title'),
            modalProps: {
                width: 680
            },
            modalData: modalData,
            formRender: (modalData) => <>
                <OrdFormBuilder config={formConfig}/>
            </>,
            onSubmit: async (formValues, modalData) => {
                const bodyData: TenantUserChangePassword = {
                    tenantIdEncodedId: tenantDto?.encodedId,
                    userEncodedId: userDto.encodedId,
                    newPassword: formValues.newPassword,
                    mustChangePassword: formValues.mustChangePassword,
                };
                return await ApiActionHandler.execute(() => {
                    return TenantService.adminChangeTenantUserPassword({
                        body: bodyData
                    })
                }, {
                    successMessage: t('changePasswordUserModal.success', {...userDto}),
                });
            }
        })
    };

    return {
        open
    };
};