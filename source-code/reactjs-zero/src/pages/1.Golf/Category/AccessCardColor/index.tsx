import { AccessCardDto, } from "@api/index.defs";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import TableUtil from "@ord-core/utils/table.util";
import { useStore } from "@ord-store/index";
import { TableColumnsType, Tag } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import UiUtils from "@ord-core/utils/ui.utils";
import ModalCrudAccessCardColor from "./ModalCrudAccessCardColor";

const AccessCardColor = () => {
    const { golfAccessCardColorStore: mainStore } = useStore();
    const { t } = useTranslation("golf-access-card-color");
    const { t: tEnum } = useTranslation("enum");

    const columns: TableColumnsType<AccessCardDto> = TableUtil.getColumns(
        [
            {
                title: "code",
                dataIndex: "code",
                width: 140,
            },
            {
                title: "name",
                dataIndex: "name",
                width: 200,
                render: (text: string, record: AccessCardDto) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div 
                            style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: text,
                                border: '1px solid #d9d9d9',
                                borderRadius: '4px'
                            }}
                        />
                    </div>
                ),
            },
            {
                title: "description",
                dataIndex: "description",
                width: 200,
            },
            {
                title: "status",
                dataIndex: "isActived",
                align: "center",
                render: (_: any, record: any) => (
                    <>
                        {record?.isActived ? (
                            <Tag className="me-0 ord-cell-actived">{t("dang_hoat_dong")}</Tag>
                        ) : (
                            <Tag className="me-0 ord-cell-inactived">
                                {t("ngung_hoat_dong")}
                            </Tag>
                        )}
                    </>
                ),
                width: 100,
            },
        ],
        {
            actions: [
                {
                    title: "edit",
                    onClick: (d) => {
                        mainStore.createOrUpdateModal.width = 600;
                        mainStore.openUpdateModal(d);
                    },
                },
                {
                    title: "remove",
                    onClick: (d: any) => {
                        mainStore.openRemoveById(d);
                    },
                },
            ],
            ns: mainStore.getNamespaceLocale(),
            viewAction: (d) => {
                mainStore.createOrUpdateModal.width = 600;
                mainStore.openUpdateModal(d);
            },
        }
    );

    const topActions: IActionBtn[] = [
        {
            title: "addNew",
            onClick: () => {
                mainStore.createOrUpdateModal.width = 600;
                mainStore.openCreateModal();
            },
        },
    ];


    return (
        <>
            <OrdCrudPage
                stored={mainStore}
                classNameTable="table-padding"
                topActions={topActions}
                columns={columns}
                searchForm={(f) => (
                    <>
                        <SearchFilterText
                            span={8}
                            placeHolder={t("golfAccessCardColorSearching")}
                        />
                    </>
                )}
                entityForm={() => <ModalCrudAccessCardColor />}
            ></OrdCrudPage>

        </>
    );
};

export default observer(AccessCardColor);
