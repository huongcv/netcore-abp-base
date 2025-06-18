import React, {memo, useCallback, useEffect, useState} from 'react';
import {Button, Col, Input, Row, Tag, Tooltip} from "antd";
import HorizontalScrollList from "@ord-components/common/scroll/HorizontalScroll";
import {IconlyLightSearch} from "@ord-components/icon/IconlyLightSearch";
import {useTranslation} from "react-i18next";
import '../index.scss';
import {OrderRestaurantService} from "@api/OrderRestaurantService";
import {colorClassMap} from "@pages/2.Restaurant/Order/Utils/Util";
import GridCardTableOrder from "@pages/2.Restaurant/Order/Tables/GridCardTableOrder";
import {TableStatusCounterDto} from "@api/index.defs";
import {observer} from "mobx-react-lite";
import {orderFilterStore} from "@ord-store/Restaurant/Order/OrderFilterStore";

const TableOrder = () => {
    const {t} = useTranslation('order');
    const [statusList, setStatusList] = useState<TableStatusCounterDto[]>([]);
    const [searchValue, setSearchValue] = useState('');

    const getStatusList = async (search: string) => {
        const fetchData = await OrderRestaurantService.getTableStatusCounter({
            body: {
                filter: search
            }
        });

        if (fetchData.isSuccessful && !!fetchData?.data?.length) {
            setStatusList(fetchData.data)
        }
    }

    const changeArea = (value: TableStatusCounterDto) => {
        orderFilterStore.setAreaId(+(value!.id || 0));
        search();
    };

    const search = () => {
        orderFilterStore.setFilterTable(searchValue);
        orderFilterStore.setTimeStampTableFilter(new Date().getMilliseconds());
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            search();
        }
    };

    useEffect(() => {
        getStatusList(orderFilterStore.filterTable)
    }, [orderFilterStore.filterTable]);

    // console.log('TableOrder');

    const render = useCallback((item: TableStatusCounterDto, isActive: boolean) => {
        return <div
            className={`flex-none min-w-48 h-[62px] mr-[10px] rounded-[6px] cursor-pointer p-[6px_10px_55px] text-center text-base snap-start transition border-[2px] ${isActive ? 'border-[#22BA4F]' : 'border-[#E8E8E8]'} `}>
            <p className={`!font-medium`}> {item.areaName}</p>
            <div className='flex items-center justify-center'>
                {
                    item.tables?.map((table, index: number) => {
                        return <React.Fragment key={table.status}>
                            {
                                !!index && <> / </>
                            }
                            <Tooltip className='mx-1' title={table.statusName}
                                     key={table.status}>
                                <Tag className='!text-black border border-solid border-current '
                                     color={colorClassMap[table.status!] || '#ecebeb'}>{table.count} {t('bàn')}</Tag>
                            </Tooltip>
                        </React.Fragment>
                    })
                }
            </div>
        </div>
    }, []);

    return (
        <div className='table-list-order'>
            <div className='bg-white rounded-[6px] p-3 pb-1 mb-3'>
                <Row gutter={8} className='mb-2'>
                    <Col span={10} className='text-xl font-semibold text-[#163422]'>
                        {t('Danh sách bàn')}
                    </Col>
                    <Col span={14} className='flex items-center'>
                        <Input value={searchValue} onKeyDown={handleKeyDown}
                               onChange={(e) => {
                                   setSearchValue(e.target.value)
                               }}
                               className='flex-grow' allowClear
                               placeholder="Nhập mã, tên bàn để tìm kiếm"
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
                    <HorizontalScrollList initialActiveId={0} render={render} data={statusList} onChange={changeArea}/>
                </div>
            </div>
            <div className='bg-white rounded-[6px] p-3'>
                <GridCardTableOrder/>
            </div>
        </div>
    );
};

export default memo(observer(TableOrder));