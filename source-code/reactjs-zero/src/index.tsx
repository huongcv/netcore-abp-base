import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import appInformationApiService from "@ord-core/service-proxies/session/appInformationApiService";
import {Provider, rootStore} from "@ord-store/index";
import {I18nextProvider} from 'react-i18next';
import './i18n';
import i18n from "i18next";
import {serviceOptions} from "@api/index.defs";
import httpService from "@ord-core/service-proxies/httpService";
import {OrdDbClient} from "@ord-core/db";
import {Helmet, HelmetProvider} from 'react-helmet-async';
import OrdThemeConfig from "@ord-core/theme/ord-theme.config";

serviceOptions.axios = httpService;

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
appInformationApiService.getBoostrap().then(data => {
    if (data.isLogined) {
        OrdDbClient.setDbName(data);
    }
    let promiseListSyncs = data.isLogined ? [
        // fetchSyncDataProducts(),
        // fetchSyncDataInventoryLine(),
        // fetchSyncDataPartners(),
        // fetchSyncDataProductPriceLists()
    ] : [];
    Promise.all(promiseListSyncs)
        .then(() => {
            const logoSimple = OrdThemeConfig.getLogoSimpleUrl;
            const logoFull = OrdThemeConfig.getLogoUrl;
            const systemName = OrdThemeConfig.systemName;
            const faviconIco = OrdThemeConfig.faviconIco;
            const descriptionPage = OrdThemeConfig.descriptionPage;
            root.render(
                <HelmetProvider>
                    <I18nextProvider i18n={i18n}>
                        <Helmet>
                            <link rel="icon" href={faviconIco}/>
                            <title>{systemName}</title>
                            <meta name="description"
                                  content={descriptionPage}/>
                            <link rel="apple-touch-icon" href={logoSimple}/>
                            <meta property="og:title" content={systemName}/>
                            <meta property="og:description"
                                  content={descriptionPage}/>
                            <meta property="og:image" content={logoFull}/>
                        </Helmet>
                        <Provider value={rootStore}>
                            <App boostrapResultDto={data}/>
                        </Provider>
                    </I18nextProvider>
                </HelmetProvider>
            );
        });

}).catch((error) => {
    //  alert(error);
})


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

