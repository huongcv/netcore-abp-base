import { ExportOutlined, PlusOutlined, DownOutlined } from "@ant-design/icons";
import { ShopTemplateDto } from "@api/index.defs";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { SearchIsActived } from "@ord-components/forms/search/SearchIsActived";
import { useSelectShopTemplateType } from "@ord-components/forms/select/selectDataSource/useSelectShopTemplateType";
import { IsActivedColumn } from "@ord-components/table/columns/IsActivedColumn";
import { useStore } from "@ord-store/index";
import { TableColumnsType, Col, Form } from "antd";
import { observer } from "mobx-react-lite/src/observer";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import TableUtil from "@ord-core/utils/table.util";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import { useEffect } from "react";
import { useWatch } from "antd/es/form/Form";

const SampleSalesOrderList = () => {
  const { shopSalesOrderSampleStore: mainStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const { t: tEnum } = useTranslation("enum");

  const columns: TableColumnsType<any> = TableUtil.getColumns(
    [
      {
        dataIndex: "name",
        title: "name",
        width: 300,
      },
      
      {
        dataIndex: "notes",
        title: "notes",
        width: 400,
      },
      IsActivedColumn(),
    ],
    {
      actions: [
        {
          title: "view",
          onClick: (d: ShopTemplateDto) => {
            navigate(`/system/shop-template/update/${d.idHash}/view`);
          },
        },
        {
          title: "edit",
          onClick: (d: ShopTemplateDto) => {
            // mainStore.openUpdateModal(d);
            navigate(`/system/shop-template/update/${d.idHash}/update`);
          },
        },
        {
          title: "export",
          content: (d: ShopTemplateDto) => {
            return (
              <div
                onClick={() => {
                  if (d.id)
                    mainStore.exportShopTemplateDetails(d.id, d.name ?? "");
                }}
              >
                <ExportOutlined></ExportOutlined>
                <span className="ml-2">{t("actionBtn.export")}</span>
              </div>
            );
          },
        },
        {
          title: "remove",
          onClick: (d) => {
            mainStore.openRemoveByHashId(d);
          },
        },
      ],
      ns: mainStore.getNamespaceLocale(),
    }
  );
  const navigate = useNavigate();

  const topActions: IActionBtn[] = [
    {
      permission: "System.ShopTemplate.Create",
      title: "addNew",
      onClick: () => {
        navigate("/system/shop-template/create/sample-sales-order");
      },
    },
  ];
  const SearchFilterAndIsActived = () => {
    return (
      <>
        <SearchIsActived span={10} />
        <SearchFilterText span={14} />
      </>
    );
  };

  return (
    <>
      <OrdCrudPage
        stored={mainStore}
        topActions={topActions}
        columns={columns}
        searchForm={(f) => <SearchFilterAndIsActived />}
      ></OrdCrudPage>
    </>
  );
};

export default observer(SampleSalesOrderList);
