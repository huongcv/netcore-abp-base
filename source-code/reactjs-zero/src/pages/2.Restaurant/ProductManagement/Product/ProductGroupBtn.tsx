import { Button, Dropdown, MenuProps, Modal, Space } from "antd";
import {
  FileExcelOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { IconlyLight } from "@ord-components/icon/IconlyLight";
import { ProductGroupColumns } from "@pages/ProductManagement/ProductGroup";
import { useStore } from "@ord-store/index";
import { Link } from "react-router-dom";
import { ProductGroupSearchForm } from "@pages/ProductManagement/ProductGroup/datatable/SearchForm";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import ModalCloseBtn from "@ord-components/btn-action/ModalCloseBtn";
import OrdCreateOrUpdateModal from "@ord-components/crud/OrdCreateOrUpdateModal";
import { ProductGroupCreateOrUpdateForm } from "@pages/ProductManagement/ProductGroup/forms/CreateOrUpdateForm";
import { ProductGroupService } from "@api/ProductGroupService";
import Utils from "@ord-core/utils/utils";
import { v4 as uuidv4 } from "uuid";

const ProductGroupBtn = () => {
  const { productGroupStore: mainStore, selectDataSourceStore } = useStore();
  const [t] = useTranslation(mainStore.getNamespaceLocale());
  const [openListModal, setOpenListModal] = useState(false);
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
          {t("productGroupAction.addNew")}
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
          {t("productGroupAction.list")}
        </span>
      ),
    },
    {
      key: "2",
      label: (
        <Link to={"/product-group/import-excel"}>
          <span>
            <UploadOutlined className={"me-1"} />
            {t("productGroupAction.importExcel")}
          </span>
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <span
          onClick={() => {
            mainStore.exportExcelPagedResult().then();
          }}
        >
          <FileExcelOutlined className={"me-1"} />
          {t("productGroupAction.exportExcel")}
        </span>
      ),
    },
  ];
  const columns = ProductGroupColumns(mainStore);
  const handleCancel = () => {
    setOpenListModal(false);
  };

  return (
    <>
      <Dropdown menu={{ items }}>
        <Button icon={<UnorderedListOutlined />}>{t("productGroup")}</Button>
      </Dropdown>
      {/*<div hidden>*/}
      {/*    <ProductGroup></ProductGroup>*/}
      {/*</div>*/}
      <Modal
        open={openListModal}
        style={{ top: 5 }}
        width={1300}
        onCancel={handleCancel}
        title={t("productGroupAction.listOfGroup")}
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
              {t("productGroupAction.addNew")}
            </Button>
          </Space>
        }
      >
        <OrdCrudPage
          key={uuidv4()}
          stored={mainStore}
          columns={columns}
          hiddenTopAction
          searchForm={(f) => <ProductGroupSearchForm />}
          // entityForm={form => <ProductGroupCreateOrUpdateForm/>}
        ></OrdCrudPage>
      </Modal>
      <OrdCreateOrUpdateModal
        stored={mainStore}
        entityForm={() => <ProductGroupCreateOrUpdateForm />}
        onSavedSuccess={async () => {
          selectDataSourceStore.clearByName("ProductGroup");
          await selectDataSourceStore.getOptions("ProductGroup", async () => {
            const result = await ProductGroupService.getComboOptions({});
            return Utils.mapCommonSelectOption(result);
          });
        }}
      />
    </>
  );
};
export default ProductGroupBtn;
