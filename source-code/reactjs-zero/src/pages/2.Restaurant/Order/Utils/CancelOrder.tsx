import React, {memo, useEffect, useState} from 'react';
import {Button, Form, Modal, Space} from "antd";
import ModalCloseBtn from "@ord-components/btn-action/ModalCloseBtn";
import {StopOutlined} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import {useTranslation} from "react-i18next";
import UiUtils from "@ord-core/utils/ui.utils";
import {OrderGetPagedDto} from "@api/index.defs";
import {OrderRestaurantService} from "@api/OrderRestaurantService";
import {orderFilterStore} from "@ord-store/Restaurant/Order/OrderFilterStore";
import {observer} from "mobx-react-lite";

type CancelOrderProps = {
    record: OrderGetPagedDto | null,
    setRecord: (record: OrderGetPagedDto | null) => void
}

const CancelOrder = (props: CancelOrderProps) => {
    const {record, setRecord} = props;
    const [t] = useTranslation('order');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (record) {
            setIsModalOpen(true);
            form.setFieldsValue({
                ...record
            });
        }
    }, [record?.idHash]);

    const handleCancel = () => {
        setIsModalOpen(false);
        setRecord(null);
        form.setFieldsValue({})
    }

    const handleOk = async () => {
        try {
            UiUtils.setBusy();
            const result = await OrderRestaurantService.cancelOrder({
                body: {
                    ...form.getFieldsValue()
                }
            });

            if (!result.isSuccessful) {
                UiUtils.showError(result.message);
                return;
            }

            UiUtils.showSuccess('Huỷ thành công đơn hàng ' + record?.orderCode);
            orderFilterStore.setTimeStampOrderListFilter(new Date().getMilliseconds());

        } catch (ex) {
            console.error(ex)
        } finally {
            handleCancel();
            UiUtils.clearBusy();
        }
    }

    return (<>
        {
            isModalOpen &&
            <Modal title={t('Huỷ đơn hàng ' + record?.orderCode)}
                   open={isModalOpen}
                   onOk={handleOk}
                   onCancel={handleCancel}
                   footer={(
                       <Space wrap>

                           <ModalCloseBtn onClick={handleCancel}></ModalCloseBtn>
                           <Button type={"primary"} danger
                                   icon={<StopOutlined/>}
                                   onClick={handleOk}>
                               {t('actionBtn.cancel')}
                           </Button>
                       </Space>
                   )}
            >
                <Form form={form} layout='vertical'>
                    <Form.Item label={t('Lý do huỷ')} name='canceledReason'>
                        <TextArea autoSize={{minRows: 3, maxRows: 6}} placeholder={t('Nhập lý do huỷ đơn hàng')}/>
                    </Form.Item>
                    <div hidden>
                        <Form.Item noStyle name={'idHash'} initialValue={record?.idHash}></Form.Item>
                    </div>
                </Form>
            </Modal>
        }
    </>)
};

export default memo(observer(CancelOrder));