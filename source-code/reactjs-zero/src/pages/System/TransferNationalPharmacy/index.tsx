import {
    TransactionOutlined
} from "@ant-design/icons";
import { Card, Menu, MenuProps } from "antd";
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";

import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { TopAction } from "@ord-components/crud/TopAction";
import { HotKeyScope } from "@ord-core/AppConst";
import { HotkeysProvider, useHotkeys } from "react-hotkeys-hook";


import TransferNationalPharmacyDrug from './TransferNationalPharmacy_Drug';
import TransferNationalPharmacyTicket from './TransferNationalPharmacy_Ticket';

type ComType =  'nationalDrug' |  'nationalTicket';
type MenuItem = Required<MenuProps>['items'][number];
const TransferNationalPharmacy = () => {
    const {t} = useTranslation('transfer-national-pharmacy');
    const [componentName, setComponentName] = useState<ComType>('nationalTicket');


    useHotkeys('F8', (event) => {
        //onSaveClick();
        event.preventDefault();
    }, {scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true})
    const items: MenuItem[] = [
        {
            label: t('nationalDrug'),
            key: 'nationalDrug',
            icon: <TransactionOutlined/>,
            onClick: ($event) => {
                setComponentName($event.key as ComType)
            }
        },
        {
            label: t('nationalTicket'),
            key: 'nationalTicket',
            icon: <TransactionOutlined/>,
            onClick: ($event) => {
                setComponentName($event.key as ComType)
            }
        },

    ];

    const renderComponent = (name: ComType) => {
        switch (name) {           
            case 'nationalDrug': 
                return <TransferNationalPharmacyDrug ></TransferNationalPharmacyDrug>
             case 'nationalTicket': 
                return <TransferNationalPharmacyTicket ></TransferNationalPharmacyTicket>
        }
    };

    useEffect(() => {

    }, []);

  

    const topActions: IActionBtn[] = [
        ];
    return (
        <div>
            <HotkeysProvider initiallyActiveScopes={[HotKeyScope.crudPageBase]}>
                <PageTopTitleAndAction>
                    <TopAction topActions={topActions}/>
                </PageTopTitleAndAction>
                <Card title={
                    <Menu
                        selectedKeys={[componentName ?? '']}
                        defaultOpenKeys={[componentName ?? '']}
                        mode="horizontal" items={items}/>}
                >
                    {renderComponent(componentName)}
                </Card>
            </HotkeysProvider>

        </div>
    );
};

export default TransferNationalPharmacy;


