import React, { useEffect } from 'react';
import { Form, Select, InputNumber, Button, Radio, Row, Col, Modal, Space, DatePicker } from 'antd';
import { useStore } from '@ord-store/index';
import { observer } from 'mobx-react-lite';
import dayjs from 'dayjs';
import OrdDateRangeInput from '@ord-components/forms/OrdDateRangeInput';
import FloatLabel from '@ord-components/forms/FloatLabel';
import OrdDateInput from '@ord-components/forms/OrdDateInput';
import uiUtils from '@ord-core/utils/ui.utils';
import { TaxDeclrationService } from '@api/TaxDeclrationService';

const { Option } = Select;

const TaxDeclarationFormModal = () => {
    const [form] = Form.useForm();
    const { taxDeclrationReportStore } = useStore();

    const periodType = Form.useWatch('periodType', form);
    const periodYear = Form.useWatch('periodYear', form);
    const selectedQuarter = Form.useWatch('periodQuarter', form);
    const periodMonth = Form.useWatch('periodMonth', form);
    const rangeMonth = Form.useWatch('rangeMonth', form);
    const periodDate = Form.useWatch('periodDate', form);


    useEffect(() => {
        if (periodType === 100) {
            const range = form.getFieldValue('rangeMonth');
            if (range?.startDate && range?.endDate) {
                const fromMonth = dayjs(range.startDate).month() + 1;
                const toMonth = dayjs(range.endDate).month() + 1;
                form.setFieldsValue({ periodMonthFrom: fromMonth, periodMonthTo: toMonth });
            } else if (periodYear) {
                const start = dayjs(`${periodYear}-01-01`).toDate();
                const end = dayjs(`${periodYear}-12-01`).toDate();
                form.setFieldsValue({
                    periodMonthFrom: 1,
                    periodMonthTo: 12,
                    rangeMonth: { startDate: start, endDate: end },
                });
            }
        }
        if (periodType === 200 && selectedQuarter) {
            const from = (selectedQuarter - 1) * 3 + 1;
            const to = from + 2;
            form.setFieldsValue({ periodMonthFrom: from, periodMonthTo: to });
        }
        if (periodType === 300) {
            form.setFieldsValue({ periodMonthFrom: periodMonth, periodMonthTo: periodMonth });
        }
        if (periodType === 400) {
            if (periodDate) {
                const date = dayjs(periodDate);
                const month = date.month() + 1;
                const year = date.year();
                const quarter = Math.floor((month - 1) / 3) + 1;
                form.setFieldsValue({
                    periodMonth: month,
                    periodYear: year,
                    periodQuarter: quarter,
                    periodMonthFrom: month,
                    periodMonthTo: month,
                });
            }
        }
    }, [periodType, selectedQuarter, periodYear, rangeMonth, periodDate, periodMonth]);

    useEffect(() => {
        if (taxDeclrationReportStore.createOrUpdateModal.entityData) {
            form.setFieldsValue(taxDeclrationReportStore.createOrUpdateModal.entityData);
        }
    }, [taxDeclrationReportStore.createOrUpdateModal.entityData])

    const handleOk = async () => {
        const data = await form.validateFields();
        uiUtils.setBusy();
        TaxDeclrationService.createOrUpdate({
            body: data
        }).then(res => {
            uiUtils.clearBusy();
            if (res.isSuccessful) {
                taxDeclrationReportStore.createOrUpdateModal.visible = false;
                if(res.data?.id) {
                    uiUtils.showSuccess("Cập nhật tờ khai thuế thành công"); 
                } else {
                    uiUtils.showSuccess("Tạo mới tờ khai thuế thành công"); 
                }
            }
        }).finally(() => {
            uiUtils.clearBusy();
        })
    };

    return (
        <Modal
            title="CHỌN KỲ TÍNH THUẾ"
            open={taxDeclrationReportStore.createOrUpdateModal.visible}
            width={700}
            centered
            onCancel={() => taxDeclrationReportStore.createOrUpdateModal.visible = false}
            onClose={() => taxDeclrationReportStore.createOrUpdateModal.visible = false}
            destroyOnClose
            footer={
                <Space>
                    <Button onClick={() => taxDeclrationReportStore.createOrUpdateModal.visible = false}>Đóng (F10)</Button>
                    <Button type="primary" onClick={() => handleOk()}>Lưu (F8)</Button>
                </Space>
            }
        >
            <Form form={form} layout="vertical" initialValues={{ periodType: 100 }}>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item label="Loại tờ khai" name="periodType">
                            <Radio.Group>
                                <Radio value={100}>Tờ khai năm</Radio>
                                <Radio value={200}>Tờ khai quý</Radio>
                                <Radio value={300}>Tờ khai tháng</Radio>
                                <Radio value={400}>Tờ khai lần phát sinh</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>

                    {(periodType === 100) && (
                        <Col span={24}>
                            <FloatLabel label="Năm">
                                <Form.Item name="periodYear">
                                    <InputNumber min={2000} max={2100} style={{ width: '100%' }} autoFocus/>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                    )}

                    {periodType === 100 && (
                        <Col span={24}>
                            <FloatLabel label="Khoảng thời gian">
                                <Form.Item name="rangeMonth">
                                    <OrdDateRangeInput />
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                    )}

                    {periodType === 200 && (
                        <>
                            <Col span={12}>
                                <FloatLabel label="Năm">
                                    <Form.Item name="periodYear">
                                        <InputNumber min={2000} max={2100} style={{ width: '100%' }} />
                                    </Form.Item>
                                </FloatLabel>
                            </Col>
                            <Col span={12}>
                                <FloatLabel label="Quý">
                                    <Form.Item name="periodQuarter">
                                        <Select>
                                            <Option value={1}>1</Option>
                                            <Option value={2}>2</Option>
                                            <Option value={3}>3</Option>
                                            <Option value={4}>4</Option>
                                        </Select>
                                    </Form.Item>
                                </FloatLabel>
                            </Col>
                        </>

                    )}

                    {periodType === 300 && (
                        <>
                            <Col span={12}>
                                <FloatLabel label="Tháng">
                                    <Form.Item name="periodMonth">
                                        <InputNumber min={1} max={12} style={{ width: '100%' }} />
                                    </Form.Item>
                                </FloatLabel>
                            </Col>
                            <Col span={12}>
                                <FloatLabel label="Năm">
                                    <Form.Item name="periodYear">
                                        <InputNumber min={2000} max={2100} style={{ width: '100%' }} />
                                    </Form.Item>
                                </FloatLabel>
                            </Col>
                        </>
                    )}

                    {periodType === 400 && (
                        <Col span={24}>
                            <FloatLabel label="Ngày">
                                <Form.Item name="periodDate">
                                    <OrdDateInput />
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                    )}

                    <Col span={24}>
                        <Form.Item label="Loại khai" name="isFirstTimeReport">
                            <Radio.Group>
                                <Radio value={true}>Tờ khai lần đầu</Radio>
                                <Radio value={false}>Tờ khai bổ sung</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item label="Phụ lục kê khai" name="declarationTemplate">
                            <Select placeholder="Chọn phụ lục">
                                <Option value={1}>01-1/BK-CNKD</Option>
                                <Option value={2}>01-2/BK-HDKD</Option>
                                <Option value={3}>PL43/2022/QH15</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <div hidden>
                    <Form.Item name="periodMonthFrom" />
                    <Form.Item name="periodMonthTo" />
                    <Form.Item name="id" />
                </div>
            </Form>
        </Modal>
    );
};

export default observer(TaxDeclarationFormModal);
