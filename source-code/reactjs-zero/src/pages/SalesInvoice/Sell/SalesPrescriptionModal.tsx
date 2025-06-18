import {SalesPrescriptionDto} from "@api/index.defs";
import {FooterCrudModal} from "@ord-components/crud/FooterCrudModal";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import UiUtils from "@ord-core/utils/ui.utils";
import ValidateUtils from "@ord-core/utils/validate.utils";
import PartnerInput from "@pages/AccountantManagement/Shared/forms/PartnerInput";
import {useModal} from "@pages/SalesInvoice/Utils/modalContext";
import {Col, Form, FormInstance, Input, InputNumber, Modal, Row,} from "antd";
import {forwardRef, useCallback, useImperativeHandle, useMemo, useState,} from "react";
import {useTranslation} from "react-i18next";
import {HotKeyScope} from "@ord-core/AppConst";
import {HotkeysProvider, useHotkeys} from "react-hotkeys-hook";
import DateUtil from "@ord-core/utils/date.util";

export const SalesPrescriptionModal = forwardRef(
    (
        props: {
            modalKey: string;
            form: FormInstance;
        },
        ref: any
    ) => {
        const [confirmLoading, setConfirmLoading] = useState(false);
        const {t: tCommon} = useTranslation("common");
        const {t} = useTranslation("sale-invoice");
        const {form: fSale} = props;
        const [form] = Form.useForm();
        // @ts-ignore
        const {modals, openModal, closeModal, closeAllModals} = useModal();

        const showModal = (d: SalesPrescriptionDto) => {
            openModal(props.modalKey);
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
                UiUtils.setBusy();
                try {
                    fSale.setFieldsValue({
                        prescriptionInfo: data.prescriptionInfo,
                        prescriptionType: 1,
                    });
                    handleCancel();
                } catch (e) {
                } finally {
                    UiUtils.clearBusy();
                }
            } catch (errorInfo) {
                UiUtils.showCommonValidateForm();
            }
        };

        const handleCancel = () => {
            closeModal(props.modalKey);
        };
        useImperativeHandle(ref, () => ({
            showModal,
        }));

        const fGrPrescription = useCallback(
            (name: string) => ["prescriptionInfo", name],
            []
        );
        const setDefaultValues = useCallback(() => {
            form.setFieldValue(
                fGrPrescription("dateIssued"),
                form.getFieldValue("invoiceDate") ?? new Date()
            );
            form.setFieldValue(
                fGrPrescription("patientId"),
                form.getFieldValue("partnerId")
            );
        }, [form, fGrPrescription]);

        const calculateAge = useCallback(
            (birthDate: Date) => {
                const today =
                    form.getFieldValue(fGrPrescription("dateIssued")) ?? new Date();
                const birthYear = birthDate.getFullYear();
                const birthMonth = birthDate.getMonth(); // Tháng từ 0-11
                const birthDay = birthDate.getDate();
                let age = today.getFullYear() - birthYear;
                let ageMonths = age * 12 + (today.getMonth() - birthMonth);
                // Kiểm tra nếu sinh nhật năm nay chưa tới
                if (
                    today.getMonth() < birthMonth ||
                    (today.getMonth() === birthMonth && today.getDate() < birthDay)
                ) {
                    age--;
                    ageMonths--;
                }
                // Kiểm tra số tháng nếu ngày hiện tại trước ngày sinh trong tháng
                if (today.getDate() < birthDay) {
                    ageMonths--;
                }
                if (ageMonths <= 72) {
                    return {
                        years: 0,
                        months: ageMonths,
                    };
                } else {
                    return {
                        years: age,
                        months: undefined,
                    };
                }
            },
            [form, fGrPrescription]
        );

        function convertAgeToYearOfBirth(age: number | null) {
            if (age != null) {
                const currentYear = form.getFieldValue("invoiceDate")
                    ? form.getFieldValue("invoiceDate").getFullYear()
                    : new Date().getFullYear();
                // Tính năm sinh dựa trên tuổi
                const yearOfBirth = currentYear - age;

                return yearOfBirth;
            }
            return undefined;
        }

        function convertYearOfBirthToAge(yearOfBirth: number | null) {
            if (yearOfBirth != null) {
                const today = form.getFieldValue("invoiceDate")
                    ? form.getFieldValue("invoiceDate")
                    : new Date();
                const currentYear = today.getFullYear();
                let age = currentYear - yearOfBirth;

                // Kiểm tra nếu sinh nhật chưa qua trong năm nay, trừ đi 1
                const birthDateThisYear = new Date(
                    yearOfBirth,
                    today.getMonth(),
                    today.getDate()
                );
                if (today < birthDateThisYear) {
                    age--;
                }
                if (age > 6) {
                    return {
                        years: age,
                        months: undefined,
                    };
                } else {
                    const m = age == 0 ? 1 : age * 12;
                    return {
                        years: 0,
                        months: m < 0 ? 0 : m,
                    };
                }
            }
            return {};
        }

        function convertMonthsToYearOfBirth(monthsAge: number | null) {
            if (monthsAge != null) {
                const today = form.getFieldValue("invoiceDate")
                    ? form.getFieldValue("invoiceDate")
                    : new Date();
                // Tính tổng số tháng hiện tại (năm * 12 + tháng)
                const currentTotalMonths = today.getFullYear() * 12 + today.getMonth();
                // Tính tổng số tháng của năm sinh
                const birthTotalMonths = currentTotalMonths - monthsAge;
                // Tính năm và tháng từ tổng số tháng của năm sinh
                const birthYear = Math.floor(birthTotalMonths / 12);
                return birthYear;
            }
        }

        const w_monthOld = Form.useWatch(fGrPrescription("monthOld"), form);

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
            return (
                <Form form={form}>
                    <Row gutter={16}>
                        <Col {...responsiveSpan(6)}>
                            <FloatLabel label={t("prescription.prescriptionId")} required>
                                <Form.Item
                                    rules={[ValidateUtils.required]}
                                    name={fGrPrescription("prescriptionId")}
                                >
                                    <Input
                                        placeholder={t("prescription.prescriptionId")}
                                        maxLength={50}
                                    />
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col {...responsiveSpan(6)}>
                            <FloatLabel label={t("prescription.dateIssued")} required>
                                <Form.Item
                                    rules={[ValidateUtils.required]}
                                    name={fGrPrescription("dateIssued")}
                                >
                                    <OrdDateInput></OrdDateInput>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col {...responsiveSpan(12)}>
                            <FloatLabel required label={t("prescription.medicalFacility")}>
                                <Form.Item
                                    rules={[ValidateUtils.required]}
                                    name={fGrPrescription("medicalFacility")}
                                >
                                    <Input maxLength={200}/>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col {...responsiveSpan(6)}>
                            <FloatLabel label={t("prescription.diagnosis")}>
                                <Form.Item name={fGrPrescription("diagnosis")}>
                                    <Input maxLength={200}/>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col {...responsiveSpan(6)}>
                            <FloatLabel
                                label={t("prescription.prescribingDoctorId")}
                                required
                            >
                                <Form.Item
                                    rules={[ValidateUtils.required]}
                                    name={fGrPrescription("prescribingDoctorId")}
                                >
                                    <PartnerInput
                                        onChange={(val, op) => {
                                            form.setFieldValue(fGrPrescription('medicalFacility'), op.data?.companyName);
                                        }}
                                        partner_type={6}></PartnerInput>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col {...responsiveSpan(12)}>
                            <FloatLabel required label={t("prescription.patientName")}>
                                {/*<Form.Item*/}
                                {/*    name={fGrPrescription('patientId')}>*/}
                                {/*    <PartnerInput partner_type={1}*/}
                                {/*                  onChange={(value, obj: IOrdSelectOption) => {*/}
                                {/*                      // form.setFieldValue('partnerId', value);*/}
                                {/*                      form.setFieldValue(fGrPrescription('prescription.patientName'), obj.data?.name);*/}
                                {/*                  }}*/}
                                {/*    ></PartnerInput>*/}
                                {/*</Form.Item>*/}
                                <Form.Item
                                    rules={[ValidateUtils.required]}
                                    name={fGrPrescription("patientName")}
                                >
                                    <Input maxLength={200}/>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        {/*<Col {...responsiveSpan(4)}>*/}
                        {/*    <Button*/}
                        {/*        disabled={!Form.useWatch(fGrPrescription('patientId'), form)}*/}
                        {/*        type={'primary'} htmlType={'button'} className='w-[100%]' onClick={() => {*/}
                        {/*        fSale.setFieldValue('partnerId', form.getFieldValue(fGrPrescription('patientId')))*/}
                        {/*    }}>*/}
                        {/*        {t('prescription.applyCustom')}*/}
                        {/*    </Button>*/}
                        {/*</Col>*/}
                        <Col {...responsiveSpan(4)}>
                            <FloatLabel label={t("prescription.dateOfBirth")}>
                                <Form.Item name={fGrPrescription("dateOfBirth")}>
                                    <OrdDateInput
                                        disabledDate={DateUtil.disableAfterNow}
                                        onChange={(data) => {
                                            if (data) {
                                                form.setFieldValue(
                                                    fGrPrescription("yearOfBirth"),
                                                    data.getFullYear()
                                                );
                                                const ttTuoi = calculateAge(data);
                                                form.setFieldValue(
                                                    fGrPrescription("age"),
                                                    ttTuoi.years
                                                );
                                                form.setFieldValue(
                                                    fGrPrescription("monthOld"),
                                                    ttTuoi.months
                                                );
                                            }
                                        }}
                                    ></OrdDateInput>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col {...responsiveSpan(4)}>
                            <FloatLabel label={t("prescription.yearOfBirth")} required>
                                <Form.Item
                                    rules={[ValidateUtils.required]}
                                    name={fGrPrescription("yearOfBirth")}
                                >
                                    <InputNumber
                                        className={"w-full"}
                                        onChange={(data) => {
                                            const age = convertYearOfBirthToAge(data);
                                            form.setFieldValue(fGrPrescription("age"), age.years);
                                            form.setFieldValue(
                                                fGrPrescription("monthOld"),
                                                age.months
                                            );
                                        }}
                                        max={2200}
                                        min={1900}
                                    ></InputNumber>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col {...responsiveSpan(4)}>
                            <FloatLabel label={t("prescription.age")}>
                                <Form.Item name={fGrPrescription("age")}>
                                    <InputNumber
                                        className={"w-full"}
                                        onChange={(data) => {
                                            const yearOfBirth = convertAgeToYearOfBirth(data);
                                            form.setFieldValue(
                                                fGrPrescription("yearOfBirth"),
                                                yearOfBirth
                                            );
                                            form.setFieldValue(
                                                fGrPrescription("monthOld"),
                                                undefined
                                            );
                                        }}
                                        max={125}
                                        min={0}
                                    ></InputNumber>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col {...responsiveSpan(4)}>
                            <FloatLabel label={t("prescription.monthOld")}>
                                <Form.Item name={fGrPrescription("monthOld")}>
                                    <InputNumber
                                        className={"w-full"}
                                        onChange={(data) => {
                                            const y = convertMonthsToYearOfBirth(data);
                                            form.setFieldValue(fGrPrescription("yearOfBirth"), y);
                                            form.setFieldValue(fGrPrescription("age"), 0);
                                        }}
                                        max={72}
                                        min={0}
                                    ></InputNumber>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col {...responsiveSpan(8)}>
                            <FloatLabel label={t("prescription.weight")}>
                                <Form.Item name={fGrPrescription("weight")}>
                                    <InputNumber className={"w-full"} min={0}></InputNumber>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col {...responsiveSpan(8)}>
                            <FloatLabel label={t("prescription.address")}>
                                <Form.Item name={fGrPrescription("address")}>
                                    <Input maxLength={200}/>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col {...responsiveSpan(4)}>
                            <FloatLabel
                                label={t("prescription.guardian")}
                                required={w_monthOld >= 0 && w_monthOld <= 72}
                            >
                                <Form.Item
                                    rules={
                                        w_monthOld >= 0 && w_monthOld <= 72
                                            ? [ValidateUtils.required]
                                            : []
                                    }
                                    name={fGrPrescription("guardian")}
                                >
                                    <Input maxLength={200}/>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col {...responsiveSpan(4)}>
                            <FloatLabel label={t("prescription.phoneNumber")}>
                                <Form.Item
                                    rules={[ValidateUtils.phoneNumberVietNam]}
                                    name={fGrPrescription("phoneNumber")}
                                >
                                    <Input maxLength={200}/>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col {...responsiveSpan(8)}>
                            <FloatLabel label={t("prescription.healthInsuranceCard")}>
                                <Form.Item name={fGrPrescription("healthInsuranceCard")}>
                                    <Input maxLength={200}/>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                    </Row>
                </Form>
            );
        };
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
                if (modals[props.modalKey] && form) {
                    event.preventDefault();
                    handleCancel();
                }
            },
            {scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true}
        );

        return (
            <>
                <HotkeysProvider initiallyActiveScopes={[HotKeyScope.crudPageBase]}>
                    {modals[props.modalKey] && (
                        <>
                            <Modal
                                title={t("prescriptionOutside")}
                                destroyOnClose
                                open={modals[props.modalKey]}
                                onOk={handleOk}
                                okText={tCommon("actionBtn.print")}
                                confirmLoading={confirmLoading}
                                width={1200}
                                style={{top: "10px"}}
                                maskClosable={false}
                                onCancel={handleCancel}
                                footer={
                                    <FooterCrudModal onCancel={handleCancel} onOk={handleOk}/>
                                }
                            >
                                <FormView></FormView>
                            </Modal>
                        </>
                    )}
                </HotkeysProvider>
            </>
        );
    }
);
