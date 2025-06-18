import React, {useEffect, useState} from "react";
import {Button, Form, Modal, Space} from "antd";
import {StopOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import ModalCloseBtn from "@ord-components/btn-action/ModalCloseBtn";
import TextArea from "antd/lib/input/TextArea";
import {CancelMoveStockDto, CommonResultDtoOfNullableOfInt64} from "@api/index.defs";
import UiUtils from "@ord-core/utils/ui.utils";

const CancelStockMoveModal = (props: {
    record: any,
    onCancelDone?: () => void,
    apiCancelMove: (
        params: {
            body?: CancelMoveStockDto;
        }
    ) => Promise<CommonResultDtoOfNullableOfInt64>
}) => {
    const {record} = props;
    const [t] = useTranslation('stock');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    useEffect(() => {
        if (record) {
            setIsModalOpen(true);
            form.setFieldsValue({
                ...record
            });
        }
    }, [record]);
    const form_w = Form.useWatch([], form);
    const handleCancel = () => {
        setIsModalOpen(false);
        if (props.onCancelDone) {
            props.onCancelDone();
        }
    }
    const handleOk = async () => {
        UiUtils.setBusy();
        try {
            const result = await props.apiCancelMove({
                body: {
                    ...form.getFieldsValue()
                }
            });
            if (result.isSuccessful) {
                if (props.onCancelDone) {
                    props.onCancelDone();
                }
                UiUtils.showSuccess(t('cancelMoveSuccess', form_w) as any);
                handleCancel();
            } else {
                UiUtils.showError(result.message);
            }
        } catch {

        } finally {
            UiUtils.clearBusy();
        }
    }
    return (<>
        {
            isModalOpen &&
            <Modal title={t('cancelMoveTitle', form_w) as any}
                   open={isModalOpen}
                   onOk={handleOk}
                   onCancel={handleCancel}
                   footer={(
                       <Space wrap>

                           <ModalCloseBtn onClick={handleCancel}></ModalCloseBtn>
                           <Button type={"primary"} danger
                                   icon={<StopOutlined/>}
                                   onClick={handleOk}>
                               {t('cancelMoveBtn')}
                           </Button>
                       </Space>
                   )}
            >
                <Form form={form} layout='vertical'>
                    <Form.Item label={t('CancelReason')} name={'cancelReason'}>
                        <TextArea autoSize={{minRows: 3, maxRows: 6}} placeholder={t('placeholderCancelReason')}/>
                    </Form.Item>
                    <div hidden>
                        <Form.Item noStyle name={'moveHashId'} initialValue={record.idHash}></Form.Item>
                        <Form.Item noStyle name={'moveCode'} initialValue={record.moveCode}></Form.Item>
                    </div>
                </Form>
            </Modal>
        }
    </>);
}
export default CancelStockMoveModal;
