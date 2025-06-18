import { useStore } from "@ord-store/index";
import {
  Badge,
  Form,
  FormInstance,
  InputNumber,
  Modal,
  Table,
  Tabs,
} from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import TableUtil from "@ord-core/utils/table.util";
import { ProductTypeCell } from "@pages/ProductManagement/Product/datatable/ProductTypeCell";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import { MOVE_TYPE, ProductSearchWithUnitDto } from "@api/index.defs";
import { ColumnType } from "antd/es/table/interface";
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { FooterCrudModal } from "@ord-components/crud/FooterCrudModal";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import GridProductItemsInModal, {
  selectedProductFieldName,
} from "@pages/StockManagement/OrderStock/search-table-modal/GridProductItemsInModal";
import FormList from "antd/es/form/FormList";
import { GetFileUrl } from "@ord-core/service-proxies/axios.base";
import "./TableDesign.scss";

export const getProductColumns = (
  formRefTable: FormInstance,
  onChangeQty: (
    product: ProductSearchWithUnitDto,
    index: number,
    value: number
  ) => void
) => {
  const { t } = useTranslation("stock");
  const getDataColumn = (index: number, fieldName: string) => {
    return formRefTable.getFieldValue([
      selectedProductFieldName,
      index,
      fieldName,
    ]);
  };
  return [
    {
      title: t("order"),
      dataIndex: "stt",
      width: 10,
      className: "columes-styles-stt",
      render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
    },
    {
      title: t("productCode"),
      dataIndex: "productCode",
      width: 30,
      className: "columes-styles-code",
      render: (_, __, index: number) => (
        <span style={{ width: "100%", color: "#3BB54A" }}>
          {getDataColumn(index, "productCode")}
        </span>
      ),
    },
    {
      title: t("productName"),
      dataIndex: "productName",
      width: 250,
      render: (_, __, index: number) => {
        const info = getDataColumn(index, "productName");
        const img = getDataColumn(index, "imageUrl");
        const imgTemp = img
          ? GetFileUrl(img)
          : "/images/product-placeholder.png";
        return (
          <div className="info-product">
            <div className="container-img">
              <img
                className="img-box"
                src={imgTemp}
                alt="/images/product-placeholder.png"
              />
            </div>
            <span style={{ width: "85%" }} className="name">
              {info}
            </span>
          </div>
        );
      },
    },
    {
      title: t("qty"),
      dataIndex: "qty",
      width: "100px",
      render: (_: any, __, index: number) => (
        <Form.Item name={[index, "qty"]} style={{ margin: 0 }}>
          <InputNumber
            className="styles-input-number"
            addonAfter={__.unitName}
            min={0}
            placeholder="..."
            step={1}
            onChange={(value) => {
              onChangeQty(__, index, value as number);
            }}
            style={{ width: "100%" }}
          />
        </Form.Item>
      ),
    },
    {
      title: t("productTypeId"),
      dataIndex: "productTypeId",
      width: "130px",
      render: (_, __, index: number) => (
        <ProductTypeCell value={getDataColumn(index, "productTypeId")} />
      ),
    },
    {
      title: t("productPrice"),
      dataIndex: "productPrice",
      align: "end",
      render: (_, __, index: number) => (
        <PriceCell
          className="price-style"
          value={getDataColumn(index, "price")}
        />
      ),
      width: "90px",
    },
  ] as ColumnType<ProductSearchWithUnitDto>[];
};

const ListSelected = (props: { form: FormInstance }) => {
  const { t } = useTranslation("stock");
  const { stockSearchProductStore } = useStore();
  const columns: ColumnType<ProductSearchWithUnitDto>[] = [
    ...getProductColumns(props.form, (__, index, value) => {}),
    {
      title: "",
      align: "center",
      width: 10,
      render: (_, dto) => {
        return (
          <a
            className={"text-red"}
            onClick={() => {
              stockSearchProductStore.remove(dto.productUnitId);
            }}
          >
            {" "}
            <DeleteOutlined></DeleteOutlined>
          </a>
        );
      },
    },
  ];

  useEffect(() => {
          stockSearchProductStore.extraParams = null;
  }, [])

  return (
    <>
      <Form form={props.form}>
        <FormList name={selectedProductFieldName}>
          {(fields, { add, remove }) => {
            // addRowRef.current = add;
            // removeRowRef.current = remove;
            return (
              <Table<ProductSearchWithUnitDto>
                dataSource={fields.map((field, index) => {
                  return {
                    ...props.form.getFieldValue([
                      selectedProductFieldName,
                      index,
                    ]),
                    rowKey: "" + field.key,
                  };
                })}
                columns={columns}
                pagination={false}
                rowKey={(d) => `${d.productUnitId}`}
              />
            );
          }}
        </FormList>
      </Form>
    </>
  );
};

const SearchProductTenantTableModal = (props: {
  moveType?: MOVE_TYPE;
  supplierListData: SelectDataSource;
  onItemsSelected?: (items: ProductSearchWithUnitDto[]) => void;
}) => {
  const { t } = useTranslation("stock");
  const { stockSearchProductStore } = useStore();
  const [tabActiveKey, setTabActiveKey] = useState("0");
  const { isModalOpen } = stockSearchProductStore;
  const [formSelected] = Form.useForm();
  const wItem: ProductSearchWithUnitDto[] = Form.useWatch(
    selectedProductFieldName,
    formSelected
  );
  const handleCancel = () => {
    stockSearchProductStore.handleCancel();
  };
  useEffect(() => {
    if (stockSearchProductStore.isModalOpen) {
      formSelected.setFieldValue(
        selectedProductFieldName,
        stockSearchProductStore?.selectedRows ?? []
      );
      setTabActiveKey("0");
      setTabActiveKey("1");
    }
  }, [stockSearchProductStore.isModalOpen]);
  return (
    <>
      <Modal
        title={t("searchProduct")}
        className={"ord-modal-tab"}
        style={{ top: 10 }}
        width={1300}
        open={isModalOpen}
        footer={
          <FooterCrudModal
            okBtn={
              <>
                <CheckOutlined className={"me-1"} />{" "}
                {t("submitProductSelected")}
              </>
            }
            onCancel={handleCancel}
            onOk={() => {
              if (props.onItemsSelected) {
                stockSearchProductStore.setNewSelectedRows(wItem);
                props.onItemsSelected(wItem);
              }
              stockSearchProductStore.handleCancel();
            }}
          />
        }
        onCancel={handleCancel}
      >
        <div className={"stock-product-search-modal"}>
          <Tabs
            activeKey={tabActiveKey}
            onChange={setTabActiveKey}
            items={[
              {
                key: "1",
                forceRender: true,
                label: t("productList"),
                children: (
                  <>
                    <GridProductItemsInModal
                      usingTab={tabActiveKey == "1"}
                      supplierListData={props.supplierListData}
                      formSelected={formSelected}
                    ></GridProductItemsInModal>

                    {/*<OrdCrudPage stored={stockSearchProductStore}*/}
                    {/*             initSearchFormData={*/}
                    {/*                 {*/}
                    {/*                     moveType: props.moveType,*/}
                    {/*                     shopId: props.supplierListData?.data[1]?.value*/}
                    {/*                 }*/}
                    {/*             }*/}
                    {/*             hiddenTopAction={true}*/}
                    {/*             columns={TableUtil.translateTitleColumns(columns, 'product')}*/}
                    {/*             searchForm={(f) => <>*/}
                    {/*                 <Col {...useResponsiveSpan(6)}>*/}
                    {/*                     <FloatLabel label={t('shopId')}>*/}
                    {/*                         <Form.Item name='shopId'>*/}
                    {/*                             <OrdSelect datasource={props.supplierListData}/>*/}
                    {/*                         </Form.Item>*/}
                    {/*                     </FloatLabel>*/}

                    {/*                 </Col>*/}
                    {/*                 <Col {...useResponsiveSpan(6)}>*/}
                    {/*                     <FloatLabel label={t('ProductType')}>*/}
                    {/*                         <Form.Item name='productTypeId'>*/}
                    {/*                             <OrdSelect datasource={useSelectProductType()}/>*/}
                    {/*                         </Form.Item>*/}
                    {/*                     </FloatLabel>*/}

                    {/*                 </Col>*/}
                    {/*                 <Col {...useResponsiveSpan(8)}>*/}
                    {/*                     <FloatLabel label={t('ProductGroup')}>*/}
                    {/*                         <Form.Item name='listProductGroup'>*/}
                    {/*                             <SelectAddNewProductGroup hiddenAddNew={true}/>*/}
                    {/*                         </Form.Item>*/}
                    {/*                     </FloatLabel>*/}

                    {/*                 </Col>*/}
                    {/*                 <SearchFilterText span={10}/>*/}
                    {/*                 /!*<ProductSearch/>*!/*/}
                    {/*                 <div hidden>*/}
                    {/*                     <Form.Item name={'moveType'}>*/}
                    {/*                         <Input></Input>*/}
                    {/*                     </Form.Item>*/}
                    {/*                 </div>*/}
                    {/*             </>}*/}
                    {/*             rowSelection={{type: 'checkbox', ...rowSelection}}*/}
                    {/*             tableRowKey={'productUnitId'}*/}
                    {/*></OrdCrudPage>*/}
                  </>
                ),
              },
              {
                key: "2",
                forceRender: true,
                label: (
                  <>
                    {t("productListSelected")}
                    <Badge
                      className={"ms-2"}
                      count={wItem?.length ?? 0}
                    ></Badge>
                  </>
                ),
                children: (
                  <>
                    <ListSelected form={formSelected} />
                  </>
                ),
              },
            ]}
          ></Tabs>
        </div>
      </Modal>
    </>
  );
};
export default observer(SearchProductTenantTableModal);
