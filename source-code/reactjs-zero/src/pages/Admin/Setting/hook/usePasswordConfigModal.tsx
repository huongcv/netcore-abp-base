import {FormBuilder} from "@ord-components/forms/form-builder/builder";
import {useTranslation} from "react-i18next";
import {useFormModal} from "@ord-components/modal/GlobalModalManager/hook/useFormModal";
import {OrdFormBuilder} from "@ord-components/forms/form-builder";
import {PasswordConfigDto} from "@api/base/index.defs";
import {ApiActionHandler} from "@ord-core/utils/api/api-action.handler";
import {HostSystemSettingService} from "@api/base/HostSystemSettingService";

export const usePasswordConfigModal = () => {
    const {t} = useTranslation('modal');
    const formConfig = new FormBuilder()
        .addNumber({
            name: 'maxLoginAttempts',
            componentProps: {
                max: 50,
                min: 0
            },
            required: true
        }).addNumber({
            name: 'passwordExpiry',
            componentProps: {
                max: 365,
                min: 0
            },
            required: true
        })
        .addNumber({
            name: 'passwordMinLength',
            componentProps: {
                max: 50,
                min: 6
            },
            required: true
        })
        .addCheckbox({
            name: 'requireUppercase',
        }).addCheckbox({
            name: 'requireLowercase',
        }).addCheckbox({
            name: 'requireNumbers',
        }).addCheckbox({
            name: 'requireSpecialChars',
        })
        .build();
    const {openFormModal} = useFormModal({
        title: t('hostSetting.passwordConfig.title'),
        formFields: <OrdFormBuilder config={formConfig}/>,
        modalProps: {
            width: 500
        }
    });
    const openPasswordConfigModal = (setting: PasswordConfigDto) => {
        const modalData = {
            ...setting
        }
        openFormModal(modalData, async (formValues, form, modalData) => {
            const successMessage = t('hostSetting.passwordConfig.success');
            const result = await ApiActionHandler.execute(() => {
                return HostSystemSettingService.updatePasswordConfig({
                    body: formValues
                })
            }, {
                successMessage: successMessage
            });
            return {
                mustCloseModal: true,
            }
        });
    }
    return {
        openPasswordConfigModal
    }
}