import React from "react";
import { Table, Collapse, Typography, Dropdown, Menu } from "antd";
import arrowdown from './icons/Arrow_Down_Detail.svg';
import './style.scss';

const { Panel } = Collapse;
const { Title } = Typography;

const dataSource = [
    {
        key: '1',
        stt: 1,
        ngay: '05/04/2025',
        teetime: '07:30 AM',
        solo: '18',
        caddie: 'Caddie A',
        with: 'Trần Văn Minh',
        cost: '3,500,000 VND',
    },
    {
        key: '2',
        stt: 2,
        ngay: '05/04/2025',
        teetime: '07:30 AM',
        solo: '18',
        caddie: 'Caddie A',
        with: 'Trần Văn Minh',
        cost: '3,500,000 VND',
    },
    {
        key: '3',
        stt: 3,
        ngay: '05/04/2025',
        teetime: '07:30 AM',
        solo: '18',
        caddie: 'Caddie A',
        with: 'Trần Văn Minh',
        cost: '3,500,000 VND',
    },
];

const golf = () => {
    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            width: 70,
        },
        {
            title: 'Ngày',
            dataIndex: 'ngay',
            key: 'ngay',
        },
        {
            title: 'Tee time',
            dataIndex: 'teetime',
            key: 'teetime',
        },
        {
            title: 'Số lỗ',
            dataIndex: 'solo',
            key: 'solo',
        },
        {
            title: 'Caddie',
            dataIndex: 'caddie',
            key: 'caddie',
        },
        {
            title: 'Đi cùng',
            dataIndex: 'with',
            key: 'with',
        },
        {
            title: 'Chi phí',
            dataIndex: 'cost',
            key: 'cost',
        },
    ];

    return (
        <div className="bookinghistory">
            <Collapse
                defaultActiveKey={["1"]}
                bordered={false}
                expandIconPosition="left"
                expandIcon={({ isActive }) => (
                    <img
                        src={arrowdown}
                        alt="arrow"
                        className={`custom-collapse-icon ${isActive ? 'rotate' : ''}`}
                    />
                )}
            >
                <Panel
                    key="1"
                    header={
                        <div className="custom-header">
                            <Title level={4} style={{ margin: 0, color: "green" }}>
                                Golf
                            </Title>
                        </div>
                    }
                >
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                        size="small"
                    />
                </Panel>
            </Collapse>
        </div>
    );
};

export default golf;
