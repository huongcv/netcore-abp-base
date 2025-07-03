import {useTranslation} from "react-i18next";
import {useFormModal} from "@ord-components/modal/GlobalModalManager/hook/useFormModal";
import {SmtpMailingDto} from "@api/base/index.defs";
import {ApiActionHandler} from "@ord-core/utils/api/api-action.handler";
import {HostSystemSettingService} from "@api/base/HostSystemSettingService";
import {SmtpForm} from "@pages/Admin/Setting/components/SmtpForm";

export const useSmtpConfigModal = () => {
    const {t} = useTranslation('modal');
    const {openFormModal} = useFormModal({
        title: t('hostSetting.mailingSmtp.title'),
        formFields: <SmtpForm/>,
        modalProps: {
            width: 500
        }
    });
    const openSmtpConfigModal = (setting: SmtpMailingDto, afterSuccess: (updateValue: any) => void) => {
        const modalData = {
            ...setting,
            password: null,
            oldPassword: setting.password
        }
        openFormModal(modalData, async (formValues, form, modalData) => {
            const result = await ApiActionHandler.execute(() => {
                return HostSystemSettingService.updateMailingSmtpConfig({
                    body: formValues
                })
            }, {
                successMessage: 'modal.hostSetting.mailingSmtp.success',
                afterSuccess: () => {
                    afterSuccess(formValues);
                }
            });
            return {
                mustCloseModal: result,
            }
        });
    }
    return {
        openSmtpConfigModal
    }
}