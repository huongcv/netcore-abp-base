import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ProductPriceListDto } from "@api/index.defs";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { useStore } from "@ord-store/index";
import { Button, Checkbox, Col, Flex, Form, Input } from "antd";
import { useWatch } from "antd/es/form/Form";
import { observer } from "mobx-react-lite/src/observer";
import { EventHandler, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

export enum CALCULATE_PRICE_TYPE {

    Percentage = 1,
    Value = 2,
}

export enum CALCULATE_PRICE_METHOD {

    Plus = 1,
    Minus = 2,
}

const PriceListDetailFormSearch = (props: {
    item: ProductPriceListDto | undefined,
    openEditHandler?: EventHandler<any>,
    openChangeShopHandler?: EventHandler<any>,
    openFormAdd?: () => void,
}) => {
    const { productPriceListDetailStore: mainStore, StockSearchProductTableServerSideStore } = useStore();
    const form = Form.useFormInstance();
    const { t } = useTranslation('price-list');

    useEffect(() => {
        if (props.item) {
            const { calculatePriceMethod, calculatePriceValue, calculatePriceType } = props.item;
            const operator = calculatePriceMethod === 2 ? '-' : '+';
            const unit = calculatePriceType === 2 ? 'VNĐ' : '%';
            const value = calculatePriceValue ?? 0;

            form.setFieldsValue({
                ...props.item,
                priceFormula: `Giá chung ${operator} ${value}${unit}`
            });
        }
    }, [props.item]);

    useEffect(() => {
        mainStore.disableFormSearch = true;
    }, [])

    return (
        <>
            <Col span={8}>
                <FloatLabel label={t('name')} required>
                    <Form.Item name="name" rules={[ValidateUtils.required, ValidateUtils.maxLength(100)]}>
                        <Input allowClear />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={8}>
                <FloatLabel label={t('priceFormula')}>
                    <Form.Item name="priceFormula">
                        <Input disabled />
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={4}>
                <FloatLabel label={t('startDate')}>
                    <Form.Item name="startDate">
                        <OrdDateInput></OrdDateInput>
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={4}>
                <FloatLabel label={t('endDate')}>
                    <Form.Item name="endDate">
                        <OrdDateInput></OrdDateInput>
                    </Form.Item>
                </FloatLabel>
            </Col>
            <Col span={15}>
                <Flex className="ml-3">
                    <Form.Item name="isAutoUpdatePrice" valuePropName="checked">
                        <Checkbox>{'Thay đổi theo bảng giá chung'}</Checkbox>
                    </Form.Item>
                    <Form.Item name="isAutoCreateProduct" valuePropName="checked">
                        <Checkbox>{t('Tự động thêm sản phẩm')}</Checkbox>
                    </Form.Item>
                </Flex>
            </Col>
            <Col span={9}>
                <Flex className="gap-3 w-full justify-end">
                    <Button type={"primary"} disabled={false} onClick={() => props.openFormAdd && props.openFormAdd()} hidden={props.item?.isMain}>
                        <PlusOutlined /> Thêm sản phẩm vào bảng giá
                    </Button>
                    <Button onClick={props.openEditHandler} hidden={Form.useWatch('isMain', form)} disabled={false} type={'primary'} icon={<EditOutlined />} >Sửa thông tin</Button>
                </Flex>
            </Col>
            <Form.Item name='isMain' hidden initialValue={false}/>
            <Form.Item name='calculatePriceValue' hidden initialValue={0}/>
            <Form.Item name='calculatePriceType' hidden initialValue={0}/>
            <Form.Item name='calculatePriceMethod' hidden initialValue={0}/>
        </>
    )
}

export default observer(PriceListDetailFormSearch); 