import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import {useEffect} from "react";
import {Card, Tooltip} from "antd";
import {ArrowDownOutlined, ArrowUpOutlined} from "@ant-design/icons";
import * as React from "react";
import {observer} from "mobx-react-lite";
import {CustomerIcon} from "@ord-components/icon/CustomerIcon";

const CustomerCountCard = () => {
    const {t} = useTranslation('dashboard');
    const {dashboard} = useStore();
    const {customerData: data} = dashboard;

    useEffect(() => {
        dashboard.getCustomerByDays().then();
    }, []);

    return <>
        <Card className={'h-full'}>
            <div className={'header-card-dashboard'}>
                <div className={'container-card'}>
                    <CustomerIcon></CustomerIcon>
                    <div className={'container-info'}>
                        <p className={'title-card'}>{t('customerTodayTitle')}</p>
                        <div className={'container-content text-14'}>
                            <p className={'content-card'}>{data?.currentDayCustomer}</p>
                            <p className={'unit'}>{t('customer')}</p>
                        </div>
                    </div>
                </div>
                {
                    (data?.currentDayCustomer ?? 0) > (data?.lastDayCustomer ?? 0) ? (
                        <Tooltip className={'percent-container green-text text-16'}
                                 title={`${t('increase')} ${data?.percentWithLastDay}% ${t('comparison')}`}
                        >
                            <ArrowUpOutlined/>
                            <p>{data?.percentWithLastDay}% </p>
                        </Tooltip>
                    ) : <Tooltip className={'percent-container red-text text-16'}
                                 title={`${t('decrease')} ${data?.percentWithLastDay}% ${t('comparison')}`}
                    >
                        <ArrowDownOutlined/>
                        <p>{data?.percentWithLastDay}% </p>
                    </Tooltip>
                }

            </div>

        </Card>
    </>
}

export default observer(CustomerCountCard)
