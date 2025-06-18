import { SearchOutlined } from "@ant-design/icons";
import { NationalPrescriptionService } from "@api/NationalPrescriptionService";
import { FooterCrudModal } from "@ord-components/crud/FooterCrudModal";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import UiUtils from "@ord-core/utils/ui.utils";
import { useModal } from "@pages/SalesInvoice/Utils/modalContext";
import { Button, Col, Form, FormInstance, Input, InputNumber, Modal, Row, Space } from "antd";
import { useWatch } from "antd/es/form/Form";
import * as React from "react";
import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import SalePrescriptionTable from "./components/prescription/SalePrescriptionTable";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {HotkeysProvider, useHotkeys} from "react-hotkeys-hook";
import {HotKeyScope} from "@ord-core/AppConst";
import {SalesPrescriptionDto} from "@api/index.defs";
import { observer } from "mobx-react-lite";

const SalesPrescriptionNationalModal = forwardRef((props: {
    modalKey: string,
    form: FormInstance,
    priceListId?: number,
    onSetProduct: (data: any) => void
}, ref: any) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const { t: tCommon } = useTranslation('common');
    const { t } = useTranslation('sale-invoice');
    const { form: fSale } = props;
    const [form] = Form.useForm();
    
    // @ts-ignore
    const { modals, openModal, closeModal, closeAllModals } = useModal();

    const showModal = (d: SalesPrescriptionDto) => {
        openModal(props.modalKey)
        if (d) {
            Object.entries(d).forEach(([key, value]) => {
                form.setFieldValue(fGrPrescription(key), value);
            });
        } else {
            form.resetFields();
            setDefaultValues();
        }
    };

    const handleOk = async () => {
        try {
            const data = await form.validateFields();
            
            fSale.setFieldsValue({
                prescriptionInfo: data.prescriptionInfo,
                prescriptionType: 2,
            })
            console.log("data.prescriptionInfo",data.prescriptionInfo)

            const lstDetails = Object.values(
                (data.saleInvoiceDetails ?? []).reduce((map: any, item: any) => {
                    if (!item.productId || !item.productUnitId) return map;
                    const key = `${item.productId}_${item.productUnitId}`;
                    map[key] = map[key] ? { ...map[key], qty: map[key].qty + item.qty } : { ...item };
                    return map;
                }, {})
            );

            console.log("lstDetails.MAP",lstDetails)

            props.onSetProduct([...lstDetails]);
            handleCancel();
        } catch (errorInfo) {
            UiUtils.showCommonValidateForm()
        }

    };

    const handleCancel = () => {
        closeModal(props.modalKey)
    };
    useImperativeHandle(ref, () => ({
        showModal
    }));


    const fGrPrescription = useCallback(
        (name: string) => ['prescriptionInfo', name],
        []
    );
    const setDefaultValues = useCallback(() => {
        form.setFieldValue('saleInvoiceDetails', []);
    }, [form, fGrPrescription]);

    const dateOfBith_w = useWatch(fGrPrescription('dateOfBirth'), form);

    React.useEffect(() => {
        if (dateOfBith_w) {
            const birthDate = new Date(dateOfBith_w);
            const today = new Date();

            const yearOfBirth = birthDate.getFullYear();
            const age = today.getFullYear() - yearOfBirth - (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0);
            const monthsOld = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());

            form.setFieldValue(fGrPrescription('yearOfBirth'), yearOfBirth);
            form.setFieldValue(fGrPrescription('age'), age);
            form.setFieldValue(fGrPrescription('monthsOld'), monthsOld);
        }
    }, [dateOfBith_w]);


    const searchPrescription = () => {
        UiUtils.setBusy();
        NationalPrescriptionService.getByCode({
            code: form.getFieldValue(fGrPrescription('prescriptionId'))
        }).then(res => {
            UiUtils.clearBusy();
            if (res.isSuccessful) {
                form.setFieldsValue({ prescriptionInfo: { ...res.data } });
            } else {
                UiUtils.showError(t(res.notification?.message ?? "Error"))
            }

        }, () => UiUtils.clearBusy())
    }

    const FormView = () => {
        const responsiveSpan = useMemo(
            () => (width: number) => ({
                span: 24,
                sm: 24,
                md: width < 8 ? 12 : 24,
                lg: width,
            }),
            []
        );
        return <Form form={form} >
            <Row gutter={16}>
                <Col {...responsiveSpan(6)}>
                    <FloatLabel label={t('prescription.prescriptionId')} required>
                        <Space.Compact style={{ width: '100%' }}>
                            <Form.Item noStyle
                                rules={[ValidateUtils.required]}
                                name={fGrPrescription('prescriptionId')}>
                                <Input  placeholder={t('prescription.prescriptionId')} />
                            </Form.Item>
                            <Button disabled={!Form.useWatch(fGrPrescription('prescriptionId'), form)}
                                onClick={searchPrescription} type="primary">
                                <SearchOutlined></SearchOutlined></Button>
                        </Space.Compact>
                    </FloatLabel>
                </Col>
                <Col {...responsiveSpan(6)}>
                    <FloatLabel label={t('prescription.dateIssued')}>
                        <Form.Item
                            name={fGrPrescription('dateIssued')}>
                            <OrdDateInput disabled></OrdDateInput>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col  {...responsiveSpan(12)} >
                    <FloatLabel label={t('prescription.medicalFacility')}>
                        <Form.Item name={fGrPrescription('medicalFacility')}>
                            <Input disabled />
                        </Form.Item>
                    </FloatLabel>
                </Col>

                <Col {...responsiveSpan(6)}>
                    <FloatLabel label={t('prescription.prescribingDoctorId')}>
                        <Form.Item
                            name={fGrPrescription('doctorName')}>
                             <Input disabled />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col {...responsiveSpan(6)}>
                    <FloatLabel label={t('prescription.patientName')}>
                        <Form.Item
                            name={fGrPrescription('patientName')}>
                             <Input disabled />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col {...responsiveSpan(12)}>
                    <FloatLabel label={t('prescription.diagnosis')}>
                        <Form.Item name={fGrPrescription('diagnosis')}>
                            <Input disabled />
                        </Form.Item>
                    </FloatLabel>
                </Col>

                <Col {...responsiveSpan(4)}>
                    <FloatLabel label={t('prescription.dateOfBirth')}>
                        <Form.Item
                            name={fGrPrescription('dateOfBirth')}>
                            <OrdDateInput disabled></OrdDateInput>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col {...responsiveSpan(4)}>
                    <FloatLabel label={t('prescription.yearOfBirth')} >
                        <Form.Item
                            name={fGrPrescription('yearOfBirth')}>
                            <InputNumber className={"w-full"}  disabled></InputNumber>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col {...responsiveSpan(4)}>
                    <FloatLabel label={t('prescription.age')}>
                        <Form.Item
                            name={fGrPrescription('age')}>
                            <InputNumber className={"w-full"} disabled></InputNumber>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col {...responsiveSpan(4)}>
                    <FloatLabel label={t('prescription.monthOld')}>
                        <Form.Item
                            name={fGrPrescription('monthOld')}>
                            <InputNumber className={"w-full"} disabled></InputNumber>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col {...responsiveSpan(8)}>
                    <FloatLabel label={t('prescription.weight')}>
                        <Form.Item
                            name={fGrPrescription('weight')}>
                            <InputNumber className={"w-full"} disabled></InputNumber>
                        </Form.Item>
                    </FloatLabel>
                </Col>

                <Col {...responsiveSpan(12)}>
                    <FloatLabel label={t('prescription.address')}>
                        <Form.Item name={fGrPrescription('address')}>
                            <Input disabled />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col {...responsiveSpan(4)}>
                    <FloatLabel label={t('prescription.guardian')}
                        >
                        <Form.Item
                            name={fGrPrescription('guardian')}>
                            <Input disabled/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col {...responsiveSpan(4)}>
                    <FloatLabel label={t('prescription.phoneNumber')}>
                        <Form.Item
                            name={fGrPrescription('phoneNumber')}>
                            <Input disabled />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col {...responsiveSpan(4)}>
                    <FloatLabel label={t('prescription.healthInsuranceCard')}>
                        <Form.Item
                            name={fGrPrescription('healthInsuranceCard')}>
                            <Input disabled />
                        </Form.Item>
                    </FloatLabel>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <SalePrescriptionTable priceListId={props.priceListId}/>
                </Col>
            </Row>
            <div hidden>
                <Form.Item name={['prescriptionInfo', 'prescriptionDetails']} />
                <Form.Item name="saleInvoiceDetails" />
            </div>
        </Form>
    }
    useHotkeys(
        "F8",
        (event) => {
            if (modals[props.modalKey] && form) {
                handleOk();

            }
        },
        {scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true}
    );
    useHotkeys(
        "F10",
        (event) => {
            if (modals[props.modalKey] && form
            ) {
                event.preventDefault();
                handleCancel()
            }
        },
        {scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true}
    );

    return (<>
        <HotkeysProvider initiallyActiveScopes={[HotKeyScope.crudPageBase]}>
            {modals[props.modalKey] && <>
                <Modal
                    title={t('prescriptionNational')}
                    destroyOnClose
                    open={modals[props.modalKey]}
                    onOk={handleOk}
                    okText={tCommon('actionBtn.print')}
                    confirmLoading={confirmLoading}
                    width={1200}
                    style={{top: '10px'}}
                    maskClosable={false}
                    onCancel={handleCancel}
                    footer={<FooterCrudModal
                        onCancel={handleCancel}
                        onOk={handleOk}/>}>
                    <FormView></FormView>
                </Modal>
            </>}
        </HotkeysProvider>
    </>)
})

export default observer(SalesPrescriptionNationalModal)