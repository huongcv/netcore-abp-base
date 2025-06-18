import { SaveOutlined } from '@ant-design/icons';
import { EinvoiceService } from '@api/EinvoiceService';
import { MisaInvoiceTemplateData } from '@api/index.defs';
import ModalCloseBtn from '@ord-components/btn-action/ModalCloseBtn';
import tableUtil from '@ord-core/utils/table.util';
import {
    Button,
    Col,
    Input,
    Modal,
    Row,
    Space,
    Table,
} from 'antd';
import React, { useEffect, useState } from 'react';

interface Props {
    visible: boolean;
    dataItem?: MisaInvoiceTemplateData[];
    userName: string;
    password: string;
    taxCode: string;
    onClose: (result?: any) => void;
}

const MisaInvoiceTemplateModal: React.FC<Props> = ({
    visible,
    dataItem = [],
    userName,
    password,
    taxCode,
    onClose,
}) => {
const [dataList, setDataList] = useState<MisaInvoiceTemplateData[]>([]);
    const [filteredData, setFilteredData] = useState<MisaInvoiceTemplateData[]>([]);
    const [arrCheckbox, setArrCheckbox] = useState<MisaInvoiceTemplateData[]>([]);
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        if (!visible) {
            setArrCheckbox([]);
            setSearchKeyword('');
            return;
        }

        EinvoiceService.getMisaInvoiceTemplateList({
            body: {
                password,
                taxCode,
                userName,
            }
        }).then(res => {
            setDataList(res || []);
            setFilteredData(res || []);
        });

        setArrCheckbox(dataItem);
    }, [visible]);


    const save = () => {
        if (arrCheckbox.length === 0) {
            Modal.error({ content: 'Bạn cần chọn một mẫu hóa đơn.' });
            return;
        }

        onClose(arrCheckbox[0]);
    };

    const columns = tableUtil.getColumns([
        {
            title: 'Mẫu hóa đơn',
            dataIndex: 'ipTemplateID',
            render: (value: string) => (
                <a
                    style={{ color: '#3699ff', textDecoration: 'underline' }}
                    onClick={() => { }}
                >
                    {value}
                </a>
            ),
        },
        {
            title: 'Loại hóa đơn',
            dataIndex: 'invoiceType',
            align: 'right',
            width: 240,
        },
        {
            title: 'Ký hiệu hóa đơn',
            dataIndex: 'invSeries',
            align: 'right',
            width: 240,
        },
    ]);

    const rowSelection = {
        type: 'radio' as const,
        selectedRowKeys: arrCheckbox
            .map(i => i?.ipTemplateID)
            .filter((id): id is string => typeof id === 'string'),
        onChange: (selectedRowKeys: React.Key[], selectedRows: MisaInvoiceTemplateData[]) => {
            console.log('Selected row keys:', selectedRowKeys);
            console.log('Selected rows:', selectedRows);
            setArrCheckbox(selectedRows);
        },
    };

    const handleSearch = (value: string) => {
        setSearchKeyword(value); 
        if (value.trim() === '') {
            setFilteredData(dataList); 
            return;
        }

        const filtered = dataList.filter(item =>
            item.ipTemplateID?.toLowerCase().includes(value.toLowerCase()) ||
            item.invoiceType?.toString().toLowerCase().includes(value.toLowerCase()) ||
            item.invSeries?.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };



    return (
        <Modal
            open={visible}
            title="Danh sách mẫu hóa đơn"
            width={1200}
            footer={
                <Space wrap>
                    <ModalCloseBtn onClick={() => onClose()} />
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={save}
                    >
                        Lựa chọn
                    </Button>
                </Space>
            }
            onCancel={() => onClose()}
        >
            <Row gutter={16} className="mb-3">
                <Col span={8}>
                    <Input.Search
                        placeholder="Nhập từ khóa để tìm kiếm"
                        allowClear
                        enterButton
                        value={searchKeyword}
                        onChange={e => setSearchKeyword(e.target.value)}
                        onSearch={value => handleSearch(value)}
                    />
                </Col>
            </Row>

            <Table
                rowKey="ipTemplateID"
                columns={columns}
                dataSource={filteredData}
                bordered={true}
                className="margin-top-20"
                pagination={false}
                scroll={{ y: 400 }}
                rowSelection={rowSelection}
            />
        </Modal>
    );
};

export default MisaInvoiceTemplateModal;