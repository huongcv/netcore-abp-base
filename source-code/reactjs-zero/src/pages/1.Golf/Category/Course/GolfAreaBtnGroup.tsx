import { PlusOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { GolfAreaDto } from "@api/index.defs";
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

export const GolfAreaBtnGroup = () => {
  const { golfAreaStore: mainStore } = useStore();
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
          {t("golfAreaBtnGroup.addNew")}
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
          {t("golfAreaBtnGroup.list")}
        </span>
      ),
    },
  ];
  const columns: TableColumnsType<GolfAreaDto> = TableUtil.getColumns(
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
        title: t("description"),
        dataIndex: "description",
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
      ] as ITableAction<GolfAreaDto>[],
      viewAction: (d) => {
        mainStore.openUpdateModal(d);
      },
      ns: mainStore.getNamespaceLocale(),
    }
  );
  const handleCancel = () => {
    setOpenListModal(false);
  };
  const GolfAreaCreateOrUpdateForm = () => {
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

        <Col span={24}>
          <FloatLabel label={t("name")} required>
            <Form.Item name="name" rules={[ValidateUtils.required]}>
              <Input maxLength={200} />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={24}>
          <FloatLabel label={t("description")}>
            <Form.Item
              name="description"
              rules={[ValidateUtils.maxLength(200)]}
            >
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
        <Button icon={<UnorderedListOutlined />}>{t("btnGolfArea")}</Button>
      </Dropdown>
      <Modal
        open={openListModal}
        style={{ top: 5 }}
        width={800}
        onCancel={handleCancel}
        title={t("golfAreaBtnGroup.list")}
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
              {t("golfAreaBtnGroup.addNew")}
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
        entityForm={() => <GolfAreaCreateOrUpdateForm />}
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
