import React from "react";
import { Card, Tag } from "antd";
import { WarningOutlined } from "@ant-design/icons";

const NotificationPanel = () => {
    return (
        <Card title="Thông báo">
            <div>
                <Tag color="red">
                    Sân 3 đang được bảo trì (06:00 - 08:00)
                </Tag>
            </div>
            <div style={{ marginTop: 8 }}>
                <Tag color="orange">Kiểm tra thiết bị tại sân tập vào 15:00</Tag>
            </div>
            <div style={{ marginTop: 8 }}>
                <Tag color="blue">Cập nhật phần mềm vào tối nay 22:00</Tag>
            </div>
        </Card>
    );
};

export default NotificationPanel;
