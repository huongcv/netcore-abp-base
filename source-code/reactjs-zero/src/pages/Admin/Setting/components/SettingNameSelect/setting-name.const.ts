export const SETTING_NAME_FOR_APP = [
    'App:Setting:LockInSecond',
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
    'Boostrap:Image:BgLogin.Left'

];
export const SETTING_NAME_FOR_TENANT: string[] = [
];
export const SETTING_NAME_FOR_USER: string[] = [];

export enum SettingType {
    ForApp = 1,
    ForTenant = 2,
    ForUser = 3
}
