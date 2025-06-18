import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import * as React from "react";
import {useEffect} from "react";
import {Card} from "antd";
import './style-dashboard.scss';
import {observer} from "mobx-react-lite";
import {BillIcon} from "@ord-components/icon/BillIcon";
import {WarningIcon} from "@ord-components/icon/WarningExpiryIcon";

const WarningExpiryProductCard = () => {
    const {t} = useTranslation('dashboard');
    const {dashboard} = useStore();
    const {warningData: warningData} = dashboard;

    useEffect(() => {
        dashboard.getCountStatusProduct().then();
    }, []);

    return <>
        <Card className={'h-full'}>
            <div className={'header-card-dashboard'}>
                <div className={'container-card w-full'}>
                    <WarningIcon style={{fontSize: '56px'}}/>
                    <div className={'container-info flex-grow'}>
                        <p className={'title-card'}>{t('waringExpiryTitle')}</p>
                        <div className='flex justify-between w-full'>
                            <p className='flex flex-wrap items-baseline'>
                                <span className='content-card mr-2'>
                                    {warningData?.countOutOfStock}
                                </span> <span className='2xl:text-base text-sm'>sắp hết hàng</span>
                            </p>
                            <p className='flex flex-wrap items-baseline'>
                                <span className='content-card mr-2'>{warningData?.countWarningExpiry} </span>
                                <span className='2xl:text-base text-sm'>sắp hết hạn</span>
                            </p>
                            <p className='flex flex-wrap items-baseline'>
                                <span className='content-card mr-2'>{warningData?.countExpiried} </span>
                                <span className='2xl:text-base text-sm'>đã hết hạn</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    </>
}

export default observer(WarningExpiryProductCard);
