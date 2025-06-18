import {Button, Dropdown, MenuProps, Space} from "antd";
import {
    BarcodeOutlined, DownOutlined,
    EditOutlined,
    FileExcelOutlined,
    RedoOutlined,
    SettingOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import PrintBarcodeProductModal from "@pages/ProductManagement/Product/Tools/PrintBarcodeProductModal";
import React, { useState } from "react";
import SettingBarcodeModal from "@pages/ProductManagement/Product/Tools/bar-code-setting/SettingBarcodeModal";
import { useStore } from "@ord-store/index";
import { Link } from "react-router-dom";
import UiUtils from "@ord-core/utils/ui.utils";
import { fetchSyncDataProducts } from "@ord-core/db/services/syncDataProducts";

const ProductToolAction = () => {
  const [t] = useTranslation("product");
  const { productStore: mainStore } = useStore();
  const [isPrintBarcodeModalOpen, setIsPrintBarcodeModalOpen] = useState(false);
  const [isSettingBarcodeModalOpen, openSettingBarCode] = useState(false);
  const reloadDbProduct = async () => {
    UiUtils.setBusy();
    try {
      await fetchSyncDataProducts(true);
    } catch {
    } finally {
      UiUtils.clearBusy();
    }
  };
  const items: MenuProps["items"] = [
    {
      key: "-1",
      label: (
        <Link to={"import-excel"}>
          <span >
            <UploadOutlined className={"me-1"} />
            {t("importExcel")}
          </span>
        </Link>
      ),
    },
    {
      key: "0",
      label: (
        <span
          
          onClick={() => {
            mainStore.exportExcelPagedResult().then();
          }}
        >
          <FileExcelOutlined className={"me-1"} />
          {t("exportExcel")}
        </span>
      ),
    },
    // {
    //   key: "1",
    //   label: (
    //     <span
    //
    //       onClick={() => {
    //         setIsPrintBarcodeModalOpen(true);
    //       }}
    //     >
    //       <BarcodeOutlined className={"me-1"} />
    //       {t("printBarCode")}
    //     </span>
    //   ),
    // },
    // {
    //   key: "2",
    //   label: (
    //     <span
    //
    //       onClick={() => {
    //         openSettingBarCode(true);
    //       }}
    //     >
    //       <SettingOutlined className={"me-1"} />
    //       {t("settingBarCode")}
    //     </span>
    //   ),
    // },
    // {
    //   key: "3",
    //   label: (
    //     <span
    //
    //       onClick={() => {
    //         reloadDbProduct();
    //       }}
    //     >
    //       <RedoOutlined className={"me-1"} />
    //       {t("refreshDbProduct")}
    //     </span>
    //   ),
    // },
  ];
  return (
    <>
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

      <PrintBarcodeProductModal
        isModalOpen={isPrintBarcodeModalOpen}
        onCloseModal={() => {
          setIsPrintBarcodeModalOpen(false);
        }}
      />
      <SettingBarcodeModal
        isModalOpen={isSettingBarcodeModalOpen}
        onCloseModal={() => {
          openSettingBarCode(false);
        }}
      ></SettingBarcodeModal>
    </>
  );
};
export default ProductToolAction;
