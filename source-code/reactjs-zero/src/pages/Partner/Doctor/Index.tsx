import {
  CheckCircleOutlined,
  DownOutlined,
  ExportOutlined,
  FileExcelOutlined,
  ImportOutlined,
  StopOutlined
} from "@ant-design/icons";
import { PartnerDto } from "@api/index.defs";
import { PartnerDoctorService } from "@api/PartnerDoctorService";
import { IsActiveStatusCounter } from "@ord-components/crud/counter-list/IsActiveStatusCounter";
import OrdCrudPage, { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectPartnerGroup } from "@ord-components/forms/select/selectDataSource/useSelectPartnerGroup";
import { IsActivedColumn } from "@ord-components/table/columns/IsActivedColumn";
import { PERMISSION_APP } from "@ord-core/config/permissions";
import { fetchSyncDataPartners } from "@ord-core/db/services/syncDataPartners";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import TableUtil from "@ord-core/utils/table.util";
import UiUtils from "@ord-core/utils/ui.utils";
import Utils from "@ord-core/utils/utils";
import { useStore } from "@ord-store/index";
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
import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { GroupNamesCell } from "../Shared/GroupNamesCell";
import { PartnerGroupService } from "@api/PartnerGroupService";
import PartnerGroupBtn from "@pages/Partner/Shared/PartnerGroup/PartnerGroupBtn";

const Doctor = () => {
  const {
    partnerDoctorStore: mainStore,
    doctorGroupStore, 
    selectDataSourceStore
  } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const navigate = useNavigate();

  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  const handleOnClickChangeIsActiveDoctor = async (
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
        width: 150,
        render: (_, record) => {
          return (<>
            <a className="font-semibold underline"
               onClick={() =>    mainStore.openUpdateModal(record)}>{_}</a>
          </>)
        }
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
        width: 150,
        render: (v: string, record: PartnerDto) => {
          return <>{Utils.transformPhoneNumber(v)}</>;
        },
      },
      {
        dataIndex: "companyName",
        title: t("workPlace"),
        width: 250,
      },
      IsActivedColumn(),
    ],
    {
      actions: [
        {
          title: "",
          content: (d: PartnerDto) => {
            return d.isActived ? (
              <div
                style={{ color: "#f5413d" }}
                onClick={() => {
                  handleOnClickChangeIsActiveDoctor(Number(d.id), false);
                }}
              >
                <StopOutlined />{" "}
                <span className="ml-1">{t("changeIsActive.unActive")}</span>
              </div>
            ) : (
              <div
                style={{ color: "#1AB01A" }}
                onClick={() => {
                  handleOnClickChangeIsActiveDoctor(Number(d.id), true);
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
      content: (
        <>
          <PartnerGroupBtn partnerType={6} store={doctorGroupStore}></PartnerGroupBtn>
        </>
      ),
    },
    {
      permission: PERMISSION_APP.customer.customerGroup,
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
      permission: PERMISSION_APP.customer.doctor + ".Create",
      onClick: () => {
        mainStore.openCreateModal();
      },
    },
  ];
  const LazyModalCruSupplier = lazy(
    () => import("@pages/Partner/Doctor/ModalCruDoctor")
  );
  return (
    <>
      <OrdCrudPage
        stored={mainStore}
        topActions={topActions}
        columns={columns}
        contentTopTable={
          <IsActiveStatusCounter getCountApi={PartnerDoctorService.getCount} />
        }
        searchForm={(f) => (
          <>
            <Col {...useResponsiveSpan(6)}>
              <FloatLabel label={t("groupId")}>
                <Form.Item name={["groupId"]}>
                  <OrdSelect datasource={useSelectPartnerGroup(6)} allowClear></OrdSelect>
                </Form.Item>
              </FloatLabel>
            </Col>
            <SearchFilterText
              span={10}
              placeHolder={t("customerSearchtring")}
            />
          </>
        )}
        onEntitySavedSuccess={() => {
          fetchSyncDataPartners().then();
          selectDataSourceStore.clearByName("PartnerGroup_6"),
            selectDataSourceStore.getOptions("PartnerGroup_6", async () => {
              const result = await PartnerGroupService.getComboOptions({
                type: 6
              });
              return Utils.mapCommonSelectOption(result);
            });
          mainStore.refreshGridData()
        }}
      ></OrdCrudPage>
      <Suspense fallback={<Spin />}>
        {mainStore.createOrUpdateModal.visible && (
          <LazyModalCruSupplier stored={mainStore}></LazyModalCruSupplier>
        )}
      </Suspense>
    </>
  );
};

export default observer(Doctor);
