import React, { useEffect, useState } from "react";
import { Row, Col, Form, Checkbox, Select } from "antd";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { specialDaysList } from "../../Helper/Helper";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { observer } from "mobx-react-lite";
import { useStore } from "@ord-store/index";
import TimeRangeSelector from "./TimeRangeSelector";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import { CloseOutlined } from "@ant-design/icons";
dayjs.extend(isBetween);

interface ModelRangeDate {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

const ApplyDaysComponent: React.FC<{
  disabledProp: boolean;
}> = ({ disabledProp }) => {
  const { t } = useTranslation("promotion");
  const { promotionFormStore: mainStore } = useStore();
  const [timeRangeDate, setTimeRangeDate] = useState<ModelRangeDate>({
    startDate: mainStore.startDateTemp,
    endDate: mainStore.endDateTemp,
  });
  const [specialDays, setSpecialDays] = useState<dayjs.Dayjs[]>([]);
  const [availableMonths, setAvailableMonths] = useState<number[]>([]);

  const calculateMonthsInRange = (
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs
  ) => {
    const months = [];

    let current = startDate.startOf("month");
    while (current.isBefore(endDate, "month")) {
      months.push(current.month() + 1);
      current = current.add(1, "month");
    }
    return months;
  };

  useEffect(() => {
    const { startDate, endDate } = timeRangeDate;
    if (startDate && endDate) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);

      const months = calculateMonthsInRange(start, end);
      setAvailableMonths(months); // Chỉ cập nhật danh sách các tháng

      const filteredDays = specialDaysList
        .map((d: any) => {
          const [day, month] = d.date.split("-").map(Number);
          const date = dayjs()
            .date(day)
            .month(month - 1);
          return { ...d, dayjs: date };
        })
        .filter((d: any) => d.dayjs.isBetween(start, end, null, "[]"));
      setSpecialDays(filteredDays);
    }
  }, [timeRangeDate]);

  return (
    <>
      <div className="header-container-promotion">{t("TitleApplyDay")}</div>
      {/* Start Date and End Date */}
      <Row style={{ marginTop: "20px" }} gutter={16}>
        <Col span={12}>
          <FloatLabel label={t("StartDate")}>
            <Form.Item
              name={["startDate"]}
              rules={[{ required: true, message: t("RequiredStartDate") }]}
            >
              <OrdDateInput
                disabled={disabledProp}
                placeholder={t("selectStartDate")}
                onChange={(val: Date | null) => {
                  if (val) {
                    setTimeRangeDate({ ...timeRangeDate, startDate: val });
                    mainStore.setStartDate(val);
                  }
                }}
              />
            </Form.Item>
          </FloatLabel>
        </Col>

        <Col span={12}>
          <FloatLabel label={t("EndDate")}>
            <Form.Item
              name={["endDate"]}
              rules={[{ required: true, message: t("RequiredEndDate") }]}
            >
              <OrdDateInput
                allowClear={false}
                disabled={disabledProp}
                placeholder={t("selectEndDate")}
                onChange={(val: Date | null) => {
                  if (val) {
                    setTimeRangeDate({ ...timeRangeDate, endDate: val });
                    mainStore.setEndDate(val);
                  }
                }}
              />
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
      <Row gutter={16}>
        {/* {khoảng giờ} */}
        <Col span={12}>
          <TimeRangeSelector disabledProp={disabledProp} />
        </Col>
        {/* Days of Week */}
        <Col span={12}>
          <Form.Item name={["applyDaysDto", "daysOfWeek"]}>
            <Checkbox.Group
              disabled={disabledProp}
              options={[
                { label: t("monday"), value: 1 },
                { label: t("tuesday"), value: 2 },
                { label: t("wednesday"), value: 3 },
                { label: t("thursday"), value: 4 },
                { label: t("friday"), value: 5 },
                { label: t("saturday"), value: 6 },
                { label: t("sunday"), value: 7 },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Months */}
      <Row gutter={16}>
        <Col span={12}>
          <FloatLabel label={t("months")}>
            <Form.Item name={["applyDaysDto", "months"]}>
              <Select
                disabled={disabledProp}
                mode="multiple"
                style={{ width: "100%" }}
                placeholder={t("selectMonths")}
              >
                {availableMonths.map((month) => (
                  <Select.Option key={month} value={month}>
                    {t(`month.${month}`)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </FloatLabel>
        </Col>
        {/* Specific Dates */}
        <Col span={12}>
          <FloatLabel label={t("specialDates")}>
            <Form.Item name={["applyDaysDto", "specificDates"]}>
              <Select
                disabled={disabledProp}
                mode="multiple"
                style={{ width: "100%" }}
                tagRender={(props) => {
                  const { label, value, closable, onClose } = props;
                  const [dayP, monthP] = value?.split("-") || ["", ""];
                  return (
                    <div className="tagRenderTimeSpec">
                      <span>
                        {dayP}-{monthP}
                      </span>
                      {closable && (
                        <span
                          onClick={onClose}
                          style={{ marginLeft: 8, cursor: "pointer" }}
                        >
                          <CloseOutlined />
                        </span>
                      )}
                    </div>
                  );
                }}
                placeholder={t("selectSpecialDates")}
              >
                {specialDays.map((day: any, index: number) => (
                  <Select.Option
                    key={index}
                    value={day.dayjs.format("DD-MM-YYYY")}
                  >
                    {`${day.date} - ${day.name}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </FloatLabel>
        </Col>
      </Row>
    </>
  );
};

export default observer(ApplyDaysComponent);
