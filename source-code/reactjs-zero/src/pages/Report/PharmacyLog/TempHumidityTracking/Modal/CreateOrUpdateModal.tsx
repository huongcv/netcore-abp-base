import React, { useEffect, useState } from "react";
import { DatePicker, Table, Input, Form, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { ShopWeatherDataDto } from "@api/index.defs";
import { TableProps } from "antd/es/table";
import { useStore } from "@ord-store/index";
import { useTranslation } from "react-i18next";
import FormList from "antd/es/form/FormList";
import OrdSelect, {
  IOrdSelectOption,
} from "@ord-components/forms/select/OrdSelect";
import { useSelectEmployee } from "@ord-components/forms/select/selectDataSource/useSelectEmployee";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import "../index.scss";
import ValidateUtils from "@ord-core/utils/validate.utils";

const { Title } = Typography;
const detailsFieldName = "trackingItems";
interface IShopWeatherDataExtDto extends ShopWeatherDataDto {
  rowKey: number;
}
type ColumnTypes = Exclude<
  TableProps<IShopWeatherDataExtDto>["columns"],
  undefined
>;
const CreateOrUpdateModal = (props: {}) => {
  const { tempHumidityTrackingStore: mainStore } = useStore();
  const [daysInMonth, setDaysInMonth] = useState<ShopWeatherDataDto[]>([]);
  const { t } = useTranslation("tracking");
  const [loading, setLoading] = useState(false);
  const form = Form.useFormInstance();

  const handleMonthChange = (date: Dayjs) => {
    if (date) {
      setLoading(true);
      setTimeout(() => {
        const r = renderColumes(date);
        setDaysInMonth(r);
        setLoading(false);
      }, 500);
    } else {
      setDaysInMonth([]);
    }
  };
  const renderColumes = (date: Dayjs): ShopWeatherDataDto[] => {
    const year = date.year();
    const month = date.month();

    const days: ShopWeatherDataDto[] = Array.from(
      { length: dayjs(date).daysInMonth() },
      (_, i) => ({
        key: i + 1,
        id: undefined,
        measureDate: new Date(year, month, i + 1), // Sử dụng Date object
        tempAt9AM: undefined,
        tempAt3PM: undefined,
        humidityAt9AM: undefined,
        humidityAt3PM: undefined,
        executorId: "",
        reviewerId: "",
        notes: "",
      })
    );

    return days;
  };

  const RenderEmp = (props: {
    employeeId: string | undefined;
    onChange: (
      value: any,
      option: IOrdSelectOption | IOrdSelectOption[]
    ) => void;
  }) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<
      string | undefined
    >(
      props.employeeId && props.employeeId !== "" ? props.employeeId : undefined
    );

    const handleChange = (
      value: any,
      option: IOrdSelectOption | IOrdSelectOption[]
    ) => {
      setSelectedEmployeeId(value);
      props.onChange(value, option);
    };

    return (
      <OrdSelect
        onChange={handleChange}
        datasource={useSelectEmployee()}
        allowClear
        value={selectedEmployeeId}
      ></OrdSelect>
    );
  };

  useEffect(() => {
    if (mainStore.isAddNewEntity) {
      form.resetFields();
      setDaysInMonth([]);
    }
  }, [mainStore.createOrUpdateModal.visible]);

  const columns: ColumnTypes = [
    {
      title: t("measureDate"),
      dataIndex: "measureDate",
      key: "measureDate",
      render: (text: any, record: any, index: number) => {
        const date = dayjs(text);
        return (
          <>
            <Form.Item
              name={[index, "measureDate"]}
              initialValue={record.measureDate}
              hidden
            >
              <Input />
            </Form.Item>
            <span>{date.format("DD")}</span>
          </>
        );
      },
      width: 100,
      fixed: "left",
    },
    {
      title: t("temp"),
      children: [
        {
          title: t("tempAt9AM"),
          dataIndex: "tempAt9AM",
          key: "tempAt9AM",
          render(_, record, index) {
            return (
              <>
                <Form.Item
                  name={[index, "tempAt9AM"]}
                  initialValue={record.tempAt9AM}
                >
                  <PriceNumberInput style={{ width: "100%" }} />
                </Form.Item>
              </>
            );
          },
          width: 100,
          align: "center",
        },
        {
          title: t("tempAt3PM"),
          dataIndex: "tempAt3PM",
          key: "tempAt3PM",
          render(_, record, index) {
            return (
              <>
                <Form.Item
                  name={[index, "tempAt3PM"]}
                  initialValue={record.tempAt3PM}
                >
                  <PriceNumberInput style={{ width: "100%" }} />
                </Form.Item>
              </>
            );
          },
          width: 100,
          align: "center",
        },
      ],
    },
    {
      title: t("humidity"),
      children: [
        {
          title: t("humidityAt9AM"),
          dataIndex: "humidityAt9AM",
          key: "humidityAt9AM",
          render(_, record, index) {
            return (
              <>
                <Form.Item
                  name={[index, "humidityAt9AM"]}
                  initialValue={record.humidityAt9AM}
                >
                  <PriceNumberInput style={{ width: "100%" }} />
                </Form.Item>
              </>
            );
          },
          width: 100,
          align: "center",
        },
        {
          title: t("humidityAt3PM"),
          dataIndex: "humidityAt3PM",
          key: "humidityAt3PM",
          render(_, record, index) {
            return (
              <>
                <Form.Item
                  name={[index, "humidityAt3PM"]}
                  initialValue={record.humidityAt3PM}
                >
                  <PriceNumberInput style={{ width: "100%" }} />
                </Form.Item>
              </>
            );
          },
          width: 100,
          align: "center",
        },
      ],
    },

    {
      title: t("executorId"),
      dataIndex: "executorId",
      key: "executorId",
      render(_, record, index) {
        return (
          <>
            <Form.Item name={[index, "executorId"]}>
              <div style={{ textAlign: "left" }}>
                <RenderEmp
                  onChange={(val: string) => {
                    form.setFieldValue(
                      [detailsFieldName, index, "executorId"],
                      val
                    );
                  }}
                  employeeId={record.executorId}
                />
              </div>
            </Form.Item>
          </>
        );
      },
      width: 200,
      align: "center",
    },
    {
      title: t("reviewerId"),
      dataIndex: "reviewerId",
      key: "reviewerId",
      render(_, record, index) {
        return (
          <>
            <Form.Item name={[index, "reviewerId"]}>
              <div style={{ textAlign: "left" }}>
                <RenderEmp
                  onChange={(val: string) => {
                    form.setFieldValue(
                      [detailsFieldName, index, "reviewerId"],
                      val
                    );
                  }}
                  employeeId={record.reviewerId}
                />
              </div>
            </Form.Item>
          </>
        );
      },
      width: 200,
      align: "center",
    },
    {
      title: t("notes"),
      dataIndex: "notes",
      key: "notes",
      render(_, record, index) {
        return (
          <>
            <Form.Item
              name={[index, "notes"]}
              initialValue={record.notes || ""}
            >
              <Input />
            </Form.Item>
          </>
        );
      },
      align: "center",
    },
  ];

  return (
    <div>
      <Title level={4}>{t("pickMonth")}</Title>
      <Form.Item name="day" rules={[ValidateUtils.required]}>
        <DatePicker
          onChange={handleMonthChange}
          picker="month"
          disabled={mainStore.entityUpdateData != null}
          format="MM/YYYY"
          disabledDate={(current) => {
            return current && current.isAfter(dayjs(), "month");
          }}
        />
      </Form.Item>

      <FormList name={detailsFieldName}>
        {(fields) => {
          return (
            <Table<IShopWeatherDataExtDto>
              dataSource={
                mainStore.entityUpdateData == null
                  ? daysInMonth
                  : fields.map((field, index) => {
                      return {
                        ...form.getFieldValue([detailsFieldName, index]),
                        rowKey: "" + field.key,
                      };
                    })
              }
              columns={columns as ColumnTypes}
              pagination={false}
              rowKey={(d) => `${d.rowKey}`}
              loading={loading}
              className="custom-table"
              scroll={{ x: "max-content" }}
              bordered
              sticky
            />
          );
        }}
      </FormList>
    </div>
  );
};

export default CreateOrUpdateModal;
