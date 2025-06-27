import {Button, Space} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {MouseEventHandler} from "react";


const AddNewEntity = (props: {
    disabled?: boolean;
    onClick?: MouseEventHandler<any> | undefined;
}) => {
    const {t} = useTranslation('action');
    return (<>
        <Button type='primary'
                onClick={props?.onClick}
                disabled={props?.disabled}>
            <Space>
                <PlusOutlined/>
            </Space>
            {t('addNew')}
        </Button>
    </>);
}
export default AddNewEntity;
