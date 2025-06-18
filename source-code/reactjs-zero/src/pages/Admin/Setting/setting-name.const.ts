export const SETTING_NAME_FOR_APP = [
    'App:Setting:MaxAccessFailedCount',
    'App:Setting:LockInSecond',
    'App:Setting:Mailing.Smtp.Host',
    'App:Setting:Mailing.Smtp.Port',
    'App:Setting:Mailing.Smtp.UserName',
    'App:Setting:Mailing.Smtp.Password',
    'App:Setting:Mailing.Smtp.DisplayName',
    'App:Setting:FrontEndUrl',
    'App:Setting:HtmlTemplate.News',
    'App:Setting:HtmlTemplate.UpdatedVersion',
    'App:Setting:HtmlTemplate.maintenanceNotice',
    'App:Setting:Firebase.JsonFirebaseAdmin',
    'Boostrap:Image:LogoFull',
    'Boostrap:Image:LogoSimple',
    'Boostrap:ThemeInfo',
    'Boostrap:Copyright',
    'Boostrap:SystemName',
    'Boostrap:DescriptionPage',
    'Boostrap:Image:FaviconIco',
    'Boostrap:Image:BgLogin.Under',
    'Boostrap:Image:BgLogin.Left',
    'Boostrap:PageLogin:LandingPageUrl',
    'Boostrap:Image:DashboardSlider1',
    'Boostrap:Image:DashboardSlider2',
    'Boostrap:Image:DashboardSlider3',
    'Boostrap:Image:DashboardSlider4',
    'Boostrap:Image:DashboardSlider5',

];
export const SETTING_NAME_FOR_TENANT: string[] = [
];
export const SETTING_NAME_FOR_USER: string[] = [];

export enum SettingType {
    ForApp = 1,
    ForTenant = 2,
    ForUser = 3
}
