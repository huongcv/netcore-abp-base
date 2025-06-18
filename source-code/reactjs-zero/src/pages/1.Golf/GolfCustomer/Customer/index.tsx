import {
  CheckCircleOutlined,
  EditOutlined,
  ExportOutlined,
  ImportOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { CustomerService } from "@api/CustomerService";
import { GolfCustomerService } from "@api/GolfCustomerService";
import { GolfCustomerDto } from "@api/index.defs";
import { PartnerDoctorService } from "@api/PartnerDoctorService";
import { PartnerGroupService } from "@api/PartnerGroupService";
import { IsActiveStatusCounter } from "@ord-components/crud/counter-list/IsActiveStatusCounter";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectPartnerGroup } from "@ord-components/forms/select/selectDataSource/useSelectPartnerGroup";
import { IconlyLight } from "@ord-components/icon/IconlyLight";
import { PERMISSION_APP } from "@ord-core/config/permissions";
import { fetchSyncDataPartners } from "@ord-core/db/services/syncDataPartners";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import TableUtil from "@ord-core/utils/table.util";
import UiUtils from "@ord-core/utils/ui.utils";
import Utils from "@ord-core/utils/utils";
import { useStore } from "@ord-store/index";
import PartnerGroupBtn from "@pages/Partner/Shared/PartnerGroup/PartnerGroupBtn";
import {
  Button,
  Col,
  Form,
  MenuProps,
  Space,
  Spin,
  TableColumnsType,
  Tag,
} from "antd";
import { observer } from "mobx-react-lite";
import { lazy, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Customer = () => {
  const {
    golfCustomerStore: mainStore,
    customerGroupStore,
    selectDataSourceStore,
  } = useStore();
  const { t } = useTranslation("golf-customer");
  const navigate = useNavigate();

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

  const columns: TableColumnsType<GolfCustomerDto> = TableUtil.getColumns(
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
        title: "groupId",
        width: 200,
        render: (_: string, record: GolfCustomerDto) => (
          <>{record.groupNames}</>
        ),
      },
      {
        dataIndex: "phone",
        title: "phone",
        width: 140,
        render: (v: string, record: GolfCustomerDto) => {
          return <>{Utils.transformPhoneNumber(v)}</>;
        },
      },
      {
        title: "theDangSuDung",
        width: 140,
        align: "center",
        render: (v: string, record: GolfCustomerDto) => {
          return (
            <>
              {record.listCardAssigned &&
                record.listCardAssigned.length > 0 && (
                  <strong>
                    {record.listCardAssigned.map((f) => f.uid).join(",")}
                  </strong>
                )}
            </>
          );
        },
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
          title: "view",
          onClick: (d: any) => {
            navigate(`/app/golf/customer/${d.id}`);
          },
        },
        {
          title: "",
          content: (d: GolfCustomerDto) => {
            return (
              <div
                onClick={() => {
                  mainStore.setOpenAccessCardManageModal(d);
                }}
              >
                <EditOutlined style={{ fontSize: 20 }} />{" "}
                <span className="ml-1">{t("quanLyThe")}</span>
              </div>
            );
          },
        },
        {
          title: "",
          content: (d: GolfCustomerDto) => {
            return d.isActived ? (
              <div
                onClick={() => {
                  handleChangeIsActivePartner(Number(d.id), false);
                }}
              >
                <StopOutlined />{" "}
                <span className="ml-1">{t("changeIsActive.unActive")}</span>
              </div>
            ) : (
              <div
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
      ns: mainStore.getNamespaceLocale(),
      viewAction: (d: GolfCustomerDto) => {
        mainStore.openUpdateModal(d);
      },
    }
  );

  const topActions: IActionBtn[] = [
    {
      title: t("actionBtn.CustomerGroup"),
      permission: PERMISSION_APP.customer.customerGroup,
      content: <PartnerGroupBtn partnerType={1} store={customerGroupStore} isCustomerGroupGolf={true} />,
    },
    {
      title: t("actionBtn.CustomerGroup"),
      permission: PERMISSION_APP.customer.customerGroup,
      content: (
        <>
          <Button
            onClick={() => {
              mainStore.exportExcelPagedResult().then();
            }}
            icon={
              <IconlyLight
                style={{ paddingTop: 5 }}
                width={20}
                type={"Excel-Golf.svg"}
              />
            }
          >
            {t("exportExcel")}
          </Button>
        </>
      ),
    },
    {
      title: t("actionBtn.CustomerGroup"),
      permission: PERMISSION_APP.customer.customerGroup,
      content: (
        <>
          <Button
            onClick={() => {
              navigate("import-excel");
            }}
            icon={
              <IconlyLight
                style={{ paddingTop: 5 }}
                width={20}
                type={"Excel-Golf.svg"}
              />
            }
          >
            {t("importExcel")}
          </Button>
        </>
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
    () => import("../Customer/Form/ModalCruCustomer")
  );

  const LazyModalAccessCardManage = lazy(
    () => import("../Customer/Form/ModalAccessCardManage")
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
              <FloatLabel label={t("groupId")}>
                <Form.Item name={["groupId"]}>
                  <OrdSelect
                    datasource={useSelectPartnerGroup(1)}
                    allowClear
                  ></OrdSelect>
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
          selectDataSourceStore.clearByName("PartnerCustomer"),
            selectDataSourceStore.getOptions("PartnerCustomer", async () => {
              const result = await PartnerGroupService.getComboOptions({
                type: 1,
              });
              return Utils.mapCommonSelectOption(result);
            });
          mainStore.refreshGridData();
        }}
      ></OrdCrudPage>

      <Suspense fallback={<Spin />}>
        {mainStore.createOrUpdateModal.visible && (
          <LazyModalCruCustomer stored={mainStore} isCustomerGolf={true}></LazyModalCruCustomer>
        )}
      </Suspense>
      <Suspense fallback={<Spin />}>
        {mainStore.accessCardManageModel.visible && (
          <LazyModalAccessCardManage
            stored={mainStore}
          ></LazyModalAccessCardManage>
        )}
      </Suspense>
    </>
  );
};

export default observer(Customer);
