import { Checkbox, Col, Form, Modal, Row } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { HotkeysProvider } from "react-hotkeys-hook";
import { HotKeyScope } from "@ord-core/AppConst";
import { FooterCrudModal } from "@ord-components/crud/FooterCrudModal";
import uiUtils from "@ord-core/utils/ui.utils";
import CustomerGroupStore from "@ord-store/Golf/Customer/customerGroupStore";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { GolfBookingGroupService } from "@api/GolfBookingGroupService";
import { useParams } from "react-router-dom";
import { useGolferMemberTypeEnum } from "@ord-components/forms/select/selectDataSource/golf/useSelectGolferMemberTypeEnum";
import validateUtils from "@ord-core/utils/validate.utils";
import PartnerInput from "@pages/AccountantManagement/Shared/forms/PartnerInput";

const CreateOrUpdateMemberShip = (prop: {
    stored: CustomerGroupStore;
}) => {
    const { createOrUpdateMemberModal } = prop.stored;
    const { t } = useTranslation("golf-customer-group");
    const { t: tCommon } = useTranslation("common");
    const [form] = Form.useForm();
    const { id } = useParams();

    useEffect(() => {
        if (createOrUpdateMemberModal.mode == "update" || createOrUpdateMemberModal.mode == "viewDetail") {
            form.setFieldsValue(createOrUpdateMemberModal.entityData);
        }
    }, [createOrUpdateMemberModal.visible]);

    const onOkModal = async () => {
        try {
            const formValue = await form.validateFields();
            formValue.groupId = id;
            uiUtils.setBusy();
            let isCreate = createOrUpdateMemberModal.mode === "addNew";
            await GolfBookingGroupService.createOrUpdateMemberShip({ body: formValue }).then(res => {
                if (res.isSuccessful) {
                    uiUtils.showSuccess(isCreate ? t('addNewSuccess') : t('updateSuccess'));
                    form.resetFields();
                    prop.stored.closeCrudMemberModal(true);
                } else {
                    uiUtils.showError(res.message)
                }
            })

        } catch (error) {
            // @ts-ignore
            if (error.name === 'ValidationError') {
                uiUtils.showCommonValidateForm();
            } else {
                console.error("Error during CRUD operation:", error);
            }
        } finally {
            uiUtils.clearBusy();
        }
    };

    return (
        <>
            <HotkeysProvider initiallyActiveScopes={[HotKeyScope.crudPageBase]}>
                <Modal
                    title={t(('titleMember.' + createOrUpdateMemberModal!.mode)) || t('addMember') }
                    open={createOrUpdateMemberModal.visible}
                    width={createOrUpdateMemberModal.width}
                    maskClosable={false}
                    style={{ top: "30px" }}
                    onCancel={() => prop.stored.closeCrudMemberModal()}
                    destroyOnClose
                    footer={
                        <FooterCrudModal
                            hiddenOk={createOrUpdateMemberModal.mode === "viewDetail"}
                            onOk={onOkModal}
                            onCancel={() => prop.stored.closeCrudMemberModal()}
                        />
                    }
                >
                    <Form autoComplete="off"
                        form={form}
                        layout='vertical'
                        clearOnDestroy
                        disabled={createOrUpdateMemberModal.mode === 'viewDetail'}
                        onFinish={onOkModal}
                        onFinishFailed={() => uiUtils.showCommonValidateForm()}>
                        <Row gutter={16}>
                            <Col lg={8}>
                                {/* <FloatLabel label={t("partnerName")}>
                                    <Form.Item name="partnerId">
                                        <OrdSelect datasource={partnerComboOption || { data: [], isPending: false }} placeholder={t('')} allowClear></OrdSelect>
                                    </Form.Item>
                                </FloatLabel> */}
                                <FloatLabel label={t("partnerName")}>
                                    <Form.Item name='partnerId' rules={[validateUtils.required]}>
                                        <PartnerInput
                                            onChange={(val, op) => {
                                                if (op && op.data)
                                                    form.setFieldsValue({
                                                        requestedBy: op.data?.name,
                                                        contactNo: op.data?.phone,
                                                    })
                                            }}
                                            partner_type={1}></PartnerInput>
                                    </Form.Item>
                                </FloatLabel>

                            </Col>
                            <Col span={8}>
                                <FloatLabel label={t("role")} required>
                                    <Form.Item name="golferMemberType" rules={[validateUtils.required]}>
                                        <OrdSelect
                                            datasource={useGolferMemberTypeEnum()}
                                            allowClear
                                        />
                                    </Form.Item>
                                </FloatLabel>
                            </Col>
                            <Col lg={8}>
                                <Form.Item
                                    name="isActived"
                                    initialValue={true}
                                    valuePropName="checked">
                                    <Checkbox>{tCommon("dang_hoat_dong")}</Checkbox>
                                </Form.Item>
                            </Col>
                             <Col lg={8}>
                                <Form.Item hidden
                                    name="id"
                                    >
                                </Form.Item>
                            </Col>
                        </Row>

                    </Form>
                </Modal>
            </HotkeysProvider>
        </>
    );
};

export default observer(CreateOrUpdateMemberShip);
