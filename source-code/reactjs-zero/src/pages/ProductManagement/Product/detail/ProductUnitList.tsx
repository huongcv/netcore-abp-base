import React, { useEffect, useState } from "react";
import { ProductDto, ProductUnitDto } from "@api/index.defs";
import { Form, Input, Space, Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import { useStore } from "@ord-store/index";
import OrdCreateOrUpdateModal from "@ord-components/crud/OrdCreateOrUpdateModal";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { ProductUnitTableFormList } from "@pages/ProductManagement/Product/forms/units/ProductUnitTableFormList";

export const ProductUnitList = (props: {
  units?: ProductUnitDto[] | undefined | null;
  product: ProductDto | undefined | null;
}) => {
  const { product } = props;
  const { productUnitStore, productDetailStore } = useStore();
  const [unitItems, setUnitItems] = useState<ProductUnitDto[]>([]);
  const { t } = useTranslation("product");
  const { t: tCommon } = useTranslation("common");
  const [hoveredRowIndex, setHoveredRowIndex] = useState<
    number | null | undefined
  >(null);
  useEffect(() => {
    setUnitItems(props.units || []);
  }, [props.units]);
  const columns: TableProps<ProductUnitDto>["columns"] = [
    {
      title: tCommon("unitName"),
      dataIndex: "unitName",
      width: 200,
      render: (v, dto) => {
        return (
          <>
            <Space>{v}</Space>
          </>
        );
      },
    },
    {
      title: tCommon("convertRate"),
      dataIndex: "convertRate",
      width: 100,
    },
    {
      title: tCommon("price"),
      dataIndex: "price",
      render: (v) => <PriceCell value={v} />,
      width: 160,
    },
    {
      title: t("barCode"),
      dataIndex: "barcode",
      // render: (v, record, index.ts: number) => <div className='relative'>
      //     {v}
      //     {
      //         hoveredRowIndex === index.ts ? <div className='act-group'>
      //             <Button className='me-2' shape="circle" size='small' icon={<EditOutlined/>}
      //                     type="primary"></Button>
      //             {
      //                 record.isBasicUnit ? null :
      //                     <Button shape="circle" size='small' icon={<DeleteOutlined/>} danger></Button>
      //             }
      //
      //
      //         </div> : null
      //     }
      // </div>,
    },
  ];
  const openEdit = () => {
    const baseInput = {
      product: props.product,
      productIdHash: props.product?.idHash,
      basicUnitName: props.product?.basicUnitName,
      basicUnitPrice: props.product?.productPrice,
    };

    if (props.units && props.units.length > 0) {
      let unitItems = [...props.units];
      const basicUnit = unitItems[0];
      unitItems.shift();
      productUnitStore.openUpdateModal({
        ...baseInput,
        unitItems: [...unitItems],
        basicUnitBarcode: basicUnit.barcode,
        basicUnitPrice: basicUnit?.price,
      });
    } else {
      productUnitStore.openUpdateModal({
        ...baseInput,
        unitItems: [],
      });
    }
  };
  const onSavedSuccess = (dataSaved: any) => {
    if (props.product?.idHash) {
      productDetailStore.getDetail(props.product?.idHash).then();
    }
  };
  return (
    <>
      {unitItems && (
        <div className="tbl-unit-lst">
          <div className={"mt-3 mb-2"}>
            <span className={"me-5 text-[16px] font-semibold"}>
              {t("ListUnits")}
            </span>
          </div>
          <Table
            columns={columns}
            dataSource={unitItems.map((item, index) => ({
              ...item,
              key: item.id || index,
            }))}
            pagination={false}
            onRow={(_, rowIndex) => ({
              onMouseEnter: () => setHoveredRowIndex(rowIndex), // Hiển thị nút khi hover
              onMouseLeave: () => setHoveredRowIndex(null), // Ẩn nút khi rời khỏi hover
            })}
            rowClassName="hover-row"
          />

          <OrdCreateOrUpdateModal
            stored={productUnitStore}
            onSavedSuccess={onSavedSuccess}
            entityForm={() => <ProductListUnitForm />}
          />
        </div>
      )}
    </>
  );
};
const ProductListUnitForm = () => {
  const { t } = useTranslation("product");
  return (
    <>
      <FloatLabel label={t("name")} required>
        <Form.Item
          name={["product", "productName"]}
          rules={[ValidateUtils.required]}
        >
          <Input maxLength={200} disabled />
        </Form.Item>
      </FloatLabel>
      <ProductUnitTableFormList mode={"update"} />
      <Form.Item noStyle hidden name="productIdHash">
        <Input />
      </Form.Item>
    </>
  );
};
