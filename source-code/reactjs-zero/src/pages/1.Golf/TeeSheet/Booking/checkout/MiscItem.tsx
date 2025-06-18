import React, {useEffect, useState} from 'react';
import {Button, GetProp, Input, InputNumber, TableColumnsType, TableProps, TransferProps} from 'antd';
import {Table, Transfer} from 'antd';
import {InfoPrivateInvoiceSimple, ReturnItemInputDto} from "@api/index.defs";
import FormItem from "antd/es/form/FormItem";
import './MiscItem.scss';

type TransferItem = GetProp<TransferProps, 'dataSource'>[number];
type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];

interface DataType extends ReturnItemInputDto {
    key: string;
}

interface TableTransferProps extends TransferProps<TransferItem> {
    dataSource: DataType[];
    leftColumns: TableColumnsType<DataType>;
    rightColumns: TableColumnsType<DataType>;
}

// Customize Table Transfer
const TableTransfer: React.FC<TableTransferProps> = (props) => {
    const {leftColumns, rightColumns, ...restProps} = props;
    return (
        <Transfer
            className='tran-misc-item'
            titles={['Đồ đã thuê', 'Đồ trả']}
            style={{
                width: '100%',
                flexDirection: 'column'
            }
            } {...restProps}
        >
            {({
                  direction,
                  filteredItems,
                  onItemSelect,
                  onItemSelectAll,
                  selectedKeys: listSelectedKeys,
                  disabled: listDisabled,
              }) => {
                const columns = direction === 'left' ? leftColumns : rightColumns;
                const rowSelection: TableRowSelection<TransferItem> = {
                    getCheckboxProps: () => ({disabled: listDisabled}),
                    onChange(selectedRowKeys) {
                        onItemSelectAll(selectedRowKeys, 'replace');
                    },
                    selectedRowKeys: listSelectedKeys,
                };

                return (
                    <Table
                        // title={() => {
                        //     return direction === 'left' ? 'Đồ đã thuê' : 'Đồ trả'
                        // }}
                        rowSelection={rowSelection}
                        columns={columns}
                        scroll={{y: 60}}
                        dataSource={filteredItems}
                        pagination={false}
                        size="small"
                        style={{
                            pointerEvents: listDisabled ? 'none' : undefined,
                        }}
                        onRow={({key, disabled: itemDisabled}) => ({
                            onClick: () => {
                                if (itemDisabled || listDisabled) {
                                    return;
                                }
                                onItemSelect(key, !listSelectedKeys.includes(key));
                            },
                        })}
                    />
                );
            }}
        </Transfer>
    );
};


const columns: TableColumnsType<DataType> = [
    {
        dataIndex: 'productName',
        title: 'Dịch vụ',
    },
    {
        dataIndex: 'qty',
        align: 'right',
        title: 'Số lượng đã thuê',
    },

];

const rightColumns: TableColumnsType<DataType> = [
    {
        dataIndex: 'productName',
        title: 'productName',
    },
    {
        dataIndex: 'qtyReturn',
        title: 'SL trả',
        align:'center',
        render: (text, record, idx) => {
            return <div onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}>
                <FormItem noStyle hidden initialValue={record.productId} name={['listReturnItem', idx, 'productId']}>
                    <Input></Input>
                </FormItem>
                <FormItem initialValue={record.qty} name={['listReturnItem', idx, 'qtyReturn']}>
                    <InputNumber className="input-qty-misc-item"
                                 variant="borderless" min={0} max={record.qty}></InputNumber>
                </FormItem>
            </div>
        }
    },
    {
        dataIndex: 'qtyLoss',
        title: 'SL mất',
        align:'center',
        render: (text, record, idx) => {
            return <div onClick={(e) => {
                e.stopPropagation();
            }}>
                <FormItem initialValue={0} name={['listReturnItem', idx, 'qtyLoss']}>
                    <InputNumber className="input-qty-misc-item"
                                 variant="borderless" min={0} max={record.qty}></InputNumber>
                </FormItem>
            </div>
        }
    }
];


const MiscItem = (props: {
    dataSource: ReturnItemInputDto[],
    value: number[],
    onChange: (value: number[]) => void,
}) => {
    const [dataSource, setDatasource] = useState<DataType[]>([])
    const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([]);
    const [disabled, setDisabled] = useState(false);

    const onChange: TableTransferProps['onChange'] = (nextTargetKeys) => {
        setTargetKeys(nextTargetKeys);
        props.onChange(nextTargetKeys as number[]);
        console.log("nextTargetKeys", nextTargetKeys)
    };

    const toggleDisabled = (checked: boolean) => {
        setDisabled(checked);
    };
    useEffect(() => {
        const data = props.dataSource.map((item, index) => ({
                ...item,
                key: item.productId,
            } as DataType
        ));
        setDatasource(data);
    }, [props.dataSource]);
    useEffect(() => {
        setTargetKeys(props.value);
    }, [props.value]);

    return (
        <TableTransfer
            rowKey={f => f.productId}
            dataSource={dataSource}
            targetKeys={targetKeys}
            disabled={disabled}
            showSelectAll={true}
            onChange={onChange}
            leftColumns={columns}
            rightColumns={rightColumns}
        />
    );
};

export default MiscItem;
