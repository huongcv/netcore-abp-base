import {FormBuilder} from "@ord-components/forms/form-builder/builder";
import {useTranslation} from "react-i18next";
import {useFormModal} from "@ord-components/modal/GlobalModalManager/hook/useFormModal";
import {OrdFormBuilder} from "@ord-components/forms/form-builder";
import {PasswordConfigDto, SmtpMailingDto} from "@api/base/index.defs";
import {ApiActionHandler} from "@ord-core/utils/api/api-action.handler";
import {HostSystemSettingService} from "@api/base/HostSystemSettingService";

export const useSmtpConfigModal = () => {
    const {t} = useTranslation('modal');
    const formConfig = new FormBuilder()
        .addText({
            span: 16,
            label: 'smtp_host',
            name: 'host',
            required: true,
            maxLength: 200
        }).addNumber({
            span: 8,
            label: 'smtp_port',
            name: 'port',
            required: true
        }).addText({
            name: 'username',
            label: 'smtp_userName',
            required: true,
            maxLength: 200
        })
        .addText({
            name: 'password',
            label: 'smtp_password',
            componentProps:{
              placeholder:"Để trống nếu không muốn thay đổi"
            },
            maxLength: 200
        })
        .addText({
            label: 'smtp_displayName',
            name: 'displayName',
            maxLength: 200
        })
        .addCheckbox({
            name: 'enableSsl',
        })
        .build();
    const {openFormModal} = useFormModal({
        title: t('hostSetting.mailingSmtp.title'),
        formFields: <OrdFormBuilder config={formConfig}/>,
        modalProps: {
            width: 500
        }
    });
    const openSmtpConfigModal = (setting: SmtpMailingDto, afterSuccess: () => void) => {
        const modalData = {
            ...setting,
            password: null
        }
        openFormModal(modalData, async (formValues, form, modalData) => {
            const successMessage = t('hostSetting.mailingSmtp.success');
            const result = await ApiActionHandler.execute(() => {
                return HostSystemSettingService.updateMailingSmtpConfig({
                    body: formValues
                })
            }, {
                successMessage: successMessage,
                afterSuccess: () => {
                    afterSuccess();
                }
            });
            return {
                mustCloseModal: true,
            }
        });
    }
    return {
        openSmtpConfigModal
    }
}