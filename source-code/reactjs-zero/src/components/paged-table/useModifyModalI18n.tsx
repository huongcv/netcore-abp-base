import {useTranslation} from "react-i18next";
import {Trans} from "react-i18next";
import React from "react";

export interface ModifyModalI18nConfig {
    titleI18nKey?: {
        create?: string;
        edit?: string;
        viewDetail?: string;
    };
    successI18nKey?: {
        create?: string;
        edit?: string;
        remove?: string;
    };
    confirmI18nKey?: {
        remove?: string;
    };
    translationNamespace?: string | string[]; // namespace cho useTranslation
}

export interface UseModifyModalI18nProps {
    entityTranslationNs: string;
    i18nConfig?: ModifyModalI18nConfig;
}

export const useModifyModalI18n = ({
                                       entityTranslationNs,
                                       i18nConfig
                                   }: UseModifyModalI18nProps) => {
    const {t} = useTranslation(['modify-modal']); // Giữ mặc định cho cách cũ
    const {t: tCommon} = useTranslation(['common']);
    const {t: tCustom} = useTranslation(i18nConfig?.translationNamespace || ['modify-modal']);

    const getTitleText = (mode: 'create' | 'edit' | 'viewDetail', editingItem?: any) => {
        if (i18nConfig?.titleI18nKey) {
            const keyMap = {
                create: i18nConfig.titleI18nKey.create,
                edit: i18nConfig.titleI18nKey.edit,
                viewDetail: i18nConfig.titleI18nKey.viewDetail,
            };
            const key = keyMap[mode];
            return key ? tCustom(key, editingItem || {}) : '---';
        } else {
            // Cách cũ - sử dụng entity translation với namespace mặc định
            const entity = t('entity.' + entityTranslationNs);
            const keyMap = {
                create: t('common.title.create', {entity}),
                edit: t('common.title.edit', {entity}),
                viewDetail: t('common.title.view', {entity}),
            };
            const key = keyMap[mode];
            return t(key, editingItem || {}) || '---';
        }
    };

    const getSuccessMessage = (
        mode: 'create' | 'edit' | 'viewDetail',
        data: any
    ) => {
        if (i18nConfig?.successI18nKey) {
            const keyMap = {
                create: i18nConfig.successI18nKey.create,
                edit: i18nConfig.successI18nKey.edit,
                viewDetail: i18nConfig.successI18nKey.remove,
            };
            const key = keyMap[mode];
            return key ? tCustom(key, (data)) : '';
        } else {
            // Cách cũ - sử dụng entity translation với namespace mặc định
            const entity = t('entity.' + entityTranslationNs);
            const keyMap = {
                create: t('common.success.create', {entity}),
                edit: t('common.success.edit', {entity}),
                viewDetail: t('common.success.remove', {entity}),
            };
            const key = keyMap[mode];
            return t(key, (data));
        }
    };

    const getDeleteSuccessMessage = (
        deletingItem: any
    ) => {
        if (i18nConfig?.successI18nKey?.remove) {
            return tCustom(i18nConfig.successI18nKey.remove, ({...deletingItem}));
        } else {
            // Cách cũ - sử dụng entity translation với namespace mặc định
            const entity = t('entity.' + entityTranslationNs);
            const key = t('common.success.remove', {entity});
            return t(key, ({...deletingItem}));
        }
    };

    const getConfirmContent = (deletingItem: any): React.ReactNode => {
        if (i18nConfig?.confirmI18nKey?.remove) {
            return (
                <Trans
                    ns={i18nConfig.translationNamespace || ['modify-modal']}
                    i18nKey={i18nConfig.confirmI18nKey.remove}
                    values={deletingItem}
                    components={{italic: <i/>, bold: <strong/>}}
                />
            );
        } else {
            // Cách cũ - sử dụng entity translation với namespace mặc định
            const entity = t('entity.' + entityTranslationNs);
            const i18nKey = t('common.confirm.remove', {entity});
            return (
                <Trans
                    ns={'confirm'}
                    i18nKey={i18nKey}
                    values={deletingItem}
                    components={{italic: <i/>, bold: <strong/>}}
                />
            );
        }
    };

    const getConfirmTitle = () => {
        return tCommon('confirmDelete');
    };

    return {
        getTitleText,
        getSuccessMessage,
        getDeleteSuccessMessage,
        getConfirmContent,
        getConfirmTitle,
        t,
        tCommon
    };
};