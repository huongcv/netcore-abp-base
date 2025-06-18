import {Button, Space} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {MouseEventHandler} from "react";


const AddNewEntity = (props: {
    disabled?: boolean;
    onClick?: MouseEventHandler<any> | undefined;
}) => {
    const {t} = useTranslation('common');
    return (<>
        <Button type='primary'
                onClick={props?.onClick}
                disabled={props?.disabled}>
            <Space>
                <PlusOutlined/>
            </Space>
            {t('actionBtn.addNew')}
        </Button>
    </>);
}
export default AddNewEntity;
