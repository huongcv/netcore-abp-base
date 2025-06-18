import React from 'react';
import { Modal, Input, Button, Form } from 'antd';
import FloatLabel from '@ord-components/forms/FloatLabel';

interface CancelReservationModalProps {
    visible: boolean;
    onCancel: () => void;
    onConfirm: (reason: string) => void;
}

const CancelReservationModal: React.FC<CancelReservationModalProps> = ({
    visible,
    onCancel,
    onConfirm
}) => {
    const [form] = Form.useForm();

    const handleConfirm = async () => {
        try {
            const values = await form.validateFields();
            onConfirm(values.reason);
            form.resetFields();
        } catch (error) {

        }
    };

    const handleClose = () => {
        onCancel();
        form.resetFields();
    };

    return (
        <Modal
            title="Huỷ đặt bàn"
            open={visible}
            onCancel={handleClose}
            footer={[
                <Button key="back" onClick={handleClose}>
                    Đóng
                </Button>,
                <Button key="submit" type="primary" onClick={handleConfirm}>
                    Xác nhận
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <FloatLabel label="Lý do huỷ" required>
                    <Form.Item
                        name="reason"
                        rules={[{ required: true, message: 'Vui lòng nhập lý do huỷ' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </FloatLabel>
            </Form>
        </Modal>
    );
};

export default CancelReservationModal;
