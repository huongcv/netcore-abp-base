import React from "react";
import { Card, Typography } from "antd";
import { TrophyOutlined } from "@ant-design/icons";

const { Text } = Typography;

const UpcomingTournaments = () => {
    return (
        <Card title="Giải đấu sắp diễn ra">
            <div>
                <TrophyOutlined /> Giải Golf Mùa xuân 2025<br />
                <Text type="secondary">20/03/2025 - 25/03/2025</Text>
            </div>
            <div style={{ marginTop: 12 }}>
                <TrophyOutlined /> Giải Golf Doanh nhân<br />
                <Text type="secondary">01/04/2025 - 03/04/2025</Text>
            </div>
        </Card>
    );
};

export default UpcomingTournaments;
