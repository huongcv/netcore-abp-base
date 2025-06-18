import React from "react";
import { Card, Row, Col, Button, Tag, Typography } from "antd";

const { Text } = Typography;

const ScheduleBoard = () => {
    return (
        <Card style={{ minHeight: 332 }}
            title="Lịch đặt sân"
            extra={
                <>
                    <Button type="link">Ngày</Button>
                    <Button type="primary" type="link">Tuần</Button>
                    <Button type="link">Tháng</Button>
                </>
            }
        >
            <Row>
                <Col span={6}><Text strong>Thời gian</Text></Col>
                <Col span={6}><Text strong>Sân 1</Text></Col>
                <Col span={6}><Text strong>Sân 2</Text></Col>
                <Col span={6}><Text strong>Sân 3</Text></Col>
            </Row>
            <Row style={{ marginTop: 8 }}>
                <Col span={6}>06:00</Col>
                <Col span={6}><Tag color="green">Đã đặt</Tag></Col>
                <Col span={6}><Tag>Trống</Tag></Col>
                <Col span={6}><Tag color="red">Bảo trì</Tag></Col>
            </Row>
        </Card>
    );
};

export default ScheduleBoard;