import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useStore } from "@ord-store/index";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Col, Form, Input, Row, Space, TimePicker, Tooltip } from "antd";
import { ShopSettingService } from "@api/ShopSettingService";
import UiUtils from "@ord-core/utils/ui.utils";
import { ShopSettingDto } from "@api/index.defs";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectInvoiceProvider } from "@ord-components/forms/select/selectDataSource/useSelectInvoiceProvider";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { IFormSettingShop_Invoice, SETTING_NAME_FOR_SHOP, PROP_SETTING_SHOP_Invoice } from './setting-name.const';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import OrdDateTimeInput from '@ord-components/forms/OrdDateTimeInput';
import { useSelectEInvoiceMethod } from '@ord-components/forms/select/selectDataSource/useSelectEinvoiceMethod';
import { PriceNumberInput } from '@ord-components/forms/PriceNumberInput';
import dayjs from "dayjs";
import uiUtils from '@ord-core/utils/ui.utils';
import QuotaDetailModal from '../form/QuotaDetailModalModal';
import MisaInvoiceTemplateModal from '../form/MisaInvoiceTemplateModal';

interface Props {
}

// Define the ref type
export type ShopSettingInvoiceRef = {
    saveData: () => void;
};

const ShopSettingInvoice = forwardRef<ShopSettingInvoiceRef, Props>((props, ref) => {
    const { t } = useTranslation('shop-setting');
    const [cusForm] = Form.useForm<IFormSettingShop_Invoice>();
    const [isShowModalMisaInvoice, setModalMisaInvoice] = useState<boolean>(false)
    const [isShowModalPlan, setShowModalPlan] = useState<boolean>(false);

    const method_w = Form.useWatch('method', cusForm);
    const userName_w = Form.useWatch('userName', cusForm);
    const password_w = Form.useWatch('password', cusForm);
    const taxCode_w = Form.useWatch('taxCode', cusForm);
    const currentMonthRate = useRef<string>();
    const usingInvoice = Form.useWatch("usingInvoice", cusForm);
    const supplier_w = Form.useWatch('supplier', cusForm);

    useEffect(() => {
        ShopSettingService.getAllInvoiceSetting().then((res) => {
            let formValue = {} as IFormSettingShop_Invoice;
            Object.entries(SETTING_NAME_FOR_SHOP.invoice).forEach(
                ([formKey, valueKey]) => {
                    const findValue = res.find(
                        (x: ShopSettingDto) => x.name == valueKey
                    );
                    let value = findValue?.value as any;

                    if (formKey === 'usingInvoice' || formKey === 'isInvoiceDraft') {
                        const boolValue = value === 'true';
                        value = boolValue ? true : false;
                    }

                    if (formKey == 'time' && value) {
                        const openStr = String(value);
                        if (openStr.includes(':')) {
                            const [h, m, s = '00'] = openStr.split(':');
                            value = dayjs(`1970-01-01T${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`);
                        }
                    }

                    if (formKey == "monthlyRate") {
                        currentMonthRate.current = value;
                    }

                    if (formKey === 'autoDelete') {
                        const boolValue = value === 'true';
                        value = boolValue ? true : false;
                    }

                    if (formKey == "method" && value) {
                        value = parseInt(value);
                    }

                    formValue[formKey as PROP_SETTING_SHOP_Invoice] = value;
                }
            );
            cusForm.setFieldsValue(formValue);
        });
    }, []);

    useImperativeHandle(ref, () => ({
        saveData: () => {
            saveData().then();
        }
    }));


    const labelUsername = useMemo(() => {
        switch (supplier_w) {
            case '4':
                return 'PartnerGUID';
            case '7':
                return 'ClientId';
            default:
                return 'Tài khoản HĐĐT';
        }
    }, [supplier_w]);

    const labelPassword = useMemo(() => {
        switch (supplier_w) {
            case '4':
                return 'PartnerToken';
            case '7':
                return 'ClientSecret';
            default:
                return 'Mật khẩu';
        }
    }, [supplier_w]);

    const saveData = async () => {
        try {
            const data = await cusForm.validateFields();
            UiUtils.setBusy();
            try {
                const input: ShopSettingDto[] = [];
                const formValues = cusForm.getFieldsValue();
                Object.keys(formValues).forEach((key) => {
                    let fieldValue = cusForm.getFieldValue(key as any);

                    let keyName = "";
                    const foundEntry = Object.entries(
                        SETTING_NAME_FOR_SHOP.invoice
                    ).find(([formKey, _]) => formKey === key);

                    if (foundEntry) {
                        keyName = foundEntry[1];
                    }

                    if (key == "time" && formValues.time) {
                        fieldValue = formValues.time?.format("HH:mm");
                    }

                    input.push({
                        id: "0",
                        name: keyName,
                        value: fieldValue?.toString() ?? "",
                    });
                });

                await ShopSettingService.setListValue({
                    body: input
                }).then(_ => {
                    UiUtils.showSuccess(t('updateSuccess', {
                        ...data
                    }) as any);
                    setTimeout(() => {
                        window.location.reload();
                    }, 5000)
                }).catch((e) => {
                    UiUtils.showError(t(e.response?.data?.error?.message))
                })
            } catch (e) {
                console.log(e);
            } finally {
                UiUtils.clearBusy();
            }
        } catch (errorInfo) {
            UiUtils.showCommonValidateForm()
        }
    }

    const FormInvoice = () => {
        if (usingInvoice) {
            return <>
                <Row gutter={16}>
                    <Col {...useResponsiveSpan(4)}>
                        <FloatLabel label={t('supplier')} required>
                            <Form.Item name='supplier' rules={[ValidateUtils.required]}>
                                <OrdSelect datasource={useSelectInvoiceProvider()}></OrdSelect>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col {...useResponsiveSpan(8)}>
                        <FloatLabel label={t('businessName')}>
                            <Form.Item name='company' rules={[ValidateUtils.maxLength(100)]}>
                                <Input></Input>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col {...useResponsiveSpan(4)}>
                        <FloatLabel label={t('taxCode')}>
                            <Form.Item name='taxCode' rules={[ValidateUtils.maxLength(50), ValidateUtils.taxCode]}>
                                <Input></Input>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col {...useResponsiveSpan(4)}>
                        <FloatLabel label={labelUsername} required>
                            <Form.Item rules={[ValidateUtils.required, ValidateUtils.maxLength(100)]} name='userName'>
                                <Input></Input>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col {...useResponsiveSpan(4)}>
                        <FloatLabel label={labelPassword} required>
                            <Form.Item rules={[ValidateUtils.required, ValidateUtils.maxLength(100)]} name='password'>
                                <Input.Password></Input.Password>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col {...useResponsiveSpan(4)} hidden={supplier_w == 3}>
                        <FloatLabel label={t('templateInvoice')} required>
                            <Form.Item rules={[ValidateUtils.required, ValidateUtils.maxLength(50)]}
                                name='template'>
                                <Input placeholder={'VD: 1/001, 2/001'}></Input>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col {...useResponsiveSpan(4)} hidden={supplier_w != 3}>
                        <FloatLabel label={t('templateInvoice')} required>
                            <Form.Item rules={[ValidateUtils.required, ValidateUtils.maxLength(50)]}
                                name='template'>
                                <Input
                                    placeholder="Vui lòng chọn mẫu hóa đơn từ danh sách"
                                    addonAfter={
                                        <Tooltip title="Chọn mẫu hóa đơn">
                                            <a style={{ padding: '0 5px' }} onClick={() => {
                                                setModalMisaInvoice(true);
                                            }}>
                                                <SearchOutlined style={{ color: '#1890ff' }} />
                                            </a>
                                        </Tooltip>
                                    }
                                />
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col {...useResponsiveSpan(4)}>
                        <FloatLabel label={t('invoiceType')} required>
                            <Form.Item name='type' rules={[ValidateUtils.required, ValidateUtils.maxLength(50)]}>
                                <Input placeholder={'VD: 1 (hd gtgt), 2 (hd bán hàng) ...'}></Input>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col {...useResponsiveSpan(4)}>
                        <FloatLabel label={t('invoiceSymbol')} required>
                            <Form.Item name='number'
                                rules={[ValidateUtils.required, ValidateUtils.maxLength(50)]}>
                                <Input placeholder={'VD: C22TAA, C22TYY'}></Input>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col {...useResponsiveSpan(8)}>
                        <Row gutter={0} wrap={false} style={{ width: '100%' }}>
                            <Col flex={"auto"}>
                                <FloatLabel label={t('Loại hình')} required>
                                    <Form.Item
                                        name="method"
                                        rules={[{ required: true, message: 'Bắt buộc' }]}
                                    >
                                        <OrdSelect
                                            datasource={useSelectEInvoiceMethod()}
                                            style={{
                                                borderTopRightRadius: 0,
                                                borderBottomRightRadius: 0,
                                                width: '100%',
                                            }}
                                        />
                                    </Form.Item>
                                </FloatLabel>
                            </Col>
                            {method_w == "99" && <Col flex="44px">
                                <Button
                                    type="default"
                                    icon={<EyeOutlined />}
                                    onClick={() => setShowModalPlan(true)}
                                    style={{
                                        width: '100%',
                                        height: '38px',
                                        borderTopLeftRadius: 0,
                                        borderBottomLeftRadius: 0,
                                    }}
                                />
                            </Col>}
                        </Row>
                    </Col>
                    {<Col {...useResponsiveSpan(4)}>
                        <FloatLabel label={t('Thời điểm')}>
                            <Form.Item name='time'>
                                <TimePicker format="HH:mm" style={{ width: '100%' }} disabled={method_w != "99"}></TimePicker>
                            </Form.Item>
                        </FloatLabel>
                    </Col>}
                    {(supplier_w === '1') && (
                        <>
                            <Col span={4}>
                                <FloatLabel label={t('Tài khoản quản trị')}>
                                    <Form.Item
                                        name="adminUserName"
                                        rules={[ValidateUtils.required]}>
                                        <Input
                                        />
                                    </Form.Item>
                                </FloatLabel>
                            </Col>

                            <Col span={10}>
                                <FloatLabel label={t('Mật khẩu quản trị')}>
                                    <Form.Item
                                        name="adminPwd"
                                        rules={[ValidateUtils.required]}>
                                        <Input
                                            maxLength={128}
                                        />
                                    </Form.Item>
                                </FloatLabel>
                            </Col>

                            <Col span={10}>
                                <FloatLabel label="Đường dẫn API">
                                    <Form.Item
                                        name="urlAPI"
                                        rules={[ValidateUtils.required]}>
                                        <Input
                                        />
                                    </Form.Item>
                                </FloatLabel>
                            </Col>
                        </>
                    )}
                    {(supplier_w === '7') && (
                        <Col span={24}>
                            <FloatLabel label={t('Đường dẫn API')}>
                                <Form.Item
                                    name="apiUrl"
                                    rules={[{ required: true, message: 'Bắt buộc nhập' }]}
                                >
                                    <Input
                                    />
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                    )}
                    <Col {...useResponsiveSpan(4)}>
                        <FloatLabel label={t('phoneNumber')}>
                            <Form.Item name='phoneNumber' rules={[ValidateUtils.maxLength(50), ValidateUtils.phoneNumberVietNam]}>
                                <Input></Input>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col {...useResponsiveSpan(10)}>
                        <FloatLabel label={t('department')}>
                            <Form.Item name='department' rules={[ValidateUtils.maxLength(100)]}>
                                <Input></Input>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                    <Col {...useResponsiveSpan(10)}>
                        <FloatLabel label={t('address')} required>
                            <Form.Item name='address' rules={[ValidateUtils.required, ValidateUtils.maxLength(200)]}>
                                <Input></Input>
                            </Form.Item>
                        </FloatLabel>
                    </Col>
                </Row>
                <h3 style={{ color: 'red' }} hidden={supplier_w != 4}>Vui lòng liên hệ với BKAV để lấy thông tin PartnerGUID và PartnerToken.</h3>
                <QuotaDetailModal autoDelete={cusForm.getFieldValue('autoDelete')} open={isShowModalPlan} onClose={(res) => {
                    setShowModalPlan(false);
                }} />
                <MisaInvoiceTemplateModal userName={userName_w} password={password_w} taxCode={taxCode_w} onClose={(res) => handleSelectMisaTemplate(res)} visible={isShowModalMisaInvoice} />
            </>
        } else {
            return <></>
        }
    }

    const handleSelectMisaTemplate = (res?: any) => {
        if (res) {
            cusForm.setFieldsValue({
                template: res.ipTemplateID,
                type: res.templateType.toString(),
                number: res.invSeries,
            })
        }

        setModalMisaInvoice(false);
    }

    return (
        <div>
            <Form form={cusForm} layout={"vertical"}>
                <Row gutter={16} className="mb-2.5">
                    <Col {...useResponsiveSpan(4)}>
                        <Form.Item
                            name="usingInvoice"
                            valuePropName="checked"
                            initialValue={false}
                        >
                            <Checkbox>{t("usingInvoice")}</Checkbox>
                        </Form.Item>
                    </Col>
                    <Col {...useResponsiveSpan(4)}>
                        <Form.Item
                            name="isInvoiceDraft"
                            valuePropName="checked"
                            initialValue={false}
                        >
                            <Checkbox>{t("isInvoiceDraft")}</Checkbox>
                        </Form.Item>
                    </Col>
                </Row>
                {usingInvoice && <FormInvoice />}

            </Form>
        </div>
    );
});


export default ShopSettingInvoice;
