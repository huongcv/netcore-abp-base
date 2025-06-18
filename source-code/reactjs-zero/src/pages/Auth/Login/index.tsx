import './index.scss';
import * as React from 'react';
import authApiService from "@ord-core/service-proxies/auth/authApiService";
import serviceProxyUtils from "@ord-core/utils/service-proxy.utils";
import uiUtils from "@ord-core/utils/ui.utils";
import UiUtils from "@ord-core/utils/ui.utils";
import jwtUtils from "@ord-core/utils/jwt.utils";
import {observer} from "mobx-react-lite";
import appInformationApiService from "@ord-core/service-proxies/session/appInformationApiService";
import {useStore} from "@ord-store/index";
import paths from "@ord-core/config/paths";
import {Button, Checkbox, Flex, Form, Input} from "antd";
import {useNavigate} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {LoginBody} from "@ord-core/service-proxies/auth/dto";
import Utils from "@ord-core/utils/utils";
import {DollarOutlined, UnlockOutlined} from "@ant-design/icons";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {LoginIcon} from "@ord-components/icon/LoginIcon";
import {SaleIcon} from "@ord-components/icon/menu/SaleIcon";
import OrdThemeConfig from "@ord-core/theme/ord-theme.config";

const Login: React.FC = observer(() => {
    const {sessionStore} = useStore();
    let navigate = useNavigate();
    const [form] = Form.useForm();
    const {t} = useTranslation(['common']);
    const onFinish = async (data: LoginBody) => {
        try {
            UiUtils.setBusy();
            data.FireBaseToken = sessionStore.firebaseToken;
            data.Platform = window.navigator.platform
            data.TenantCode = Utils.resolveTenancyCode(data.UserName);
            const ret = await authApiService.login(data);
            serviceProxyUtils.notifyErrorResultApi(ret);
            console.log("resLogin", ret)
            if (ret.isSuccessful) {
                jwtUtils.saveToken(ret.data!.accessToken);
                jwtUtils.saveRefreshToken(ret.data!.refreshToken);
                const boostrapDto = await appInformationApiService.getBoostrap();
                sessionStore.setSession(boostrapDto);
                // chuyển trang
                window.location.href = data.ReturnURL ? data.ReturnURL : paths.root;
                //navigate(paths.root);
                // history.push(paths.root);
            }
        } catch (error) {
            uiUtils.showCatchError(error);
        } finally {
            UiUtils.clearBusy();
        }
    };
    const goToSell = () => {
        form.setFieldValue('ReturnURL', '/sales-invoice/sell');
        onFinish(form.getFieldsValue());
    }
    // const yupSync = yupValidator(yup.object().shape({
    //     UserName: ValidateUtils.yupUtil.notEmpty,
    //     Password: ValidateUtils.yupUtil.notEmpty,
    // }), form.getFieldsValue);
    const homePage = OrdThemeConfig.landingPageUrl;
    return (
        <>
            <h3 className="titleLogin mb-5">{t('login')}</h3>
            <Form form={form} layout='vertical' onFinish={onFinish}
                  onFinishFailed={() => uiUtils.showCommonValidateForm()} className="pt-3">
                <FloatLabel label={t('UserName')} required>
                    <Form.Item name='UserName' rules={[ValidateUtils.required]}>
                        <Input style={{height: 44}}/>
                    </Form.Item>
                </FloatLabel>
                <FloatLabel label={t('Password')} required>
                    <Form.Item name='Password' rules={[ValidateUtils.required]}>
                        <Input.Password className="pass-input" style={{padding: 0, paddingRight: 10, height: 44,}}/>
                    </Form.Item>
                </FloatLabel>
                <Flex className="justify-between font-semibold">
                    {homePage ? <a href={homePage}> {t('backToHome')} </a> : <span></span>}
                    <a onClick={() => navigate("/auth/forgot-password")}>{t('forgotPassword')}</a>
                </Flex>
                <Flex className="gap-3 mt-3 flex-col">
                    <Button type="primary" className="login-btn" htmlType="submit">
                        <LoginIcon/>
                        {t('login')}
                    </Button>
                    <Button type="default" className="login-btn text-primary" onClick={goToSell}>
                        <SaleIcon/>
                        {t('sell')}
                    </Button>
                    <Form.Item hidden name="ReturnURL"><Input/></Form.Item>
                </Flex>
            </Form>
        </>
    )
});
export default Login;
