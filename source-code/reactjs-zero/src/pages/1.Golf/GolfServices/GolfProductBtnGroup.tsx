import { PlusOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { GolfProductGroupDto } from "@api/index.defs";
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
const { TextArea } = Input;

export const GolfProductBtnGroup = () => {
  const { golfProductGroupStore: mainStore, selectDataSourceStore } =
    useStore();
  const { t } = useTranslation("golf-product-group");
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
          {t("golfProductBtnGroup.addNew")}
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
          {t("golfProductBtnGroup.list")}
        </span>
      ),
    },
  ];
  const columns: TableColumnsType<GolfProductGroupDto> = TableUtil.getColumns(
    [
      {
        title: t("groupCode"),
        dataIndex: "groupCode",
        align: "left",
        width: 50,
      },
      {
        title: t("groupName"),
        dataIndex: "groupName",
        align: "left",
        width: 100,
      },
      {
        title: t("notes"),
        dataIndex: "notes",
        align: "left",
        width: 100,
      },
      IsActivedColumnWithFilter(),
    ],
    {
      actions: [
        {
          title: "edit",
          onClick: (d) => {
            mainStore.openUpdateModal(d);
          },
        },
      ] as ITableAction<GolfProductGroupDto>[],
      viewAction: (d) => {
        mainStore.openUpdateModal(d);
      },
      ns: mainStore.getNamespaceLocale(),
      widthRowIndexCol: 40,
      widthActionCol: 50,
    }
  );
  const handleCancel = () => {
    setOpenListModal(false);
  };
  const GolfProductGroupCreateOrUpdateForm = () => {
    return (
      <Row gutter={16}>
        <Col span={18}>
          <FloatLabel
            label={t("groupCode")}
            required={mainStore.createOrUpdateModal.mode === "update"}
          >
            <Form.Item
              name="groupCode"
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

        <Col span={24}>
          <FloatLabel label={t("groupName")} required>
            <Form.Item name="groupName" rules={[ValidateUtils.required]}>
              <Input maxLength={200} />
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
          {t("golfProductBtnGroupTitle")}
        </Button>
      </Dropdown>
      <Modal
        open={openListModal}
        style={{ top: 5 }}
        width={800}
        onCancel={handleCancel}
        title={t("golfProductBtnGroup.list")}
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
              {t("golfProductBtnGroup.addNew")}
            </Button>
          </Space>
        }
      >
        <OrdCrudPage
          //   key={uuidv4()}
          stored={mainStore}
          columns={columns}
          hiddenTopAction
          //   searchForm={(f) => <ProductGroupSearchForm />}
          // entityForm={form => <ProductGroupCreateOrUpdateForm/>}
        ></OrdCrudPage>
      </Modal>
      <OrdCreateOrUpdateModal
        stored={mainStore}
        entityForm={() => <GolfProductGroupCreateOrUpdateForm />}
        // onSavedSuccess={async () => {
        //   selectDataSourceStore.clearByName("ProductGroup");
        //   await selectDataSourceStore.getOptions("ProductGroup", async () => {
        //     const result = await ProductGroupService.getComboOptions({});
        //     return Utils.mapCommonSelectOption(result);
        //   });
        // }}
      />
    </>
  );
};
