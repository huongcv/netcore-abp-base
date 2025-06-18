import {ProductLotDto} from "@api/index.defs";
import {Form, FormInstance, Select, Space, Tag} from "antd";
import {CalendarFilled} from "@ant-design/icons";
import DateUtil from "@ord-core/utils/date.util";
import {Countdown2Icon} from "@ord-components/icon/Countdown2";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import React, {useEffect, useState} from "react";
import {ProductHelperService} from "@api/ProductHelperService";
import {SelectProps} from "antd/lib";
import UiUtils from "@ord-core/utils/ui.utils";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";

type LabelRender = SelectProps['labelRender'];

export const LotProductInput = (props: {
    product: any;
    inventoryId: any;
    form: FormInstance;
}) => {
    const {product, form} = props;
    const [lotOptionItems, setLotOptionItems] = useState<ProductLotDto[] | null>(
        null
    );

    useEffect(() => {
        getLotOptions();
    }, [product, props.inventoryId]);

    const getLotOptions = async () => {
        try {
            const result = await ProductHelperService.getLotNumbers({
                body: {
                    productId: product?.productId,
                    inventoryId: props.inventoryId,
                },
            });

            setLotOptionItems([...result]);
        } catch {
        }
    };
    const renderOptionLot = (item: ProductLotDto) => {
        return {
            value: item.stockInventoryLineId,
            data: item,
            label: (
                <>
                    <Space className="mt-1">
                        <Tag
                            style={{
                                marginInlineEnd: 0,
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                maxWidth: "300px",
                                marginTop: "10px",
                            }}
                            color="green"
                            className="me-2"
                        >
                            {item.lotNumber}
                        </Tag>
                        <Tag color="orange">
                            <CalendarFilled className="me-1"/>
                            {DateUtil.showWithFormat(item.expiryDate)}
                        </Tag>
                        {item.qty && item.qty > 0 && (
                            <>
                                <Countdown2Icon/>
                                <PriceCell value={item.qty}/>
                            </>
                        )}
                    </Space>
                </>
            ),
        };
    };

    const onChange = (value: string, option: any) => {
        // handle trường hợp allowClear nhưng lotExpiryDate và lotQty không clear
        if (option && option.data) {
            form.setFieldsValue({
                lotExpiryDate: option.data.expiryDate,
                lotQty: option.data.qty,
                lotNumber: option.data.lotNumber,
                lotNumberId: option.data.stockInventoryLineId,
            });
        } else {
            form.setFieldsValue({
                lotExpiryDate: null,
                lotQty: null,
                lotNumber: null,
                lotNumberId: null
            });
        }
    };

    const labelRender: LabelRender = (props) => {
        const {label, value} = props;

        const lot = lotOptionItems?.find(x => x.stockInventoryLineId === value);
        if (!lot) {
            UiUtils.showError("Không tìm thấy số lô");
            form.setFieldsValue({
                lotExpiryDate: null,
                lotQty: null,
                lotNumber: null,
                lotNumberId: null
            });
            return;
        }

        return <i>{lot.lotNumber} - {DateUtil.showWithFormat(lot.expiryDate, 'dd/MM/yyyy')}</i>
    };

    return (
        <>
            <Form.Item name="lotNumberId">
            <Select
                    labelRender={labelRender}
                    onChange={onChange}
                    allowClear
                    showSearch
                    options={lotOptionItems?.map(renderOptionLot)}
                    className="w-full"
                />
            </Form.Item>

            <div hidden>
                <Form.Item name="lotExpiryDate"></Form.Item>
                <Form.Item name="lotQty"></Form.Item>
                <Form.Item name="lotNumber"></Form.Item>
            </div>
        </>
    );
};
