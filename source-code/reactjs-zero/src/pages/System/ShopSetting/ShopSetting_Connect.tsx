import { ShopSettingDto } from "@api/index.defs";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import UiUtils from "@ord-core/utils/ui.utils";
import { useStore } from "@ord-store/index";
import { Button, Checkbox, Col, Collapse, Form, Input, Row, Space } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from "react-i18next";

import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { ShopSettingService } from "@api/ShopSettingService";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { IFormSettingShop_Connect, SETTING_NAME_FOR_SHOP } from "./setting-name.const";

interface Props {
}

// Define the ref type
export type ShopSettingConnectRef = {
    saveData: () => void;
};

const ShopSettingConnect = forwardRef<ShopSettingConnectRef, Props>((props, ref) => {
    const {sessionStore} = useStore();
    const {t} = useTranslation('shop-setting');
    const [cusForm] = Form.useForm<IFormSettingShop_Connect>();

    useEffect(() => {
        ShopSettingService.getAllConnectSetting()
            .then(res => {
                const tingeeInfo = res.find(x => x.name == SETTING_NAME_FOR_SHOP.connect.tingee)?.value
                const nationalPharmacyInfo = res.find(x => x.name == SETTING_NAME_FOR_SHOP.connect.nationalPharmacy)?.value
                const nationalPrescriptionInfo = res.find(x => x.name == SETTING_NAME_FOR_SHOP.connect.nationalPrescription)?.value

                cusForm.setFieldsValue({
                    tingee: tingeeInfo ? JSON.parse(tingeeInfo) : {},
                    nationalPharmacy: nationalPharmacyInfo ? JSON.parse(nationalPharmacyInfo) : {},
                    nationalPrescription: nationalPrescriptionInfo ? JSON.parse(nationalPrescriptionInfo) : {},
                });
            })
    }, []);
    // Pass the ref to the useImperativeHandle hook
    useImperativeHandle(ref, () => ({
        saveData: () => {
            // getProperty(SETTING_NAME_FOR_SHOP, '')
            saveData().then();
        }
    }));
    const saveData = async () => {
        try {
            const data = await cusForm.validateFields();
            UiUtils.setBusy();
            try {

                const input: ShopSettingDto[] = [];
                input.push({
                    id: '0',
                    name: SETTING_NAME_FOR_SHOP.connect.tingee,
                    value: JSON.stringify(data.tingee)
                })
                input.push({
                    id: '0',
                    name: SETTING_NAME_FOR_SHOP.connect.nationalPrescription,
                    value: JSON.stringify(data.nationalPrescription)
                })
                input.push({
                    id: '0',
                    name: SETTING_NAME_FOR_SHOP.connect.nationalPharmacy,
                    value: JSON.stringify(data.nationalPharmacy)
                })
                await ShopSettingService.setListValue({
                    body: input
                }).then(result => {
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

            } finally {
                UiUtils.clearBusy();
            }
        } catch (errorInfo) {
            UiUtils.showCommonValidateForm()
        }
    }


    const w_Prescription = Form.useWatch(['nationalPrescription', 'using'], cusForm);
    const w_Pharmacy = Form.useWatch(['nationalPharmacy', 'using'], cusForm);
    const w_Tingee = Form.useWatch(['tingee', 'using'], cusForm);
    const urlWebHook = import.meta.env.VITE_API_URL + "/api/tingee/webhook/complete-transaction";
    const [isCopy, setIsCopy] = useState<boolean>();
    return (
        <div>
            <Form form={cusForm}
                  layout={'vertical'}>

                <Row gutter={16}>

                    <Col {...useResponsiveSpan(6)} hidden={!sessionStore.isPharmacy}>

                        <Collapse
                            defaultActiveKey={['0']}
                            items={[
                                {
                                    key: "0",
                                    label: t("nationalPharmacyInfo"),
                                    children: <>
                                        <Row gutter={[16, 16]}>
                                            <Col {...useResponsiveSpan(24)}>
                                                <Form.Item name={['nationalPharmacy', 'using']}
                                                           valuePropName="checked"
                                                           initialValue={false}
                                                >
                                                    <Checkbox>{t('connect')}</Checkbox>
                                                </Form.Item>
                                            </Col>
                                            <Col {...useResponsiveSpan(24)}>
                                                <FloatLabel label={t('nationalPharmacy.userName')}
                                                            required={!!w_Pharmacy}>
                                                    <Form.Item rules={w_Pharmacy ? [ValidateUtils.required] : []}
                                                               name={['nationalPharmacy', 'userName']}>
                                                        <Input disabled={!w_Pharmacy}></Input>
                                                    </Form.Item>
                                                </FloatLabel>
                                            </Col>
                                            <Col {...useResponsiveSpan(24)}>
                                                <FloatLabel label={t('nationalPharmacy.password')}
                                                            required={!!w_Pharmacy}>
                                                    <Form.Item rules={w_Pharmacy ? [ValidateUtils.required] : []}
                                                               name={['nationalPharmacy', 'password']}>
                                                        <Input.Password disabled={!w_Pharmacy}></Input.Password>
                                                    </Form.Item>
                                                </FloatLabel>
                                            </Col>
                                        </Row>
                                    </>,
                                }
                            ]}
                        >
                        </Collapse>
                    </Col>

                    <Col {...useResponsiveSpan(12)}>
                        <Collapse
                            defaultActiveKey={['0']}
                            items={[
                                {
                                    key: "0",
                                    label: t("tingeeInfo"),
                                    children: <>
                                        <Row gutter={[16, 16]}>
                                            <Col {...useResponsiveSpan(24)}>
                                                <Form.Item name={['tingee', 'using']}
                                                           valuePropName="checked"
                                                           initialValue={false}
                                                >
                                                    <Checkbox>{t('connect')}</Checkbox>
                                                </Form.Item>
                                            </Col>
                                            <Col {...useResponsiveSpan(12)}>
                                                <FloatLabel label={t('tingee.clientId')} required={!!w_Tingee}>
                                                    <Form.Item rules={w_Tingee ? [ValidateUtils.required] : []}
                                                               name={['tingee', 'clientId']}>
                                                        <Input
                                                            disabled={!w_Tingee}></Input>
                                                    </Form.Item>
                                                </FloatLabel>
                                            </Col>
                                            <Col {...useResponsiveSpan(12)}>
                                                <FloatLabel label={t('tingee.secretToken')} required={!!w_Tingee}>
                                                    <Form.Item rules={w_Tingee ? [ValidateUtils.required] : []}
                                                               name={['tingee', 'secretToken']}>
                                                        <Input.Password
                                                            disabled={!w_Tingee}></Input.Password>
                                                    </Form.Item>
                                                </FloatLabel>
                                            </Col>
                                            <Col {...useResponsiveSpan(24)}>
                                                <FloatLabel label={t('tingee.urlWebhook')}>
                                                    <Form.Item>
                                                        <Space.Compact style={{width: '100%'}}>
                                                            <Input
                                                                value={urlWebHook}
                                                                disabled={true}></Input>
                                                            <Button type="primary" onClick={() => {
                                                                setIsCopy(true);
                                                                navigator.clipboard.writeText(urlWebHook);
                                                                setTimeout(()=>{
                                                                    setIsCopy(false);
                                                                },2000)
                                                            }}>
                                                                {isCopy? <CheckOutlined></CheckOutlined>: <CopyOutlined></CopyOutlined>}
                                                            </Button>
                                                        </Space.Compact>

                                                    </Form.Item>
                                                    {/*<Paragraph ellipsis={true} copyable>{urlWebHook}</Paragraph>*/}

                                                </FloatLabel>
                                            </Col>
                                        </Row>
                                    </>,
                                }
                            ]}
                        >
                        </Collapse>
                    </Col>


                </Row>
            </Form>

        </div>
    );
});


export default ShopSettingConnect;
