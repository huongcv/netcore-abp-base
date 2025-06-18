import React from 'react';
import {Button, Flex, Modal} from "antd";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import {observer} from "mobx-react-lite";
import {FooterCrudModal} from "@ord-components/crud/FooterCrudModal";
import {CheckOutlined} from "@ant-design/icons";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import TableUtil from "@ord-core/utils/table.util";
import {ColumnType} from "antd/es/table/interface";
import {ProductSearchWithUnitAndQtyDto, ShopTemplateWithProductUnitDto} from "@api/index.defs";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";

const SearchFromShopTemplate = (props: {
    onSelectedTpl: (items: ProductSearchWithUnitAndQtyDto[]) => void
}) => {
    const {t} = useTranslation('stock');
    const {t: tEnum} = useTranslation('enum');
    const {stockSearchProductFromShopTemplate: mainStore} = useStore()

    const handleCancel = () => {
        mainStore.handleCancel();
    }
    const columns: ColumnType<ShopTemplateWithProductUnitDto>[] = [
        {
            dataIndex: 'name',
            title: t('shopTemplateName'),
            width: 250,
        },
        {
            dataIndex: 'productName',
            title: t('productName'),
            render: (d, record: ShopTemplateWithProductUnitDto) => {

                return <>
                    <ul>
                        {record.products?.map(p => {
                            return <li key={p.productUnitId}>

                                <Flex justify="space-between" className="w-full gap-2">
                                    <span>
                                           {/*<Tag className={'ms-2'}></Tag>*/}
                                        {p.productName}
                                    </span>
                                    <span
                                        className="mb-[5px] border-b-[1px] border-dashed border-b-gray-300 flex-1"></span>
                                    <span>
                                        {p.qty} {p.unitName} = <PriceCell value={(p.price ?? 0) * (p.qty ?? 0)}/> đ
                                    </span>
                                </Flex>
                            </li>
                        })}
                    </ul>
                </>
            }
        },
        {
            dataIndex: 'action',
            title: 'action',
            width: 70,
            render: (d, record: ShopTemplateWithProductUnitDto) => {
                return <Button onClick={() => {
                    handleCancel();
                    props.onSelectedTpl(record?.products ?? []);
                }}>
                    <CheckOutlined></CheckOutlined>
                    {t('select')}
                </Button>
            }
        },
    ]
    return (
        <div>
            <Modal open={mainStore.isModalOpen}
                   closable={false}
                   maskClosable={false}
                   width={1200}
                   title={t('addFromShopTemplate')}
                   onClose={() => handleCancel}
                   footer={<FooterCrudModal
                       hiddenOk={true}
                       onCancel={handleCancel}
                       onOk={() => {
                           mainStore.handleCancel();
                       }}/>}
            >
                <OrdCrudPage stored={mainStore}
                             hiddenTopAction={true}
                             columns={TableUtil.translateTitleColumns(columns, 'product')}
                             searchForm={(f) => <>
                                 <SearchFilterText span={14}/>
                             </>}
                             tableRowKey={'id'}
                ></OrdCrudPage>
            </Modal>
        </div>
    );
};


export default observer(SearchFromShopTemplate);