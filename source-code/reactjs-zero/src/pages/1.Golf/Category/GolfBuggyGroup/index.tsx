import { GolfBuggyGroupDto } from "@api/index.defs";
import { useStore } from "@ord-store/index";
import { Button, Dropdown, Modal, Space, TableColumnsType } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import TableUtil from "@ord-core/utils/table.util";
import { ITableAction } from "@ord-components/table/cells/TableActionCell";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import { BuggyGroupSearchForm } from "./Form/BuggyGroupSearchForm";
import {
  DownOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { IconlyLight } from "@ord-components/icon/IconlyLight";
import BuggyGroupCruForm from "./Modal/BuggyGroupCruForm";
import OrdCreateOrUpdateModal from "@ord-components/crud/OrdCreateOrUpdateModal";
import { useCallback, useState } from "react";
import ModalCloseBtn from "@ord-components/btn-action/ModalCloseBtn";
import { StatusCell } from "@ord-components/table/cells/StatusCell";
import { GolfBuggyGroupService } from "@api/GolfBuggyGroupService";
import Utils from "@ord-core/utils/utils";

const BuggyGroupList = () => {
  const {
    golfBuggyGroupStore: mainStore,
    selectDataSourceStore,
    golfBuggyStore,
  } = useStore();
  const { t: tEnum } = useTranslation("enum");
  const { t } = useTranslation("buggy-group");
  const [openListModal, setOpenListModal] = useState(false);

  const columns: TableColumnsType<GolfBuggyGroupDto> = TableUtil.getColumns(
    [
      {
        title: "buggyGroupCode",
        dataIndex: "buggyGroupCode",
        align: "left",
        width: 200,
      },
      {
        title: "buggyGroupName",
        dataIndex: "buggyGroupName",
        align: "left",
        width: 200,
      },
      {
        title: "notes",
        dataIndex: "notes",
        align: "left",
        width: 200,
      },
      {
        title: "isActived",
        dataIndex: "isActived",
        align: "center",
        width: 200,
        render: (v) => <StatusCell isActived={v} />,
      },
    ],
    {
      actions: [
        {
          title: "view",
          onClick: (d) => {
            mainStore.openViewDetailModal(d);
          },
        },
        {
          title: "edit",
          onClick: (d) => {
            mainStore.openUpdateModal(d);
          },
        },
        {
          title: "remove",
          onClick: (d: GolfBuggyGroupDto) => {
            const removeByHash = {
              ...d,
              id: d.id,
            };
            mainStore.openRemoveById(removeByHash);
          },
        },
      ] as ITableAction<GolfBuggyGroupDto>[],
      ns: mainStore.getNamespaceLocale(),
    }
  );

  const items = [
    {
      key: "0",
      label: (
        <a
          onClick={() => {
            mainStore.openCreateModal();
          }}
        >
          <PlusOutlined className="me-1 mr-2" />
          {t("buggyGroup.addNew")}
        </a>
      ),
    },
    {
      key: "1",
      label: (
        <a
          onClick={() => {
            setOpenListModal(true);
          }}
        >
          <IconlyLight type="Paper.svg" width={16} className="me-1 mr-2" />
          {t("buggyGroup.list")}
        </a>
      ),
    },
    // {
    //   key: "2",
    //   label: (
    //     <Link to={getImportPath()}>
    //       <UploadOutlined className="me-1 mr-2" />
    //       {t("buggyGroup.importExcel")}
    //     </Link>
    //   )
    // },
    // {
    //   key: "3",
    //   label: (
    //     <span
    //       onClick={() => {
    //         const params: PartnerGroupPagedRequestDto = {
    //           ...store.searchFormRef?.getFieldsValue(),
    //           groupType: partnerType
    //         };
    //         store.exportExcelPagedResult(params);
    //       }}
    //     >
    //       <FileExcelOutlined className="me-1 mr-2" />
    //       {t("buggyGroup.exportExcel")}
    //     </span>
    //   )
    // }
  ];

  const handleSavedSuccess = useCallback(() => {
    const key = "BuggyGroup";
    selectDataSourceStore.clearByName(key);
    selectDataSourceStore.getOptions(key, async () => {
      const result = await GolfBuggyGroupService.getComboOptions();
      return Utils.mapCommonSelectOption(result);
    });
    golfBuggyStore.refreshGridData;
  }, []);

  return (
    <>
      <Dropdown menu={{ items }}>
        <Button icon={<UnorderedListOutlined />}>
          {t("buggyGroup.title")}
          <DownOutlined />
        </Button>
      </Dropdown>
      <Modal
        title={t("buggyGroupModal.title")}
        onCancel={() => setOpenListModal(false)}
        open={openListModal}
        footer={
          <Space wrap>
            <ModalCloseBtn onClick={() => setOpenListModal(false)} />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setOpenListModal(false);
                mainStore.openCreateModal();
              }}
            >
              {t("buggyGroup.addNew")}
            </Button>
          </Space>
        }
        width="60%"
      >
        <OrdCrudPage
          hiddenTopAction={true}
          stored={mainStore}
          columns={columns}
          searchForm={(f) => <BuggyGroupSearchForm />}
        />
      </Modal>
      <OrdCreateOrUpdateModal
        stored={mainStore}
        entityForm={() => <BuggyGroupCruForm />}
        onSavedSuccess={handleSavedSuccess}
      />
    </>
  );
};

export default observer(BuggyGroupList);
