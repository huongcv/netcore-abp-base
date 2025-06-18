import { GolfCourseHolesDto } from "@api/index.defs";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { useStore } from "@ord-store/index";
import { Col, Form, Input, InputNumber, Row, Select, Tabs } from "antd";
import { useWatch } from "antd/es/form/Form";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./index-course.scss";
import { GolfCourseService } from "@api/GolfCourseService";
import { useSelectGolfGameTypeDefault } from "@ord-components/forms/select/selectDataSource/useSelectGolfGameTypeDefault";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import ValidateUtils from "@ord-core/utils/validate.utils";

export const TabGameTypeSetting = () => {
  const { golfCourseStore: mainStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const form = Form.useFormInstance();
  const gameTypeAllowIds_w = useWatch("gameTypeAllowIds", form);
  const gameTypeDefault_w = useWatch("gameTypeDefault", form);

  const initialHolesRef = useRef<GolfCourseHolesDto[]>([]);
  const dataSouceGameTypeDefaul = useSelectGolfGameTypeDefault();

  // Hàm tính tổng số lỗ tối đa từ gameTypeAllowIds
  const calculateTotalHoles = (gameTypeAllowIds: number[] = []) => {
    if (!gameTypeAllowIds.length) return 0;

    const gameTypeToHoleCount: Record<number, number> = {
      1: 9,
      2: 18,
      3: 27,
      4: 36,
      5: 9, // Game9x tạm hiểu là 9 lỗ (bạn confirm thêm nếu cần)
    };

    let maxHole = 0;
    gameTypeAllowIds.forEach((id) => {
      const holes = gameTypeToHoleCount[id] || 0;
      if (holes > maxHole) {
        maxHole = holes;
      }
    });

    return maxHole;
  };

  useEffect(() => {
    if (!gameTypeAllowIds_w) return;

    const totalHoles = calculateTotalHoles(gameTypeAllowIds_w);

    if (totalHoles === 0) return;

    const currentHoles: GolfCourseHolesDto[] =
      mainStore.createOrUpdateModal.mode === "update"
        ? initialHolesRef.current
        : form.getFieldValue("golfCourseHoles") || [];

    const updatedHoles = Array.from({ length: totalHoles }, (_, i) => {
      const existing = currentHoles[i];
      return {
        holeNumber: i + 1,
        par: existing?.par ?? 0,
        handicap: existing?.handicap ?? 0,
      };
    });

    form.setFieldValue("golfCourseHoles", updatedHoles);
  }, [gameTypeAllowIds_w]);

  useEffect(() => {
    const currentAllowIds = form.getFieldValue("gameTypeAllowIds") || [];

    if (
      gameTypeDefault_w != null &&
      !currentAllowIds.includes(gameTypeDefault_w)
    ) {
      const updated = [...currentAllowIds, gameTypeDefault_w];
      form.setFieldValue("gameTypeAllowIds", updated);
    }
  }, [gameTypeDefault_w]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await GolfCourseService.getListHolesById({
        id: form.getFieldValue("id"),
      });
      initialHolesRef.current = res;
      form.setFieldValue("golfCourseHoles", res);
    };

    if (mainStore.createOrUpdateModal.mode === "update") {
      fetchData();
    }
  }, []);

  return (
    <>
      <Row className="w-full" gutter={16}>
        <Form.Item hidden noStyle name="id">
          <Input />
        </Form.Item>
        <Col span={8}>
          <FloatLabel label={t("gameTypeDefault")} required>
            <Form.Item
              name="gameTypeDefault"
              initialValue={1}
              rules={[ValidateUtils.required]}
            >
              <OrdSelect
                datasource={dataSouceGameTypeDefaul}
                allowClear
                placeholder={t("gameTypeDefault")}
              />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("expectedDurationPerRound")}>
            <Form.Item name="expectedDurationPerRound">
              <InputNumber
                addonAfter={t("timeSecond")}
                className="w-full"
                min={1}
                placeholder={t("expectedDurationPerRoundPlace")}
              ></InputNumber>
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={8}>
          <FloatLabel label={t("expectedHolePerRound")}>
            <Form.Item name="expectedHolePerRound">
              <InputNumber className="w-full" min={1}></InputNumber>
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={24}>
          <FloatLabel label={t("gameTypeAllowIds")}>
            <Form.Item name="gameTypeAllowIds">
              <OrdSelect
                datasource={{
                  ...dataSouceGameTypeDefaul,
                  data: dataSouceGameTypeDefaul.data.map((item) => ({
                    ...item,
                    disabled: item.value == gameTypeDefault_w,
                  })),
                }}
                allowClear
                mode="multiple"
                placeholder={t("gameTypeDefault")}
              />
            </Form.Item>
          </FloatLabel>
        </Col>
        <Col span={24}>
          <Form.List name="golfCourseHoles">
            {(fields) => {
              const renderTable = (from: number, to: number) => {
                const holesRange = fields.slice(from - 1, to);

                return (
                  <table
                    className="border border-gray-400"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr className="bg-gray-300 h-10">
                        <th className="text-start font-bold pl-5">Số lỗ</th>
                        {holesRange.map((field, idx) => (
                          <th className="border" key={field.key}>
                            {from + idx}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 td-course-custome font-bold text-start pl-5">
                          Par
                        </td>
                        {holesRange.map((field) => (
                          <td
                            key={`par-${field.key}`}
                            className="border border-gray-300 td-course-custome"
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <Form.Item
                              name={[field.name, "par"]}
                              rules={[{ required: true, message: "Nhập par" }]}
                              className="ant-form-item-custome"
                            >
                              <InputNumber min={0} max={10} className="w-16" />
                            </Form.Item>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-gray-300 font-bold text-start pl-5">
                          Index
                        </td>
                        {holesRange.map((field) => (
                          <td
                            key={`handicap-${field.key}`}
                            className="border border-gray-300 td-course-custome"
                          >
                            <Form.Item
                              name={[field.name, "handicap"]}
                              rules={[
                                { required: true, message: "Nhập handicap" },
                              ]}
                              className="ant-form-item-custome"
                            >
                              <InputNumber min={0} max={36} className="w-16" />
                            </Form.Item>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                );
              };

              const totalHoles = calculateTotalHoles(gameTypeAllowIds_w);

              const items = [];

              for (let i = 0; i < totalHoles; i += 9) {
                const from = i + 1;
                const to = Math.min(i + 9, totalHoles);

                items.push({
                  key: `${from}-${to}`,
                  label: `Tee ${i / 9 + 1}`,
                  children: renderTable(from, to),
                });
              }

              return <Tabs defaultActiveKey="1-9" items={items} />;
            }}
          </Form.List>
        </Col>
      </Row>
    </>
  );
};
