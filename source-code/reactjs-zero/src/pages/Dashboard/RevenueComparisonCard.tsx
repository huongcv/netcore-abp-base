import {useStore} from "@ord-store/index";
import * as React from "react";
import {useEffect, useState} from "react";
import {RevenueComparisonDto} from "@api/index.defs";
import {Card, Spin, Tooltip} from "antd";
import {DashboardService} from "@api/DashboardService";
import {useTranslation} from "react-i18next";
import './style-dashboard.scss';
import {ArrowDownOutlined, ArrowUpOutlined} from "@ant-design/icons";
import {RevenueIcon} from "@ord-components/icon/RevenueIcon";
import {observer} from "mobx-react-lite";
import Utils from "@ord-core/utils/utils";
import {currencyDefault} from "@ord-core/AppConst";

const RevenueComparisonCard = () => {
    const {t} = useTranslation('dashboard');
    const {dashboard} = useStore();
    const {revenueData: data} = dashboard;

    const formatterNumber = Utils.formatterNumber;

    useEffect(() => {
        dashboard.getRevenueByDays().then();
    }, []);

    return <>
        <Card className={'h-full'}>
            <div className={'header-card-dashboard'}>
                <div className={'container-card'}>
                    <RevenueIcon></RevenueIcon>
                    <div className={'container-info'}>
                        <p className={'title-card'}>{t('revenueTodayTitle')}</p>
                        <div className={'container-content text-14'}>
                            <p className={'content-card'}>{formatterNumber(data?.currentDayRevenue, 0)}</p>
                            <p className={'unit'}>{currencyDefault}</p>
                        </div>
                    </div>
                </div>
                {
                    (data?.currentDayRevenue ?? 0) > (data?.lastDayRevenue ?? 0) ? (
                        <Tooltip className={'percent-container green-text text-16'}
                                 title={`${t('increase')} ${data?.percentWithLastDay}% ${t('comparison')}`}>
                            <ArrowUpOutlined/>
                            <p>{data?.percentWithLastDay}% </p>
                        </Tooltip>
                    ) : <Tooltip className={'percent-container red-text text-16'}
                                 title={`${t('decrease')} ${data?.percentWithLastDay}% ${t('comparison')}`}>
                        <ArrowDownOutlined/>
                        <p>{data?.percentWithLastDay}% </p>
                    </Tooltip>
                }

            </div>

        </Card>
    </>
}

export default observer(RevenueComparisonCard)
