import {ThemeConfig} from "antd/es/config-provider/context";
import {theme} from "antd";
import type {ComponentToken as TableComponentToken} from "antd/es/table/style";
import {OrdThemeDto} from "@api/index.defs";

function GetFileUrl(x: string) {
    return import.meta.env.VITE_MINIO + x;
}

class OrdThemeConfig {
    KEY_THEME = 'ThemeCurrent';
    KEY_LogoId = 'LogoId';
    KEY_Copyright = 'Copyright';
    KEY_SystemName = 'SystemName';
    KEY_FaviconIco = 'FaviconIco';
    KEY_LogoSimpleId = 'LogoSimpleId';
    KEY_PRIMARY_COLOR = 'PRIMARY_COLOR';
    PRIMARY_COLOR_DEFAULT = "#3BB54A";
    KEY_SECONDARY_COLOR = 'SECONDARY_COLOR';
    SECONDARY_COLOR_DEFAULT = "#2354a9";

    initData(data: OrdThemeDto) {
        this.setTheme(data.themeInfo);
        this.setLogo(data.logoFull);
        this.setLogoSimple(data.logoSimple);
        this.setCopyright(data.copyright);
        this.setSystemName(data.systemName);
        this.setFaviconIco(data.faviconIco);
        this.setBgLoginUnder(data.bgLoginUnder);
        this.setBgLoginLeft(data.bgLoginLeft);
        this.setDescriptionPage(data.descriptionPage);
        this.setLandingPageUrl(data.landingPageUrl);
        this.setDashboardSlider(data.dashboardSlider ?? []);
    }

    deepMerge = (obj1: any, obj2: any) => {
        return Object.keys({...obj1, ...obj2}).reduce((acc: any, key) => {
            acc[key] = obj2[key] !== undefined
                ? (typeof obj2[key] === 'object' && !Array.isArray(obj2[key])
                    ? this.deepMerge(obj1[key] || {}, obj2[key])
                    : obj2[key])
                : obj1[key];
            return acc;
        }, {});
    };

    get antDesignConfigDefault(): ThemeConfig {
        const BASE_CONTROL_HEIGHT = 38;
        const primaryColor = this.PRIMARY_COLOR_DEFAULT;
        const inputVal = {
            activeBorderColor: "rgb(0,0,0)",
            hoverBorderColor: "rgb(0,0,0)"

        }
        const blackColor = "#000000E0";
        const blackColorBorder = "rgba(0,0,0,0.10)";
        const blackColorHover = "rgba(0,0,0,0.50)";
        const blackColorActive = "rgba(0,0,0,0.80)";
        return {
            algorithm: theme.defaultAlgorithm,
            token: {
                colorPrimary: primaryColor,
                colorSuccess: "#3BB54A",


                colorTextDisabled: '#000000FF',
                controlItemBgActiveDisabled: '#000000FF',
                colorError: '#F5413D',
                borderRadius: 6,
                fontSize: 15,
                colorPrimaryActive: primaryColor,
            },
            components: {
                Button: {
                    // colorPrimary: PRIMARY_COLOR,
                    colorPrimaryHover: `color-mix(in srgb,  var(--main-color) 80%, black 20%)`,
                    colorPrimaryActive: ' var(--main-color)',
                    primaryShadow: 'none',
                    dangerShadow: 'none',
                    defaultShadow: 'none',
                    borderRadius: 3,
                    paddingInline: 12,
                    controlHeight: BASE_CONTROL_HEIGHT,
                    fontWeight: 500,

                    colorLink: blackColor,
                    colorLinkActive: blackColorActive,
                    colorLinkHover: blackColorHover,

                    defaultColor: blackColor,
                    defaultActiveColor: blackColorActive,
                    defaultHoverColor: blackColorActive,
                    defaultBorderColor: blackColorBorder,
                    defaultHoverBorderColor: blackColorHover,
                },
                Card: {
                    headerHeight: 38,
                    padding: 8
                },
                Checkbox: {
                    controlInteractiveSize: 20,
                    colorPrimary: this.activeColor,
                    colorPrimaryHover: `color-mix(in srgb,  var(${this.activeColor}) 80%, black 20%)`,
                    colorPrimaryBorder: `color-mix(in srgb,  var(${this.activeColor}) 80%, black 10%)`,
                },
                Tree: {
                    colorPrimary: this.activeColor,
                    colorPrimaryHover: `color-mix(in srgb,  var(${this.activeColor}) 80%, black 20%)`,
                    colorPrimaryBorder: `color-mix(in srgb,  var(${this.activeColor}) 80%, black 10%)`,
                },
                Badge: {
                    colorPrimary: blackColor,
                    colorPrimaryHover: blackColorHover,
                },
                Table: {
                    headerBg: '#E2E2E2',
                    headerColor: '#212123',
                    rowSelectedBg: "none",
                    rowSelectedHoverBg: "none",
                } as TableComponentToken,
                Pagination: {
                    controlHeight: BASE_CONTROL_HEIGHT,
                    colorPrimary: blackColor,
                    colorPrimaryHover: blackColorHover,
                },
                Layout: {
                    siderBg: "#FFF",
                },
                Menu: {
                    itemSelectedColor: "#FFF",
                    itemSelectedBg: 'var(--main-color)',
                    fontSize: 16,
                    itemBorderRadius: 0,
                },

                Input: {
                    controlHeight: BASE_CONTROL_HEIGHT,
                    paddingInline: 10,
                    borderRadius: 3,
                    ...inputVal
                },

                Select: {
                    controlHeight: BASE_CONTROL_HEIGHT,
                    optionHeight: 40,
                    borderRadius: 3,
                    ...inputVal
                },
                DatePicker: {
                    controlHeight: BASE_CONTROL_HEIGHT,
                    borderRadius: 3,
                    ...inputVal
                },
                InputNumber: {
                    controlHeight: BASE_CONTROL_HEIGHT,
                    borderRadius: 3,
                    ...inputVal
                },
                Tag: {
                    fontSizeSM: 15
                },

                Tabs: {
                    "itemSelectedColor": "#000000E0",
                    "inkBarColor": "rgb(0,0,0)",
                    "itemHoverColor": "rgb(0,0,0)",
                    "itemActiveColor": "rgba(0,0,0,0.88)"
                },
                Radio: {
                    radioSize: 20,
                    dotSize: 12,
                    colorPrimaryActive: this.activeColor,
                    colorPrimary: this.activeColor,
                    colorPrimaryHover: `color-mix(in srgb,  var(${this.activeColor}) 80%, black 20%)`,
                    colorPrimaryBorder: `color-mix(in srgb,  var(${this.activeColor}) 80%, black 10%)`,
                    /// Style color file layout.css
                },
            }
        } as ThemeConfig
    }

    get blueColor() {
        return "#0671B7";
    }

    get activeColor() {
        return this.PRIMARY_COLOR_DEFAULT;
    }

    get PrimaryColor() {
        const color = localStorage.getItem(this.KEY_PRIMARY_COLOR);
        return color || this.PRIMARY_COLOR_DEFAULT;
    }

    get SecondaryColor() {
        const color = localStorage.getItem(this.SECONDARY_COLOR_DEFAULT);
        return color ?? this.SECONDARY_COLOR_DEFAULT;
    }

    setTheme(val?: string) {
        if (val) {
            const dataP = JSON.parse(val) as ThemeConfig;
            const dataAfter = this.deepMerge(this.antDesignConfigDefault, dataP) as ThemeConfig;
            localStorage.setItem(this.KEY_PRIMARY_COLOR, dataAfter?.token?.colorPrimary ?? "");
            // @ts-ignore
            localStorage.setItem(this.KEY_SECONDARY_COLOR, dataAfter?.token?.colorSecondary ?? "");
            localStorage.setItem(this.KEY_THEME, JSON.stringify(dataAfter));
        } else {
            localStorage.setItem(this.KEY_THEME, "");
            localStorage.setItem(this.KEY_PRIMARY_COLOR, "");
            localStorage.setItem(this.KEY_SECONDARY_COLOR, "");
        }
    }

    getTheme(): ThemeConfig {
        const strData = localStorage.getItem(this.KEY_THEME);
        if (strData) {
            const data = JSON.parse(strData) as ThemeConfig;
            console.log("dataConvert", data);
            if (data)
                return data
        }
        return this.antDesignConfigDefault
    }

    setLogo(val?: string) {
        localStorage.setItem(this.KEY_LogoId, val?.toString() ?? "");
    }

    get getLogoUrl() {
        const data = localStorage.getItem(this.KEY_LogoId);
        if (data) {
            return GetFileUrl(data);
        } else {
            return "/images/logo/vpos-logo-v2.png"
        }
    }


    setLogoSimple(val?: string) {
        localStorage.setItem(this.KEY_LogoSimpleId, val?.toString() ?? "");
    }

    get getLogoSimpleUrl() {
        const data = localStorage.getItem(this.KEY_LogoSimpleId);
        if (data) {
            return GetFileUrl(data);
        } else {
            return "/images/logo/vpos-logo-sm.png"
        }
    }
    setCopyright(val?: string) {
        localStorage.setItem(this.KEY_Copyright, val?.toString() ?? "");
    }

    get copyright() {
        const data = localStorage.getItem(this.KEY_Copyright);
        return data || "Copyright © Orenda 2024";
    }

    setSystemName(val?: string) {
        localStorage.setItem(this.KEY_SystemName, val?.toString() ?? "");
    }

    get systemName() {
        const data = localStorage.getItem(this.KEY_SystemName);
        return data || "";
    }

    setDescriptionPage(val?: string) {
        localStorage.setItem('descriptionPage', val?.toString() ?? "");
    }

    get descriptionPage() {
        const data = localStorage.getItem('descriptionPage');
        return data || "";
    }

    setFaviconIco(val?: string) {
        localStorage.setItem(this.KEY_FaviconIco, val?.toString() ?? "");
    }

    get faviconIco() {
        const data = localStorage.getItem(this.KEY_FaviconIco);
        return data ? GetFileUrl(data) : "/favicon.ico";
    }

    private setBgLoginLeft(val?: string) {
        localStorage.setItem("bgLoginLeft", val?.toString() ?? "");
    }

    get bgLoginLeft() {
        const data = localStorage.getItem("bgLoginLeft");
        return data ? GetFileUrl(data) : "/images/bg-login2.png";
    }

    private setBgLoginUnder(val?: string) {
        localStorage.setItem("bgLoginUnder", val?.toString() ?? "");
    }

    get bgLoginUnder() {
        const data = localStorage.getItem("bgLoginUnder");
        return data ? GetFileUrl(data) : "/images/bg-login3.png";
    }

    private setLandingPageUrl(val?: string) {
        localStorage.setItem("landingPageUrl", val?.toString() ?? "");
    }

    get landingPageUrl() {
        const data = localStorage.getItem("landingPageUrl");
        return data || "";
    }

    private setDashboardSlider(val: string[]) {
        localStorage.setItem("SliderHome", val ? JSON.stringify(val) : "");
    }

    get dashboardSlider() {
        const data = localStorage.getItem("SliderHome");
        if (data) {
            const dataConvert = JSON.parse(data) as string[];
            return dataConvert.map(x => GetFileUrl(x));
        } else {
            return []
        }
    }

}

export default new OrdThemeConfig();

