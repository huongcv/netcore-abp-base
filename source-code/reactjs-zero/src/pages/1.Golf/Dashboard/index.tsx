import React from "react";
import {Button, Col, Row, Typography} from "antd";
import {CalendarOutlined, CheckCircleOutlined, DollarCircleOutlined, UserOutlined,} from "@ant-design/icons";
import StatCard from "./StatCard";
import ScheduleBoard from "./ScheduleBoard";
import WeatherBox from "./WeatherBox";
import ResourceManager from "./ResourceManager";
import UpcomingTournaments from "./UpcomingTournaments";
import NotificationPanel from "./NotificationPanel";

const {Title} = Typography;

const DashboardGolfOverview = () => {
    return (
        <div style={{padding: 16}}>
            <Row justify="space-between" align="middle" style={{marginBottom: 16}}>
                <Title level={3}>Tổng quan sân golf</Title>
                <Button icon={<CalendarOutlined/>}>Xuất báo cáo</Button>
            </Row>

            <Row gutter={[16, 16]}>
                <Col span={6}><StatCard title="Người chơi hiện tại" value="42" icon={<UserOutlined/>}
                                        note="Tỷ lệ lấp đầy: 65%"/></Col>
                <Col span={6}><StatCard title="Check-in hôm nay" value="156" icon={<CheckCircleOutlined/>}
                                        note="+12% so với hôm qua"/></Col>
                <Col span={6}><StatCard title="Doanh thu hôm nay" value="45.6M VND" icon={<DollarCircleOutlined/>}
                                        note="+8% so với hôm qua"/></Col>
                <Col span={6}><StatCard title="Đặt lịch mới" value="28" icon={<CalendarOutlined/>}
                                        note="Trong 24h qua"/></Col>
            </Row>

            <Row gutter={[16, 16]} style={{marginTop: 16}}>
                <Col span={16}><ScheduleBoard/></Col>
                <Col span={8}><WeatherBox/></Col>
            </Row>

            <Row gutter={[16, 16]} style={{marginTop: 16}}>
                <Col span={8}><ResourceManager/></Col>
                <Col span={8}><UpcomingTournaments/></Col>
                <Col span={8}><NotificationPanel/></Col>
            </Row>
        </div>
    );
};

export default DashboardGolfOverview;
