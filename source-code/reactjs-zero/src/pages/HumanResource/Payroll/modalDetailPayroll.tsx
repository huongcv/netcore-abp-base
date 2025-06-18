import {FooterCrudModal} from "@ord-components/crud/FooterCrudModal";
import {Col, Form, InputNumber, Modal, Row, Space, Tabs, TabsProps} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import FloatLabel from "@ord-components/forms/FloatLabel";
import UiUtils from "@ord-core/utils/ui.utils";
import {UpdateEmployeePayrollDetailDto} from "@api/index.defs";
import {useStore} from "@ord-store/index";
import {
    AppstoreAddOutlined,
    SignatureOutlined
} from "@ant-design/icons";
import PayrollStore from "@ord-store/Payroll/payrollStore";
import TimesheetDetail from "@pages/HumanResource/Payroll/timesheetDetail";
import AllowanceByEmployee from "@pages/HumanResource/Payroll/allowance";
import Utils from "@ord-core/utils/utils";

const ModalDetailPayroll = (prop: {
    onCruSuccess?: Function
}) => {

    const childRef = useRef<any>();

    const {payrollDetailStore: mainStore, payrollStore: payrollStore} = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {t: payroll} = useTranslation(payrollStore.getNamespaceLocale());
    const {createOrUpdateModal: modalData} = mainStore;
    const [cusForm] = Form.useForm<UpdateEmployeePayrollDetailDto>();
    const [activeTab, setActiveTab] = React.useState("1");
    const [allowance, setAllowance] = useState<UpdateEmployeePayrollDetailDto[]>([]);
    const FormDetail = observer((prop: {
        stored: PayrollStore,
    }) => {
        const {entityData} = modalData;
        useEffect(() => {
            cusForm.resetFields();
            if (entityData)
                cusForm.setFieldsValue(entityData);
        })
        // Hàm nhận dữ liệu từ component con
        const handleDataFromChild = (data: UpdateEmployeePayrollDetailDto[]) => {
            setAllowance(data);
        };

        const items: TabsProps['items'] = [
            {
                key: '1',
                label: <Space><SignatureOutlined/>{t('timesheet')}</Space>,
                children: <div>
                    <TimesheetDetail timesheetId={modalData.entityData?.timesheetId}
                                     employeeId={modalData?.entityData?.employeeId}/>
                </div>
            },
            {
                key: '2',
                label: <Space><AppstoreAddOutlined/>{t('allowance')}</Space>,
                children: <div>
                    <AllowanceByEmployee payrollDetailId={modalData?.entityData?.id} employeeId={modalData?.entityData?.employeeId}  form={cusForm}
                                         status={modalData?.entityData?.status} ref={childRef}/>
                </div>
            },
        ];

        return <>
            <Form form={cusForm}>
                <Row gutter={16}>
                    <Col span={4}>
                            <Form.Item name='id' hidden>
                                <InputNumber></InputNumber>
                            </Form.Item>

                        <FloatLabel label={payroll('totalWorkDay')}>
                            <Form.Item name='totalWorkDay'>
                                <InputNumber
                                    formatter={Utils.formatterNumberInput}
                                    parser={Utils.parseNumber}
                                    disabled
                                    style={{width: '100%'}}></InputNumber>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={4}>
                        <FloatLabel label={payroll('actualWorkDay')}>
                            <Form.Item name='actualWorkDay'>
                                <InputNumber
                                    formatter={Utils.formatterNumberInput}
                                    parser={Utils.parseNumber}
                                    disabled
                                    style={{width: '100%'}}></InputNumber>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={4}>
                        <FloatLabel label={payroll('salaryAmount')}>
                            <Form.Item name='salaryAmount'>
                                <InputNumber
                                    formatter={Utils.formatterNumberInput}
                                    parser={Utils.parseNumber}
                                    disabled
                                    style={{width: '100%'}}></InputNumber>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={4}>
                        <FloatLabel label={payroll('actualSalaryAmount')}>
                            <Form.Item name='actualSalaryAmount'>
                                <InputNumber
                                    formatter={Utils.formatterNumberInput}
                                    parser={Utils.parseNumber}
                                    disabled
                                    style={{width: '100%'}}></InputNumber>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={4}>
                        <FloatLabel label={payroll('allowanceAmount')}>
                            <Form.Item name='allowanceAmount'>
                                <InputNumber
                                    formatter={Utils.formatterNumberInput}
                                    parser={Utils.parseNumber}
                                    disabled
                                    style={{width: '100%'}}></InputNumber>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={4}>
                        <FloatLabel label={payroll('totalSalaryAmount')}>
                            <Form.Item name='totalSalaryAmount'>
                                <InputNumber
                                    formatter={Utils.formatterNumberInput}
                                    parser={Utils.parseNumber}
                                    disabled
                                    style={{width: '100%'}}></InputNumber>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                </Row>

                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key)}
                    items={items}
                />
            </Form>
        </>
    });

    const onOkModal = async () => {
        try {
            const data = await cusForm.validateFields();
            UiUtils.setBusy();
            try {
                const isCreate = modalData.mode === 'addNew';
                const input: UpdateEmployeePayrollDetailDto = {
                    ...data,
                    payrollId: modalData?.entityData?.payrollId,
                    employeeId:modalData?.entityData?.employeeId,
                    status: modalData?.entityData?.status,
                    timesheetId: modalData?.entityData?.timesheetId,
                }
                if (childRef.current) {
                    input.allowances = childRef.current.getValue(); // Gọi phương thức của component con
                }
                // @ts-ignore
                await payrollStore.apiService().updatePayrollDetailByEmployee({
                    body: {
                        ...input
                    }
                    // @ts-ignore
                }, {}).then(result => {
                    UiUtils.showSuccess(t(isCreate ? 'addNewSuccess' : 'updateSuccess', {
                        ...data
                    }) as any);
                    cusForm.resetFields();
                    if (prop.onCruSuccess)
                        prop.onCruSuccess();
                    mainStore.closeModal(true)

                })
            } catch (e) {

            } finally {
                UiUtils.clearBusy();
            }
        } catch (errorInfo) {
            UiUtils.showCommonValidateForm()
        }
    }

    const titleModal = () => {
        return t('title.Detail') + ` [${modalData.entityData?.employeeName}]`
    }
    // @ts-ignore
    return (
        <>
            {
                modalData.visible &&
                <Modal title={titleModal()}
                       open={modalData.visible}
                       width={1400}
                       maskClosable={false}
                       style={{top: '30px'}}
                       onCancel={() => mainStore.closeModal()}
                       destroyOnClose
                       footer={<FooterCrudModal
                           hiddenOk={modalData?.entityData?.status===3 || modalData?.entityData?.status===4}
                           onOk={onOkModal} onCancel={() => mainStore.closeModal()}/>}
                >
                    <FormDetail stored={mainStore}></FormDetail>
                </Modal>}
        </>
    );
}
export default observer(ModalDetailPayroll);
