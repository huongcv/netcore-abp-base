import * as React from "react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Form, Input, Modal, Popover, Progress, TableColumnsType } from "antd";
import TableUtil from "@ord-core/utils/table.util";
import { useStore } from "@ord-store/index";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import { InvoiceSearch } from "@pages/SalesInvoice/Invoice/invoiceSearch";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import { SaleInvoiceStatusCell } from "@pages/SalesInvoice/InvoiceReturn/datatable/saleInvoiceStatusCell";
import { SaleInvoiceDto } from "@api/index.defs";
import DateUtil from "@ord-core/utils/date.util";
import { useTranslation } from "react-i18next";
import { PopoverDetailInvoiceReturn } from "@pages/SalesInvoice/InvoiceReturn/datatable/popoverDetailInvoiceReturn";
import { CloseOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useHotkeys } from "react-hotkeys-hook";
import { HotKeyScope } from "@ord-core/AppConst";
import { MoveType } from "@pages/StockManagement/Shared/Const/StockMoveConst";

export const ListInvoiceReturn = forwardRef(
  (
    props: {
      invoiceSelectHandler: Function;
    },
    ref: any
  ) => {
    const { saleInvoiceStore: mainStore } = useStore();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { t } = useTranslation("sale-invoice");
    const invoiceSelect = (dto: SaleInvoiceDto) => {
      props.invoiceSelectHandler(dto);
      handleCancel();
    };

    const columns: TableColumnsType<any> = TableUtil.getColumns(
      [
        {
          title: "invoiceCode",
          dataIndex: "invoiceCode",
          width: 120,
          align: "center",
          render: (text, dto) => {
            return (
              <>
                <a
                  className="font-semibold underline"
                  onClick={() => invoiceSelect(dto)}
                >
                  {text}
                </a>
              </>
            );
          },
        },
        {
          dataIndex: "invoiceDate",
          title: "invoiceDate",
          width: 150,
          align: "center",
          render: (v) => DateUtil.toFormat(v),
        },
        {
          title: "partnerName",
          dataIndex: "partnerName",
        },
        {
          dataIndex: "totalQty",
          title: "statusReturn",
          align: "center",
          render: (text, dto) => {
            return (
              <>
                {dto.totalReturnQtyConvert ? (
                  <Popover
                    content={
                      <PopoverDetailInvoiceReturn
                        invoiceId={dto.id}
                      ></PopoverDetailInvoiceReturn>
                    }
                    title="Chi tiết trả hàng"
                  >
                    <div className="flex items-center gap-0 cursor-pointer">
                      <Progress
                        format={(percent) => ``}
                        percent={
                          ((dto.totalReturnQtyConvert ?? 0) /
                            (dto.totalQtyConvert ?? 1)) *
                          100
                        }
                        size={[150, 15]}
                      />
                      <InfoCircleOutlined className="mt-[-5px]" />
                    </div>
                  </Popover>
                ) : (
                  <Progress
                    format={(percent) => ``}
                    percent={0}
                    size={[165, 15]}
                  />
                )}
              </>
            );
          },
          width: 130,
        },
        {
          dataIndex: "totalAmount",
          title: "productAmount",
          align: "end",
          render: (v) => <PriceCell value={v} />,
          width: 130,
        },
        {
          dataIndex: "paymentAmount",
          title: "payment",
          align: "end",
          render: (v) => <PriceCell value={v} />,
          width: 130,
        },
        {
          dataIndex: "status",
          title: "status",
          align: "center",
          render: (v) => <SaleInvoiceStatusCell status={v} />,
          width: 130,
        },
      ],
      {
        actions: [],
        ns: mainStore.getNamespaceLocale(),
      }
    );

    const showModal = () => {
      setOpen(true);
    };

    const handleOk = () => {
      props.invoiceSelectHandler(undefined);
      handleCancel();
    };

    const handleCancel = () => {
      setOpen(false);
    };

    useImperativeHandle(ref, () => ({
      showModal,
    }));

    useHotkeys(
      "F10",
      (event) => {
        handleCancel();
        event.preventDefault();
      },
      { scopes: [HotKeyScope.crudPageBase], enableOnFormTags: true }
    );

    return (
      <>
        <Modal
          title={t("selectInvoiceReturn")}
          open={open}
          wrapClassName="modal-list"
          width={1200}
          maskClosable={false}
          style={{ top: "30px" }}
          onCancel={handleCancel}
          cancelText={
            <>
              <CloseOutlined /> {t("cancelModal")} (F10)
            </>
          }
          okText={t("returnWithoutInvoice")}
          onOk={handleOk}
          destroyOnClose
        >
          <OrdCrudPage
            stored={mainStore}
            hiddenTopAction={true}
            columns={columns}
            searchForm={(f) => (
              <>
                <InvoiceSearch defaultStatus={4} alowEq={true} />
                <Form.Item
                  name="moveType"
                  hidden
                  noStyle
                  initialValue={MoveType.HoaDon}
                >
                  <Input />
                </Form.Item>
              </>
            )}
            entityForm={undefined}
          ></OrdCrudPage>
        </Modal>
      </>
    );
  }
);
