import { OrderStockMoveDto, OrderStockTicketDto } from "@api/index.defs";
import { Tag } from "antd";
import { useTranslation } from "react-i18next";
import DateUtil from "@ord-core/utils/date.util";
import FloatLabel from "@ord-components/forms/FloatLabel";
import TextArea from "antd/es/input/TextArea";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import { useSelectPaymentMethod } from "@ord-components/forms/select/selectDataSource/useSelectPaymentMethod";
import { ExportStockOrderCell } from "../cell/ExportStockOrderCell";

const RightDetailOrderStockMove = (props: {
  moveDto: OrderStockMoveDto;
  ticketDto: OrderStockTicketDto;
}) => {
  const { moveDto, ticketDto } = props;
  const { t } = useTranslation(["stock-detail"]);
  const [tStock] = useTranslation(["stock"]);
  const [tOrderStock] = useTranslation(["orderStock"]);

  return (
    <>
      {moveDto && (
        <>
          <h3 className="text-primary text-xl font-bold">{t("MoveInfor")}</h3>
          <table className={"w-full move-detail-tbl"}>
            <tbody>
              <tr>
                <td>{tStock("moveDate")}</td>
                <td className="text-right infor-col">
                  {moveDto?.orderDate && (
                    <>
                      <Tag color="processing" style={{ marginRight: "0" }}>
                        {DateUtil.showWithFormat(
                          moveDto?.orderDate,
                          "dd/MM/yyyy"
                        )}
                      </Tag>
                      {/* <Tag className={"me-0"}>
                        {DateUtil.showWithFormat(moveDto?.orderDate, "HH:mm")}
                      </Tag> */}
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td>{tOrderStock("desiredDeliveryDate")}</td>
                <td className="text-right infor-col">
                  {moveDto?.desiredDeliveryDate && (
                    <>
                      <Tag color="processing" style={{ marginRight: "0" }}>
                        {DateUtil.showWithFormat(
                          moveDto?.desiredDeliveryDate,
                          "dd/MM/yyyy"
                        )}
                      </Tag>
                      {/* <Tag className={"me-0"}>
                        {DateUtil.showWithFormat(
                          moveDto?.desiredDeliveryDate,
                          "HH:mm"
                        )}
                      </Tag> */}
                    </>
                  )}
                </td>
              </tr>
              <tr className={"bg-blue-200"}>
                <td>{tStock("moveCode")}</td>
                <td className="text-right infor-col">{moveDto?.orderCode}</td>
              </tr>
              {moveDto?.supplierId && (
                <tr>
                  <td>{tOrderStock("supplierId")}</td>
                  <td className="text-right infor-col">
                    <ExportStockOrderCell moveDto={moveDto} />
                  </td>
                </tr>
              )}
              <tr className={"paymentMethod"}>
                <td>{tOrderStock("paymentMethod")}</td>
                <td className="text-right">
                  <DisplayTextFormSelectDataSource
                    value={moveDto?.paymentMethod}
                    datasource={useSelectPaymentMethod()}
                  ></DisplayTextFormSelectDataSource>
                </td>
              </tr>
              <tr className={"paymentStatus"}>
                <td>{tOrderStock("paymentStatus")}</td>
                <td className="text-right">
                  {/* <DisplayTextFormSelectDataSource
                    value={moveDto?.paymentStatus}
                    datasource={useSelectPaymentMethod()}
                  ></DisplayTextFormSelectDataSource> */}
                </td>
              </tr>
              <tr className={"totalAmount bg-blue-100 font-bold"}>
                <td>{tOrderStock("totalAmount")}</td>
                <td className="text-right number-readonly">
                  {<PriceCell value={moveDto?.totalAmount}></PriceCell>}
                </td>
              </tr>
              <tr>
                <td>{tStock("status")}</td>
                <td className="text-right infor-col">
                  <Tag
                    className={"me-0 move-status-label-" + moveDto.moveStatus}
                  >
                    {tOrderStock("move_status." + moveDto.moveStatus)}
                  </Tag>
                </td>
              </tr>
            </tbody>
          </table>
          {moveDto?.note && (
            <div className={"note"} style={{ marginTop: "10px" }}>
              <FloatLabel label={t("notes")}>
                <TextArea
                  value={moveDto?.note}
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  disabled
                />
              </FloatLabel>
            </div>
          )}
        </>
      )}
    </>
  );
};
export default RightDetailOrderStockMove;
