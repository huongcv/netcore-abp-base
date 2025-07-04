import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {LangUtil} from '@ord-core/language/lang.utils';

const currentLang = LangUtil.getLang();
// Tự động import tất cả file json trong thư mục translations
const modules = import.meta.glob('./translations/**/*.json', {eager: true});

const resources: Record<string, Record<string, any>> = {};

// Duyệt qua từng file đã load
for (const path in modules) {
    const match = path.match(/\.\/translations\/(.+?)\/(.+?)\.json$/);
    if (match) {
        const lng = match[1]; // ví dụ: 'en', 'vi'
        if (lng !== currentLang) {
            continue;
        }
        const ns = match[2]; // ví dụ: 'common', 'menu'
        const module = modules[path] as { default: any };

        if (!resources[lng]) {
            resources[lng] = {};
        }

        resources[lng][ns] = module.default;
    }
}

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: LangUtil.getLang(), // hoặc 'vi', 'en'
        fallbackLng: 'vi',
        ns: Object.values(resources[LangUtil.getLang()] ?? {}).length
            ? Object.keys(resources[LangUtil.getLang()])
            : ['common'],
        defaultNS: 'common',
        interpolation: {
            escapeValue: false,
        },
        debug: false,
    });

export default i18n;
