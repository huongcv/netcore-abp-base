import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { ComboOptionDto } from "@ord-core/service-proxies/dto";
import { Checkbox, Col, Form, Popover, Row, Spin } from "antd";
import { ShopWorkCalendarService } from "@api/ShopWorkCalendarService";
import { displayDayOfWeek } from "@pages/WorkShift/ShopWorkCalendar/shopWorkCalendarList";
import { TFunction } from "i18next";

export const FormConfigEmployeeWorkSchedule = (props: {
  tEnum: TFunction<"enum", undefined>;
}) => {
  const { t } = useTranslation("employee");
  // const {t: tCommon} = useTranslation('common');
  const [options, setOptions] = useState<ComboOptionDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await ShopWorkCalendarService.getComboOptions();
        const converse = response.filter((item) => item.data.isActived);
        setOptions(converse);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchOptions().then();
  }, []);

  return (
    <>
      <Row gutter={64}>
        <Col span={12}>
          <p style={{ marginBottom: 15, fontWeight: "600" }}>
            {t("cruAction.employeeWorkSchedule")}
          </p>
          {loading ? (
            <Spin></Spin>
          ) : (
            <Form.Item name="listWorkScheduleId">
              <Checkbox.Group
                style={{ display: "flex", flexDirection: "column", gap: 4 }}
              >
                {options.map((option) => (
                  <Checkbox
                    key={option.value}
                    value={option.value}
                    className="mb-1"
                  >
                    <Popover
                      title="Lịch làm việc"
                      content={
                        <table
                          style={{ borderCollapse: "collapse", width: "100%" }}
                        >
                          <tbody>
                            <tr>
                              <td>
                                <b>Thứ:</b>
                              </td>
                              <td>
                                {displayDayOfWeek(
                                  option.data.listDayOfWeek,
                                  props.tEnum
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <b>Bắt đầu:</b>
                              </td>
                              <td>{option.data.hourFrom}</td>
                            </tr>
                            <tr>
                              <td>
                                <b>Nghỉ giữa:</b>
                              </td>
                              <td>
                                {option.data.hourBreakTimeFrom} -{" "}
                                {option.data.hourBreakTimeTo}
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <b>Kết thúc:</b>
                              </td>
                              <td>{option.data.hourTo}</td>
                            </tr>
                          </tbody>
                        </table>
                      }
                      color="#fff"
                    >
                      <span
                        className="w-full flex"
                        style={{ cursor: "pointer" }}
                      >
                        {option.displayName}
                      </span>
                    </Popover>
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>
          )}
        </Col>
      </Row>
    </>
  );
};
