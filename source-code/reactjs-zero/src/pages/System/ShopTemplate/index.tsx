import React from "react";
import OrdCrudPage, {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useStore} from "@ord-store/index";
import {Button, Checkbox, Col, Dropdown, Form, FormInstance, Input, MenuProps, Space, TableColumnsType} from "antd";
import {useTranslation} from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import TableUtil from "@ord-core/utils/table.util";
import {IsActivedColumn} from "@ord-components/table/columns/IsActivedColumn";
import {SearchFilterAndIsActived} from "@ord-components/forms/search/SearchFilterAndIsActived";
import {SearchIsActived} from "@ord-components/forms/search/SearchIsActived";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectIsActived} from "@ord-components/forms/select/selectDataSource/useSelectIsActived";
import {useSelectShopTypeEnum} from "@ord-components/forms/select/selectDataSource/useSelectShopTypeEnum";
import {useSelectShopTemplate} from "@ord-components/forms/select/selectDataSource/useSelectShopTemplate";
import {useSelectShopTemplateType} from "@ord-components/forms/select/selectDataSource/useSelectShopTemplateType";
import {ShopTemplateDto} from "@api/index.defs";
import {useNavigate} from "react-router";
import {DownOutlined, ExportOutlined, PlusOutlined, UnorderedListOutlined} from "@ant-design/icons";
import {PERMISSION_APP} from "@ord-core/config/permissions";
import shopTemplateStore from "@ord-store/System/shopTemplateStore";
import {ExcelIcon} from "@ord-components/icon/ExcelIcon";


const ShopTemplate: React.FC = () => {
    const {shopTemplateStore: mainStore} = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {t: tEnum} = useTranslation('enum');

    const columns: TableColumnsType<any> = TableUtil.getColumns([
        {
            dataIndex: 'name',
            title: 'name',
            width: 300,
        },
        {
            title: 'type',
            dataIndex: 'strType',
            width: 200,
            render: (d, record: ShopTemplateDto) => {
                return tEnum(record.strType ?? "")
            }
        },
        {
            dataIndex: 'notes',
            title: 'notes',
            width: 400,
        },
        IsActivedColumn()
    ], {
        actions: [
            {
                title: 'view',
                onClick: (d: ShopTemplateDto) => {
                    navigate(`update/${d.idHash}/view`)
                }
            },
            {
                title: 'edit',
                onClick: (d: ShopTemplateDto) => {
                    // mainStore.openUpdateModal(d);
                    navigate(`update/${d.idHash}/update`)
                }
            },
            {
                title: 'export',
                content: (d: ShopTemplateDto)=>{
                    return <div onClick={()=>{
                        if (d.id)
                            mainStore.exportShopTemplateDetails(d.id, d.name??"");
                    }}>
                        <ExportOutlined></ExportOutlined>
                        <span className='ml-2'>{t('actionBtn.export')}</span>
                    </div>
                },
            },
            {
                title: 'remove',
                onClick: (d) => {
                    mainStore.openRemoveByHashId(d);
                }
            }
        ],
        ns: mainStore.getNamespaceLocale()
    });
    const navigate = useNavigate();
    const itemsReasonType: MenuProps['items'] = [
        {
            label: <a onClick={() => navigate("create/sample-sales-order")}>{t('actionBtn.addNewSampleSalesOrder')}</a>,
            key: '0'
        },
        {
            label: <a onClick={() => navigate("create/sample-receipt")}>{t('actionBtn.addNewSampleReceipt')}</a>,
            key: '1'
        },
    ];
    const topActions: IActionBtn[] = [
        {
            permission: 'System.ShopTemplate.Create',
            content: (
                <Dropdown menu={{items: itemsReasonType}} trigger={['hover']}>
                    <Button type='primary'>
                        <Space>
                            <PlusOutlined/>
                            {t('actionBtn.addNew')}
                            <DownOutlined/>
                        </Space>
                    </Button>
                </Dropdown>
            )
        },
    ];
    const SearchFilterAndIsActived = () => {
        return (<>
            <SearchIsActived/>
            <Col  {...useResponsiveSpan(6)}>
                <FloatLabel label={t('type')}>
                    <Form.Item name='type'>
                        <OrdSelect allowClear datasource={useSelectShopTemplateType()}/>
                    </Form.Item>
                </FloatLabel>

            </Col>
            <SearchFilterText span={14}/>
        </>);
    }

    return (
        <>
            <OrdCrudPage stored={mainStore}
                         topActions={topActions}
                         columns={columns}
                         searchForm={(f) => <SearchFilterAndIsActived/>}
            ></OrdCrudPage>
        </>)
        ;
}
export default (ShopTemplate);

