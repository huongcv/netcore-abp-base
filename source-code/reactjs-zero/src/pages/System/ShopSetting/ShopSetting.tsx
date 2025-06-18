import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Menu, MenuProps } from "antd";
import { useTranslation } from "react-i18next";
import {
    BankOutlined,
    FileProtectOutlined,
    GiftOutlined,
    LinkOutlined,
    SaveOutlined,
    SettingOutlined,
    ShopOutlined,
    TransactionOutlined
} from "@ant-design/icons";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { TopAction } from "@ord-components/crud/TopAction";
import { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { HotKeyScope } from "@ord-core/AppConst";
import { HotkeysProvider, useHotkeys } from "react-hotkeys-hook";
import BankAccountList from "@pages/System/BankAccount";
import ShopSettingConnect, { ShopSettingConnectRef } from './ShopSetting_Connect';
import ShopSettingGeneralInfo, { ShopSettingGeneralInfoRef } from './ShopSetting_GeneralInfo';
import ShopSettingInfo, { ShopSettingInfoRef } from './ShopSetting_Info';
import ShopSettingInvoice, { ShopSettingInvoiceRef } from './ShopSetting_Invoice';
import { useStore } from "@ord-store/index";
import ShopSettingLoyalty, { ShopSettingLoyaltyRef } from './ShopSetting_Loyalty';
import ShopSettingConfigDefaulGolf, { ShopSettingConfigDefaulGolfRef } from './ShopSetting_ConfigDefaulGolf';


type ComType = "info" | "invoice" | 'generalInfo' | 'connect' | 'bankAccount' | 'nationalDrug' | 'nationalTicket' | 'loyalty' | 'config-default-golf';
type MenuItem = Required<MenuProps>['items'][number];
const ShopSetting = () => {
    const { t } = useTranslation('shop-setting');
    const { sessionStore } = useStore();
    const [componentName, setComponentName] = useState<ComType>('info');
    const refGeneralInfo = useRef<ShopSettingGeneralInfoRef>(null);
    const refInfo = useRef<ShopSettingInfoRef>(null);
    const refInvoice = useRef<ShopSettingInvoiceRef>(null)
    const refConnect = useRef<ShopSettingConnectRef>(null);
    const refLoyalty = useRef<ShopSettingLoyaltyRef>(null);
    const refConfigDefaulGolf = useRef<ShopSettingConfigDefaulGolfRef>(null);


    useHotkeys('F8', (event) => {
        onSaveClick();
        event.preventDefault();
    }, { scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true })

    const getItems = () => {
        const items: MenuItem[] = [
            {
                label: t('info'),
                key: 'info',
                icon: <ShopOutlined />,
                onClick: ($event) => {
                    setComponentName($event.key as ComType)
                }
            },
            {
                label: t('generalInfo'),
                key: 'generalInfo',
                icon: <FileProtectOutlined />,
                onClick: ($event) => {
                    setComponentName($event.key as ComType)
                }
            },
            {
                label: t('invoice'),
                key: 'invoice',
                icon: <TransactionOutlined />,
                onClick: ($event) => {
                    setComponentName($event.key as ComType)
                }
            },
            {
                label: t('connectSetting'),
                key: 'connect',
                icon: <LinkOutlined />,
                onClick: ($event) => {
                    setComponentName($event.key as ComType)
                }
            },
            {
                label: t('bankAccount'),
                key: 'bankAccount',
                icon: <BankOutlined />,
                onClick: ($event) => {
                    setComponentName($event.key as ComType)
                }
            },
            {
                label: t('loyalty'),
                key: 'loyalty',
                icon: <GiftOutlined />,
                onClick: ($event) => {
                    setComponentName($event.key as ComType)
                }
            },
        ];
        if(sessionStore.isGolfShop){
            items.push({
                label: t('config-default-golf'),
                key: 'config-default-golf',
                icon: <SettingOutlined />,
                onClick: ($event) => {
                    setComponentName($event.key as ComType)
                }
            } as MenuItem)
        }
        return items;
    }

    const renderComponent = (name: ComType) => {
        switch (name) {
            case "generalInfo":
                return <ShopSettingGeneralInfo ref={refGeneralInfo}></ShopSettingGeneralInfo>
            case 'info':
                return <ShopSettingInfo ref={refInfo}></ShopSettingInfo>
            case 'invoice':
                return <ShopSettingInvoice ref={refInvoice}></ShopSettingInvoice>
            case 'connect':
                return <ShopSettingConnect ref={refConnect}></ShopSettingConnect>
            case 'loyalty':
                return <ShopSettingLoyalty ref={refLoyalty}></ShopSettingLoyalty>
            case 'bankAccount':
                return <BankAccountList></BankAccountList>
            case 'config-default-golf':
                return <ShopSettingConfigDefaulGolf ref={refConfigDefaulGolf}></ShopSettingConfigDefaulGolf>
        }
    };

    useEffect(() => {

    }, []);

    function onSaveClick() {

        switch (componentName) {
            case "generalInfo":
                refGeneralInfo.current?.saveData();
                break;
            case 'info':
                refInfo.current?.saveData();
                break;
            case 'invoice':
                refInvoice.current?.saveData();
                break;
            case 'loyalty':
                refLoyalty.current?.saveData();
                break;
            case 'connect':
                refConnect.current?.saveData();
                break;
            case 'config-default-golf':
                refConfigDefaulGolf.current?.saveData();
                break;
        }
    }

    const topActions: IActionBtn[] = [
        {
            title: 'save',
            content: <>
                <Button type='primary' onClick={() => {
                    onSaveClick()
                }}>
                    <SaveOutlined></SaveOutlined>
                    {t('actionBtn.save')}
                </Button>
            </>,
        }];
    return (
        <div>
            <HotkeysProvider initiallyActiveScopes={[HotKeyScope.crudPageBase]}>
                <PageTopTitleAndAction>
                    <TopAction topActions={topActions} />
                </PageTopTitleAndAction>
                <Card title={
                    <Menu
                        selectedKeys={[componentName ?? '']}
                        defaultOpenKeys={[componentName ?? '']}
                        mode="horizontal" items={getItems()} />}
                >
                    {renderComponent(componentName)}
                </Card>
            </HotkeysProvider>

        </div>
    );
};

export default ShopSetting;


