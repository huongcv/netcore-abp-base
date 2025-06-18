import { ProductUnitViewDto } from "@api/index.defs";
import { Button, Form } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { StockHelperService } from "@api/StockHelperService";
import validateUtils from "@ord-core/utils/validate.utils";
import { SearchProduct } from "./SearchProduct";
import LotProductInput from "./LotProduct";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import OrdSelect, {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {useSelectTaxCode} from "@ord-components/forms/select/selectDataSource/useSelectTaxPercent";
import { TextLineClampDisplay } from "@ord-components/common/TextLineClampDisplay";
import { Delete2Icon } from "@ord-components/icon/DeleteIcon";
import { SumIcon } from "@ord-components/icon/SumIcon";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import DiscountProductInput from "./DiscountProduct";
import QtyAndUnitProduct from "@pages/StockManagement/Shared/Upsert/grid-product/forms/QtyAndUnitProduct";

const GridProductItems = observer(() => {
    const { t } = useTranslation("order");
    const form = Form.useFormInstance();
    const taxCombo = useSelectTaxCode();

    const subTaxAmount = Form.useWatch(["subTaxAmount"], form) || 0;
    const totalAmountBeforeDiscount = 0;
    const totalAmountAfterDiscount = 0;

    const thClassName = "py-2 px-1 border-b border-gray-200 text-left text-gray-600";
    const tdClassName = "py-2 px-2 border-b border-gray-200 text-gray-800 align-top";

    const handleProductSelect = async (productSelected: ProductUnitViewDto) => {
        await StockHelperService.stockProductSelect({
            body: {
                products: [
                    {
                        productId: productSelected.productId!,
                        productUnitId: productSelected.productUnitId,
                    },
                ],
            },
        });
    };

    const handleMultiProductSelect = async (selectedProducts: ProductUnitViewDto[]) => {
        await StockHelperService.stockProductSelect({
            body: {
                products: selectedProducts.map((product) => ({
                    productId: product.productId!,
                    productUnitId: product.productUnitId,
                })),
            },
        });
    };

    return (
        <div className="grid-product-item-container">
            <SearchProduct
                onProductSelected={handleProductSelect}
                onMultiSelected={handleMultiProductSelect}
            />
            <table className="min-w-full bg-white border border-gray-200 min-h-[100px] mt-3">
                <thead className="product-table-h">
                    <tr>
                        <th className={`${thClassName} w-[30px] text-center`}>#</th>
                        <th className={`${thClassName} w-[200px]`}>{t("product")}</th>
                        <th className={`${thClassName} w-[80px] text-right`}>{t("qty")}</th>
                        <th className={`${thClassName} w-[100px]`}>{t("unit")}</th>
                        <th className={`${thClassName} w-[150px] text-right`}>{t("price")}</th>
                        <th className={`${thClassName} w-[150px] text-center`}>{t("discount")}</th>
                        <th className={`${thClassName} w-[120px] text-center`}>{t("vat")}</th>
                        <th className={`${thClassName} w-[150px] text-right`}>{t("totalAmountDetail")}</th>
                        <th className={`${thClassName} w-[30px] text-right`}></th>
                    </tr>
                </thead>
                <tbody>
                    <Form.List name="products">
                        {(fields, { remove }) =>
                            fields.map((field, index) => (
                                <tr className="even:bg-gray-50" key={field.key}>
                                    <td className={`${tdClassName} text-center`}>{index + 1}</td>
                                    <td className={tdClassName}>
                                        <TextLineClampDisplay
                                            className="!text-[#505050] !font-medium !text-base"
                                            content=""
                                        />
                                        <LotProductInput
                                            enableAddNewEntity
                                            productItem={{}}
                                            field={field}
                                        />
                                    </td>
                                    <QtyAndUnitProduct
                                        productItem={{}}
                                        tdClassName={tdClassName}
                                        field={field}
                                    />
                                    <td className={`${tdClassName} text-right`}>
                                        <Form.Item
                                            name={[field.name, "price"]}
                                            rules={[validateUtils.requiredShortMessWithText(t("priceImportField"))]}
                                        >
                                            <PriceNumberInput
                                                min={0}
                                                step={1000}
                                                decimalLimit={5}
                                                integerLimit={13}
                                                className="not-handler-wrap text-right"
                                            />
                                        </Form.Item>
                                        {totalAmountBeforeDiscount > 0 && (
                                            <div className="flex items-center justify-end">
                                                <SumIcon className="me-1" />
                                                <PriceCell value={totalAmountBeforeDiscount} />
                                            </div>
                                        )}
                                        <Form.Item hidden name="totalAmountBeforeDiscount" />
                                    </td>
                                    <td className={`${tdClassName} text-right`}>
                                        <DiscountProductInput field={field} productItem={{}} />
                                    </td>
                                    <td className={`${tdClassName} text-right`}>
                                        <Form.Item name={[field.name, "taxCode"]}>
                                            <OrdSelect
                                                className="h-[31px]"
                                                allowClear={false}
                                                datasource={taxCombo}
                                                onChange={(data, option: IOrdSelectOption) => {
                                                    form.setFieldValue("taxPercent", option.data?.taxPercent);
                                                }}
                                            />
                                        </Form.Item>

                                        {subTaxAmount > 0 && (
                                            <div className="flex items-center justify-end">
                                                <SumIcon className="me-1" />
                                                <PriceCell value={subTaxAmount} />
                                            </div>
                                        )}
                                        <Form.Item hidden name="subTaxAmount" />
                                        <Form.Item hidden name="taxPercent" />
                                    </td>
                                    <td className={`${tdClassName} text-right`}>
                                        <PriceCell fixed={2} value={totalAmountAfterDiscount} />
                                        <div hidden>
                                            <Form.Item noStyle name={[field.name, "taxAmount"]} />
                                            <Form.Item noStyle name={[field.name, "subTotalAmount"]} />
                                        </div>
                                    </td>
                                    <td className="py-3 text-right">
                                        <Button
                                            type="text"
                                            danger
                                            onClick={() => remove(field.name)}
                                            icon={<Delete2Icon />}
                                        />
                                    </td>
                                </tr>
                            ))
                        }
                    </Form.List>
                </tbody>
            </table>
        </div>
    );
});

export default GridProductItems;