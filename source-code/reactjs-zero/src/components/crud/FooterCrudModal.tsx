import React, {ReactNode, useMemo} from "react";
import {useTranslation} from "react-i18next";
import {Checkbox, CheckboxProps} from "antd";
import {l} from "@ord-core/language/lang.utils";
import {OrdModalSaveButton} from "@ord-components/modal/footer/buttons/OrdModalSaveButton";
import {OrdModalFooter} from "@ord-components/modal/footer/OrdModalFooter";

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
    const {hasAddNewContinue, hiddenOk, onCancel} = props;
    const onChange: CheckboxProps['onChange'] = (e) => {
        if (props.isAddNewContinueChange) {
            props.isAddNewContinueChange(e.target.checked);
        }
    };
    const onOkClick = () => {
        props.onOk();
    }
    const renderLeftFooter = useMemo(() => {
        if (hasAddNewContinue == true) {
            return <Checkbox checked={props.isAddNewContinue}
                             onChange={onChange}>
                {l.transCommon('addNewContinue')}
            </Checkbox>
        }
        return null;
    }, [hasAddNewContinue]);
    const renderRightFooter = useMemo(() => {
        if (hiddenOk == true) {
            return null;
        }
        return <OrdModalSaveButton onSubmit={onOkClick}/>;
    }, [hiddenOk]);
    return (
        <>
            <OrdModalFooter onClose={onCancel} left={renderLeftFooter}
                            right={renderRightFooter}
            ></OrdModalFooter>
        </>
    );
}
