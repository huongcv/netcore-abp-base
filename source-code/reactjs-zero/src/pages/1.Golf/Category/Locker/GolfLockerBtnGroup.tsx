import {
  EyeOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { GolfLockerGroupDto, GolfLockerGroupTypeEnum } from "@api/index.defs";
import { IconlyLight } from "@ord-components/icon/IconlyLight";
import { useStore } from "@ord-store/index";
import {
  Button,
  Checkbox,
  Col,
  Dropdown,
  Form,
  Input,
  MenuProps,
  Modal,
  Row,
  Select,
  Space,
  TableColumnsType,
} from "antd";
import { useState } from "react";
import TableUtil from "@ord-core/utils/table.util";
import { useTranslation } from "react-i18next";
import ModalCloseBtn from "@ord-components/btn-action/ModalCloseBtn";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import OrdCreateOrUpdateModal from "@ord-components/crud/OrdCreateOrUpdateModal";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdInputRegexText from "@ord-components/forms/OrdInputRegexText";
import RegexUtil from "@ord-core/utils/regex.util";
import { IsActivedColumnWithFilter } from "@ord-components/table/columns/IsActivedColumn";
import { ITableAction } from "@ord-components/table/cells/TableActionCell";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import Utils from "@ord-core/utils/utils";
import { SearchIsActived } from "@ord-components/forms/search/SearchIsActived";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";
import { GolfLockerGroupService } from "@api/GolfLockerGroupService";
const { TextArea } = Input;

export const GolfLockerBtnGroup = () => {
  const { golfLockerGroupStore: mainStore, selectDataSourceStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const [openListModal, setOpenListModal] = useState(false);
  const { t: tCommon } = useTranslation("common");
  const items: MenuProps["items"] = [
    {
      key: "0",
      label: (
        <span
          onClick={() => {
            mainStore.openCreateModal();
          }}
        >
          <PlusOutlined className={"me-1"} />
          {t("golfLockerBtnGroup.addNew")}
        </span>
      ),
    },
    {
      key: "1",
      label: (
        <span
          onClick={() => {
            setOpenListModal(true);
          }}
        >
          <IconlyLight type={"Paper.svg"} width={18} className={"me-1"} />
          {t("golfLockerBtnGroup.list")}
        </span>
      ),
    },
  ];
  const columns: TableColumnsType<GolfLockerGroupDto> = TableUtil.getColumns(
    [
      {
        title: t("code"),
        dataIndex: "code",
        align: "left",
        width: 100,
      },
      {
        title: t("name"),
        dataIndex: "name",
        align: "left",
        width: 100,
      },
      {
        title: t("notes"),
        dataIndex: "notes",
        align: "left",
        width: 100,
        render: (v) => (
          <TextLineClampDisplay content={v} className="!font-medium" />
        ),
      },
      IsActivedColumnWithFilter(),
    ],
    {
      actions: [
        {
          title: "view-update",
          icon: <EyeOutlined />,
          onClick: (d) => {
            mainStore.openUpdateModal(d);
          },
        },
        {
          title: "remove",
          onClick: (d: GolfLockerGroupDto) => {
            const removeByHash = {
              ...d,
              id: d.id,
            };
            mainStore.openRemoveById(removeByHash);
          },
        },
      ] as ITableAction<GolfLockerGroupDto>[],
      // viewAction: (d) => {
      //   mainStore.openUpdateModal(d);
      // },
      ns: mainStore.getNamespaceLocale(),
    }
  );
  const handleCancel = () => {
    setOpenListModal(false);
  };
  const GolfLockerCreateOrUpdateForm = () => {
    return (
      <Row gutter={16}>
        <Col span={18}>
          <FloatLabel
            label={t("code")}
            required={mainStore.createOrUpdateModal.mode === "update"}
          >
            <Form.Item
              name="code"
              rules={
                mainStore.createOrUpdateModal.mode === "update"
                  ? [ValidateUtils.required]
                  : []
              }
            >
              <OrdInputRegexText maxLength={50} regex={RegexUtil.CodeRegex} />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={6}>
          <Form.Item
            noStyle
            name="isActived"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox>{tCommon("dang_hoat_dong")}</Checkbox>
          </Form.Item>
        </Col>

        <Col span={18}>
          <FloatLabel label={t("name")} required>
            <Form.Item name="name" rules={[ValidateUtils.required]}>
              <Input maxLength={200} />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={6}>
          <FloatLabel label={t("lockertype")}>
            <Form.Item name="status" initialValue={1}>
              <Select>
                <Select.Option value={1 as GolfLockerGroupTypeEnum}>
                  Public
                </Select.Option>
                <Select.Option value={2 as GolfLockerGroupTypeEnum}>
                  Private
                </Select.Option>
              </Select>
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={24}>
          <FloatLabel label={t("notes")}>
            <Form.Item name="notes" rules={[ValidateUtils.maxLength(200)]}>
              <TextArea
                autoSize
                disabled={mainStore.createOrUpdateModal.mode === "viewDetail"}
              />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <Dropdown menu={{ items }}>
        <Button icon={<UnorderedListOutlined />}>
          {t("btnGolfLockerGroup")}
        </Button>
      </Dropdown>
      <Modal
        open={openListModal}
        style={{ top: 5 }}
        width={800}
        onCancel={handleCancel}
        title={t("golfLockerBtnGroup.list")}
        footer={
          <Space wrap>
            <ModalCloseBtn onClick={handleCancel} />
            <Button
              type={"primary"}
              icon={<PlusOutlined />}
              onClick={() => {
                handleCancel();
                mainStore.openCreateModal({});
              }}
            >
              {t("golfLockerBtnGroup.addNew")}
            </Button>
          </Space>
        }
      >
        <OrdCrudPage
          //   key={uuidv4()}
          stored={mainStore}
          columns={columns}
          hiddenTopAction
          searchForm={(f) => {
            return (
              <>
                <SearchIsActived span={8} />
                <SearchFilterText span={16} />
              </>
            );
          }}
          // entityForm={form => <ProductGroupCreateOrUpdateForm/>}
        ></OrdCrudPage>
      </Modal>
      <OrdCreateOrUpdateModal
        stored={mainStore}
        entityForm={() => <GolfLockerCreateOrUpdateForm />}
        onSavedSuccess={async () => {
          selectDataSourceStore.clearByName("GolfLockerGroup");
          await selectDataSourceStore.getOptions(
            "GolfLockerGroup",
            async () => {
              const result = await GolfLockerGroupService.getComboOptions({});
              return Utils.mapCommonSelectOption(result);
            }
          );
        }}
      />
    </>
  );
};
