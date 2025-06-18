import './index.scss';
import * as React from 'react';
import {useEffect, useState} from 'react';
import uiUtils from "@ord-core/utils/ui.utils";
import UiUtils from "@ord-core/utils/ui.utils";
import {observer} from "mobx-react-lite";
import {Button, Flex, Form, Input, Result} from "antd";
import {useTranslation} from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {LoginIcon} from "@ord-components/icon/LoginIcon";
import {ForgotPasswordService} from "@api/ForgotPasswordService";
import {useNavigate, useParams} from "react-router-dom";
import {ReturnIcon} from "@ord-components/icon/ReturnIcon";
import validateUtils from "@ord-core/utils/validate.utils";
import {SaveOutlined} from "@ant-design/icons";

const ResetPassword: React.FC = observer(() => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const {t} = useTranslation(['common']);
    const {id} = useParams();
    const [isSubmitted, setIsSubmitted] = useState(false);


    useEffect(() => {
        if (id) {
            ForgotPasswordService.checkCode({
                body: {
                    code: id
                }
            }).then(res => {
                if (res.isSuccessful) {
                    form.setFields([
                        {
                            name: "userName",
                            value: res.data?.userName
                        },
                        {
                            name: "email",
                            value: res.data?.email
                        },
                        {
                            name: "newPassword",
                            value: null
                        },
                        {
                            name: "confirmPassword",
                            value: null
                        },
                        {
                            name: "resetCode",
                            value: id
                        },
                    ])
                }
            })

        }
    }, [id]);


    const onFinish = async (data: { newPassword: string; resetCode: string; }) => {
        try {
            UiUtils.setBusy();

            ForgotPasswordService.changePassword(data).then(res => {
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
                            />
                            <Button type="default" className="login-btn border-primary text-primary"
                                    onClick={() => navigate("/")}>
                                <ReturnIcon/>
                                {t('pages.404.buttonText')}
                            </Button>
                        </>
                    ) :
                    (
                        <>
                            <h3 className="titleLogin mb-5">{t('changePassword')}</h3>
                            <Form form={form} layout='vertical' onFinish={onFinish}
                                  onFinishFailed={() => uiUtils.showCommonValidateForm()} className="pt-3">
                                <FloatLabel label={t('UserName')}>
                                    <Form.Item name='userName'>
                                        <Input style={{height: 44}} disabled/>
                                    </Form.Item>
                                </FloatLabel>
                                <FloatLabel label={t('email')}>
                                    <Form.Item name='email'>
                                        <Input style={{height: 44}} disabled/>
                                    </Form.Item>
                                </FloatLabel>
                                <FloatLabel label={t('newPassword')} required>
                                    <Form.Item name='newPassword' rules={[ValidateUtils.required,ValidateUtils.password]}>
                                        <Input.Password className="pass-input" style={{paddingRight: 10, height: 44}}/>
                                    </Form.Item>
                                </FloatLabel>
                                <FloatLabel label={t('confirmPassword')} required>
                                    <Form.Item name='confirmPassword' rules={[ValidateUtils.required,ValidateUtils.password,({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error(t('confirmPasswordError')));
                                        },
                                    })]}>
                                        <Input.Password className="pass-input" style={{paddingRight: 10, height: 44}}/>
                                    </Form.Item>
                                </FloatLabel>
                                <Form.Item hidden name="resetCode"><Input/></Form.Item>
                                <Flex className="gap-3 mt-3 flex-col">
                                    <Button type="primary" className="login-btn" htmlType="submit">
                                        <SaveOutlined/>
                                        {t('save')}
                                    </Button>
                                    <Button type="default" className="login-btn border-primary text-primary"
                                            onClick={() => navigate("/")}>
                                        <ReturnIcon/>
                                        {t('pages.404.buttonText')}
                                    </Button>
                                </Flex>
                            </Form>
                        </>
                    )
            }
        </>
    )
});
export default ResetPassword;
