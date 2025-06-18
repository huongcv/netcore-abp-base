import * as React from 'react';
import {Card, Col, Row} from "antd";
import RevenueComparisonCard from "@pages/Dashboard/RevenueComparisonCard";
import RevenueInMonthChart from "@pages/Dashboard/RevenueInMonthChart";
import {ProductHotSaleCard} from "@pages/Dashboard/ProductHotSaleCard";
import './style-dashboard.scss';
import ListStatusProductInventory from "@pages/Dashboard/ListStatusProductInventory";
import {observer} from "mobx-react-lite";
import WarningExpiryProductCard from "@pages/Dashboard/WaringExpiryProductCard";
import SaleInvoiceComparisonCard from "@pages/Dashboard/SaleInvoiceComparisonCard";
import CustomerCountCard from "@pages/Dashboard/CustomerCountCard";
import RevenueByChanelCard from "@pages/Dashboard/RevenueByChanelCard";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";


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
                <WarningExpiryProductCard />
            </ColSpanResponsive>
            {/*<RevenueByChanelCard/>*/}
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
