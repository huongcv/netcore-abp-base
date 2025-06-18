import React from "react";
import { Card, Progress } from "antd";

const ResourceManager = () => {
    return (
        <Card title="Quản lý tài nguyên">
            <div>Caddy (Khả dụng): <Progress percent={80} status="active" strokeColor="#52c41a" /></div>
            <div style={{ marginTop: 8 }}>Buggy (Khả dụng): <Progress percent={75} status="active" strokeColor="#faad14" /></div>
        </Card>
    );
};

export default ResourceManager;