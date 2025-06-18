import { ImportDiscountSupplierOutputDto } from "@api/index.defs";
import { useStore } from "@ord-store/index";
import { RcFile } from "antd/es/upload";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import UiUtils from "@ord-core/utils/ui.utils";
import { DiscountService } from "@api/DiscountService";
import { Button, Modal, Space, Tabs, TabsProps } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DownloadOutlined,
  FileDoneOutlined,
  ImportOutlined,
  RightOutlined,
} from "@ant-design/icons";
import ImportSourceDiscount from "./ImportSourceDiscount";
import CheckSourceDiscount from "../Excel/CheckSourceDiscount";
import { ImportExcelButton } from "@ord-components/excel/ImportExcelButton";
import { observer } from "mobx-react-lite";

const ModalTabImportDataDiscount = () => {
  const { productDiscountStore: mainStore } = useStore();
  const { t } = useTranslation("excel");
  const [activeTab, setActiveTab] = React.useState("1");
  const [fileUpload, setFileUpload] = useState<RcFile>();
  const [resultImport, setResultImport] =
    useState<ImportDiscountSupplierOutputDto>();
  const handleFileUpload = (result: RcFile) => {
    setFileUpload(result);
  };
  const handleNextTab = () => {
    if (activeTab === "1") {
      startImportFileUpload(fileUpload).then((r) => setActiveTab("2"));
    }
  };

  const startImportFileUpload = async (file: RcFile | undefined) => {
    try {
      UiUtils.setBusy();
      const response = await DiscountService.import({
        files: [file] as any,
      });
      if (response.isSuccessful) {
        UiUtils.clearBusy();
        setResultImport(response.data);
      } else {
        UiUtils.clearBusy();
        UiUtils.showError(t("excelAlert.error"));
      }
    } catch (error) {
      UiUtils.clearBusy();
      UiUtils.showError(t("excelAlert.error"));
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <Space>
          <ImportOutlined />
          {t("excelAction.importSource")}
        </Space>
      ),
      children: (
        <div>
          <ImportSourceDiscount onFileUpload={handleFileUpload} />
          <div
            style={{ marginBottom: 20, display: "flex", justifyContent: "end" }}
          >
            <Button
              icon={<CloseOutlined />}
              type={"default"}
              onClick={() => mainStore.setIsShowExcelModal(false)}
            >
              {t("actionBtn.close")}
            </Button>
            <Button style={{ marginLeft: 10 }}>
              <a
                href="/excels/mau-danh-sach-nhom-san-pham.xlsx"
                target={"_blank"}
              >
                <DownloadOutlined />
                {t("importDownloadTemplateBtn")}
              </a>
            </Button>

            <Button
              type={"primary"}
              style={{ marginLeft: 10 }}
              onClick={handleNextTab}
              disabled={fileUpload == null}
            >
              {t("actionBtn.next")}
              <RightOutlined />
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <Space>
          <CheckOutlined />
          {t("excelAction.checkSource")}
        </Space>
      ),
      disabled: activeTab === "1",
      children: (
        <div>
          <CheckSourceDiscount result={resultImport} />
          <div
            style={{ marginBottom: 20, display: "flex", justifyContent: "end" }}
          >
            <Button
              icon={<CloseOutlined />}
              type={"default"}
              onClick={() => mainStore.setIsShowExcelModal(false)}
            >
              {t("actionBtn.close")}
            </Button>
            <Button
              icon={<FileDoneOutlined />}
              type={"primary"}
              style={{ marginLeft: 10 }}
              onClick={() => {
                mainStore.setIsShowExcelModal(false);
                mainStore.refreshGridData().then();
              }}
            >
              {t("actionBtn.done")}
            </Button>
          </div>
        </div>
      ),
    },
  ];
  return (
    <>
      <Modal
        width={1200}
        title={t("importExcel")}
        open={mainStore.isShowExcelModal}
        onOk={() => {
          mainStore.setIsShowExcelModal(false);
          mainStore.refreshGridData().then();
        }}
        onCancel={() => mainStore.setIsShowExcelModal(false)}
        footer={null}
      >
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={items}
          type="card"
          centered
        />
      </Modal>
    </>
  );
};
export default observer(ModalTabImportDataDiscount);
