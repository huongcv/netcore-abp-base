import {FooterCrudModal} from "@ord-components/crud/FooterCrudModal";
import {Col, Form, Input, InputNumber, Modal, Row} from "antd";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import UiUtils from "@ord-core/utils/ui.utils";
import {TenantDto} from "@api/index.defs";
import {useStore} from "@ord-store/index";
import shopPackageRegistrationStore, {
    IShopPackageRegistration
} from "@ord-store/masterData/shopPackageRegistrationStore";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectPackage} from "@ord-components/forms/select/selectDataSource/useSelectPackage";
import TextArea from "antd/lib/input/TextArea";
import DateUtil from "@ord-core/utils/date.util";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import {useSelectHrEmployee} from "@ord-components/forms/select/selectDataSource/useSelectHrEmployee";
import {useSelectTimeUnit} from "@ord-components/forms/select/selectDataSource/useSelectTimeUnit";

function addDays(date: Date, days: number): Date {
    const result = new Date(date); // Tạo bản sao của ngày hiện tại
    result.setDate(result.getDate() + days); // Thêm số ngày vào
    return result;
}

function addMonths(date: Date, months: number): Date {
    const result = new Date(date); // Tạo bản sao của ngày hiện tại
    result.setMonth(result.getMonth() + months); // Thêm số tháng vào
    return result;
}

function addYears(date: Date, years: number): Date {
    const result = new Date(date); // Tạo bản sao của ngày hiện tại
    result.setFullYear(result.getFullYear() + years); // Thêm số năm vào
    return result;
}

function addWeeks(date: Date, weeks: number): Date {
    const result = new Date(date); // Tạo bản sao của ngày hiện tại
    result.setDate(result.getDate() + weeks * 7); // Thêm số ngày tương ứng với số tuần
    return result;
}

const timeUnitHandlers: Record<number, (date: Date, amount: number) => Date> = {
    1: addDays,
    2: addWeeks,
    3: addMonths,
    4: addYears,
};

const ModalSubscribePackage = (props: {
    onCruSuccess?: Function,
    tenant?: TenantDto
}) => {
    const {t} = useTranslation('subscribePackage');
    const {shopPackageRegistrationStore: mainStore} = useStore();
    const {createOrUpdateModal: modalData} = mainStore;
    const [cusForm] = Form.useForm<IShopPackageRegistration>();
    const timeUnitOptions = useSelectTimeUnit();

    const FormDebt = observer((prop: {
        stored: shopPackageRegistrationStore,
    }) => {
        const {entityData} = modalData;
        const [timeUnitName, setTimeUnitName] = useState<string>('');
        useEffect(() => {
            cusForm.resetFields();
            if (entityData)
                cusForm.setFieldsValue({
                    ...entityData,
                    packageRegistrationId: undefined
                });
            if (props.tenant) {
                cusForm.setFieldsValue({
                    tenantId: props.tenant.id,
                    tenant: {
                        ...props.tenant
                    }
                });
            }
        }, []);

        function changePackage(value: number, option: any) {
            const handler = timeUnitHandlers[option.data.timeUnit];
            const expiryDate = handler ? handler(new Date(), option.data.totalTime) : null;
            cusForm.setFieldsValue({
                ...(() => {
                    const {shopId, tenantId, ...rest} = option.data || {}; // Loại bỏ shopId khỏi option.data
                    return rest;
                })(),
                qty: 1,
                packageRegistrationDate: new Date(),
                packageRegistrationStartDate: new Date(),
                packageRegistrationExpiryDate: expiryDate,
                totalAmountBeforeDiscount: 1 * option.data.price,
            });

            const timeUName = timeUnitOptions?.data?.find(x => x.value == option.data.timeUnit)?.label || '';
            setTimeUnitName(timeUName);
        }

        function changeStartDate(date: Date | null) {
            const handler = timeUnitHandlers[cusForm.getFieldValue("timeUnit")];
            const expiryDate = handler ? handler(date || new Date(), cusForm.getFieldValue("totalTime")) : null;
            cusForm.setFieldValue("packageRegistrationExpiryDate", expiryDate);
        }

        const clearPackage  = () => {
            cusForm.setFieldsValue({
                packageRegistrationId: undefined,
                packageRegistrationCode: undefined,
                packageRegistrationName: undefined,
                packageRegistrationType: undefined,
                packageRegistrationDate: undefined,
                timeUnit: undefined,
                qty: undefined,
                chargeTime: undefined,
                freeTime: undefined,
                totalTime: undefined,
                packageAccountNumber: undefined,
                packageShopNumber: undefined,
                price: undefined,
                totalAmountBeforeDiscount: undefined,
                discountAmount: undefined,
                totalAmount: undefined,
                packageRegistrationStartDate: undefined,
                packageRegistrationExpiryDate: undefined,
                salePartnerId: undefined,
            });
        }

        return <>
            <Form form={cusForm}
                  layout={'vertical'}>
                {props.tenant && (
                    <div hidden>
                        <Form.Item name='shopId'/>
                        <Form.Item name='tenantId'/>
                        <Form.Item name={['tenant', 'code']}/>
                        <Form.Item name={['tenant', 'name']}/>
                    </div>
                )}
                <Row gutter={16}>
                    <div hidden>
                        <Form.Item name='packageRegistrationCode'/>
                        <Form.Item name='packageRegistrationName'/>
                        <Form.Item name='packageRegistrationType'/>
                        <Form.Item name='packageRegistrationDate'/>
                        <Form.Item name='timeUnit' rules={[ValidateUtils.required]}/>
                    </div>

                    <Col span={8}>
                        <FloatLabel required label={t('code')}>
                            <Form.Item name='code' rules={[ValidateUtils.required]}>
                                <Input maxLength={10} disabled/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={16}>
                        <FloatLabel required label={t('name')}>
                            <Form.Item name='name' rules={[ValidateUtils.required]}>
                                <Input maxLength={100} disabled/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={18}>
                        <FloatLabel required label={t('package')}>
                            <Form.Item name='packageRegistrationId' rules={[ValidateUtils.required]}>
                                <OrdSelect allowClear datasource={useSelectPackage()} onClear={clearPackage} onChange={changePackage}
                                ></OrdSelect>
                            </Form.Item>
                        </FloatLabel>
                    </Col>


                    <Col span={6}>
                        <FloatLabel required label={t('qty')}>
                            <Form.Item name='qty' rules={[ValidateUtils.required]}>
                                <Input maxLength={100} disabled/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>

                    <Col span={6}>
                        <FloatLabel required label={t('chargeTime')}>
                            <Form.Item name='chargeTime' rules={[ValidateUtils.required]}>
                                <InputNumber defaultValue={0}
                                             disabled
                                             maxLength={20}
                                             style={{width: '100%'}}
                                             addonAfter={timeUnitName}
                                />
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={6}>
                        <FloatLabel required label={t('freeTime')}>
                            <Form.Item name='freeTime' rules={[ValidateUtils.required]}>
                                <InputNumber defaultValue={0}
                                             disabled
                                             maxLength={50}
                                             style={{width: '100%'}}
                                             addonAfter={timeUnitName}
                                />
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={6}>
                        <FloatLabel required label={t('totalTime')}>
                            <Form.Item name='totalTime' rules={[ValidateUtils.required]}>
                                <InputNumber maxLength={50} style={{width: '100%'}} disabled addonAfter={timeUnitName}/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>

                    <Col span={6}>
                        <FloatLabel required label={t('packageAccountNumber')}>
                            <Form.Item name='packageAccountNumber' rules={[ValidateUtils.required]}>
                                <InputNumber style={{width: '100%'}} disabled/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col span={6}>
                        <FloatLabel required label={t('packageShopNumber')}>
                            <Form.Item name='packageShopNumber' rules={[ValidateUtils.required]}>
                                <InputNumber style={{width: '100%'}} disabled/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>

                    <Col span={6}>
                        <FloatLabel required label={t('price')}>
                            <Form.Item name='price' rules={[ValidateUtils.required]}>
                                <PriceNumberInput disabled
                                                  defaultValue={0}
                                                  step={1000} min={0}
                                                  style={{width: '100%'}}
                                />
                            </Form.Item>
                        </FloatLabel>
                    </Col>

                    <Col span={6}>
                        <FloatLabel label={t('totalAmountBeforeDiscount')}>
                            <Form.Item name='totalAmountBeforeDiscount'>
                                <PriceNumberInput disabled
                                                  step={1000} min={0}
                                                  defaultValue={0}
                                />
                            </Form.Item>
                        </FloatLabel>
                    </Col>

                    <Col span={6}>
                        <FloatLabel required label={t('discountAmount')}>
                            <Form.Item name='discountAmount' rules={[ValidateUtils.required]}>
                                <PriceNumberInput disabled
                                                  step={1000} min={0}
                                                  defaultValue={0}
                                />
                            </Form.Item>
                        </FloatLabel>
                    </Col>

                    <Col span={6}>
                        <FloatLabel required label={t('totalAmount')}>
                            <Form.Item name='totalAmount' rules={[ValidateUtils.required]}>
                                <PriceNumberInput step={1000} min={0} disabled/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>

                    <Col span={6}>
                        <FloatLabel required label={t('packageRegistrationStartDate')}>
                            <Form.Item name='packageRegistrationStartDate' rules={[ValidateUtils.required]}>
                                <OrdDateInput disabledDate={DateUtil.disableBeforeNow} onChange={(date) => {
                                    changeStartDate(date)
                                }}/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>

                    <Col span={6}>
                        <FloatLabel required label={t('packageRegistrationExpiryDate')}>
                            <Form.Item name='packageRegistrationExpiryDate' rules={[ValidateUtils.required]}>
                                <OrdDateInput disabled/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>

                    <Col span={6}>
                        <FloatLabel label={t('salePartner')}>
                            <Form.Item name='salePartnerId'>
                                <OrdSelect datasource={useSelectHrEmployee()}
                                           placeholder={t('')}></OrdSelect>
                            </Form.Item>
                        </FloatLabel>
                    </Col>

                    <Col span={24}>
                        <FloatLabel label={t('notes')}>
                            <Form.Item name='notes'>
                                <TextArea rows={4}/>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                </Row>
            </Form>
        </>
    });


    const onOkModal = async () => {
        try {
            // Xác thực các trường trong form
            const data = await cusForm.validateFields();
            data.status = data.packageRegistrationDate <= new Date() ? 2 : 1;
            UiUtils.setBusy();

            const isCreate = modalData.mode === 'addNew';

            const apiFun = isCreate
                ? mainStore.createEntity({...data})
                : mainStore.updateEntity({...data});

            // Gọi API và xử lý kết quả
            await apiFun;

            // Hiển thị thông báo thành công
            UiUtils.showSuccess(
                t(isCreate ? 'addNewSuccess' : 'updateSuccess', {...data}) as any
            );

            // Reset form và kích hoạt callback nếu cần
            cusForm.resetFields();
            props.onCruSuccess?.();
            mainStore.closeModal(true);

        } catch (error) {
            // Xử lý lỗi xác thực hoặc lỗi API
            // @ts-ignore
            if (error.name === 'ValidationError') {
                UiUtils.showCommonValidateForm();
            } else {
                console.error("Error during CRUD operation:", error);
            }
        } finally {
            // Bỏ trạng thái busy bất kể thành công hay thất bại
            UiUtils.clearBusy();
        }
    };

    return (
        <>
            {
                modalData.visible &&
                <Modal title={t('subscribePackageTitle')}
                       open={modalData.visible}
                       width={modalData.width || 550}
                       maskClosable={false}
                       style={{top: '30px'}}
                       onCancel={() => mainStore.closeModal()}
                       destroyOnClose
                       footer={<FooterCrudModal
                           hiddenOk={modalData.mode === 'viewDetail'}
                           onOk={onOkModal} onCancel={() => mainStore.closeModal()}/>}
                >
                    <FormDebt stored={mainStore}></FormDebt>
                </Modal>}
        </>
    );
}
export default observer(ModalSubscribePackage);
