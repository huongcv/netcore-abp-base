import { ColumnsType } from 'antd/es/table';
import { Table } from 'antd/lib';

interface TtdbRow {
    stt: number;
    hangHoa: string;
    maChiTieu: string;
    donViTinh: string;
    doanhThu: number;
    thueSuat: number;
    soThue: number;
}

export const ttdbColumns: ColumnsType<TtdbRow> = [
    {
        title: 'STT',
        dataIndex: 'stt',
        width: 60,
        align: 'center',
    },
    {
        title: 'Hàng hoá, dịch vụ chịu thuế TTĐB',
        dataIndex: 'hangHoa',
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
        title: 'Doanh thu tính thuế TTĐB (5)',
        dataIndex: 'doanhThu',
        width: 150,
        align: 'right',
    },
    {
        title: 'Thuế suất (6)',
        dataIndex: 'thueSuat',
        width: 100,
        align: 'right',
    },
    {
        title: 'Số thuế (7) = (5)*(6)',
        dataIndex: 'soThue',
        width: 150,
        align: 'right',
    },
];

const TtdbTable: React.FC = () => {
    return (
        <Table<TtdbRow>
            columns={ttdbColumns}
            pagination={false}
            bordered
           
        />
    );
};

export default TtdbTable;
