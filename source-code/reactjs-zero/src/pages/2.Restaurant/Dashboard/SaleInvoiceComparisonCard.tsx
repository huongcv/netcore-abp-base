import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import * as React from "react";
import {useEffect, useState} from "react";
import {SaleInvoiceComparisonDto} from "@api/index.defs";
import {DashboardService} from "@api/DashboardService";
import {Card, Spin, Tooltip} from "antd";
import './style-dashboard.scss'
import {BillIcon} from "@ord-components/icon/BillIcon";
import {ArrowDownOutlined, ArrowUpOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";


const SaleInvoiceComparisonCard = () => {
    const {t} = useTranslation('dashboard');
    const {dashboard} = useStore();
    const {saleInvoiceData: data} = dashboard;

    useEffect(() => {
        dashboard.getSaleInvoiceByDays().then();
    }, []);

    return <>
        {
            <Card className={'h-full'}>
                <div className={'header-card-dashboard'}>
                    <div className={'container-card'}>
                        <BillIcon></BillIcon>
                        <div className={'container-info'}>
                            <p className={'title-card'}>TỔNG SỐ ORDER</p>
                            <div className={'container-content text-14'}>
                                <p className={'content-card'}>{data?.currentDaySaleInvoice}</p>
                                <p className={'unit'}>Order</p>
                            </div>
                        </div>
                    </div>
                    {
                        (data?.currentDaySaleInvoice ?? 0) > (data?.lastDaySaleInvoice ?? 0) ? (
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
        }
    </>
}

export default observer(SaleInvoiceComparisonCard)
