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
        ngayci: '05/04/2025',
        ngayco: '05/04/2025',
        note: 'Dùng sau chơi golf',
        cost: '3,500,000 VND',
    },
    {
        key: '2',
        stt: 2,
        ngayci: '05/04/2025',
        ngayco: '05/04/2025',
        note: 'Dùng sau chơi golf',
        cost: '2,400,000 VND',
    },
];

const hotel = () => {
    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            width: 70,
        },
        {
            title: 'Ngày check-in',
            dataIndex: 'ngayci',
            key: 'ngayci',
        },
        {
            title: 'Ngày check-out',
            dataIndex: 'ngayco',
            key: 'ngayco',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
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
                                Khách sạn
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

export default hotel;
