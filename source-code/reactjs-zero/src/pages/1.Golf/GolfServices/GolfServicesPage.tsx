import { GolfProductDto } from "@api/index.defs";
import { useStore } from "@ord-store/index";
import {
  Button,
  Dropdown,
  Form,
  FormInstance,
  MenuProps,
  TableColumnsType,
} from "antd";
import { useTranslation } from "react-i18next";
import TableUtil from "@ord-core/utils/table.util";
import { ITableAction } from "@ord-components/table/cells/TableActionCell";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { IsActivedColumn } from "@ord-components/table/columns/IsActivedColumn";
import GolfServiceEntityForm from "./GolfServiceEntityForm";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import {
  CheckCircleOutlined,
  PlusOutlined,
  StopOutlined,
} from "@ant-design/icons";
import UiUtils from "@ord-core/utils/ui.utils";
import { GolfProductService } from "@api/GolfProductService";
import { GolfProductBtnGroup } from "./GolfProductBtnGroup";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";
import { ColSpanResponsive } from "@ord-components/common/ColSpanResponsive";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { SearchIsActived } from "@ord-components/forms/search/SearchIsActived";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { useSelectProductTypeGolfService } from "@ord-components/forms/select/selectDataSource/useSelectProductTypeGolfService";
import { SelectAddNewProductGroup } from "@ord-components/forms/select/addNewEntityAfterForm/selectAddNewProductGroup";

export enum ProductTypeGolfServiceEnum {
  GreenFee = 600, // phí sân
  RentalBuggy = 601, // thuê xe
  RentalCaddy = 602, // thuê caddy
  MemberCard = 603, // MemberCard
  Other = 604, // khác
  RentalItems = 605, // cho thuê đồ
}

const GolfServicesPage: React.FC = () => {
  const { golfServicesStore: mainStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const { t: tEnum } = useTranslation("enum");
  const columns: TableColumnsType<GolfProductDto> = TableUtil.getColumns(
    [
      {
        title: t("productCode"),
        dataIndex: "productCode",
        align: "left",
        width: 100,
      },
      {
        title: t("productName"),
        dataIndex: "productName",
        align: "left",
        width: 150,
      },
      // {
      //   title: t("gameType"),
      //   dataIndex: "gameType",
      //   align: "left",
      //   width: 100,
      //   render: (v) => {
      //     return v ? <>{tEnum(`GameTypeEnum.${v}`)}</> : <></>;
      //   },
      // },
      // {
      //   title: t("numberOfHoles"),
      //   dataIndex: "numberOfHoles",
      //   align: "right",
      //   width: 50,
      // },
      {
        title: t("productPrice"),
        width: 100,
        dataIndex: "productPriceWithTax",
        align: "end",
        render: (v, dto) => (
          <>
            <PriceCell value={v} />
          </>
        ),
      },
      {
        title: t("taxPercent"),
        dataIndex: "taxPercent",
        width: 50,
        align: "end",
        render: (v, r: GolfProductDto) => {
          if (r.taxCode == "-") return "";
          return v + "%";
        },
      },
      {
        title: t("basicUnitNameLable"),
        dataIndex: "basicUnitName",
        width: 50,
        align: "center",
      },
      {
        title: t("productCategoryId"),
        dataIndex: "productCategoryId",
        width: 200,
        render: (v) => {
          return v ? <>{tEnum(`ProductTypeGolfServiceEnum.${v}`)}</> : <></>;
        },
      },
      IsActivedColumn(),
    ],
    {
      actions: [
        {
          title: "",
          content: (d: GolfProductDto) => {
            return d.isActived ? (
              <div
                style={{ color: "#f5413d" }}
                onClick={() => {
                  handleOnClickChangeIsActiveProduct(
                    Number(d.id),
                    false
                  ).then();
                }}
              >
                <StopOutlined style={{ fontSize: 20 }} />{" "}
                <span style={{ marginLeft: "2px" }}>
                  {t("changeIsActive.unActive")}
                </span>
              </div>
            ) : (
              <div
                style={{ color: "#1AB01A" }}
                onClick={() => {
                  handleOnClickChangeIsActiveProduct(Number(d.id), true).then();
                }}
              >
                <CheckCircleOutlined style={{ fontSize: 20 }} />{" "}
                <span style={{ marginLeft: "2px" }}>
                  {t("changeIsActive.active")}
                </span>
              </div>
            );
          },
          permission: "Product",
          hiddenIf: (d) => {
            return d.isTemplateProduct === true;
          },
        },
        {
          title: "remove",
          onClick: (d: GolfProductDto) => {
            const removeByHash = {
              ...d,
              id: d.id,
            };
            mainStore.openRemoveById(removeByHash);
          },
        },
      ] as ITableAction<GolfProductDto>[],
      viewAction: (d) => {
        mainStore.openUpdateModal(d);
      },
      ns: mainStore.getNamespaceLocale(),
      widthRowIndexCol: 50,
      widthActionCol: 100,
    }
  );
  const handleOnClickChangeIsActiveProduct = async (
    id: number,
    isActived: boolean
  ) => {
    try {
      UiUtils.setBusy();
      const response = await GolfProductService.updateChangeIsActive({
        id,
        isActived,
      });

      if (response.isSuccessful) {
        UiUtils.showSuccess(t(`updateIsActiveSuccessfully`));
        mainStore.refreshGridData(true);
      } else {
        UiUtils.showError(response.message);
      }
    } catch (err: any) {
      UiUtils.showError(err?.Message);
    } finally {
      UiUtils.clearBusy();
    }
  };
  const items: MenuProps["items"] = [
    {
      key: "0",
      onClick: () => {
        mainStore.openCreateModal({
          productCategoryId: ProductTypeGolfServiceEnum.GreenFee,
        } as GolfProductDto);
      },
      label: <span>{tEnum("ProductTypeGolfServiceEnum.GreenFee")}</span>,
    },
    {
      key: "1",
      onClick: () => {
        mainStore.openCreateModal({
          productCategoryId: ProductTypeGolfServiceEnum.RentalBuggy,
        } as GolfProductDto);
      },
      label: <span>{tEnum("ProductTypeGolfServiceEnum.RentalBuggy")}</span>,
    },
    {
      key: "2",
      onClick: () => {
        mainStore.openCreateModal({
          productCategoryId: ProductTypeGolfServiceEnum.RentalCaddy,
        } as GolfProductDto);
      },
      label: <span>{tEnum("ProductTypeGolfServiceEnum.RentalCaddy")}</span>,
    },
    // {
    //   key: "4",
    //   onClick: () => {
    //     mainStore.openCreateModal({
    //       productCategoryId: ProductTypeGolfServiceEnum.MemberCard,
    //     } as GolfProductDto);
    //   },
    //   label: <span>{tEnum("ProductTypeGolfServiceEnum.MemberCard")}</span>,
    // },
    {
      key: "5",
      onClick: () => {
        mainStore.openCreateModal({
          productCategoryId: ProductTypeGolfServiceEnum.RentalItems,
        } as GolfProductDto);
      },
      label: <span>{tEnum("ProductTypeGolfServiceEnum.RentalItems")}</span>,
    },
    {
      key: "3",
      onClick: () => {
        mainStore.openCreateModal({
          productCategoryId: ProductTypeGolfServiceEnum.Other,
        } as GolfProductDto);
      },
      label: <span>{tEnum("ProductTypeGolfServiceEnum.Other")}</span>,
    },
  ];
  const topActions: IActionBtn[] = [
    {
      title: "btnGolfArea",
      content: <GolfProductBtnGroup />,
      // permission: "ProductPriceList.Create",
      onClick: () => {
        mainStore.openCreateModal();
      },
    },
    {
      title: "",
      content: (
        <div className="addNewCustome">
          <Dropdown menu={{ items }}>
            <Button type="primary" icon={<PlusOutlined />}>
              {t("actionBtn.addNew")}
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];
  const SearchForm = () => {
    return (
      <>
        <ColSpanResponsive span={4}>
          <FloatLabel label={t("productCategoryId")}>
            <Form.Item name="productCategoryId">
              <OrdSelect
                datasource={useSelectProductTypeGolfService()}
                allowClear
                placeholder={t("productCategoryId")}
              />
            </Form.Item>
          </FloatLabel>
        </ColSpanResponsive>
        <SearchIsActived span={4} />
        {/* <ColSpanResponsive span={8}>
          <FloatLabel label={t("idsProductGroup")}>
            <Form.Item name="productGroupIds">
              <SelectAddNewProductGroup hiddenAddNew={true} />
            </Form.Item>
          </FloatLabel>
        </ColSpanResponsive> */}
        <SearchFilterText span={8} />
      </>
    );
  };

  return (
    <>
      <OrdCrudPage
        stored={mainStore}
        entityForm={() => <GolfServiceEntityForm />}
        topActions={topActions}
        columns={columns}
        searchForm={() => <SearchForm />}
      ></OrdCrudPage>
    </>
  );
};
export default GolfServicesPage;
