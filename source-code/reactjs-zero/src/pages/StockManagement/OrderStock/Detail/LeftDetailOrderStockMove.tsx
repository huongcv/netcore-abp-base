import {
  ImportStockMoveDetailDto,
  OrderStockMoveDetailDto,
  OrderStockMoveDto,
} from "@api/index.defs";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import { ReturnQtyCell } from "@pages/StockManagement/Shared/Detail/ReturnQtyCell";
import Table, { ColumnType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { RowIdxColumn } from "@ord-components/table/cells/RowIdxColumn";
import { Tag } from "antd";
import DateUtil from "@ord-core/utils/date.util";

const LeftDetailOrderStockMove = (props: {
  moveDto: OrderStockMoveDto;
  items: OrderStockMoveDetailDto[] | undefined | null;
}) => {
  const { t } = useTranslation("stock");
  const { items, moveDto } = props;

  const columns: ColumnType<ImportStockMoveDetailDto>[] = [
    RowIdxColumn,
    {
      title: t("product"),
      render: (_, dto) => {
        if (!dto?.productDetail) {
          return <></>;
        }
        const { productDetail } = dto;
        return (
          <>
            {productDetail && (
              <>
                <div>
                  <Tag>{productDetail.productCode}</Tag>
                  <b className="text-primary">{productDetail.productName}</b>
                  {/* <span className={"ms-2"}>
                    <Link
                  to={"/product/detail/" + dto.productHashId}
                  target={"_blank"}
                >
                  <EyeOutlined />
                </Link>
                  </span> */}
                </div>
                {/* {dto.lotNumber && (
                  <div className="mt-1">
                    <span>{t("lotNumber")}:</span>
                    <span className="italic me-2 ms-1">{dto.lotNumber}</span>
                    <span className={"ms-2 me-1"}>{t("expiryDate")}:</span>
                    {dto.expiryDate && (
                      <span>{DateUtil.showWithFormat(dto.expiryDate)} </span>
                    )}
                  </div>
                )} */}
              </>
            )}
          </>
        );
      },
    },
    {
      title: t("qty"),
      render: (_, dto) => {
        return (
          <>
            {dto?.qty && (
              <>
                <PriceCell value={dto.qty} />
                {/* <span className="italic ms-1">{dto.unitName}</span> */}
                {/* {moveDto && <ReturnQtyCell moveDto={moveDto} item={dto} />} */}
              </>
            )}
          </>
        );
      },
      align: "end",
      width: 130,
    },
    {
      title: t("price"),
      dataIndex: "price",
      render: (_, dto) => {
        return <>{dto?.price && <PriceCell value={dto.price} />}</>;
      },
      align: "end",
      width: 130,
    },
  ];

  return (
    <div>
      {items && !!columns && (
        <Table
          columns={columns}
          dataSource={items || {}}
          pagination={{ position: ["none"] }}
          rowKey="id"
        />
      )}
    </div>
  );
};
export default LeftDetailOrderStockMove;
