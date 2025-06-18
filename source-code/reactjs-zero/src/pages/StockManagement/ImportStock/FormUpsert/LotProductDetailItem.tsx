import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Divider, Form, Input, Modal, Row, Select} from "antd";
import {CloseOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {StockProductUnitDto} from "@api/index.defs";
import StockDisplayEllipsisTextLong from "@ord-components/displays/StockDisplayEllipsisTextLong";
import DateUtil from "@ord-core/utils/date.util";
import UiUtils from "@ord-core/utils/ui.utils";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import OrdInputRegexText from "@ord-components/forms/OrdInputRegexText";
import RegexUtil from "@ord-core/utils/regex.util";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import dayjs from "dayjs";

type ILotProductDetailItemProps = {
    lotNumbers?: any[]; //StockProductUnitDto[]
    product?: any,
    enableAddNewEntity?: boolean
}

interface LotDto {
    lotNumber: string;
    expiryDate: Date;
}

const getLotDisplay = (values: any) => `Số lô: ${values.lotNumber} - HSD: ${DateUtil.showWithFormat(values.expiryDate)}`;

const renderOptionLot = (item: StockProductUnitDto) => {
    return {
        value: item.inventoryLineDetailsId,
        label: (
            <div className='inline-flex items-center'>
                <StockDisplayEllipsisTextLong className={"text-sm leading-5 inline-flex items-center"}
                                              text={item.lotNumber!} maxWidth={120}/>
                <span className={"ms-1 italic text-sm"}>
         - HSD: {DateUtil.showWithFormat(item.expiryDate)}
        </span>
            </div>
        ),
        data: item
    };
};

const LotProductDetailItem = (props: ILotProductDetailItemProps) => {
    const {lotNumbers, product, enableAddNewEntity} = props;
    const form = Form.useFormInstance();
    const [addNewLotForm] = Form.useForm();
    const [showAddNewLot, setShowAddNewLot] = useState(false);
    const [lotItem, setLotItem] = useState<LotDto | null>(null);
    const labelRender = (props: any) => {
        const {label, value} = props;
        const lot = lotNumbers?.find(x => x.inventoryLineDetailsId === value);
        if (!lot) {
            return;
        }

        return <i>{lot.lotNumber} - {DateUtil.showWithFormat(lot.expiryDate, 'dd/MM/yyyy')}</i>;
    };

    const changeLotNumber = (lotItem: StockProductUnitDto) => {
        if (!lotItem.inventoryLineDetailsId) {
            UiUtils.showError("Không tìm thấy số lô");
            resetLot();
            return;
        }

        form.setFieldsValue({
            lotNumber: lotItem.lotNumber,
            expiryDate: lotItem.expiryDate,
            isNewLot: false,
            lotNumberId: lotItem.inventoryLineDetailsId
        });
    }

    const resetLot = () => {
        setLotItem(null);
        form.setFieldsValue({
            lotNumber: null,
            expiryDate: null,
            isNewLot: false,
            lotNumberId: 0
        });
    }

    const onFinish = (values: any) => {
        if (values) {
            const isDuplicate = lotNumbers?.some(
                (lot: any) =>
                    lot.lotNumber?.trim().toLocaleLowerCase() ===
                    values?.lotNumber?.toString().trim().toLocaleLowerCase()
                    && values.expiryDate && dayjs(values.expiryDate).isSame(dayjs(lot.expiryDate), 'day')
            );

            if (isDuplicate) {
                UiUtils.showError("Đã tồn tại số lô trong hệ thống");
                return;
            }

            setLotItem({
                lotNumber: values.lotNumber,
                expiryDate: values.expiryDate
            });

            form.setFieldsValue({
                lotDisplay: getLotDisplay(values),
                lotNumber: values.lotNumber,
                expiryDate: values.expiryDate,
                isNewLot: true,
                lotNumberId: 0
            });

            addNewLotForm.resetFields();
        }
        setShowAddNewLot(false);
    }

    const addNewLotContentPopover = useMemo(() =>
        <Form form={addNewLotForm} onFinish={onFinish}>
            <Row gutter={16} className="pb-5">
                <Col span={24}>
                    <FloatLabel label={'Số lô'} required>
                        <Form.Item
                            name={"lotNumber"}
                            rules={[ValidateUtils.requiredShortMess, ValidateUtils.maxLength(50)]}
                        >
                            <OrdInputRegexText regex={RegexUtil.CodeRegex}/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={24}>
                    <FloatLabel label={'Hạn sử dụng'} required>
                        <Form.Item
                            name={"expiryDate"}
                            rules={[ValidateUtils.requiredShortMess]}
                        >
                            <OrdDateInput/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={24} className="text-right">
                    <Button
                        htmlType={"submit"}
                        className="me-1"
                        type={"primary"}
                        icon={<SaveOutlined/>}
                    >
                        Lưu
                    </Button>
                    <Button
                        onClick={() => {
                            addNewLotForm.resetFields();
                            setShowAddNewLot(false);
                        }}
                        icon={<CloseOutlined/>}
                    >
                        Đóng
                    </Button>
                </Col>
            </Row>
        </Form>, []
    );

    useEffect(() => {
        if (product) {
            form.setFieldsValue({
                lotNumberId: product.lotNumberId,
                lotNumber: product.lotNumber,
                lotDisplay: product.lotDisplay,
                expiryDate: product.expiryDate,
                isNewLot: product.isNewLot,
            });

            if (product?.isNewLot) {
                setLotItem({
                    lotNumber: product.lotNumber,
                    expiryDate: product.expiryDate
                })
            }
        }
    }, [product]);

    return <>
        {
            !!product?.isProductUseLotNumber &&
            <>
                {lotItem === null && (
                    <Form.Item name='lotNumberId'>
                        <Select
                            options={lotNumbers?.map((item) => renderOptionLot(item))}
                            onChange={(event, option: any) => {
                                changeLotNumber(option.data);
                            }}
                            labelRender={labelRender}
                            className="w-full"
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    {enableAddNewEntity === true && (
                                        <>
                                            <Divider style={{margin: "8px 0"}}/>
                                            <Button
                                                size={"small"}
                                                onClick={() => setShowAddNewLot(true)}
                                                type={"primary"}
                                                icon={<PlusOutlined/>}
                                            >
                                                Thêm mới số lô
                                            </Button>
                                        </>
                                    )}
                                </>
                            )}
                        />
                    </Form.Item>
                )}
                {lotItem !== null && (
                    <Form.Item name='lotDisplay'>
                        <Input
                            style={{height: '40px'}}
                            readOnly
                            suffix={
                                <Button
                                    type="text"
                                    danger
                                    onClick={() => resetLot()}
                                    icon={<CloseOutlined/>}
                                />
                            }
                        />
                    </Form.Item>
                )}
                <Modal
                    title={'Thêm mới số lô'}
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
                    <Form.Item name='lotNumber'/>
                    <Form.Item name='expiryDate'/>
                    <Form.Item name='isNewLot'/>
                    <Form.Item name='lotNumberId' />
                    <Form.Item name='lotDisplay' />
                </div>
            </>
        }
    </>
};

export default LotProductDetailItem;