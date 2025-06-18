import React from "react";
import { Card, Tag } from "antd";

const WeatherBox = () => {
    return (
        <>
            <Card title="Thời tiết">
                <div><strong>28°C</strong></div>
                <div>Nắng nhẹ</div>
                <div>Độ ẩm: 65%</div>
                <div>Gió: 12 km/h</div>
            </Card>

            <Card title="Tình trạng sân" style={{ marginTop: 16 }}>
                <div>Chất lượng cỏ: <Tag color="green">Tốt</Tag></div>
                <div>Độ ẩm sân: 70%</div>
            </Card>
        </>
    );
};

export default WeatherBox;