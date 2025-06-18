import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useStore } from "@ord-store/index";
import { Button, Checkbox, Col, Form, Input, Radio, Row, Switch, Tooltip } from "antd";
import { observer } from "mobx-react-lite/src/observer";
import { useTranslation } from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { useSelectBank } from "@ord-components/forms/select/selectDataSource/useSelectBank";
import { ReloadOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { VietQrService } from "@api/VietQrService";
import UiUtils from "@ord-core/utils/ui.utils";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import { useEffect } from "react";

const CRUBankAccModal = () => {
    const { bankAccountStore: mainStore } = useStore();
    const { t: tEnum } = useTranslation("enum");
    const {t: tCommon} = useTranslation('common');
    const { t } = useTranslation("bankAccount");
    const form = Form.useFormInstance();

    const handleChange = (value: any, option: any) => {
        console.log(option);
        form.setFieldValue('bin', option.bin);
    }

    const reloadQRStatic = async () => {
        try {
            const data = await form.validateFields();
            UiUtils.setBusy();
            try {
                VietQrService.genStaticQr({
                    body: {
                        bankcode: data.bankCode,
                        sotk: data.virtualUserName ?? data.accountCode,
                        tentk: data.accountName,
                    }
                }).then(res => {
                    if (res.isSuccessful) {
                        form.setFieldValue('qrCodeStatic', res.data)
                    } else {
                        UiUtils.showError(res.notification?.message)
                    }
                })
            } catch (e) {

            } finally {
                UiUtils.clearBusy();
            }
        } catch (errorInfo) {
            UiUtils.showCommonValidateForm()
        }

    }

    const focusRef = useAutoFocus();

    return (
        <>
            <Row gutter={16}>
                <Col span={14}>
                    <FloatLabel label={t("bankCode")} required>
                        <Form.Item name="bankCode" rules={[ValidateUtils.required]}>
                            <OrdSelect
                                datasource={useSelectBank()}
                                allowClear
                                onChange={handleChange}
                            />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={5}>
                <Form.Item name='isActived' valuePropName="checked" initialValue={true}>
                    <Checkbox>{tCommon('dang_hoat_dong')}</Checkbox>
                </Form.Item>
                </Col>
                <Col span={5}>
                <Form.Item name='isDefault' valuePropName="checked" initialValue={true}>
                    <Checkbox>{t('Mặc định')}</Checkbox>
                </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={8}>
                    <FloatLabel label={t("accountCode")} required>
                        <Form.Item name="accountCode" rules={[ValidateUtils.required]}>
                            <Input ref={focusRef} />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={16}>
                    <FloatLabel label={t("accountName")} required>
                        <Form.Item name="accountName" rules={[ValidateUtils.required]}>
                            <Input />
                        </Form.Item>
                    </FloatLabel>
                </Col>
            </Row>
            <Row gutter={8}>
                <Col span={8}>
                    <FloatLabel label={t("virtualUserName")}>
                        <Form.Item name="virtualUserName">
                            <Input />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={16}>
                    <FloatLabel label={t("qrCodeStatic")}>
                        <Form.Item name="qrCodeStatic">
                            <Input
                                addonAfter={
                                    <Button
                                        type="text"
                                        icon={<ReloadOutlined />}
                                        onClick={reloadQRStatic}
                                    />
                                }
                            />
                        </Form.Item>
                    </FloatLabel>
                </Col>
            </Row>

            <FloatLabel label={t("notes")}>
                <Form.Item name="notes">
                    <TextArea />
                </Form.Item>
            </FloatLabel>

            <Form.Item name="bin" hidden>
                <TextArea />
            </Form.Item>
        </>
    );
};
export default observer(CRUBankAccModal);
