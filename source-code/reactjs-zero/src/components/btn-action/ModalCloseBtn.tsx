import {Button, Space} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";


const ModalCloseBtn = (props: {
    disabled?: boolean;
    onClick: () => void;
}) => {
    const {t} = useTranslation('common');
    const onOkClick = () => {
        props.onClick();
    }
    return (<>
        <Button onClick={onOkClick}
                disabled={props?.disabled}>
            <Space>
                <CloseOutlined/>
            </Space>
            {t('closeModal')}
        </Button>
    </>);
}
export default ModalCloseBtn;
