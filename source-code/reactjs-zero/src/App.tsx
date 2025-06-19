import React, {Suspense, useEffect, useState} from 'react';
import './App.scss';
import {ConfigProvider, Spin} from "antd";

import {AppBootstrapDto} from "@ord-core/service-proxies/session/dto";
import {RouterProvider} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {useStore} from "@ord-store/index";
import vi_VN from 'antd/locale/vi_VN';
import {ROOT_ROUTER} from "./Router/router.config";
import {LangUtil} from "@ord-core/language/lang.utils";
import AppCommonEntityFormModal from "@ord-components/crud/AppCommonEntityFormModal";
import Loader from "@ord-components/loader";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import {PdfPrintWindow} from "@ord-components/common/PdfPrintWindow";
import {requestForToken} from "./firebase";
import ThemeUtil from "@ord-core/theme/ord-theme.config";
import OrdComponentConfig from "@ord-core/theme/ord-Component.config";

declare var ord: any;

interface IAppProp {
    boostrapResultDto: AppBootstrapDto;
}

const App = (props: IAppProp) => {
    useEffect(() => {
        console.log("ApppIOnit")
    }, []);
    const {sessionStore, uiStore, entityModalStore} = useStore();
    sessionStore!.setSession(props.boostrapResultDto);
    const [antLocale, setAntLocale] = useState(vi_VN);
    const {t} = useTranslation(['menu', 'permission', 'common', 'field']);
    useEffect(() => {
        document.documentElement.style.setProperty('--main-color', ThemeUtil.PrimaryColor);
        document.documentElement.style.setProperty('--secondary-color', ThemeUtil.SecondaryColor);
        document.documentElement.style.setProperty('--active-color', ThemeUtil.activeColor);

        ord.event.on('event@ord.ui.setBusy', () => {
            uiStore.setBusy();
        });
        ord.event.on('event@ord.ui.clearBusy', () => {
            uiStore.clearBusy();
        });
        // @ts-ignore
        setAntLocale(LangUtil.getAntLocale());
        requestForToken().then(res => {
            sessionStore.setFirebaseToken(res);
        })

        const handlePreloadError = (event: any) => {
            console.error('Vite preload error:', event);
            window.location.reload(); // Reload the page on error
        };
        // Gắn sự kiện 'vite:preloadError'
        window.addEventListener('vite:preloadError', handlePreloadError);
        return () => {
            window.removeEventListener('vite:preloadError', handlePreloadError);
        };
    }, []);

    return (
        <ConfigProvider

            theme={ThemeUtil.getTheme()} locale={antLocale}
            {...OrdComponentConfig}
        >
            <Suspense fallback={<Spin fullscreen={true}></Spin>}>
                <RouterProvider
                    router={ROOT_ROUTER} fallbackElement={<Spin fullscreen={true}></Spin>}/>
            </Suspense>
            <ToastContainer/>
            <Loader/>
            {/*modal dùng chung cho sửa thông tin */}
            <AppCommonEntityFormModal/>
            <PdfPrintWindow/>
        </ConfigProvider>
    );
};


export default observer(App);
