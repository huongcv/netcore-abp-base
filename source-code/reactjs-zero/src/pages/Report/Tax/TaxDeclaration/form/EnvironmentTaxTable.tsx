import React from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

export interface EnvironmentTaxRow {
    stt: number;
    taiNguyen: string;
    maChiTieu: string;
    donViTinh: string;
    sanLuong: number;
    giaTinhThue: number;
    thueSuat: number;
    soThue: number;
}

const columns: ColumnsType<EnvironmentTaxRow> = [
    {
        title: 'STT',
        dataIndex: 'stt',
        width: 60,
        align: 'center',
    },
    {
        title: 'Tài nguyên, hàng hoá, sản phẩm',
        dataIndex: 'taiNguyen',
        width: 300,
    },
    {
        title: 'Mã chỉ tiêu',
        dataIndex: 'maChiTieu',
        width: 80,
        align: 'center',
    },
    {
        title: 'Đơn vị tính',
        dataIndex: 'donViTinh',
        width: 100,
        align: 'center',
    },
    {
        title: 'Sản lượng/ Số lượng (5)',
        dataIndex: 'sanLuong',
        width: 150,
        align: 'right',
    },
    {
        title: 'Giá tính thuế tài nguyên/ mức thuế hoặc phí BVMT (6)',
        dataIndex: 'giaTinhThue',
        width: 200,
        align: 'right',
    },
    {
        title: 'Thuế suất (7)',
        dataIndex: 'thueSuat',
        width: 100,
        align: 'right',
    },
    {
        title: 'Số thuế (8) = (5)*(6)*(7)',
        dataIndex: 'soThue',
        width: 150,
        align: 'right',
    },
];

const data: EnvironmentTaxRow[] = [
    {
        stt: 1,
        taiNguyen: 'Khai thuế tài nguyên',
        maChiTieu: '[34]',
        donViTinh: '',
        sanLuong: 0,
        giaTinhThue: 0,
        thueSuat: 0,
        soThue: 0,
    },
    {
        stt: 2,
        taiNguyen: 'Khai thuế bảo vệ môi trường',
        maChiTieu: '[35]',
        donViTinh: '',
        sanLuong: 0,
        giaTinhThue: 0,
        thueSuat: 0,
        soThue: 0,
    },
    {
        stt: 3,
        taiNguyen: 'Khai phí bảo vệ môi trường',
        maChiTieu: '[36]',
        donViTinh: '',
        sanLuong: 0,
        giaTinhThue: 0,
        thueSuat: 0,
        soThue: 0,
    },
];

const EnvironmentTaxTable: React.FC = () => {
    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
            rowKey="stt"
        />
    );
};

export default EnvironmentTaxTable;