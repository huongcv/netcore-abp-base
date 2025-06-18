import { useStore } from "@ord-store/index";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { TableColumnsType } from "antd";
import TableUtil from "@ord-core/utils/table.util";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { SearchIsActived } from "@ord-components/forms/search/SearchIsActived";
import { IsActivedColumn } from "@ord-components/table/columns/IsActivedColumn";
import { format } from "date-fns";
import { ITableAction } from "@ord-components/table/cells/TableActionCell";
import { SalesPromotionDto } from "@api/index.defs";
import { ACTION } from "./Enums/TypePromotionDetail";

const SalesPromotion: React.FC = () => {
  const navigate = useNavigate();
  const { ProductSalesPromotionStore: mainStore } = useStore();
  const columns: TableColumnsType<any> = TableUtil.getColumns(
    [
      {
        title: "Code",
        dataIndex: "code",
        width: 150,
      },
      {
        title: "Name",
        dataIndex: "name",
        width: 150,
      },
      {
        title: "StartDate",
        dataIndex: "startDate",
        width: 150,
        render: (v: string) => format(new Date(v), "dd/MM/yyyy"),
      },
      {
        title: "EndDate",
        dataIndex: "endDate",
        width: 150,
        render: (v: string) => format(new Date(v), "dd/MM/yyyy"),
      },
      {
        title: "Description",
        dataIndex: "description",
        width: 150,
      },
      IsActivedColumn(),
    ],
    {
      actions: [
        {
          title: "view",
          onClick: (p) => {
            navigate(
              `/product/sales-promotion/create-update/${p.id}?action=${ACTION.View}`
            );
          },
        },
        {
          title: "edit",
          onClick: (p) => {
            navigate(
              `/product/sales-promotion/create-update/${p.id}?action=${ACTION.Update}`
            );
          },
        },
      ] as ITableAction<SalesPromotionDto>[],
      ns: mainStore.getNamespaceLocale(),
      widthRowIndexCol: 50,
    }
  );
  const topActions: IActionBtn[] = [
    {
      title: "addNew",
      //permission: "Product.CreateOrUpdate",
      onClick: () => {
        navigate("/product/sales-promotion/create-update");
      },
    },
  ];
  const SearchForm = () => {
    return (
      <>
        <SearchIsActived span={6} />
        <SearchFilterText span={6} />
      </>
    );
  };
  return (
    <>
      <OrdCrudPage
        stored={mainStore}
        topActions={topActions}
        columns={columns}
        searchForm={(f) => <SearchForm />}
        // entityForm={(form) => <ProductUpsertForm />}
      ></OrdCrudPage>
    </>
  );
};
export default observer(SalesPromotion);
