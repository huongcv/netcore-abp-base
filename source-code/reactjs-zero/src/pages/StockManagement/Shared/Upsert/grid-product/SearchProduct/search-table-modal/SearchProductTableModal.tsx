import {useStore} from "@ord-store/index";
import {Badge, Form, Input, Modal, Table, TableProps, Tabs, Tag} from "antd";
import {observer} from "mobx-react-lite";
import {useTranslation} from "react-i18next";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import React, {useEffect, useState} from "react";
import TableUtil from "@ord-core/utils/table.util";
import {ProductSearch} from "@pages/ProductManagement/Product/datatable/ProductSearch";
import {ProductTypeCell} from "@pages/ProductManagement/Product/datatable/ProductTypeCell";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {MOVE_TYPE, ProductSearchWithUnitDto} from "@api/index.defs";
import {ColumnType} from "antd/es/table/interface";
import {CheckOutlined, DeleteOutlined} from "@ant-design/icons";
import {FooterCrudModal} from "@ord-components/crud/FooterCrudModal";

export const getProductColumns = () => {
    return [
        {
            dataIndex: 'productCode',
            title: 'code',
            width: 150,
            render: (v, dto) => {
                return <>
                    {v} 
                </>;
            },
            
        },
        {
            title: 'name',
            dataIndex: 'productName',
            ellipsis: true,
            render: (value) => (
                <div className="max-w-4xl overflow-hidden text-ellipsis">
                    {value}
                </div>
            ),
            width: 200
        },
        {
            title: 'unitName',
            dataIndex: 'unitName',
            ellipsis: true,
            render: (value) => (
                <div className="max-w-4xl overflow-hidden text-ellipsis">
                    {value}
                </div>
            ),
            width: 200
        },
        {
            title: 'costPrice',
            dataIndex: 'costPrice',
            ellipsis: true,
            render: (v, dto) => (<>
                <PriceCell value={v}/>
            </>),
            width: 200
        },
        {
            dataIndex: 'price',
            title: 'ProductPrice',
            align: 'end',
            render: (v, dto) => (<>
                <PriceCell value={v}/>
            </>),
            width: 90,
        }
    ] as ColumnType<ProductSearchWithUnitDto>[];
}

const ListSelected = () => {
    const {t} = useTranslation('stock');
    const {stockSearchProductStore} = useStore();
    const [form] = Form.useForm();
    const columns: ColumnType<ProductSearchWithUnitDto>[] = [
        ...getProductColumns(),
        {
            title: '',
            align: 'center',
            width: 80,
            render: (_, dto) => {
                return <a className={'text-red'} onClick={() => {
                    stockSearchProductStore.remove(dto.productUnitId);
                }}> <DeleteOutlined></DeleteOutlined></a>
            }
        }

    ]

    useEffect(() => {
        stockSearchProductStore.extraParams = null;
    }, [])
    
    return (<>
        <Table
            pagination={false}
            columns={TableUtil.translateTitleColumns(columns, 'product')}
            dataSource={stockSearchProductStore.selectedRows.map((row, index) => ({
                key: index,
                ...row
            }))}
        />
    </>);
}

const SearchProductTableModal = (props: {
    moveType?: MOVE_TYPE
    onItemsSelected?: (items: ProductSearchWithUnitDto[]) => void
}) => {
    const {t} = useTranslation('stock');
    const {stockSearchProductStore} = useStore();
    const [tabActiveKey, setTabActiveKey] = useState('1');
    const {isModalOpen, extraParams} = stockSearchProductStore;

    const columns = [
        ...getProductColumns()
    ];
    const rowSelection: TableProps<ProductSearchWithUnitDto>['rowSelection'] = {
        selectedRowKeys: stockSearchProductStore.selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: ProductSearchWithUnitDto[]) => {
            stockSearchProductStore.setSelectedRows(selectedRows);
        },
        getCheckboxProps: (record: ProductSearchWithUnitDto) => ({
            name: record.productUnitId
        }),
    };
    const handleCancel = () => {
        stockSearchProductStore.handleCancel();
    }
    useEffect(() => {
        if (stockSearchProductStore.isModalOpen) {
            setTabActiveKey('1');
        }
    }, [stockSearchProductStore.isModalOpen]);
    return (<>
        <Modal title={t('searchProduct')}
               className={'ord-modal-tab'}
               style={{top: 10}}
               width={1300}
               open={isModalOpen}
               footer={<FooterCrudModal
                   okBtn={<><CheckOutlined className={'me-1'}/> {t('submitProductSelected')}</>}
                   onCancel={handleCancel} 
                   onOk={() => {
                   if (props.onItemsSelected) {
                       props.onItemsSelected(stockSearchProductStore.selectedRows || []);
                   }
                   stockSearchProductStore.handleCancel();
               }}/>}
               onCancel={handleCancel}>
            <div className={'stock-product-search-modal'}>
                <Tabs activeKey={tabActiveKey}
                      onChange={setTabActiveKey}
                      items={[{
                          key: '1',
                          label: t('productList'),
                          children: <>
                              <OrdCrudPage stored={stockSearchProductStore}
                                           initSearchFormData={
                                               {
                                                   moveType: props.moveType,
                                                   ...extraParams
                                               }
                                           }
                                           hiddenTopAction={true}
                                           columns={TableUtil.translateTitleColumns(columns, 'product')}
                                           searchForm={(f) => <>
                                               <ProductSearch/>
                                               <div hidden>
                                                   <Form.Item name={'moveType'}>
                                                       <Input></Input>
                                                   </Form.Item>
                                               </div>
                                           </>}
                                           rowSelection={{type: 'checkbox', ...rowSelection}}
                                           tableRowKey={'productUnitId'}
                              ></OrdCrudPage>
                          </>
                      }, {
                          key: '2',
                          label: <>
                              {t('productListSelected')}
                              <Badge className={'ms-2'} count={stockSearchProductStore.selectedRowKeys.length}></Badge>
                          </>,
                          children: <>
                              <ListSelected/>
                          </>
                      }]}></Tabs>
            </div>


        </Modal>


    </>);
}
export default observer(SearchProductTableModal);
