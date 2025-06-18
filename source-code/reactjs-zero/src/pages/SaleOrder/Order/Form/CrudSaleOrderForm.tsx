import { ArrowLeftOutlined, FilterOutlined } from "@ant-design/icons";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { TopAction } from "@ord-components/crud/TopAction";
import { Button, Card, Col, Flex, Form, Input, Row, Select, Space, Table, TableColumnsType, Tooltip } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../Form/CrudSaleOrderForm.scss";
import tableUtil from "@ord-core/utils/table.util";
import { useEffect, useState } from "react";
import { SaleOrderService } from "@api/SaleOrderService";
import { ProductDto, ProductOrderDto, SaleOrderDetailDto, SaleOrderDto } from "@api/index.defs";
import { ImgFromFileId } from "@ord-components/common/img/ImgFromFileId";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import { l } from "@ord-core/language/lang.utils";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectProvince } from "@ord-components/forms/select/selectDataSource/useSelectProvince";
import { useSelectDistrict } from "@ord-components/forms/select/selectDataSource/useSelectDistrict";
import { useSelectWard } from "@ord-components/forms/select/selectDataSource/useSelectWard";
import SaleOrderRightBox from "./SaleOrderRightBox";
import UpsertFormUtil from "@pages/StockManagement/Shared/utils/UpsertForm.util";
import { useStore } from "@ord-store/index";
import ProductItemTable from "./ProductItemTable";
import { UpsertMoveContext, useUpsertStockMove } from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import uiUtils from "@ord-core/utils/ui.utils";
import { StockUtil } from "@pages/StockManagement/Shared/StockUtil";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import validateUtils from "@ord-core/utils/validate.utils";

const { Option } = Select;
const CrudSaleOrderForm = (props: {
    onSave: (formData: any) => void;
    cloneTicketDto?: any;
    ns?: string;
}) => {
    const { saleOrderStore: mainStore } = useStore();
    const { t } = useTranslation('sale-order');
    const navigate = useNavigate();
    const [data, setData] = useState<ProductOrderDto[]>([]);
    const {
        formMoveTicket,
        formProductItems,
        editData: saleOrderData
    } = useUpsertStockMove();
    const editData = saleOrderData as SaleOrderDto;
    useEffect(() => {
        SaleOrderService.getProductInventoryAvailable().then(res => {
            setData(res);
        })
    }, [])

    useEffect(() => {
        if (editData) {
            formProductItems?.setFieldsValue({ editData, ...editData.saleOrderDeliveryDto })
            formMoveTicket.setFieldsValue(editData);
            mainStore.productItems = editData.saleOrderDetails ?? [];
        }
    }, [editData]);

    const onChangeState = (val: any) => {
        formMoveTicket.setFieldValue('districtCode', null);
        formMoveTicket.setFieldValue('wardCode', null);
    }

    const onChangeDistrict = (val: any) => {
        formMoveTicket.setFieldValue('wardCode', null);
    }

    const onChangeWard = (_: any, val: any) => {
        if (val) {
            const data = JSON.parse(JSON.stringify(val.data ?? {}))
            formMoveTicket.setFieldValue('address', data?.areaFullName);
        }
    }


    const topAction: IActionBtn[] = [
        {
            content: <>
                <Button onClick={() => navigate(-1)}>
                    <Space>
                        <ArrowLeftOutlined />
                    </Space>
                    {t('actionBtn.back')}
                </Button>
            </>
        },
    ]

    const addProductIntoForm = (product: any) => {
        const productItems = mainStore.productItems;
        const existingProductIndex = productItems.findIndex((item: any) => item.productId === product.productId);

        if (existingProductIndex > -1) {
            // If product already exists, increment the quantity
            const updatedProductItems = [...productItems];
            updatedProductItems[existingProductIndex].qty += 1;
            updatedProductItems[existingProductIndex].totalAmountAfterDiscount = updatedProductItems[existingProductIndex].qty * updatedProductItems[existingProductIndex].price;
            mainStore.productItems = updatedProductItems;
        } else {
            // If product does not exist, add it to the list
            const newProductItem = {
                id: product.productId,
                productName: product.productName,
                qty: 1,
                productUnitId: product.basicUnitId,
                price: product.productPrice,
                totalAmountAfterDiscount: product.productPrice,
                ...product
            };
            mainStore.productItems = [...productItems, newProductItem];
        }
        caculate();
    }

    const caculate = async () => {
        const moveValueForm = formMoveTicket.getFieldsValue();
        let productItems: any[] = mainStore.productItems;
        const {
            products,
            move
        } = UpsertFormUtil.calculatorAllProduct(productItems, moveValueForm);
        productItems = [...products];
        formMoveTicket.setFieldsValue({
            ...moveValueForm,
            ...move
        });
    }



    return <>

        <div>
            <PageTopTitleAndAction usingCustom={true} mainTitle={editData?.id ? t('tileAction.edit') : t('tileAction.addNew')} items={[t('titlePageDetailLvl1')]}>
                <>
                    <TopAction topActions={topAction} />
                </>
            </PageTopTitleAndAction>
            <Row gutter={[16, 8]} className="mt-2">

                <Col span={18}>
                    <Form form={formProductItems}>

                        <Card>
                            <h3 className={"sale-order-title-header"}>
                                {t("product")}
                            </h3>
                            <Row >
                                <Col span={18}>
                                    <Select allowClear showSearch placeholder={t("productCodeAndNameToSearch")} filterOption={false} onSelect={(value, option) => { addProductIntoForm(option.data) }}
                                        suffixIcon={<FilterOutlined style={{ fontSize: 18 }} />} value={null} style={{ width: "100%" }}>
                                        {data.map((item) => (
                                            <Option key={item.productId} value={item.productId} data={item}>
                                                <div className='product-search flex items-center'>
                                                    <ImgFromFileId
                                                        style={{ width: '36px', height: '36px', borderRadius: '2px' }}
                                                        preview={false} fileId={item.imageUrl}></ImgFromFileId>
                                                    <div className='ml-2'>
                                                        <div>
                                                            <Flex>
                                                                <Tooltip title={item.productName}>
                                                                    <b className='max-w-96 overflow-hidden text-ellipsis'>{item.productName}</b>
                                                                </Tooltip>
                                                                {
                                                                    !!item.productName && <>
                                                                        <span className={'ml-2 min-w-[40px]'}>- {item.productName}</span>
                                                                    </>
                                                                }

                                                            </Flex>
                                                            <Flex>
                                                                {
                                                                    !!item.productCode &&
                                                                    <span className='inline-block'>{item.productCode} </span>
                                                                }
                                                                {
                                                                    !!item.productPrice &&
                                                                    <p className={'ms-3 italic'}>
                                                                        <span>
                                                                            {l.transCommon('price')}:
                                                                        </span>
                                                                        <span className={'ms-1'}>
                                                                            <PriceCell value={Number(item.productPrice)} fixed={0} />
                                                                        </span>
                                                                    </p>
                                                                }
                                                            </Flex>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col span={24} className="mt-3">
                                    <ProductItemTable></ProductItemTable>
                                </Col>
                            </Row>

                        </Card>
                        <Row gutter={[16, 8]} >
                            <Col span={12}>
                                <Card className="mt-4">
                                    <h3 className={"sale-order-title-header"}>
                                        {t("receive")}
                                    </h3>
                                    <Row gutter={[16, 8]}>
                                        <Col span={24}>
                                            <Form.Item labelAlign="left" labelCol={{ flex: '200px' }} label={t("deliveryExpectedDate")} name="deliveryExpectedDate" >
                                                <OrdDateInput></OrdDateInput>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <FloatLabel label={t("receiver")} required>
                                                <Form.Item name="receiver" rules={[validateUtils.required]}>
                                                    <Input></Input>
                                                </Form.Item>
                                            </FloatLabel>
                                        </Col>
                                        <Col span={12}>
                                            <FloatLabel label={t("receiverPhone")}>
                                                <Form.Item name="receiverPhone" >
                                                    <Input></Input>
                                                </Form.Item>
                                            </FloatLabel>
                                        </Col>
                                        <Col span={24}>
                                            <FloatLabel label={t("receiverAddress")}>
                                                <Form.Item name="receiverAddress" >
                                                    <Input></Input>
                                                </Form.Item>
                                            </FloatLabel>
                                        </Col>
                                        <Col span={8}>
                                            <FloatLabel label={t("cityCode")}>
                                                <Form.Item name="cityCode">
                                                    <OrdSelect datasource={useSelectProvince()} onChange={onChangeState}></OrdSelect>
                                                </Form.Item>
                                            </FloatLabel>
                                        </Col>
                                        <Col span={8}>
                                            <FloatLabel label={t("districtCode")}>
                                                <Form.Item name="districtCode">
                                                    <OrdSelect
                                                        datasource={useSelectDistrict(
                                                            Form.useWatch("cityCode", formMoveTicket)
                                                        )}
                                                        onChange={onChangeDistrict}
                                                        allowClear
                                                    />
                                                </Form.Item>
                                            </FloatLabel>
                                        </Col>
                                        <Col span={8}>
                                            <FloatLabel label={t("wardCode")}>
                                                <Form.Item name="wardCode">
                                                    <OrdSelect
                                                        datasource={useSelectWard(
                                                            Form.useWatch("districtCode", formMoveTicket)
                                                        )}
                                                        onChange={onChangeWard}
                                                        allowClear
                                                    />
                                                </Form.Item>
                                            </FloatLabel>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card className="mt-4">
                                    <Row gutter={[16, 8]}>
                                        <Col span={14}>
                                            <h3 className={"sale-order-title-header"}>
                                                {t("delivery")}
                                            </h3>
                                        </Col>
                                        <Col span={10}>
                                            <Form.Item name="donViVanChuyen" >
                                                <Select placeholder="Đơn vị vận chuyển"></Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={10}>
                                            <FloatLabel label="Cân nặng">
                                                <Form.Item name="packageWeight" >
                                                    <Input min={0} type="number" />
                                                </Form.Item>
                                            </FloatLabel>
                                        </Col>
                                        <Col span={14}>
                                            <div className="size-input-group">
                                                <div className="inputs">
                                                    <FloatLabel label="Cao">
                                                        <Form.Item name="packageHeight" >
                                                            <Input min={0} type="number" style={{ width: "auto" }} />
                                                        </Form.Item>
                                                    </FloatLabel>

                                                    <span className="pb-4">x</span>
                                                    <FloatLabel label="Rộng">
                                                        <Form.Item name="packageWidth" >
                                                            <Input min={0} type="number" style={{ width: "auto" }} />
                                                        </Form.Item>
                                                    </FloatLabel>

                                                    <span className="pb-4">x</span>
                                                    <FloatLabel label="Dài">
                                                        <Form.Item name="packageLength" >
                                                            <Input min={0} type="number" style={{ width: "auto" }} />
                                                        </Form.Item>
                                                    </FloatLabel>

                                                    <span className="pb-4">(cm)</span>
                                                </div>
                                            </div>
                                        </Col>


                                        <Col span={12}>
                                            <FloatLabel label={t("deliveryCode")}>
                                                <Form.Item name="deliveryCode" >
                                                    <Input></Input>
                                                </Form.Item>
                                            </FloatLabel>
                                        </Col>
                                        <Col span={12}>
                                            <FloatLabel label={t("deliveryFee")}>
                                                <Form.Item name="phi" >
                                                    <PriceNumberInput
                                                        min={0}
                                                        integerLimit={17}
                                                        decimalLimit={0}
                                                        isOnlyNumberInput
                                                        step={1000}
                                                        className="not-handler-wrap text-right"
                                                    ></PriceNumberInput>
                                                </Form.Item>
                                            </FloatLabel>
                                        </Col>

                                    </Row>
                                </Card>
                            </Col>
                        </Row>

                    </Form>
                </Col>

                <Col span={6}>
                    <Form form={formMoveTicket}>
                        <SaleOrderRightBox onSave={props.onSave} />
                    </Form>

                </Col>

            </Row>


        </div >

    </>
}

export default observer(CrudSaleOrderForm);
