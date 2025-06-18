import React from "react";
import { Card, Descriptions, Flex, List, Table, Tag, Typography } from "antd";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import { useWatch } from "antd/es/form/Form";
import { useTranslation } from "react-i18next";
import "../index.scss";
import dayjs from "dayjs";
import {
  TYPE_PROMOTION,
  TYPE_PROMOTION_DETAIL,
} from "../../Enums/TypePromotionDetail";
import { SwapRightOutlined } from "@ant-design/icons";
import Paragraph from "antd/es/skeleton/Paragraph";
import { GiftItemDto, PromotionDetailDto, VoucherDto } from "@api/index.defs";
import NumberUtil from "@ord-core/utils/number.util";
import { optionsUnit } from "../../Helper/Helper";
import { useStore } from "@ord-store/index";

const { Title, Text } = Typography;
const PromotionSummary: React.FC = () => {
  const { t } = useTranslation("promotion");
  const { promotionFormStore: mainStore } = useStore();
  const form = useFormInstance();
  const promotionData = useWatch([], form);
  if (!promotionData) return null;
  const {
    name,
    code,
    isActived,
    promotionType,
    startDate,
    endDate,
    applyDaysDto,
    details,
  } = promotionData;
  const hasApplyDays = applyDaysDto;

  const hasDetails = details?.length > 0;
  if (
    !name &&
    !code &&
    !startDate &&
    !endDate &&
    !hasApplyDays &&
    !hasDetails
  ) {
    return null;
  }
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <div className="header-container-promotion">{t("PromotionSummary")}</div>
      <ul className="ul-styles">
        {name && (
          <Title
            level={5}
            style={{ color: "#3BB54A", textTransform: "uppercase" }}
          >
            {name}
          </Title>
        )}
        {code && (
          <li>
            <span className="text-bold">{t("Code")} : </span>
            {code}
          </li>
        )}
        {typeof isActived === "boolean" && (
          <li>
            <span className="text-bold">{t("isActived")} : </span>
            {isActived ? "Hoạt động" : "Không hoạt động"}
          </li>
        )}
        {code && (
          <li>
            <span className="text-bold">{t("PromotionType")} : </span>
            {promotionType == TYPE_PROMOTION.Invoice
              ? t("PromotionTypeInvoice")
              : t("PromotionTypeProduct")}
          </li>
        )}
        {startDate && endDate ? (
          <>
            <li>
              <span>{t("applyFromDayStart")} </span>
              <span className="text-bold">
                {dayjs(startDate).format("DD/MM/YYYY")}
              </span>
              <span> {t("applyFromDayEnd")} </span>
              <span className="text-bold">
                {dayjs(endDate).format("DD/MM/YYYY")}
              </span>
            </li>
          </>
        ) : (
          <></>
        )}
        {applyDaysDto.hours.some(
          (value: any) => value && value.startTime && value.endTime
        ) && (
          <li>
            <span>{t("applyRangeHour")} </span>
            {applyDaysDto.hours.map((value: any, index: number) => {
              if (!value || !value.startTime || !value.endTime) return null;
              return (
                <Tag key={index} className="text-bold font-size">
                  {value.startTime.slice(0, 5)} <SwapRightOutlined />{" "}
                  {value.endTime.slice(0, 5)}
                </Tag>
              );
            })}
          </li>
        )}

        {hasApplyDays && applyDaysDto.daysOfWeek?.length > 0 ? (
          <>
            <li>
              <span>{t("applyDayOfWeeks")} </span>
              <span className="text-bold">
                {applyDaysDto.daysOfWeek.map((value: number) => {
                  let text = "";
                  switch (value) {
                    case 1:
                      text = t("monday");
                      break;
                    case 2:
                      text = t("tuesday");
                      break;
                    case 3:
                      text = t("wednesday");
                      break;
                    case 4:
                      text = t("thursday");
                      break;
                    case 5:
                      text = t("friday");
                      break;
                    case 6:
                      text = t("saturday");
                      break;
                    case 7:
                      text = t("sunday");
                      break;
                  }
                  return text + " ";
                })}
              </span>
            </li>
          </>
        ) : (
          <></>
        )}

        {hasApplyDays && applyDaysDto.months?.length > 0 ? (
          <>
            <li>
              <span>{t("applyMonth")} </span>
              <span className="text-bold">
                {applyDaysDto.months.map((month: number, index: number) => {
                  return (
                    <span key={index} className="text-bold">
                      {t(`month.${month}`)} {` `}
                    </span>
                  );
                })}
              </span>
            </li>
          </>
        ) : (
          <></>
        )}

        {hasApplyDays && applyDaysDto.specificDates?.length > 0 ? (
          <>
            <li>
              <span>{t("applySpecificDates")} : </span>
              <span className="text-bold">
                {applyDaysDto.specificDates.map((s: string, index: number) => {
                  const [day, month, year] = s.split("-");
                  return (
                    <Tag
                      key={index}
                      className="text-bold font-size"
                    >{`${day}-${month} `}</Tag>
                  );
                })}
              </span>
            </li>
          </>
        ) : (
          <></>
        )}

        {/* Chi tiết khuyến mãi */}
        {hasDetails && (
          <>
            {details.map((item: PromotionDetailDto, index: number) => {
              if (!item.condition || !item.value) return null;

              const { totalAmountFrom, productId, quantityFrom } =
                item.condition;
              const { amount, unit, giftItems, voucherList } = item.value;

              let textPromotionDetailType = "";
              switch (item.type) {
                case TYPE_PROMOTION_DETAIL.Voucher:
                  textPromotionDetailType = "Voucher";
                  break;
                case TYPE_PROMOTION_DETAIL.Discount:
                  textPromotionDetailType = t("Discount");
                  break;
                case TYPE_PROMOTION_DETAIL.Gift:
                  textPromotionDetailType = t("Gift");
                  break;
                default:
                  break;
              }

              const infoProduct = mainStore.getProductInStore(
                productId!.toString()
              );

              return (
                <div key={index} style={{ margin: "20px 0" }}>
                  <strong>
                    {t("TitleDetailPromotion")} {index + 1}:
                  </strong>
                  <ul className="ul-styles">
                    {promotionType == TYPE_PROMOTION.Invoice ? (
                      <>
                        {totalAmountFrom && totalAmountFrom > 0 ? (
                          <li>
                            {t("TotalAmountFrom")}
                            <span>{" : "}</span>{" "}
                            <span className="text-bold">
                              {NumberUtil.formatNumberOld(totalAmountFrom)} VND
                            </span>
                          </li>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        {infoProduct && (
                          <li>
                            <span>{t("ProductID")} : </span>{" "}
                            <span className="text-bold">{`${infoProduct?.productCode}-${infoProduct?.productName}`}</span>
                          </li>
                        )}
                        <li>
                          <span>{t("quantityApplyProduct")} :</span>{" "}
                          <span className="text-bold">{quantityFrom}</span>
                        </li>
                      </>
                    )}
                    {textPromotionDetailType != "" && (
                      <li>
                        <span>{t("salesType")} : </span>
                        <span className="text-bold">
                          {textPromotionDetailType}
                        </span>
                      </li>
                    )}
                    {item.type == TYPE_PROMOTION_DETAIL.Voucher &&
                    voucherList &&
                    voucherList?.length > 0 ? (
                      <li>
                        {t("listVoucher")}
                        <ul className="ul-styles children">
                          {voucherList.map((v: VoucherDto, index: number) => {
                            return (
                              <li key={index}>
                                <span className="text-bold">{`${t(
                                  "CodeVoucherGiftForm"
                                )}: ${v.code} - ${t("Quantity")}: ${
                                  v.quantity
                                }`}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    ) : (
                      <></>
                    )}

                    {item.type == TYPE_PROMOTION_DETAIL.Gift &&
                    giftItems &&
                    giftItems?.length > 0 ? (
                      <li>
                        {t("listGift")}
                        <ul className="ul-styles children">
                          {giftItems.map((v: GiftItemDto, index: number) => {
                            return (
                              <li key={index}>
                                <span className="text-bold">{`${t(
                                  "CodeVoucherGiftForm"
                                )}: ${v.code} - ${t("NameVoucherGiftForm")}: ${
                                  v.name
                                } - ${t("Quantity")}: ${v.quantity}`}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    ) : (
                      <></>
                    )}

                    {item.type == TYPE_PROMOTION_DETAIL.Discount &&
                    amount &&
                    amount > 0 ? (
                      <li>
                        {t("AmountSale")}
                        <span>{" : "}</span>{" "}
                        <span className="text-bold">
                          {unit == optionsUnit[0].value
                            ? `${NumberUtil.formatNumberOld(amount)} ${
                                optionsUnit[0].value
                              }`
                            : `${amount} ${optionsUnit[1].value}`}
                        </span>
                      </li>
                    ) : (
                      <></>
                    )}
                  </ul>
                </div>
              );
            })}
          </>
        )}
      </ul>
    </>
  );
};

export default PromotionSummary;
