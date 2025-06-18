import OrdSelect, {IOrdSelectOption, IOrdSelectProp,} from "@ord-components/forms/select/OrdSelect";
import {Button, Divider, Form, Row} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import UiUtils from "@ord-core/utils/ui.utils";
import {useStore} from "@ord-store/index";
import {CommonResultDto} from "@ord-core/service-proxies/dto";
import {HotkeysProvider} from "react-hotkeys-hook";
import {HotKeyScope} from "@ord-core/AppConst";
import {DeserializeCardService} from "@api/DeserializeCardService";

interface ModalSetting {
    width?: string | number;
    style?: React.CSSProperties;
    wrapClassName?: string;
    title?: React.ReactNode;
}

export interface IOrdSelectAndAddNewActions {
    openAddNewModal: (initValue?: unknown) => void;
    //có thể thêm nhiều hàm khác nếu muốn expose
}

export interface IOrdSelectAndAddNewProps extends IOrdSelectProp {
    formContent: React.ReactNode,
    apiAddNew: (formValue: any) => Promise<CommonResultDto<any>>,
    nameDataSource: string,
    renderSelectOptions: (newItem: any) => IOrdSelectOption,
    onAddDone?: (newItem: any) => void,
    modalSetting?: ModalSetting,
    hiddenAddNewBtn?: boolean,
    autoFocus?: boolean
    onReady?: (actions: IOrdSelectAndAddNewActions) => void;
}

export const OrdSelectAndAddNew = (props: IOrdSelectAndAddNewProps) => {
    const {selectDataSourceStore, entityModalStore} = useStore();
    const [allowClear, setAllowClear] = useState(true);
    const [t] = useTranslation();
    const {
        formContent, nameDataSource, onAddDone, renderSelectOptions,
        modalSetting,
        apiAddNew,
        hiddenAddNewBtn,
        ...rest
    } = props;
    const [newOption, setNewOption] = useState<any>(null);
    const formRef = Form.useFormInstance();
    useEffect(() => {
        if (!props.allowClear) {
            setAllowClear(false);
        }
    }, [props.allowClear]);
    useEffect(() => {
        if (props.onReady) {
            props.onReady({openAddNewModal});  // khi mount để "giao lại" hàm cho cha.
        }
    }, []);

    const setNewData = (dto: any) => {
        if (dto && dto.id) {
            selectDataSourceStore.clearByName(nameDataSource);
            setNewOption({
                ...renderSelectOptions(dto)
            });
            if (onAddDone) {
                onAddDone(dto);
            }
        }
    }

    const openAddNewModal = (initValue?: unknown) => {
        if (formRef) {
            formRef.setFieldValue('disableHotKeySave', true);
        }

        entityModalStore.openModalForm({
            modal: {
                title: t('addNewSelectTitle.' + props.nameDataSource),
                width: modalSetting?.width || 900
            },
            entity: initValue ?? {},
            formContent: () => <>
                <Row gutter={16}>
                    {formContent}
                </Row>

            </>,
            onSave: async (formValue: any) => {
                UiUtils.setBusy()
                try {
                    const result = await props.apiAddNew({...formValue});
                    if (result.isSuccessful) {
                        setNewData({
                            ...result.data
                        });
                        return true;
                    }
                    return result.isSuccessful || false;
                } catch {

                } finally {
                    UiUtils.clearBusy();
                }
                return false;
            },
            onClose: () => {
                if (formRef) {
                    formRef.setFieldValue('disableHotKeySave', false);
                }
            }
        });
    }


    return (<>
        <HotkeysProvider initiallyActiveScopes={[HotKeyScope.crudPageBase]}>
            <OrdSelect {...rest}
                       allowClear={allowClear}
                       newOption={newOption}
                       dropdownRender={(menu) => (
                           <>
                               {menu}
                               {
                                   hiddenAddNewBtn != true && <>
                                       <Divider style={{margin: '8px 0'}}/>
                                       <Button size={'small'}
                                               onClick={() => openAddNewModal()}
                                               type={'primary'} htmlType={'button'}
                                               icon={<PlusOutlined/>}>
                                           {t('addNewItemSelect')}
                                       </Button>

                                   </>
                               }

                           </>
                       )}/>
        </HotkeysProvider>

    </>);
};
