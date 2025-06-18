import {
  CheckCircleOutlined,
  DownOutlined,
  ExportOutlined,
  FileExcelOutlined,
  ImportOutlined,
  MoneyCollectOutlined,
  StopOutlined
} from "@ant-design/icons";
import { CustomerService } from "@api/CustomerService";
import { GENDER, PartnerDto } from "@api/index.defs";
import { PartnerDoctorService } from "@api/PartnerDoctorService";
import { PartnerGroupService } from "@api/PartnerGroupService";
import { IsActiveStatusCounter } from "@ord-components/crud/counter-list/IsActiveStatusCounter";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import { useSelectPartnerGroup } from "@ord-components/forms/select/selectDataSource/useSelectPartnerGroup";
import { IsActivedColumn } from "@ord-components/table/columns/IsActivedColumn";
import { PERMISSION_APP } from "@ord-core/config/permissions";
import { fetchSyncDataPartners } from "@ord-core/db/services/syncDataPartners";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import TableUtil from "@ord-core/utils/table.util";
import UiUtils from "@ord-core/utils/ui.utils";
import Utils from "@ord-core/utils/utils";
import { useStore } from "@ord-store/index";
import { GroupNamesCell } from "@pages/Partner/Shared/GroupNamesCell";
import PartnerGroupBtn from "@pages/Partner/Shared/PartnerGroup/PartnerGroupBtn";
import {
  Button,
  Col,
  Dropdown,
  Form,
  MenuProps,
  Space,
  Spin,
  TableColumnsType
} from "antd";
import { observer } from "mobx-react-lite";
import { lazy, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelectCustomPartnerType } from "./Form/useSelectCustomPartnerType";

const Customer = () => {
  const {
    customerStore: mainStore,
    customerDebtStore: debtStore,
    partnerTransactionStore: transactionStore,
    customerGroupStore,
    selectDataSourceStore
  } = useStore();
  const { t: tEnum } = useTranslation("enum");
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const navigate = useNavigate();

  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  useEffect(() => {
    fetchSyncDataPartners().then();
  }, [mainStore.removeRecord]);
  const handleChangeIsActivePartner = async (
    id: number,
    isActived: boolean
  ) => {
    try {
      UiUtils.setBusy();
      if (id == 0 || isActived == null || isActived == undefined) return;
      const update = await PartnerDoctorService.changePartnerStatus({
        id,
        isActived,
      });
      if (update.isSuccessful) {
        UiUtils.showSuccess(t(`updateIsActiveSuccessfully`));
        mainStore.refreshGridData(true);
        fetchSyncDataPartners().then();
      } else {
        UiUtils.showError(t(`updateIsActiveFaild`));
      }
    } catch (err: any) {
      UiUtils.showError(t(`updateIsActiveFaildErr500`) + err?.Message);
    } finally {
      UiUtils.clearBusy();
    }
  };

  const columns: TableColumnsType<PartnerDto> = TableUtil.getColumns(
    [
      {
        title: "code",
        dataIndex: "code",
        width: 140,
      },
      {
        dataIndex: "name",
        title: "name",
        width: 200,
      },
      {
        dataIndex: "groupNames",
        title: "groupId",
        width: 200,
        render: (groupNames: string) => (
          <GroupNamesCell groupNames={groupNames} title={t("groupId")} />
        ),
        ellipsis: true,
      },
      {
        dataIndex: "phone",
        title: "phone",
        width: 140,
        render: (v: string, record: PartnerDto) => {
          return <>{Utils.transformPhoneNumber(v)}</>;
        },
      },
      {
        dataIndex: "gender",
        title: "gender",
        align: "center",
        width: 100,
        render: (v: GENDER, record: PartnerDto) => {
          return <>{tEnum(record.genderStr ?? "")}</>;
        },
      },
      {
        dataIndex: "address",
        title: "address",
        width: 200,
        render: (v: number, record: PartnerDto) => {
          return (
            <div className="max-w-96 text-ellipsis overflow-hidden">
              {record.address}
            </div>
          );
        },
      },
      {
        dataIndex: "debtAmount",
        title: "debtAmount",
        align: "right",
        width: 150,
        render: (v: number, record: PartnerDto) => {
          return <>{v ? formatter.format(v) : "-"}</>;
        },
      },
      IsActivedColumn(),
    ],
    {
      actions: [
        // {
        //   title: "view",
        //   onClick: (d: PartnerDto) => {
        //     // navigate("details/" + d.idHash);
        //     mainStore.openViewDetailModal(d);
        //   },
        // },
        // {
        //   title: "edit",
        //   onClick: (d) => {
        //     mainStore.openUpdateModal(d);
        //   },
        // },
        {
          title: "changeDebt",
          icon: <MoneyCollectOutlined />,
          onClick: (d) => {
            const record = d as PartnerDto;
            debtStore.openCreateModal({
              partnerId: record.id,
              formPartnerType: "customer",
              partnerName: record.name,
              partnerCode: record.code,
              debt: record.debtAmount,
              currentDebtAmount: record.debtAmount,
              transactionDate: new Date(),
            });
          },
        },
        {
          title: "changePay",
          icon: <MoneyCollectOutlined />,
          onClick: (d) => {
            const record = d as PartnerDto;
            transactionStore.openViewChangePayModal(parseInt(record.id ?? "0"));
          },
        },
        {
          title: "",
          content: (d: PartnerDto) => {
            return d.isActived ? (
              <div
                style={{ color: "#f5413d" }}
                onClick={() => {
                  handleChangeIsActivePartner(Number(d.id), false);
                }}
              >
                <StopOutlined />{" "}
                <span className="ml-1">{t("changeIsActive.unActive")}</span>
              </div>
            ) : (
              <div
                style={{ color: "#1AB01A" }}
                onClick={() => {
                  handleChangeIsActivePartner(Number(d.id), true);
                }}
              >
                <CheckCircleOutlined />{" "}
                <span className="ml-1">{t("changeIsActive.active")}</span>
              </div>
            );
          },
        },
        {
          title: "remove",
          onClick: (d) => {
            mainStore.openRemoveById(d);
          },
        },
      ],
      viewAction: (d)=>{
        mainStore.openUpdateModal(d);
      },
      ns: mainStore.getNamespaceLocale(),
    }
  );
  const items: MenuProps["items"] = [
    {
      label: (
        <a
          onClick={() => {
            navigate("import-excel");
            // mainStore.setIsShowExcelModal(true);
          }}
        >
          <Space>
            <ImportOutlined /> Nhập excel
          </Space>
        </a>
      ),
      key: "0",
    },
    {
      label: (
        <a
          onClick={() => mainStore.exportExcelPagedResult().then()}
          type={"text"}
        >
          <Space>
            <ExportOutlined />
            {t("actionBtn.exportExcel")}
          </Space>
        </a>
      ),
      key: "1",
    },
  ];
  const topActions: IActionBtn[] = [
    {
      title: t("actionBtn.CustomerGroup"),
      permission: PERMISSION_APP.customer.customerGroup,
      content: <PartnerGroupBtn partnerType={1} store={customerGroupStore} />,
    },
    {
      permission: "Partner.Customer",
      content: (
        <Dropdown
          className={"btn-secondary"}
          menu={{ items }}
          trigger={["hover"]}
        >
          <Button>
            <Space>
              <FileExcelOutlined />
              {t("actionBtn.actionExcel")}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      ),
    },
    {
      title: "addNew",
      permission: "Partner.Customer.Create",
      onClick: () => {
        mainStore.openCreateModal();
      },
    },
  ];
  const LazyModalCruCustomer = lazy(
    () => import("@pages/Customer/ModalCruCustomer")
  );
  const LazyModalChangeDebt = lazy(
    () => import("@pages/Partner/Shared/ModalChangeDebt")
  );
  const LazyModalChangePay = lazy(
    () => import("@pages/Partner/Shared/ModalChangePay")
  );

  return (
    <>
      <OrdCrudPage
        stored={mainStore}
        classNameTable="table-padding"
        contentTopTable={
          <IsActiveStatusCounter getCountApi={CustomerService.getCount} />
        }
        topActions={topActions}
        columns={columns}
        searchForm={(f) => (
          <>
            <Col {...useResponsiveSpan(6)}>
              <FloatLabel label={t("category")}>
                <Form.Item name={["categoryId"]}>
                  <OrdSelect datasource={useSelectCustomPartnerType()} allowClear></OrdSelect>
                </Form.Item>
              </FloatLabel>
            </Col>
            <Col {...useResponsiveSpan(6)}>
              <FloatLabel label={t("groupId")}>
                <Form.Item name={["groupId"]}>
                  <OrdSelect datasource={useSelectPartnerGroup(1)} allowClear></OrdSelect>
                </Form.Item>
              </FloatLabel>
            </Col>

            <SearchFilterText
              span={12}
              placeHolder={t("customerSearchtring")}
            />
          </>
        )}
        onEntitySavedSuccess={() => {
          selectDataSourceStore.clearByName("PartnerGroup_1"),
            selectDataSourceStore.getOptions("PartnerGroup_1", async () => {
              const result = await PartnerGroupService.getComboOptions({
                type: 1
            });
              return Utils.mapCommonSelectOption(result);
            });
          mainStore.refreshGridData()
        }}
      ></OrdCrudPage>

      <Suspense fallback={<Spin />}>
        {mainStore.createOrUpdateModal.visible && (
          <LazyModalCruCustomer stored={mainStore}></LazyModalCruCustomer>
        )}
      </Suspense>

      <Suspense fallback={<Spin />}>
        {debtStore.createOrUpdateModal.visible && (
          <LazyModalChangeDebt
            stored={debtStore}
            partnerType={1}
            onCruSuccess={() => {
              mainStore.refreshGridData(true).then();
            }}
          ></LazyModalChangeDebt>
        )}
      </Suspense>

      <Suspense fallback={<Spin />}>
        {transactionStore.changePayModal.visible && (
          <LazyModalChangePay
            partnerType={1}
            onSaveSuccess={() => {
              mainStore.refreshGridData(false).then();
            }}
          ></LazyModalChangePay>
        )}
      </Suspense>
    </>
  );
};


export default observer(Customer);
