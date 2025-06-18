import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { StockProductUnitDto } from "@api/index.defs";
import StockDisplayEllipsisTextLong from "@ord-components/displays/StockDisplayEllipsisTextLong";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import OrdInputRegexText from "@ord-components/forms/OrdInputRegexText";
import { Delete2Icon } from "@ord-components/icon/DeleteIcon";
import DateUtil from "@ord-core/utils/date.util";
import RegexUtil from "@ord-core/utils/regex.util";
import UiUtils from "@ord-core/utils/ui.utils";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { Button, Col, Form, Modal, Row, Select, Space, Tag } from "antd";
import { SelectProps } from "antd/lib";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IProductIItemFormInputProp } from "../types/type";

type LabelRender = SelectProps['labelRender'];

interface LotDto {
    lotNumber: string;
    expiryDate: Date;
}

const renderOptionLot = (item: StockProductUnitDto) => {
    return {
        value: item.lotNumber,
        label: (
            <div className='inline-flex items-center'>
                <StockDisplayEllipsisTextLong className={"text-sm leading-5 inline-flex items-center"}
                    text={item.lotNumber!} maxWidth={120} />
                <span className={"ms-1 italic text-sm"}>
                    - HSD: {DateUtil.showWithFormat(item.expiryDate)}
                </span>
            </div>
        ),
        data: item
    };
};

const LotProductInput = (props: IProductIItemFormInputProp) => {
    const { productItem, field } = props;
    const { isProductUseLotNumber } = productItem;
    const form = Form.useFormInstance();
    const [lotItem, setLotItem] = useState<LotDto | null>(null);
    const [lotOptionItems, setLotOptionItems] = useState<StockProductUnitDto[] | null>(
        null
    );
    const [showAddNewLot, setShowAddNewLot] = useState(false);
    const [t] = useTranslation("stock");
    const [tCommon] = useTranslation();
    const [addNewLotForm] = Form.useForm();

    const lotOptions = form.getFieldValue(['saleInvoiceDetails', field.name, 'lotNumbers']);

    useEffect(() => {
        setLotOptionItems([...(lotOptions || [])]);
    }, [lotOptions]);

    const saveAddNewLot = (value: any) => {
        if (value) {
            const checkDuplicateLotNumber = lotOptions?.some(
                (lot: any) =>
                    lot.lotNumber?.trim().toLocaleLowerCase() ===
                    value?.lotNumber?.toString().trim().toLocaleLowerCase()
            );
            if (checkDuplicateLotNumber) {
                UiUtils.showError("Đã tồn tại số lô trong hệ thống");
                return;
            }

            setLotItem({
                ...value,
            });

            form.setFieldsValue({
                ['saleInvoiceDetails']: {
                    [field.name]: {
                        lotNumber: value.lotNumber,
                        expiryDate: value.expiryDate,
                        isNewLot: true,
                        lotNumberId: null
                    },
                },
            });

            addNewLotForm.resetFields();
        }
        setShowAddNewLot(false);
    };

    const removeLot = () => {
        setLotItem(null);
        form.setFieldsValue({
            ['saleInvoiceDetails']: {
                [field.name]: {
                    lotNumber: null,
                    expiryDate: null,
                    isNewLot: false,
                    lotNumberId: null
                },
            },
        });
    };

    const addNewLotContentPopover = (
        <Form form={addNewLotForm} onFinish={saveAddNewLot}>
            <Row gutter={16} className="pb-5">
                <Col span={24}>
                    <FloatLabel label={t("lotNumber")} required>
                        <Form.Item
                            name={"lotNumber"}
                            rules={[ValidateUtils.requiredShortMess, ValidateUtils.maxLength(50)]}
                        >
                            <OrdInputRegexText regex={RegexUtil.CodeRegex} />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={24}>
                    <FloatLabel label={t("expiryDate")} required>
                        <Form.Item
                            name={"expiryDate"}
                            rules={[ValidateUtils.requiredShortMess]}
                        >
                            <OrdDateInput />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={24} className="text-right">
                    <Button
                        htmlType={"submit"}
                        className="me-1"
                        type={"primary"}
                        icon={<SaveOutlined />}
                    >
                        {tCommon("save")}
                    </Button>
                    <Button
                        onClick={() => {
                            addNewLotForm.resetFields();
                            setShowAddNewLot(false);
                        }}
                        icon={<CloseOutlined />}
                    >
                        {tCommon("close")}
                    </Button>
                </Col>
            </Row>
        </Form>
    );
    const lotItemFromExcel_w = Form.useWatch(
        ['saleInvoiceDetails', field.name, "lotItemFromExcel"],
        form
    );
    useEffect(() => {
        if (lotItemFromExcel_w && !!lotItemFromExcel_w?.lotNumber) {
            setLotItem(lotItemFromExcel_w);
        }
    }, [lotItemFromExcel_w]);

    const changeLotNumber = (lotItem: StockProductUnitDto) => {
        if (!lotItem.inventoryLineDetailsId) {
            UiUtils.showError("Không tìm thấy số lô");
            form.setFieldsValue({
                ['saleInvoiceDetails']: {
                    [field.name]: {
                        lotNumber: null,
                        expiryDate: null,
                        isNewLot: false,
                        lotNumberId: null
                    },
                },
            });
            return;
        }

        form.setFieldsValue({
            ['saleInvoiceDetails']: {
                [field.name]: {
                    lotNumber: lotItem.lotNumber,
                    expiryDate: lotItem.expiryDate,
                    isNewLot: false,
                    lotNumberId: lotItem.inventoryLineDetailsId
                },
            },
        });
    }

    const labelRender: LabelRender = (props) => {
        const { label, value } = props;

        const lot = lotOptionItems?.find(x => x.inventoryLineDetailsId === value);
        if (!lot) {
            UiUtils.showError("Không tìm thấy số lô");
            form.setFieldsValue({
                ['saleInvoiceDetails']: {
                    [field.name]: {
                        lotNumber: null,
                        expiryDate: null,
                        isNewLot: false,
                        lotNumberId: null
                    },
                },
            });
            return;
        }

        return <i>{lot.lotNumber} - {DateUtil.showWithFormat(lot.expiryDate, 'dd/MM/yyyy')}</i>;
    };

    return (
        <div>
            {isProductUseLotNumber && (
                <>
                    <Form.Item name={[field.name, "lotNumberId"]}>
                        {lotItem === null && (
                            <Select
                                options={lotOptionItems?.map((item) => renderOptionLot(item))}
                                onChange={(event, option: any) => {
                                    changeLotNumber(option.data);
                                }}
                                labelRender={labelRender}
                                placeholder={t("selectLotNumberPlaceholder")}
                                className="w-full ord-input-bottom-line lot-number-select-import"
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                    </>
                                )}
                            />
                        )}
                        {lotItem !== null && (
                            <Space.Compact className='mt-2 inline-flex items-center'>
                                <Tag color="#87d068">
                                    <StockDisplayEllipsisTextLong text={lotItem.lotNumber}
                                        className='text-base inline-flex' maxWidth={120} />
                                </Tag>
                                <Tag className='h-fit'>{DateUtil.showWithFormat(lotItem.expiryDate)} </Tag>
                                <Button type="text" danger onClick={() => {
                                    removeLot();
                                }} icon={<Delete2Icon />} />
                            </Space.Compact>
                        )}
                    </Form.Item>

                    <Modal
                        title={t("addNewLotNumberTitle", { ...productItem })}
                        width={600}
                        open={showAddNewLot}
                        onCancel={() => {
                            addNewLotForm.resetFields();
                            setShowAddNewLot(false);
                        }}
                        footer={null}
                    >
                        {addNewLotContentPopover}
                    </Modal>
                    <div hidden>
                        <Form.Item name={"lotItemFromExcel"} />
                        <Form.Item name={[field.name, "expiryDate"]}
                            rules={[ValidateUtils.requiredShortMess]} />
                        <Form.Item name={[field.name, "lotNumber"]}
                            rules={[ValidateUtils.requiredShortMess]} />
                    </div>
                </>
            )}
        </div>
    );
};
export default LotProductInput;
