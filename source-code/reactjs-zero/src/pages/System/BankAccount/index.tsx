import {ShopBankAccountDto} from "@api/index.defs";
import {useStore} from "@ord-store/index";
import {Button, Card, Space, TableColumnsType, Tag} from "antd";
import {observer} from "mobx-react-lite/src/observer";
import TableUtil from "@ord-core/utils/table.util";
import {useTranslation} from "react-i18next";
import OrdCrudPage, {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {ITableAction} from "@ord-components/table/cells/TableActionCell";
import {StatusCell} from "@ord-components/table/cells/StatusCell";
import CRUBankAccModal from "./Modal/CRUBankAccModal";
import React from "react";
import {PlusOutlined} from "@ant-design/icons";

const BankAccountList = () => {
    const {bankAccountStore: mainStore} = useStore();
    const {t: tEnum} = useTranslation("enum");
    const {t} = useTranslation("bankAccount");
    const columns: TableColumnsType<any> = TableUtil.getColumns(
        [
            {
                title: t("bankBin"),
                dataIndex: "bankCode",
                width: 150,
                render: (v: string, record) => {
                    return <>
                        <p>{v}  {record.isDefault ? <Tag className="bg-[#FFEAEE] ml-[4px]" color={"#e5ffee"} >
                        <span className="text-[#3BB54A]"> {t('Mặc định')}</span>
                        </Tag> : ""}</p>
                    </>
                }
            },
            {
                title: t("accountCode"),
                dataIndex: "accountCode",
                width: 150,
            },
            {
                title: t("accountName"),
                dataIndex: "accountName",
                width: 200,
            },
            {
                title: t("notes"),
                dataIndex: "notes",
                width: 300,
            },
            {
                dataIndex: "isActived",
                title: "status",
                align: "center",
                render: (v) => <StatusCell isActived={v}/>,
                width: 100,
            },
        ],
        {
            actions: [
                // {
                //     title: "view",
                //     onClick: (d: ShopBankAccountDto) => {
                //         mainStore.openViewDetailModal(d);
                //     },
                // },
                {
                    title: "edit",
                    hiddenIf: (d: any) => {
                        return d?.isDefault;
                    },
                    onClick: (d: ShopBankAccountDto) => {
                        mainStore.openUpdateModal(d);
                    },
                },
                {
                    title: "remove",
                    onClick: (d) => {
                        mainStore.openRemoveById(d);
                    }
                },
            ] as ITableAction<ShopBankAccountDto>[],
            viewAction: (d)=>{
                mainStore.openUpdateModal(d);
            },
            ns: mainStore.getNamespaceLocale(),
        }
    );

    const topActions: IActionBtn[] = [
        {
            title: "addNew",
            onClick: () => {
                mainStore.openCreateModal();
            },
        },
    ];

    return (
        <>
            <Card size={'small'} title={t('bankAccountTable')}
                  styles={{
                      body:{
                          padding:0
                      }
                  }}
                  extra={
                      <Button type='primary' className={'my-1'} onClick={() => {
                          mainStore.openCreateModal()
                      }
                      }>
                          <Space><PlusOutlined/></Space> {t('addBankAccount')}
                      </Button>}>
                <OrdCrudPage
                    classNameTable=" !pr-0 !pb-0 !pl-0"
                    tableBordered={false}
                    stored={mainStore}
                    hiddenTopAction={true}
                    columns={columns}
                    entityForm={(form) => <CRUBankAccModal/>}
                ></OrdCrudPage>
            </Card>

        </>
    );
};
export default observer(BankAccountList);
