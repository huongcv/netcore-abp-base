import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import {LangUtil} from "@ord-core/language/lang.utils";

const apiUrl: string = import.meta.env.VITE_API_URL;

i18n
    .use(initReactI18next) // khai báo sử dụng i18next với react-i18next
    .use(resourcesToBackend((lng: any, ns: any) => import(`./translations/${lng}/${ns}.json`)))
    .init({
        fallbackLng: LangUtil.getLang(),
        //debug: apiUrl.indexOf('localhost') > -1,
        debug: false,
        interpolation: {
            escapeValue: false, // không nên escape trong React
        },
        defaultNS: ['common'],
        fallbackNS: ['common', 'menu']
    });

export default i18n;
