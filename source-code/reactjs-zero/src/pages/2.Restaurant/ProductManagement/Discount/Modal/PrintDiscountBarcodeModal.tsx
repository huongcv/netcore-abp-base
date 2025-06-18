import { DiscountBarCodeService } from "@api/DiscountBarCodeService";
import {
  DiscountBarCodeLayoutSettingDto,
  ShopDiscountDto,
} from "@api/index.defs";
import { useStore } from "@ord-store/index";
import { Badge, Button, Col, Form, Modal, Row, Space } from "antd";
import { ColumnType, TableProps } from "antd/es/table";
import { observable } from "mobx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import UiUtils from "@ord-core/utils/ui.utils";
import { PrinterOutlined } from "@ant-design/icons";
import ModalCloseBtn from "@ord-components/btn-action/ModalCloseBtn";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import PrintBarcodeRightBox from "../forms/PrintDiscountBarcodeRightBox";
import {StatusCell} from "@ord-components/table/cells/StatusCell";

const PrintDiscountBarcodeModal = (props: {
  isModalOpen: boolean;
  onCloseModal: () => void;
}) => {
  const [t] = useTranslation("discount");
  const { discountListPrintBarcodeStore, sessionStore } = useStore();
  const { isModalOpen, onCloseModal } = props;
  const [form] = Form.useForm();
  const [barcodeLayoutItems, setBarcodeLayoutItem] = useState<
    DiscountBarCodeLayoutSettingDto[]
  >([]);

  const discountItems_w = Form.useWatch("discountItems", form);
  const handleOk = () => {};
  const handleCancel = () => {
    onCloseModal();
    discountListPrintBarcodeStore.setSelectedRows([]);
  };

  useEffect(() => {
    if (!!props.isModalOpen) {
      DiscountBarCodeService.getSetting().then((items) => {
        setBarcodeLayoutItem(items);
      });
    }
  }, [props.isModalOpen]);

  const SearchBox = () => {
    return (
      <>
        <SearchFilterText span={24} />
      </>
    );
  };

  const columns: ColumnType<ShopDiscountDto>[] = [
    {
      title: t("code"),
      dataIndex: "code",
      width: 90,
      sorter: true,
    },
    {
      title: t("discountStatus"),
      dataIndex: "discountStatus",
      width: 90,
      sorter: true,
      render(value) {
        return <StatusCell isActived={value} />;
      },
    },
  ];
  const handlerPrint = () => {
    form.submit();
  };

  const rowSelection: TableProps<ShopDiscountDto>["rowSelection"] = {
    selectedRowKeys: discountListPrintBarcodeStore.selectedRowKeys,
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: ShopDiscountDto[]
    ) => {
      discountListPrintBarcodeStore.setSelectedRows(selectedRows);
    },
    getCheckboxProps: (record: ShopDiscountDto) => ({
      name: record.id,
      disabled: record.discountStatus === 2 || record.discountStatus === 3,
    }),
  };
  const print = async (valueForm: any) => {
    UiUtils.setBusy();
    try {
      const layoutSetting: DiscountBarCodeLayoutSettingDto =
        valueForm.layoutSetting;
      if (!layoutSetting) {
        UiUtils.showError(t("notSelectLayoutBarcode"));
        return;
      }
      const resultBlob = await DiscountBarCodeService.printBarcode(
        {
          body: {
            discounts: [...valueForm.discountItems],
            setting: {
              ...layoutSetting,
            },
          },
        },
        {
          responseType: "blob",
        }
      );
      UiUtils.showPrintWindow(resultBlob);
    } catch {
    } finally {
      setTimeout(() => {
        UiUtils.clearBusy();
      }, 500);
    }
  };
  return (
    <>
      <Modal
        title={t("printBarCode")}
        width={1500}
        style={{ top: 5 }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={
          <>
            <Space wrap>
              <Button
                disabled={!(discountItems_w && discountItems_w.length > 0)}
                onClick={handlerPrint}
                type={"primary"}
                icon={<PrinterOutlined />}
              >
                {t("print")}
                <Badge
                  count={discountItems_w && discountItems_w.length}
                ></Badge>
              </Button>
              <ModalCloseBtn onClick={handleCancel} />
            </Space>
          </>
        }
      >
        <Row gutter={12}>
          <Col span={9}>
            <h3 className={"text-primary text-xl mb-3"}>{t("list")}</h3>

            <OrdCrudPage
              stored={discountListPrintBarcodeStore}
              hiddenTopAction={true}
              columns={columns}
              searchForm={(f) => <SearchBox />}
              rowSelection={{ type: "checkbox", ...rowSelection }}
            ></OrdCrudPage>
          </Col>
          <Col span={15}>
            <Form form={form} onFinish={print}>
              {barcodeLayoutItems && (
                <PrintBarcodeRightBox barcodeLayoutItems={barcodeLayoutItems} />
              )}
            </Form>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default PrintDiscountBarcodeModal;
