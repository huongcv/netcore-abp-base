import {useStore} from "@ord-store/index";
import {Avatar, Badge, Form, Input, Modal, Table, TableProps, Tabs, Tag} from "antd";
import {observer} from "mobx-react-lite";
import {useTranslation} from "react-i18next";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import React, {useEffect, useState} from "react";
import TableUtil from "@ord-core/utils/table.util";
import {ProductSearch} from "@pages/ProductManagement/Product/datatable/ProductSearch";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {MOVE_TYPE, ProductUnitViewDto} from "@api/index.defs";
import {ColumnType} from "antd/es/table/interface";
import {CheckOutlined, DeleteOutlined} from "@ant-design/icons";
import {FooterCrudModal} from "@ord-components/crud/FooterCrudModal";
import { useHotkeys } from "react-hotkeys-hook";
import {ImgFromFileId} from "@ord-components/common/img/ImgFromFileId";

export const getProductColumns = () => {
    return [
        {
            dataIndex: 'imageUrl',
            title: 'image',
            width: 80,
            align: 'center',
            render: (_) => <ImgFromFileId
                style={{width: '40px', height: '40px', borderRadius: '2px'}}
                preview={false} fileId={_}></ImgFromFileId>
        },
        {
            dataIndex: 'productCode',
            title: 'code',
            width: 100,
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
            dataIndex: 'price',
            title: 'ProductPrice',
            align: 'right',
            render: (v, dto) => <PriceCell value={v}/>,
            width: 150,
        },
        {
            title: 'inventoryQty',
            dataIndex: 'inventoryQty',
            render: (v, dto) => <PriceCell value={v}/>,
            width: 100,
            align: 'right',
        },
        {
            dataIndex: 'unitName',
            title: 'unitName',
            width: 150,
        },
    ] as ColumnType<ProductUnitViewDto>[];
}

const ListSelected = () => {
    const {StockSearchProductTableServerSideStore} = useStore();
    const columns: ColumnType<ProductUnitViewDto>[] = [
        ...getProductColumns(),
        {
            title: '',
            align: 'center',
            width: 30,
            render: (_, dto) => {
                return <a className={'text-red'} onClick={() => {
                    StockSearchProductTableServerSideStore.remove(dto.productUnitId);
                }}> <DeleteOutlined></DeleteOutlined></a>
            }
        }

    ]
    return (<>
        <Table
            pagination={false}
            columns={TableUtil.translateTitleColumns(columns, 'product')}
            dataSource={StockSearchProductTableServerSideStore.selectedRows.map((row, index) => ({
                key: index,
                ...row
            }))}
        />
    </>);
}

const SearchProductTableModalServerSide = (props: {
    moveType?: MOVE_TYPE
    onItemsSelected?: (items: ProductUnitViewDto[]) => void
}) => {
    const {t} = useTranslation('stock');
    const {StockSearchProductTableServerSideStore} = useStore();
    const [tabActiveKey, setTabActiveKey] = useState('1');
    const {isModalOpen} = StockSearchProductTableServerSideStore;
    const columns = [
        ...getProductColumns()
    ];
    const rowSelection: TableProps<ProductUnitViewDto>['rowSelection'] = {
        selectedRowKeys: StockSearchProductTableServerSideStore.selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: ProductUnitViewDto[]) => {
            StockSearchProductTableServerSideStore.setSelectedRows(selectedRows);
        },
        getCheckboxProps: (record: ProductUnitViewDto) => ({
            name: record.productUnitId
        }),
    };
    const handleCancel = () => {
        StockSearchProductTableServerSideStore.handleCancel();
    }
    useEffect(() => {
        if (StockSearchProductTableServerSideStore.isModalOpen) {
            setTabActiveKey('1');
        }
    }, [StockSearchProductTableServerSideStore.isModalOpen]);

    useHotkeys(
        "F10",
        (event) => {
          handleCancel();
          event.preventDefault();
        },
        {
          enableOnFormTags: true,
          enabled: StockSearchProductTableServerSideStore.isModalOpen,
        }
      );
    return (<>
        <Modal title={t('searchProduct')}
               className={'ord-modal-tab'}
               style={{top: 10}}
               width={1300}
               open={isModalOpen}
               footer={<FooterCrudModal
                   okBtn={<><CheckOutlined className={'me-1'}/> {t('submitProductSelected')}</>}
                   onCancel={handleCancel} onOk={() => {
                   if (props.onItemsSelected) {
                       props.onItemsSelected(StockSearchProductTableServerSideStore.selectedRows || []);
                   }
                   StockSearchProductTableServerSideStore.handleCancel();
               }}/>}
               onCancel={handleCancel}>
            <div className={'stock-product-search-modal'}>
                <Tabs activeKey={tabActiveKey}
                      onChange={setTabActiveKey}
                      items={[{
                          key: '1',
                          label: t('productList'),
                          children: <>
                              <OrdCrudPage stored={StockSearchProductTableServerSideStore}
                                           initSearchFormData={
                                               {
                                                   moveType: props.moveType
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
                              <Badge className={'ms-2'} count={StockSearchProductTableServerSideStore.selectedRowKeys.length}></Badge>
                          </>,
                          children: <>
                              <ListSelected/>
                          </>
                      }]}></Tabs>
            </div>


        </Modal>


    </>);
}
export default observer(SearchProductTableModalServerSide);
