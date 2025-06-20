import './index.scss';
import * as React from 'react';
import {useState} from 'react';
import uiUtils from "@ord-core/utils/ui.utils";
import UiUtils from "@ord-core/utils/ui.utils";
import {observer} from "mobx-react-lite";
import {Button, Flex, Form, Input, Result} from "antd";
import {useTranslation} from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {ForgotPasswordService} from "@api/ForgotPasswordService";
import {SendEmailForgotPasswordQuery} from "@api/index.defs";
import {useNavigate} from "react-router-dom";
import {ArrowLeftOutlined} from "@ant-design/icons";

const ForgotPassword: React.FC = observer(() => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const {t} = useTranslation(['common']);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const onFinish = async (data: SendEmailForgotPasswordQuery) => {
        try {
            UiUtils.setBusy();

            ForgotPasswordService.sendEmailForgotPassword({
                body: {
                    userName: data.userName,
                    email: data.email
                }
            }).then(res => {
                if (res.isSuccessful) {
                    setIsSubmitted(true)
                } else {
                    uiUtils.showError(t(res.errorDetail?.message || 'error'));
                }
            })
        } catch (error) {
            uiUtils.showCatchError(error);
        } finally {
            UiUtils.clearBusy();
        }
    };

    return (
        <>
            {
                isSubmitted ?
                    (
                        <>
                            <Result
                                status="success"
                                title={t('successful')}
                                subTitle={t('sendEmailResetPasswordSuccessfulReport')}
                            />
                            <Button type="default" className="login-btn border-primary text-primary"
                                    onClick={() => navigate("/")}>
                                <ArrowLeftOutlined/>
                                {t('pages.404.buttonText')}
                            </Button>
                        </>
                    ) :
                    (
                        <>
                            <h3 className="titleLogin mb-5">{t('forgotPassword')}</h3>
                            <p>{t('forgotPasswordDescription')}</p>
                            <Form form={form} layout='vertical' onFinish={onFinish}
                                  onFinishFailed={() => uiUtils.showCommonValidateForm()} className="pt-3">

                                <FloatLabel label={t('UserName')} required>
                                    <Form.Item name='userName'  rules={[ValidateUtils.required]}>
                                        <Input style={{height: 44}}/>
                                    </Form.Item>
                                </FloatLabel>
                                <FloatLabel label={t('email')} required>
                                    <Form.Item name='email' rules={[ValidateUtils.required, ValidateUtils.email]}>
                                        <Input style={{height: 44}}/>
                                    </Form.Item>
                                </FloatLabel>

                                <Flex className="gap-3 mt-3">
                                    <Button type="primary" className="login-btn" htmlType="submit">
                                        {t('send')}
                                    </Button>
                                    <Button type="default" className="login-btn border-primary text-primary"
                                            onClick={() => navigate("/")}>
                                        {t('back')}
                                    </Button>
                                </Flex>
                            </Form>
                        </>
                    )
            }
        </>
    )
});
export default ForgotPassword;
