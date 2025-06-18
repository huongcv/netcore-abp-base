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
        tabnum: 'B15',
        moned: 'Bò lúc lắc, Nước cam',
        note: 'Dùng sau chơi golf',
        cost: '850,000 VND',
    },
    {
        key: '2',
        stt: 2,
        ngay: '05/04/2025',
        tabnum: 'B12',
        moned: 'Sushi, Rượu vang',
        note: 'Tiếp khách',
        cost: '2,400,000 VND',
    },

];

const restaurant = () => {
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
            title: 'Bàn số',
            dataIndex: 'tabnum',
            key: 'tabnum',
        },
        {
            title: 'Món đã gọi',
            dataIndex: 'moned',
            key: 'moned',
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
                                Nhà hàng
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

export default restaurant;
