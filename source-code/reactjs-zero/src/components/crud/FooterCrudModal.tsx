import React, {ReactNode} from "react";
import {useTranslation} from "react-i18next";
import {Button, Checkbox, CheckboxProps, Space} from "antd";
import {CloseOutlined, SaveOutlined} from "@ant-design/icons";
import {debounce} from "lodash";
import {l} from "@ord-core/language/lang.utils";

interface IProp {
    hasAddNewContinue?: boolean,
    isAddNewContinue?: boolean,
    isAddNewContinueChange?: (checked: boolean) => void,
    onCancel: () => void;
    onOk: () => void;
    okBtn?: ReactNode;
    cancelBtn?: ReactNode;
    hiddenOk?: boolean;
    otherBtn?: ReactNode;
}

export const FooterCrudModal = (props: IProp) => {
    const {t} = useTranslation('action');
    const onChange: CheckboxProps['onChange'] = (e) => {
        if (props.isAddNewContinueChange) {
            props.isAddNewContinueChange(e.target.checked);
        }
    };
    const onOkClick = () => {
        props.onOk();
    }
    const debouncedClick = debounce(onOkClick, 250);
    return (
        <div
            className="flex flex-wrap items-center justify-between  max-sm:flex-col">
            <div>
                {
                    props?.hasAddNewContinue &&
                    <Checkbox checked={props.isAddNewContinue}
                              onChange={onChange}>
                        {l.transCommon('addNewContinue')}
                    </Checkbox>
                }
            </div>


            <div className="flex items-center crud-modal-footer-btn-group">
                <Button className='me-2' onClick={props.onCancel}>
                    {
                        props?.cancelBtn || (
                            <Space.Compact><Space><CloseOutlined className="me-1"/></Space>{t('modal.cancel')} (F10)
                            </Space.Compact>)
                    }

                </Button>
                {
                    props?.hiddenOk !== true && <Button type='primary' onClick={debouncedClick}>
                        {
                            props?.okBtn || (
                                <Space.Compact> <Space><SaveOutlined
                                    className="me-1"/></Space>{t('modal.save')} (F8)</Space.Compact>)
                        }

                    </Button>
                }
                {props?.otherBtn}
            </div>
        </div>
    );
}
