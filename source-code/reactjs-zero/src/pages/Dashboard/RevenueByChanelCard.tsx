import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import {useEffect, useState} from "react";
import {Button, Card, Dropdown, MenuProps} from "antd";
import {observer} from "mobx-react-lite";
import * as React from "react";
import {StoreIcon} from "@ord-components/icon/StoreIcon";
import {LazadaIcon} from "@ord-components/icon/LazadaIcon";
import {FacebookIcon} from "@ord-components/icon/FacebookIcon";
import {FilterIcon} from "@ord-components/icon/FilterIcon";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";
import Utils from "@ord-core/utils/utils";
import {DashboardService} from "@api/DashboardService";
import {CHANNEL_TYPE, RevenueDataByChanelDto} from "@api/index.defs";
import {TikTokOutlined} from "@ant-design/icons";
import {ShoppeIcon} from "@ord-components/icon/ShoppeIcon";
import {SendoIcon} from "@ord-components/icon/SendoIcon";
import {currencyDefault} from "@ord-core/AppConst";
import {useSelectTimeUnitFilter} from "@ord-components/forms/select/selectDataSource/useSelectTimeUnitFilter";

export const ALL_CHANNEL_TYPES: { type: CHANNEL_TYPE; defaultName: string; defaultGroup: string }[] = [
    {type: 0, defaultName: 'channelType.Direct.Sales', defaultGroup: 'directSale'},
    {type: 1, defaultName: 'channelType.Lazada', defaultGroup: 'eCommerce'},
    {type: 2, defaultName: 'channelType.Sendo', defaultGroup: 'eCommerce'},
    {type: 3, defaultName: 'channelType.Shopee', defaultGroup: 'eCommerce'},
    {type: 101, defaultName: 'channelType.Facebook', defaultGroup: 'socialMedia'},
    {type: 102, defaultName: 'channelType.Tiktok', defaultGroup: 'socialMedia'},
    {type: 201, defaultName: 'channelType.Website', defaultGroup: 'websiteAndOther'},
    {type: 999, defaultName: 'channelType.Other', defaultGroup: 'websiteAndOther'},
];

enum TimeUnitFilterEnum {
    CurrentDay = 1,
    ThisWeek = 2,
    ThisMonth = 3,
    LastMonth = 4,
    ThirtyDayRecent = 5,
}

const RevenueByChanelCard = () => {
    const {t} = useTranslation('dashboard');
    const {t: tEnum} = useTranslation('enum');
    const {dashboard} = useStore();
    const {revenueChanelData: data} = dashboard;
    const {revenueChanelGroupData: dataGroup} = dashboard;
    const [strFilter, setStrFilter] = useState<string>('');

    const formatterNumber = Utils.formatterNumber;

    const segmentedOnChange = async (value: TimeUnitFilterEnum) => {
        try {
            await dashboard.getRevenueByChanel(
                {
                    timeUnitFilter: value
                }
            ).then();
            await dashboard.getRevenueByChanelGroup(
                {
                    timeUnitFilter: value
                }
            ).then();
        } catch (error) {

        }
    }

    const items: MenuProps['items'] = useSelectTimeUnitFilter().data.map(x => {
        return {
            key: x.value,
            label: x.label
        }
    }) as [];

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        segmentedOnChange(e.key as unknown as number).then();
        setStrFilter(tEnum(`TimeUnitFilterEnum.${e.key}`));
    };
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
    useEffect(() => {
        segmentedOnChange(TimeUnitFilterEnum.ThisMonth).then();
        setStrFilter(tEnum(`TimeUnitFilterEnum.ThisMonth`));
    }, []);
    const ShowChannelIcon = (prop: { type?: CHANNEL_TYPE }) => {
        switch (prop.type) {
            case 0: {
                return <StoreIcon/>
            }
            // sàn tmđt
            case 1: {
                return <LazadaIcon/>
            }
            case 2: {
                return <SendoIcon/>
            }
            case 3: {
                return <ShoppeIcon/>
            }

            // mạng xã hội
            case 101: {
                return <FacebookIcon/>
            }
            case 102: {
                return <TikTokOutlined/>
            }

            // website
            case 201: {
                return <StoreIcon/>
            }
            case 999: {
                return <StoreIcon/>
            }
            default: {
                return <StoreIcon/>
            }
        }
    }

    const ShowChannelName = (prop: { type?: CHANNEL_TYPE }) => {
        let _channelName = ''
        let _channelGroupName = ''

        // Vui lòng thêm vào đây để hiển thị các kênh bán hàng trên thống kê
        switch (prop.type) {
            case 0: {
                _channelName = tEnum('channelType.Direct.Sales')
                _channelGroupName = t('directSale')
                const Icon = () => {
                    return <StoreIcon/>
                }
                break;
            }
            // sàn tmđt
            case 1: {
                _channelName = tEnum('channelType.Lazada')
                _channelGroupName = t('eCommerce')
                break;
            }
            case 2: {
                _channelName = tEnum('channelType.Sendo')
                _channelGroupName = t('eCommerce')
                break;
            }
            case 3: {
                _channelName = tEnum('channelType.Shopee')
                _channelGroupName = t('eCommerce')
                break;
            }

            // mạng xã hội
            case 101: {
                _channelName = tEnum('channelType.Facebook')
                _channelGroupName = t('socialMedia')
                break;
            }
            case 102: {
                _channelName = tEnum('channelType.Tiktok')
                _channelGroupName = t('socialMedia')
                break;
            }

            // website
            case 201: {
                _channelName = tEnum('channelType.Website')
                _channelGroupName = t('websiteAndOther')
                break;
            }
            case 999: {
                _channelName = tEnum('channelType.Other')
                _channelGroupName = t('websiteAndOther')
                break;
            }
        }
        return <div className={'child-title w-2/5'}>
            <div className={'circle-icon'}><ShowChannelIcon type={prop.type}/></div>
            <div className={'child-title-content'}>
                <p className={'child-main-title'}>{_channelName}</p>
                <p className={'child-extra-title'}>{_channelGroupName}</p>
            </div>
        </div>
    }

    const getChannelData = (channelList: typeof ALL_CHANNEL_TYPES, apiData?: RevenueDataByChanelDto[]) => {
        return channelList.map((channel) => {
            const apiChannel = apiData?.find((d) => d.saleChannelTypeId === channel.type);
            return {
                ...channel,
                amount: apiChannel?.amount ?? 0,
                percent: apiChannel?.percent ?? 0,
                countInvoice: apiChannel?.countInvoice ?? '0',
            };
        });
    };


    return <>
        <ColSpanResponsive span={16}>
            <Card styles={{
                body: {
                    maxHeight: '250px',
                    overflowY: 'auto',
                }
            }} title={
                <p className={'title-card-default mt-4'}>{t('revenueChanelTitle')}</p>
            } extra={
                    <Dropdown menu={menuProps}>
                        <Button style={{background: '#F1F1F1'}}><FilterIcon/>
                            {strFilter}
                        </Button>
                    </Dropdown>
            } className={'h-full revenue-by-channel'}>
                <div className={'container-revenue-chanel w-full'}>
                    {getChannelData(ALL_CHANNEL_TYPES, data).map((channel, index) => (
                        <div className={'child-revenue-chanel'} key={index}>
                            <ShowChannelName type={channel.type}/>
                            <p className={'revenue-money'}>{formatterNumber(channel.amount, 0)} {currencyDefault}</p>
                            <div className={'percent-chanel-container'}>
                                <p className={'percent'}>{formatterNumber(channel.percent, 0)}%</p>
                            </div>
                        </div>
                    ))}
                </div>

            </Card>
        </ColSpanResponsive>
        <ColSpanResponsive span={8}>
            <div className={'container-extra-revenue'}>
                <div className={'extra-revenue-child w-full'}>
                    <div className={'extra-revenue-content'}>
                        <div className={'extra-sale-invoice'}>
                            <p className={'count-invoice'}>{dataGroup?.at(0)?.countInvoice}</p>
                            <p className={'unit-chanel'}>{t('bill')}</p>
                        </div>
                        <div className={'extra-sale-revenue'}>
                            <p className={'title-extra-sale-revenue'}>{t(dataGroup?.at(0)?.channelGroupName ?? "")}</p>
                            <p>Doanh thu <span
                                className={'title-extra-sale-revenue'}> {formatterNumber(dataGroup?.at(0)?.amount, 0)}</span> {currencyDefault}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={'extra-revenue-child w-full'}>
                    <div className={'extra-revenue-content'}>
                        <div className={'extra-sale-invoice'}>
                            <p className={'count-invoice'}>{dataGroup?.at(1)?.countInvoice}</p>
                            <p className={'unit-chanel'}>{t('bill')}</p>
                        </div>
                        <div className={'extra-sale-revenue'}>
                            <p className={'title-extra-sale-revenue'}>{t(dataGroup?.at(1)?.channelGroupName ?? "")}</p>
                            <p>Doanh thu <span
                                className={'title-extra-sale-revenue'}> {formatterNumber(dataGroup?.at(1)?.amount, 0)}</span> {currencyDefault}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={'extra-revenue-child w-full'}>
                    <div className={'extra-revenue-content'}>
                        <div className={'extra-sale-invoice'}>
                            <p className={'count-invoice'}>{dataGroup?.at(2)?.countInvoice}</p>
                            <p className={'unit-chanel'}>{t('bill')}</p>
                        </div>
                        <div className={'extra-sale-revenue'}>
                            <p className={'title-extra-sale-revenue'}>{t(dataGroup?.at(2)?.channelGroupName ?? "")}</p>
                            <p>Doanh thu <span
                                className={'title-extra-sale-revenue'}> {formatterNumber(dataGroup?.at(2)?.amount, 0)}</span> {currencyDefault}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={'extra-revenue-child w-full'}>
                    <div className={'extra-revenue-content'}>
                        <div className={'extra-sale-invoice'}>
                            <p className={'count-invoice'}>{dataGroup?.at(3)?.countInvoice}</p>
                            <p className={'unit-chanel'}>{t('bill')}</p>
                        </div>
                        <div className={'extra-sale-revenue'}>
                            <p className={'title-extra-sale-revenue'}>{t(dataGroup?.at(3)?.channelGroupName ?? "")}</p>
                            <p>Doanh thu <span
                                className={'title-extra-sale-revenue'}> {formatterNumber(dataGroup?.at(3)?.amount, 0)}</span> {currencyDefault}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ColSpanResponsive>
    </>
}

export default observer(RevenueByChanelCard)
