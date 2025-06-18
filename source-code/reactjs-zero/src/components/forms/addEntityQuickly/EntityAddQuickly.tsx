import {observer} from "mobx-react-lite";
import React from "react";
import {Button, Form, Tooltip} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";
import { CommonResultDto } from "@ord-core/service-proxies/dto";
import { PlusIconCustom } from "@ord-core/theme/icon.config";

interface EntityAddQuicklyProps<T> {
    onSavedSuccess: (newEntity: T) => void;
    entityFormComponent: React.FC;
    apiService?: (params: { body?: any }) => Promise<CommonResultDto<any>>;
    translationKey: string;
    modalWidth?: number;
    titleCustom?: string;
    disable?: false;
}

export const EntityAddQuickly = observer(
    <T, >({
              onSavedSuccess,
              entityFormComponent: EntityFormComponent,
              apiService,
              translationKey,
              modalWidth = 900,
              titleCustom,
              disable
          }: EntityAddQuicklyProps<T>) => {
        const {t} = useTranslation(translationKey);
        const rootForm = Form.useFormInstance();
        const {entityModalStore} = useStore();

        const clickAdd = () => {

            if (rootForm) {
                rootForm.setFieldValue("disableHostKeyScopeForm", true);
            }
            entityModalStore.openModalForm({
                entity: {},
                modal: {
                    width: modalWidth, 
                    title: titleCustom ? titleCustom : t("title.addNew"),
                },
                formContent: () => <EntityFormComponent/>,
                onSave: async (formValue) => {
                    if (apiService) {
                        const resp = await apiService({
                            body: {...formValue},
                        });
                        if (!resp.isSuccessful) {
                            ServiceProxyUtils.notifyErrorResultApi(resp, translationKey, formValue);
                        } else {
                            onSavedSuccess(resp.data as T);
                        }
                        return !!resp.isSuccessful && resp.isSuccessful;
                    } else {
                        onSavedSuccess(formValue);
                        return true;
                    }
                },
                onClose: () => {
                    if (rootForm) {
                        rootForm.setFieldValue("disableHostKeyScopeForm", false);
                    }
                },
            });
        };

        return (
            <Tooltip title={titleCustom ? titleCustom : t("title.addNew")}>
                <Button disabled={disable} type={"primary"} className={"h-auto"} onClick={clickAdd}>
                    <PlusIconCustom />
                </Button>
            </Tooltip>
        );
    }
);
