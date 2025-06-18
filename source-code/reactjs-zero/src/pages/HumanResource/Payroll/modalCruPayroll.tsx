import { useTranslation } from "react-i18next";
import {
    Button,
    Col,
    Form, Input, Modal,
    Row,
    Space, Table, TableColumnsType
} from "antd";
import FloatLabel from "@ord-components/forms/FloatLabel";
import React, { useEffect, useState } from "react";
import { CalculatorOutlined } from "@ant-design/icons";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectTimesheet } from "@ord-components/forms/select/selectDataSource/useSelectTimesheet";
import TableUtil from "@ord-core/utils/table.util";
import {
    EmployeePayrollDetailDto,
    EmployeePayrollDto,
} from "@api/index.defs";
import { useStore } from "@ord-store/index";
import UiUtils from "@ord-core/utils/ui.utils";
import { FooterCrudModal } from "@ord-components/crud/FooterCrudModal";
import { observer } from "mobx-react-lite";
import Utils from "@ord-core/utils/utils";
import { HotkeysProvider, useHotkeys } from "react-hotkeys-hook";
import { HotKeyScope } from "@ord-core/AppConst";
import OrdDateInput from "@ord-components/forms/OrdDateInput";


export const PayrollCreateOrUpdateForm = (props: {
    onCruSuccess?: Function
}) => {

    const { t } = useTranslation('payroll');
    const { payrollStore: mainStore } = useStore();
    const { createOrUpdateModal: modalData } = mainStore;
    const [cusForm] = Form.useForm();

    const timesheetId_w = Form.useWatch('timesheetId', cusForm);

    function handleTimesheetChange(value: any, option: any) {
        var startDate = option.data.startDate;
        var endDate = option.data.endDate;
        cusForm.setFieldValue('startDate', startDate);
        cusForm.setFieldValue('endDate', endDate);
        cusForm.setFieldValue('name', t('title.payroll') + " " + (startDate ? `${new Date(startDate).getMonth() + 1}/${new Date(startDate).getFullYear()}` : ""))
    }


    const onOkModal = async () => {
        try {
            const data = await cusForm.validateFields();
            UiUtils.setBusy();
            const isCreate = modalData.mode === 'addNew';
            const apiFun = isCreate
                ? mainStore.createEntity({ ...data })
                : mainStore.updateEntity({ ...data });

            await apiFun.then(result => {
                if (result) {
                    UiUtils.showSuccess(
                        t(isCreate ? 'addNewSuccess' : 'updateSuccess', { ...data }) as any
                    );
                    cusForm.resetFields();
                    props.onCruSuccess?.();
                    mainStore.closeModal(true);
                }
            })
        } catch (error) {
            // @ts-ignore
            if (error.name === 'ValidationError') {
                UiUtils.showCommonValidateForm();
            } else {
                console.error("Error during CRUD operation:", error);
            }
        } finally {
            UiUtils.clearBusy();
        }
    };

    useHotkeys('F8', (event) => {
        onOkModal();
        event.preventDefault();
    }, { scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true });


    useHotkeys('F10', (event) => {
        mainStore.closeModal();
        event.preventDefault();
    }, { scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true });

    return modalData.visible ? (
        <HotkeysProvider initiallyActiveScopes={[HotKeyScope.crudPageBase]}>
            <Modal
                title={modalData.mode === "addNew" ? t("title.addNew") : t("title.viewDetail")}
                open={modalData.visible}
                width={modalData.width || 550}
                maskClosable={false}
                style={{ top: "30px" }}
                onCancel={() => mainStore.closeModal()}
                destroyOnClose
                onOk={onOkModal}
                footer={
                    <FooterCrudModal
                        hiddenOk={modalData.mode === "viewDetail"}
                        onOk={onOkModal}
                        onCancel={() => mainStore.closeModal()}
                    />
                }
            >
                <Form form={cusForm}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <FloatLabel label={t("timesheet")}>
                                <Form.Item name="timesheetId" >
                                    <OrdSelect
                                        datasource={useSelectTimesheet()}
                                        onChange={handleTimesheetChange}
                                        placeholder={t("select.timesheet")}
                                    />
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                    </Row>
                    <Row gutter={16} hidden={!timesheetId_w}>
                        <Col span={24}>
                            <FloatLabel label={t("name.payroll")}>
                                <Form.Item name="name">
                                    <Input disabled />
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col span={12}>
                            <FloatLabel label={t('startDate')}>
                                <Form.Item name='startDate'>
                                    <OrdDateInput disabled></OrdDateInput>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col span={12}>
                            <FloatLabel label={t('endDate')}>
                                <Form.Item name='endDate'>
                                    <OrdDateInput disabled></OrdDateInput>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                    </Row>
                    <Form.Item hidden name='status' initialValue={1} />
                </Form>
            </Modal>
        </HotkeysProvider>

    ) : null;

}
export default observer(PayrollCreateOrUpdateForm);


