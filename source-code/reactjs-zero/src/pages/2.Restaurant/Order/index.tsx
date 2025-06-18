import React, {Suspense, useEffect, useState} from 'react';
import {Col, Row, Segmented, Tabs, TabsProps} from "antd";
import MenuList from "@pages/2.Restaurant/Order/OrderViews/MenuList";
import TableOrder from "@pages/2.Restaurant/Order/Tables/TableOrder";
import FoodOrder from "@pages/2.Restaurant/Order/Foods/FoodOrder";
import OrderList from "@pages/2.Restaurant/Order/OrderViews/OrderList";

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Danh sách bàn',
        children: <Suspense fallback={<></>}>
            <TableOrder/>
        </Suspense>,
    },
    {
        key: '2',
        label: 'Thực đơn',
        children: <Suspense fallback={<></>}>
            <FoodOrder/>
        </Suspense>
    },
    {
        key: '3',
        label: 'Đơn hàng',
        children: <Suspense fallback={<></>}>
            <OrderList />
        </Suspense>
    },
];

const Index = () => {
    const [alignValue, setAlignValue] = React.useState<'1' | '2' | '3'>('1');
    const [activeKey, setActiveKey] = useState('1');

    useEffect(() => {
        setActiveKey(alignValue)
    }, [alignValue]);

    return (
        <div className='order-container p-4 bg-[#e5e7eb] min-h-screen'>
            <Row gutter={12}>
                <Col span={16}>
                    <Segmented
                        value={alignValue}
                        className='bg-[#DBDBDB] h-9 p-1 mb-3 text-black font-semibold text-base'
                        onChange={setAlignValue}
                        block
                        options={[
                            {
                                label: 'Danh sách bàn',
                                value: '1'
                            },
                            {
                                label: 'Thực đơn',
                                value: '2'
                            },
                            {
                                label: 'Đơn hàng',
                                value: '3'
                            },
                        ]}
                    />
                    <Tabs
                        activeKey={activeKey}
                        destroyInactiveTabPane={false}
                        items={items}
                        renderTabBar={() => null}
                    />
                </Col>
                <Col span={8}>
                    <MenuList/>
                </Col>
            </Row>
        </div>
    )
};

export default Index;