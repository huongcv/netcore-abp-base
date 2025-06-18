import {Button} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";

export const ModalFooterReadOnly = (props: {
    onCancel: () => void;
}) => {
    const {t} = useTranslation();
    return (
        <Button icon={<CloseOutlined/>} onClick={props.onCancel}>{t('cancelModal')}</Button>
    )
}
