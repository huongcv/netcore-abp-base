import React from "react";
import { Card, Row, Col, Typography } from "antd";

const { Title, Text } = Typography;

const StatCard = ({ title, value, icon, note }) => (
    <Card>
        <Row align="middle" justify="space-between">
            <Col>{icon}</Col>
            <Col>
                <Title level={3}>{value}</Title>
                <Text>{title}</Text>
                {note && <div style={{ color: '#52c41a' }}>{note}</div>}
            </Col>
        </Row>
    </Card>
);

export default StatCard;