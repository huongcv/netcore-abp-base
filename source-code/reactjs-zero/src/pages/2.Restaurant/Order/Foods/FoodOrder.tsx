import React, {memo, useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {Button, Col, Input, Row, Tooltip} from "antd";
import {IconlyLightSearch} from "@ord-components/icon/IconlyLightSearch";
import HorizontalScrollList from "@ord-components/common/scroll/HorizontalScroll";
import GridFoodOrder from "@pages/2.Restaurant/Order/Foods/GridFoodOrder";
import {OrderRestaurantService} from "@api/OrderRestaurantService";
import {useSelectProductPriceList} from "@ord-components/forms/select/selectDataSource/useSelectProductPriceList";
import {useStore} from "@ord-store/index";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {orderFilterStore} from "@ord-store/Restaurant/Order/OrderFilterStore";
import {observer} from "mobx-react-lite";

const FoodOrder = () => {
    const {t} = useTranslation('order');
    const [groups, setGroups] = useState<any[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const {sessionStore} = useStore();
    const priceListDataSource = useSelectProductPriceList();

    const changeGroup = (value: any) => {
        orderFilterStore.setProductGroupId(value.id);
    }

    const getGroups = async () => {
        const fetchGroups = await OrderRestaurantService.getProductGroup({
            body: {
                maxResultCount: 200,
                skipCount: 0
            }
        });

        if (fetchGroups.isSuccessful && !!fetchGroups.data?.items?.length) {
            setGroups(fetchGroups.data.items.map(x => ({
                id: x.productGroupId,
                title: x.productGroupName,
                desc: x.notes
            })))
        }
    }

    useEffect(() => {
        getGroups();
    }, []);

    const search = () => {
        orderFilterStore.setFilterFood(searchValue);
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            search();
        }
    };

    useEffect(() => {
        const {data} = priceListDataSource;
        const {shops, currentShopId} = sessionStore;
        if (data?.length) {
            const currentShop = shops.find(x => x.shopId === currentShopId);
            const defaultPriceList =
                data.find(item => item.data?.id === currentShop?.productPriceListMainId) ||
                data.find((item) => item.data?.isMain) || data[0];
            if (defaultPriceList?.value) {
                orderFilterStore.setPriceListId(+defaultPriceList?.value);
            }
        }

    }, [priceListDataSource.data]);

    // console.log('FoodOrder: ')
    return (
        <div className='table-list-order'>
            <div className='bg-white rounded-[6px] p-3 pb-1 mb-3'>
                <Row gutter={10} className='mb-3 items-center'>
                    <Col span={6} className='text-xl font-semibold text-[#163422]'>
                        {t('Thực đơn')}
                    </Col>
                    <Col span={4}>
                        <OrdSelect allowClear={false} value={orderFilterStore.priceListId}
                                   onChange={(v) => orderFilterStore.setPriceListId(v)}
                                   datasource={priceListDataSource}/>
                    </Col>
                    <Col span={14} className='flex items-center'>
                        <Input onKeyDown={handleKeyDown} onChange={(e) => setSearchValue(e.target.value)}
                               className='flex-grow' allowClear placeholder="Nhập món ăn để tìm kiếm"
                               prefix={<IconlyLightSearch/>}/>
                        <Tooltip placement="top" title={t('Tìm kiếm ')}>
                            <Button className='!w-12 h-10 rounded-[6px] ml-2'
                                    icon={<IconlyLightSearch width={22}/>}
                                    onClick={search}>
                            </Button>
                        </Tooltip>
                    </Col>
                </Row>

                <div className='mb-2'>
                    <HorizontalScrollList initialActiveId={0} data={groups} onChange={changeGroup}/>
                </div>
            </div>
            <div className='bg-white rounded-[6px] p-3'>
                <GridFoodOrder/>
            </div>
        </div>
    );
};

export default memo(observer(FoodOrder));