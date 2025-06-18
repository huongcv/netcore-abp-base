import {useStore} from "@ord-store/index";
import {Badge, Form, Modal, Table, TableProps, Tabs} from "antd";
import {observer} from "mobx-react-lite";
import {useTranslation} from "react-i18next";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import React, {useEffect, useState} from "react";
import TableUtil from "@ord-core/utils/table.util";
import {ProductSearch} from "@pages/ProductManagement/Product/datatable/ProductSearch";
import {ProductSearchWithUnitDto, ShopTemplateDetailsDto} from "@api/index.defs";
import {ColumnType} from "antd/es/table/interface";
import {CheckOutlined, DeleteOutlined} from "@ant-design/icons";
import {FooterCrudModal} from "@ord-components/crud/FooterCrudModal";

const getProductColumns = () => {
    return [
        {
            dataIndex: 'productCode',
            title: 'code',
            width: 150,
        },
        {
            title: 'name',
            dataIndex: 'productName',
        },
        {
            title: 'unitName',
            dataIndex: 'unitName',
        }
    ] as ColumnType<ProductSearchWithUnitDto>[];
}

const ListSelected = () => {
    const {t} = useTranslation('stock');
    const {searchProductShopTplTableStore: productSearch} = useStore();
    const [form] = Form.useForm();
    const columns: ColumnType<ProductSearchWithUnitDto>[] = [
        ...getProductColumns(),
        {
            title: '',
            align: 'center',
            width: 80,
            render: (_, dto) => {
                return <a className={'text-red'} onClick={() => {
                    productSearch.remove(dto.productUnitId);
                }}> <DeleteOutlined></DeleteOutlined></a>
            }
        }

    ]
    return (<>
        <Table
            pagination={false}
            columns={TableUtil.translateTitleColumns(columns, 'product')}
            dataSource={productSearch.selectedRows.map((row, index) => ({
                key: index,
                ...row
            }))}
        />
    </>);
}

const SearchProductTableModal = (props: {
    onItemsSelected?: (items: ShopTemplateDetailsDto[]) => void,
}) => {
    const {t} = useTranslation('stock');
    const {searchProductShopTplTableStore: searchProductStore} = useStore();
    const [tabActiveKey, setTabActiveKey] = useState('1');
    const {isModalOpen} = searchProductStore;
    const columns = [
        ...getProductColumns()
    ];
    const rowSelection: TableProps<ShopTemplateDetailsDto>['rowSelection'] = {
        selectedRowKeys: searchProductStore.selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: ShopTemplateDetailsDto[]) => {
            searchProductStore.setSelectedRows(selectedRows);
        },
        getCheckboxProps: (record: ShopTemplateDetailsDto) => ({
            name: record.productUnitId
        }),
    };
    const handleCancel = () => {
        searchProductStore.handleCancel();
    }
    useEffect(() => {
        if (searchProductStore.isModalOpen) {
            setTabActiveKey('1');
        }
    }, [searchProductStore.isModalOpen]);
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
                       props.onItemsSelected(searchProductStore.selectedRows || []);
                   }
                   searchProductStore.handleCancel();
               }}/>}
               onCancel={handleCancel}>
            <div className={'stock-product-search-modal'}>
                <Tabs activeKey={tabActiveKey}
                      onChange={setTabActiveKey}
                      items={[{
                          key: '1',
                          label: t('productList'),
                          children: <>
                              <OrdCrudPage stored={searchProductStore}
                                           hiddenTopAction={true}
                                           columns={TableUtil.translateTitleColumns(columns, 'product')}
                                           searchForm={(f) => <ProductSearch/>}
                                           rowSelection={{type: 'checkbox', ...rowSelection}}
                                           tableRowKey={'productUnitId'}
                              ></OrdCrudPage>
                          </>
                      }, {
                          key: '2',
                          label: <>
                              {t('productListSelected')}
                              <Badge className={'ms-2'} count={searchProductStore.selectedRowKeys.length}></Badge>
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
