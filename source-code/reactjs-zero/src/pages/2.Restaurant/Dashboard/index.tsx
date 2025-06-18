import * as React from 'react';
import {Card, Col, Row} from "antd";
import {
    FileExcelOutlined,
    DownOutlined,
    PlusOutlined,
    EyeOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import RevenueComparisonCard from "@pages/2.Restaurant/Dashboard/RevenueComparisonCard";
import RevenueComparisonCardMonth from "@pages/2.Restaurant/Dashboard/RevenueComparisonCardMonth";
import RevenueInMonthChart from "@pages/2.Restaurant/Dashboard/RevenueInMonthChart";
import {ProductHotSaleCard} from "@pages/2.Restaurant/Dashboard/ProductHotSaleCard";
import './style-dashboard.scss';
import ListStatusProductInventory from "@pages/2.Restaurant/Dashboard/ListStatusProductInventory";
import {observer} from "mobx-react-lite";
import SaleInvoiceComparisonCard from "@pages/2.Restaurant/Dashboard/SaleInvoiceComparisonCard";
import RevenueByChanelCard from "@pages/2.Restaurant/Dashboard/RevenueByChanelCard";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";
import {OrderIcon} from "@ord-components/icon/OrderIcon";
import {BookIcon} from "@ord-components/icon/BookIcon";
import {PlusIcon} from "@ord-components/icon/PlusIcon";
import {RestaurantIcon} from "@ord-components/icon/RestaurantIcon";
import {Link} from "react-router-dom";


const Dashboard = () => {
    return <>
        <Row gutter={[16, 16]} className={'mt-3'} style={{alignItems: 'stretch'}}>
            <ColSpanResponsive span={8}>
                <SaleInvoiceComparisonCard/>
            </ColSpanResponsive>
            <ColSpanResponsive span={8}>
                <RevenueComparisonCard/>
            </ColSpanResponsive>
            <ColSpanResponsive span={8}>
                <RevenueComparisonCardMonth/>
            </ColSpanResponsive>
            <ColSpanResponsive span={16}>
                <RevenueByChanelCard/>
            </ColSpanResponsive>
            <ColSpanResponsive span={4}>
                <Card className="card-order-book" styles={{
                    body: {
                            minHeight: '305px',
                            maxHeight: '250px',
                            overflowY: 'auto',
                        }}}>
                    <OrderIcon/>
                    <span className="title">Gọi món</span>
                    <Link to="/restaurant/dashboard">
                        <PlusOutlined />
                    </Link>
                </Card>

            </ColSpanResponsive>
            <ColSpanResponsive span={4}>
                <Card className="card-order-book" styles={{
                    body: {
                        minHeight: '305px',
                        maxHeight: '250px',
                        overflowY: 'auto',
                    }}}>
                    <BookIcon/>
                    <span className="title">Đặt bàn</span>
                    <Link to="/restaurant/dashboard">
                        <PlusOutlined />
                    </Link>
                </Card>
            </ColSpanResponsive>
            <ColSpanResponsive span={24}>
                <Card>
                    <RevenueInMonthChart/>
                </Card>
            </ColSpanResponsive>
            <ColSpanResponsive span={10}>
                <ProductHotSaleCard/>
            </ColSpanResponsive>
            <ColSpanResponsive span={14}>
                <ListStatusProductInventory/>
            </ColSpanResponsive>
        </Row>

    </>;
}
export default observer(Dashboard);
