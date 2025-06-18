import {DeleteOutlined} from "@ant-design/icons";
import {DiscountBarCodeLayoutSettingDto, ShopDiscountDto,} from "@api/index.defs";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import {useStore} from "@ord-store/index";
import {Form, Segmented, Space} from "antd";
import Table, {ColumnType} from "antd/es/table";
import {observer} from "mobx-react-lite";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";

const BarCodeCell = (props: { index: number }) => {
    const {index} = props;

    const value = Form.useWatch(["discountItems", index, "barcode"]);

    return <>{value}</>;
};

const PrintBarcodeRightBox = (props: {
    barcodeLayoutItems: DiscountBarCodeLayoutSettingDto[];
}) => {
    const {discountListPrintBarcodeStore} = useStore();
    const [layoutSetting, setLayoutSetting] =
        useState<DiscountBarCodeLayoutSettingDto>();
    const {selectedRows: dataSource} = discountListPrintBarcodeStore;

    const {barcodeLayoutItems} = props;
    const form = Form.useFormInstance();
    const [t] = useTranslation("discount");
    const columns: ColumnType<ShopDiscountDto>[] = [
        {
            title: t("code"),
            dataIndex: "discountCode",
            width: 120,
            render: (_, record, index) => {
                return (
                    <>
                        <Form.Item
                            hidden
                            name={["discountItems", index, "code"]}
                        ></Form.Item>
                        <span className={"text-blue-500"}>{record.code}</span>
                    </>
                );
            },
        },
        {
            title: t("barCode"),
            width: 120,
            render: (_, record, index) => {
                return (
                    <>
                        <Form.Item
                            hidden
                            name={["discountItems", index, "barcode"]}
                        ></Form.Item>
                        <span>{record.barcode}</span>
                    </>
                );
            },
        },
        {
            title: t("discountUseType"),
            width: 120,
            render(_, record, index) {
                return (
                    <>
                        <Form.Item
                            hidden
                            name={["discountItems", index, "discounT_USE_TYPE"]}
                        ></Form.Item>
                        <span>{t(`discountUseType.${record.discountUseType}`)}</span>
                    </>
                );
            },
        },
        {
            title: t("discountType"),
            width: 120,
            render(_, record, index) {
                return (
                    <>
                        <Form.Item
                            hidden
                            name={["discountItems", index, "discounT_TYPE"]}
                        ></Form.Item>
                        <span>{t(`discountType.${record.discountType}`)}</span>
                    </>
                );
            },
        },
        {
            title: t("discountValue"),
            width: 120,
            render: (_, record, index) => {
                return (
                    <>
                        <Form.Item
                            hidden
                            name={["discountItems", index, "discountValue"]}
                        ></Form.Item>
                        <span>
              <PriceCell value={record.discountValue}/>
                            {record.discountType == DiscountTypeEnum.Percent ? "%" : "VND"}
            </span>
                    </>
                );
            },
        },
        {
            title: t("qtyPrint"),
            width: 110,
            render: (_, record, index) => {
                // @ts-ignore
                const initialValue = record?.qtyPrint || 1;
                return (
                    <>
                        <Form.Item
                            name={["discountItems", index, "qtyPrint"]}
                            initialValue={initialValue}
                        >
                            <PriceNumberInput min={1} isOnlyNumberInput></PriceNumberInput>
                        </Form.Item>
                    </>
                );
            },
        },

        {
            width: 50,
            align: "center",
            render: (_, record, index) => {
                return dataSource.length >= 1 ? (
                    <a
                        className={"text-red-500"}
                        onClick={() => discountListPrintBarcodeStore.remove(record.id)}
                    >
                        <DeleteOutlined/>
                    </a>
                ) : null;
            },
        },
    ];

    useEffect(() => {
        if (!!barcodeLayoutItems && barcodeLayoutItems.length > 0) {
            form.setFieldValue("layoutSetting", {
                ...barcodeLayoutItems[0],
            });
            form.setFieldValue("printType", barcodeLayoutItems[0].layoutType);
        }
    }, [barcodeLayoutItems]);
    const layoutSetting_w = Form.useWatch("layoutSetting", form);
    useEffect(() => {
        setLayoutSetting(layoutSetting_w);
    }, [layoutSetting_w]);
    const printType_w = Form.useWatch("printType", form);
    useEffect(() => {
        const f = barcodeLayoutItems.find((x) => x.layoutType == printType_w);
        form.setFieldValue("layoutSetting", f);
    }, [printType_w]);

    useEffect(() => {
        if (dataSource && dataSource.length > 0) {
            const discountItems = dataSource.map((item) => ({
                barcode: item.barcode,
                code: item.code,
                discounT_USE_TYPE: item.discountUseType,
                discounT_TYPE: item.discountType,
                discountValue: item.discountValue,
                qtyPrint: 1,
            }));

            form.setFieldsValue({
                discountItems: discountItems,
            });
        }
    }, [dataSource, form]);

    return (
        <>
            <h3 className={"text-primary text-xl mb-3"}>{t("listSelected")}</h3>
            <Space wrap>
                <Form.Item name={"printType"}>
                    <Segmented
                        options={barcodeLayoutItems.map((it) => {
                            return {
                                value: it.layoutType,
                                label: t("printBarcodeTpl." + it.layoutType),
                            };
                        })}
                    />
                </Form.Item>
                <div hidden>
                    <Form.Item noStyle name={"layoutSetting"}></Form.Item>
                </div>
            </Space>
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                rowKey="id"
            />
        </>
    );
};
export default observer(PrintBarcodeRightBox);
