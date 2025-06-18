import {
  BarcodeOutlined,
  FileExcelOutlined,
  ImportOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useStore } from "@ord-store/index";
import { Button, Dropdown, MenuProps, Spin } from "antd";
import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import SettingDiscountBarcodeModal from "./Modal/SettingDiscountBarCodeModal";
import PrintDiscountBarcodeModal from "./Modal/PrintDiscountBarcodeModal";

export default function DiscountAction() {
  const [t] = useTranslation("discount");
  const { productDiscountStore: mainStore } = useStore();
  const [isDicountSettingBarcodeModalOpen, openDicountSettingBarCode] =
    useState(false);
  const [isPrintBarcodeModalOpen, setIsPrintBarcodeModalOpen] = useState(false);
  const items: MenuProps["items"] = [
    {
      key: "-1",
      label: (
        <a
          onClick={() => mainStore.setIsShowExcelModal(true)}
        >
          <ImportOutlined /> Import excel
        </a>
      ),
    },
    {
      key: "0",
      label: (
        <a
          onClick={() => {
            mainStore.exportExcelPagedResult().then();
          }}
        >
          <FileExcelOutlined className={"me-1"} />
          {t("exportExcel")}
        </a>
      ),
    },
    {
      key: "1",
      label: (
        <a
          onClick={() => {
            setIsPrintBarcodeModalOpen(true);
          }}
        >
          <BarcodeOutlined className={"me-1"} />
          {t("printBarCode")}
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          onClick={() => {
            openDicountSettingBarCode(true);
          }}
        >
          <SettingOutlined className={"me-1"} />
          {t("settingBarCode")}
        </a>
      ),
    },
  ];

  const LazyModalExcel = lazy(
    () =>
      import(
        "@pages/ProductManagement/Discount/Modal/ModalTabImportDataDiscount"
      )
  );

  return (
    <>
      <Dropdown menu={{ items }}>
        <Button className={"btn-other"} icon={<SettingOutlined />}>
          {t("toolDiscountActions")}
        </Button>
      </Dropdown>
      <PrintDiscountBarcodeModal
        isModalOpen={isPrintBarcodeModalOpen}
        onCloseModal={() => {
          setIsPrintBarcodeModalOpen(false);
        }}
      />
      <SettingDiscountBarcodeModal
        isModalOpen={isDicountSettingBarcodeModalOpen}
        onCloseModal={() => openDicountSettingBarCode(false)}
      />
      <Suspense fallback={<Spin />}>
        {mainStore.isShowExcelModal ? <LazyModalExcel /> : null}
      </Suspense>
    </>
  );
}
