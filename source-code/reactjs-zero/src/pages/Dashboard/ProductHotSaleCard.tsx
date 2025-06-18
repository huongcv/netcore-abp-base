import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import * as React from "react";
import {useEffect, useState} from "react";
import {ProductHotSaleDto, TimeUnitFilterEnum} from "@api/index.defs";
import {DashboardService} from "@api/DashboardService";
import {Badge, Button, Card, Col, Dropdown, Empty, MenuProps, Row, Spin, Tooltip} from "antd";
import {GetFileUrl} from "@ord-core/service-proxies/axios.base";
import {NumericFormat} from "react-number-format";
import './style-dashboard.scss';
import {TopSaleIcon} from "@ord-components/icon/TopSaleIcon";
import {FilterOutlined, UserOutlined} from "@ant-design/icons";
import {FilterIcon} from "@ord-components/icon/FilterIcon";
import {useSelectTimeUnitFilter} from "@ord-components/forms/select/selectDataSource/useSelectTimeUnitFilter";

export const ProductHotSaleCard = () => {
    const {t} = useTranslation('dashboard');
    const {dashboard: mainStore} = useStore();
    const [data, setData] = useState<ProductHotSaleDto[]>();
    const [loading, setLoading] = useState(true);
    const [strFilter, setStrFilter] = useState<string>('');
    const {t: tEnum} = useTranslation('enum');

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        segmentedOnChange(e.key as unknown as TimeUnitFilterEnum).then();
        setStrFilter(tEnum(`TimeUnitFilterEnum.${e.key}`));
    };

    const segmentedOnChange = async (value: TimeUnitFilterEnum) => {
        try {
            const response = await DashboardService.getListTopProductsHotSale({
                timeUnitFilter: value,
                limit: 5
            });
            setData(response.data);
        } catch (error) {

        } finally {
            setLoading(false);
        }
    }

    const items: MenuProps['items'] = useSelectTimeUnitFilter().data.filter(x=> x.value != 4).map(x => {
        return {
            key: x.value,
            label: x.label
        }
    }) as [];
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    useEffect(() => {
        segmentedOnChange(3).then();
        setStrFilter(tEnum(`TimeUnitFilterEnum.3`));
    }, []);

    return <>
        <Card title={
            <p className={'title-card-default mt-4'}>{t('titleProductHotSale')}</p>
        } extra={
            <Dropdown menu={menuProps}>
                <Button style={{background: '#F1F1F1'}}><FilterIcon/> {strFilter}</Button>
            </Dropdown>
        } className={'h-full'}>
            {
                loading ? (<div className={'w-full flex justify-center'}><Spin></Spin></div>) :
                    <>{data?.length ?
                        data?.map((item: ProductHotSaleDto, index: number) => (
                            <div className={'mb-2 flex'}
                                 style={{justifyContent: "space-between", alignItems: "center", fontSize: 16}}>
                                <div className={'flex w-2/3'} style={{alignItems: "center"}}>
                                    <img src={item.imageUrl ? GetFileUrl(item.imageUrl) : '/images/no-img.png'}
                                         className={index === 0 ? 'h-16 w-16 card-img-top p-1' : 'h-16 w-16 card-img p-2'}
                                         alt="No image"/>
                                    <div className={'px-3 w-full'}>
                                        <Tooltip title={`${item.productName} - ${item.productCode}`}>
                                            <p className={'title-card-ellipsis text-16'}>{item.productName} - {item.productCode}</p>
                                        </Tooltip>
                                        <p className={'text-16'}>{item.productCount} {t('sell')}</p>
                                    </div>
                                </div>
                                {
                                    index === 0 ? <TopSaleIcon></TopSaleIcon> : <></>
                                }
                            </div>
                        )) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                    }</>
            }
        </Card>
    </>
}
