import React, {useEffect, useState} from "react";
import {Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import {DashboardService} from "@api/DashboardService";
import {NumericFormat} from "react-number-format";
import {Empty, Spin} from "antd";
import {observer} from "mobx-react-lite";
import {currencyDefault} from "@ord-core/AppConst";


const RevenueInMonthChart = () => {
    const {t} = useTranslation('dashboard');
    const {dashboard} = useStore();
    const {revenueInMonth: data} = dashboard;
    useEffect( () => {
        dashboard.getDataRevenueInMonth().then();
    }, []);

    // @ts-ignore
    const CustomTooltip = ({active, payload, label}) => {
        if (active && payload && payload.length) {
            // @ts-ignore
            const dataPoint = data?.listRevenueDetail.find((item: { day: number; }) => item.day === label);
            const labelDay = dataPoint ? dataPoint.labelDay : label;
            return (
                <div className={'container-tooltip'}>
                    <p className={'text-14'}>{`${t('legendChart')} ${labelDay}`}</p>
                    <p className={'text-16'}>
                        <NumericFormat value={payload[0].value} displayType={'text'}
                                       style={{fontWeight: "700", color: "#121212"}} thousandSeparator={true}/> {currencyDefault}
                    </p>
                </div>
            );
        } return <div className={'container-tooltip'}></div>
    };


    return <>
        <p className={'title-card-default'}>{t('revenueTitle')}
            <span style={{color: "var(--main-color)"}}>
                <NumericFormat value={data?.revenueInMonth} displayType={'text'} thousandSeparator={true}></NumericFormat> {currencyDefault}
            </span>
        </p>
        {
                data?.listRevenueDetail?.length ?
                    <div className={'w-full h-80'}>
                    <ResponsiveContainer>
                        <AreaChart
                            data={data?.listRevenueDetail}
                        >
                            <defs>
                                <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="color-mix(in srgb, var(--main-color) 80%, white 50%)" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="color-mix(in srgb, var(--main-color) 80%, black 20%)" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="day" tickLine={false} stroke={'black'} fill={'black'}/>
                            <YAxis orientation="left" tick={false} type="number" yAxisId="left" stroke={'black'} fill={'black'}/>
                            <YAxis orientation="right" tick={false} type="number" yAxisId="right" stroke={'black'} fill={'black'}/>
                            <Tooltip
                                content={<CustomTooltip active={undefined} payload={undefined} label={undefined}/>}/>
                            <Area yAxisId="right" dataKey="revenueInDay" fillOpacity={0} strokeOpacity={0}/>
                            <Area yAxisId="left" dataKey="revenueInDay"
                                  stroke={'var(--main-color)'} r={4} fillOpacity={1} fill="url(#colorLine)"
                                  dot={{fill: "var(--main-color)"}}
                                  activeDot={{stroke: 'var(--main-color)', fill: 'white', strokeWidth: 2, r: 5}}/>

                        </AreaChart>
                    </ResponsiveContainer>
                </div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
    </>;
}
export default observer(RevenueInMonthChart);
