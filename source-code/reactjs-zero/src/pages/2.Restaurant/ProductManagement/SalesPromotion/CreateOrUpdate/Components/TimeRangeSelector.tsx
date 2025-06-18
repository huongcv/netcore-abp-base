import { Button, Col, Form, Input, Row, TimePicker } from "antd";
import { observer } from "mobx-react-lite";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { ApplyDaysDto } from "@api/index.defs";
import dayjs from "dayjs";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import React from "react";

const TimeRangeSelector: React.FC<{
  disabledProp: boolean;
}> = ({ disabledProp }) => {
  const { t } = useTranslation("promotion");
  const form = Form.useFormInstance();
  return (
    <div style={{ width: "100%" }}>
      <Form.List name={["applyDaysDto", "hours"]}>
        {(fields, { add, remove }, { errors }) => (
          <Row gutter={16} style={{ width: "100%" }}>
            {fields.map(({ key, name, ...restField }) => {
              const hours = form.getFieldValue(["applyDaysDto", "hours"]) || [];
              const startTime = hours[name]?.startTime
                ? dayjs(hours[name].startTime, "HH:mm")
                : null;
              const endTime = hours[name]?.endTime
                ? dayjs(hours[name].endTime, "HH:mm")
                : null;
              return (
                <React.Fragment key={key}>
                  <Col span={16}>
                    <Form.Item
                      {...restField}
                      name={[name, "startTime"]}
                      style={{ display: "none" }}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "endTime"]}
                      style={{ display: "none" }}
                    >
                      <Input />
                    </Form.Item>
                    <FloatLabel label={t("RangeHour")}>
                      <TimePicker.RangePicker
                        format="HH:mm"
                        disabled={disabledProp}
                        value={[startTime, endTime]}
                        onChange={(values) => {
                          if (values && values.length === 2) {
                            form.setFieldsValue({
                              applyDaysDto: {
                                hours: form
                                  .getFieldValue(["applyDaysDto", "hours"])
                                  .map((item: any, index: number) =>
                                    index === name
                                      ? {
                                          ...item,
                                          startTime:
                                            values[0]!.format("HH:mm:ss"),
                                          endTime:
                                            values[1]!.format("HH:mm:ss"),
                                        }
                                      : item
                                  ),
                              },
                            });
                          } else {
                            form.setFieldValue(
                              ["applyDaysDto", "hours", name, "startTime"],
                              null
                            );
                            form.setFieldValue(
                              ["applyDaysDto", "hours", name, "endTime"],
                              null
                            );
                          }
                        }}
                      />
                    </FloatLabel>
                  </Col>

                  <Col span={2}>
                    <Button
                      disabled={fields.length <= 1 || disabledProp}
                      type="link"
                      danger
                      onClick={() => remove(name)}
                      icon={<MinusCircleOutlined />}
                    ></Button>
                  </Col>
                </React.Fragment>
              );
            })}
            <Col style={{ margin: "6px 0 0 20px" }}>
              <Button
                style={{
                  width: "fit-content",
                  height: "fit-content",
                  padding: "0 5px 2px",
                }}
                type="dashed"
                onClick={() => add()}
                block
                disabled={disabledProp}
                icon={<PlusOutlined style={{ fontSize: "10px" }} />}
              ></Button>
            </Col>
          </Row>
        )}
      </Form.List>
    </div>
  );
};

export default observer(TimeRangeSelector);
