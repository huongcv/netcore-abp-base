import React, {lazy} from "react";
import {useStore} from "@ord-store/index";
import {Button, Form, Input, Space, TableColumnsType} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import OrdCrudPage, {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {PageTopTitleAndAction} from "@ord-components/common/page/PageTopTitleAndAction";
import {TopAction} from "@ord-components/crud/TopAction";
import {PriceCell} from "@ord-components/table/cells/priceCell";

const LogApi = () => {
    const {LogApiInvoiceStore: mainStore, sessionStore} = useStore();
    const navigate = useNavigate();
    const {t}= useTranslation('logApi')
    const columns: TableColumnsType<any> = TableUtil.getColumns([


        {
            title: 'requestValue',
            dataIndex: 'requestValue',
            width: 250
        },
        {
            dataIndex: 'responeValue',
            title: 'responeValue',
            width: 250
        },
        {
            dataIndex: 'notes',
            title: 'note',
        },
        {
            dataIndex: 'referenceCode',
            title: 'referenceCode',
            width: 150
        },
        {
            dataIndex: 'partnerName',
            title: 'partnerName',
            width: 200
        },
        {
            dataIndex: 'totalAmount',
            title: 'totalAmount',
            align: "right",
            width: 200,
            render: v => (<PriceCell value={v}/>),
        },
        {
            dataIndex: 'status',
            title: 'status',
            align:'center',
            width: 150
        },

    ],
        {

        ns: mainStore.getNamespaceLocale()
    });
    const SearchForm=()=>{
        return <>
            <SearchFilterText/>
            <Form.Item hidden={true} name='type' initialValue={2}>
                <Input/>
            </Form.Item>
        </>
    }
    const topActions: IActionBtn[] = [
        {
            title: t('actionBtn.ReasonType'),
            content: <>
                <Button onClick={() => navigate(-1)}>
                    <Space>
                        <ArrowLeftOutlined />
                    </Space>
                    {t('actionBtn.back')}
                </Button>
            </>
        },
    ];
    return (
        <>
            <PageTopTitleAndAction usingCustom={true}  mainTitle={t('title')}
                                   items={[t('invoice')]}>
                    <TopAction topActions={topActions}/>

            </PageTopTitleAndAction>
            <OrdCrudPage stored={mainStore}

                         hiddenTopAction={true}
                         columns={columns}
                         searchForm={(f) => <SearchForm/>}
                         entityForm={form => null}
            ></OrdCrudPage>
        </>
    )
};
export default LogApi;
