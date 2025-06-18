import { ProductSearchWithUnitDto } from "@api/index.defs";
import {
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Row,
  Table,
  TablePaginationConfig,
} from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@ord-store/index";
import { TableProps } from "antd/es/table/InternalTable";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import FormList from "antd/es/form/FormList";
import { ProductTypeCell } from "@pages/ProductManagement/Product/datatable/ProductTypeCell";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import { useResponsiveSpan } from "@ord-core/hooks/useResponsiveSpan";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { useSelectProductType } from "@ord-components/forms/select/selectDataSource/useSelectProductType";
import { SelectAddNewProductGroup } from "@ord-components/forms/select/addNewEntityAfterForm/selectAddNewProductGroup";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import { getProductColumns } from "@pages/StockManagement/OrderStock/search-table-modal/SearchProductTenantTableModal";

interface IProductWithUnitAndQty extends ProductSearchWithUnitDto {}

export const selectedProductFieldName = "itemSelected";
type ColumnTypes = Exclude<
  TableProps<IProductWithUnitAndQty>["columns"],
  undefined
>;
const GridProductItemsInModal = (props: {
  formSelected: FormInstance;
  supplierListData: SelectDataSource;
  usingTab: boolean;
}) => {
  const { t } = useTranslation("stock");

  const { stockSearchProductStore: searchProductStore } = useStore();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });
  const [searchFormRef] = Form.useForm();
  const [formRefTable] = Form.useForm();
  useEffect(() => {
    mapValueTable();
  }, [searchProductStore.selectedRows]);

  useEffect(() => {
    searchProductStore.extraParams = null;
  }, [])
  
  const wItem: ProductSearchWithUnitDto[] = Form.useWatch(
    selectedProductFieldName,
    props.formSelected
  );
  useEffect(() => {
    if (!props.usingTab) {
      mapValueTable();
    }
  }, [props.usingTab, wItem]);

  function mapValueTable() {
    const tableVal: ProductSearchWithUnitDto[] =
      formRefTable.getFieldValue(selectedProductFieldName) ?? [];
    tableVal.forEach((item) => {
      const findIdx = wItem.find((x) => x.productUnitId == item.productUnitId);
      if (findIdx) {
        item.qty = findIdx.qty;
      } else {
        item.qty = undefined;
      }
    });
    formRefTable.setFieldValue(selectedProductFieldName, tableVal);
  }

  const columns: ColumnTypes = getProductColumns(
    formRefTable,
    (__, index, value) => {
      const selectedVal: ProductSearchWithUnitDto[] =
        props.formSelected.getFieldValue(selectedProductFieldName) ?? [];
      const findIdx = selectedVal.findIndex(
        (x) => x.productUnitId == __.productUnitId
      );
      if (findIdx > -1) {
        if (value > 0) {
          selectedVal[findIdx].qty = value;
        } else {
          selectedVal.splice(index, 1);
        }
        props.formSelected.setFieldValue(selectedProductFieldName, [
          ...selectedVal,
        ]);
      } else {
        __.qty = value as number;
        selectedVal.push(__);
        props.formSelected.setFieldValue(selectedProductFieldName, [
          ...selectedVal,
        ]);
      }
    }
  );
  const w_shopId = Form.useWatch("shopId", searchFormRef);
  useEffect(() => {
    fetchData();
  }, [w_shopId]);

  useEffect(() => {
    if (props.supplierListData.data[1].value) {
      searchFormRef.setFieldValue(
        "shopId",
        props.supplierListData.data[1].value
      );
    }
  }, [props.supplierListData]);

  const fetchData = () => {
    const searchData = searchFormRef?.getFieldsValue() ?? {};
    if (searchData.shopId) {
      setLoading(true);
      searchProductStore
        .apiService()
        .getPaged(
          {
            body: {
              ...searchData,
              skipCount:
                ((tableParams.current as number) - 1) *
                (tableParams.pageSize as number),
              maxMaxResultCount: tableParams.pageSize,
            },
          },
          {}
        )
        .then((res) => {
          setLoading(false);
          formRefTable.setFieldValue(selectedProductFieldName, res.items);
          mapValueTable();
          setTableParams({
            ...tableParams,
            total: res.totalCount as number,
          });
        });
    } else {
      formRefTable.setFieldValue(selectedProductFieldName, []);
      mapValueTable();
      setTableParams({
        ...tableParams,
        total: 0,
      });
    }
  };
  useEffect(fetchData, [
    tableParams.current,
    tableParams.pageSize,
    searchProductStore.refreshDataState,
  ]);
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setTableParams(pagination);
    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== pagination?.pageSize) {
      formRefTable.setFieldValue(selectedProductFieldName, []);
    }
  };

  return (
    <div className="grid-product-item-container">
      <Form
        form={searchFormRef}
        layout={"vertical"}
        onFinish={() => {
          fetchData();
        }}
      >
        <Row gutter={[16, 16]}>
          <Col {...useResponsiveSpan(6)}>
            <FloatLabel label={t("shopId")}>
              <Form.Item name="shopId">
                <OrdSelect datasource={props.supplierListData} />
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col {...useResponsiveSpan(4)}>
            <FloatLabel label={t("ProductType")}>
              <Form.Item name="productTypeId">
                <OrdSelect datasource={useSelectProductType()} />
              </Form.Item>
            </FloatLabel>
          </Col>
          <Col {...useResponsiveSpan(4)}>
            <FloatLabel label={t("ProductGroup")}>
              <Form.Item name="listProductGroup">
                <SelectAddNewProductGroup hiddenAddNew={true} />
              </Form.Item>
            </FloatLabel>
          </Col>
          <SearchFilterText
            onReset={() => {
              searchFormRef.resetFields();
              fetchData();
            }}
            span={10}
          />
          {/*<ProductSearch/>*/}
          <div hidden>
            <Form.Item name={"moveType"}>
              <Input></Input>
            </Form.Item>
          </div>
        </Row>
      </Form>

      <Form form={formRefTable}>
        <FormList name={selectedProductFieldName}>
          {(fields, { add, remove }) => {
            return (
              <Table<IProductWithUnitAndQty>
                loading={loading}
                dataSource={fields.map((field, index) => {
                  return {
                    ...formRefTable.getFieldValue([
                      selectedProductFieldName,
                      index,
                    ]),
                    rowKey: "" + field.key,
                  };
                })}
                onChange={(data) => {
                  handleTableChange(data);
                }}
                columns={columns as ColumnTypes}
                pagination={tableParams}
                rowKey={(x) => x.productUnitId?.toString() ?? ""}
              />
            );
          }}
        </FormList>
      </Form>
    </div>
  );
};
export default GridProductItemsInModal;
