import React from 'react';
import { Table } from 'antd';

interface TaxTableRow {
    key: number;
    stt: number;
    nganhNghe: string;
    maChiTieu: string;
    gtgtDoanhThu: number;
    gtgtSoThue: number;
    tncnDoanhThu: number;
    tncnSoThue: number;
}

const columns = [
    {
        title: 'STT',
        dataIndex: 'stt',
        width: 60,
        align: 'center' as const,
    },
    {
        title: 'Nhóm ngành nghề',
        dataIndex: 'nganhNghe',
        width: 300,
        render: (text: string) => (
            <div style={{ whiteSpace: 'pre-line' }}>{text}</div>
        ),
    },
    {
        title: 'Mã chỉ tiêu',
        dataIndex: 'maChiTieu',
        width: 80,
        align: 'center' as const,
    },
    {
        title: 'Thuế GTGT',
        children: [
            {
                title: 'Doanh thu (a)',
                dataIndex: 'gtgtDoanhThu',
                width: 100,
                align: 'right' as const,
            },
            {
                title: 'Số thuế (b)',
                dataIndex: 'gtgtSoThue',
                width: 100,
                align: 'right' as const,
            },
        ],
    },
    {
        title: 'Thuế TNCN',
        children: [
            {
                title: 'Doanh thu (c)',
                dataIndex: 'tncnDoanhThu',
                width: 100,
                align: 'right' as const,
            },
            {
                title: 'Số thuế (d)',
                dataIndex: 'tncnSoThue',
                width: 100,
                align: 'right' as const,
            },
        ],
    },
];

const data: TaxTableRow[] = [
    {
        key: 1,
        stt: 1,
        nganhNghe: 'Phân phối, cung cấp hàng hóa\nTỷ lệ thuế GTGT 1%, thuế TNCN 0,5%',
        maChiTieu: '[28]',
        gtgtDoanhThu: 0,
        gtgtSoThue: 0,
        tncnDoanhThu: 0,
        tncnSoThue: 0,
    },
    {
        key: 2,
        stt: 2,
        nganhNghe: 'Dịch vụ, xây dựng không bao thầu nguyên vật liệu\nTỷ lệ thuế GTGT 5%, thuế TNCN 2%',
        maChiTieu: '[29]',
        gtgtDoanhThu: 0,
        gtgtSoThue: 0,
        tncnDoanhThu: 0,
        tncnSoThue: 0,
    },
    {
        key: 3,
        stt: 3,
        nganhNghe: 'Sản xuất, vận tải, dịch vụ có gắn với hàng hóa, xây dựng có bao thầu nguyên vật liệu\nTỷ lệ thuế GTGT 3%, thuế TNCN 1,5%',
        maChiTieu: '[30]',
        gtgtDoanhThu: 0,
        gtgtSoThue: 0,
        tncnDoanhThu: 0,
        tncnSoThue: 0,
    },
    {
        key: 4,
        stt: 4,
        nganhNghe: 'Hoạt động kinh doanh khác\nTỷ lệ thuế GTGT 2%, thuế TNCN 1%',
        maChiTieu: '[31]',
        gtgtDoanhThu: 0,
        gtgtSoThue: 0,
        tncnDoanhThu: 0,
        tncnSoThue: 0,
    },
];

const TaxTable: React.FC = () => {
    return (
        <Table<TaxTableRow>
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
            summary={() => (
                <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3}>
                        Tổng cộng:
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} align="right">0</Table.Summary.Cell>
                    <Table.Summary.Cell index={2} align="right">0</Table.Summary.Cell>
                    <Table.Summary.Cell index={3} align="right">0</Table.Summary.Cell>
                    <Table.Summary.Cell index={4} align="right">0</Table.Summary.Cell>
                </Table.Summary.Row>
            )}
        />
    );
};

export default TaxTable;
