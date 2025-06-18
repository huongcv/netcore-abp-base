import { ProductHelperService } from "@api/ProductHelperService";
import uiUtils from "@ord-core/utils/ui.utils";
import { Form } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { SearchProduct } from "./SearchProduct";
import { ProductSelectDto, ProductUnitViewDto } from "@api/index.defs";
import { ProductHeaderTable } from "./ProductHeaderTable";
import ProductBodyTable from "./ProductBodyTable";
import "@pages/2.Restaurant/CentralBilling/index.scss"
import { FormInstance } from "antd/lib";

const GridProductItems = observer((props: {
    form: FormInstance
}) => {
    const { t } = useTranslation("checkout");
    const form = Form.useFormInstance();

    const handleProductSelect = async (productSelected: ProductUnitViewDto) => {
        const result = await ProductHelperService.handleProductSelect({
            body: {
                products: [{ productId: productSelected.productId!, productUnitId: productSelected.productUnitId }],
            },
        });

        if (!result.isSuccessful) {
            uiUtils.showError(t(result.message!));
            return;
        }

        if (result.data) {
            addProductIntoForm(result.data[0]);
        }
    };

    const addProductIntoForm = (product: ProductSelectDto) => {
        if (!product?.productId) return;

        const values = form.getFieldValue("saleInvoiceDetails") || [];
        const findItem = values.find(
            (x: any) => x.productId === product.productId && x.productUnitId === product.productUnitId && !x.lotNumber
        );

        product.qty = findItem ? (product.qty || 0) + 1 : 1;
        const unit = product.units?.find((x) => x.productUnitId === product.productUnitId);
        if (unit) {
            product.price = (product.price || 0) * (unit.convertRate || 0);
        }

        form.setFieldValue("saleInvoiceDetails", [...values, product]);
    };

    const handleMultiProductSelect = async (selectedProducts: ProductUnitViewDto[]) => {
        await ProductHelperService.handleProductSelect({
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
            <SearchProduct onProductSelected={handleProductSelect} onMultiSelected={handleMultiProductSelect} />
            <table className="min-w-full bg-white border border-gray-200 min-h-[100px] mt-3">
                <thead className="product-table-h">
                    <ProductHeaderTable />
                </thead>
                <tbody>
                    <Form.List name="saleInvoiceDetails">
                        {(fields, { remove }) =>
                            fields.map((field) => {
                                const propsProduct: any = { field, remove };
                                return (
                                    <tr className="even:bg-gray-50 grid-form" key={field.key}>
                                        <ProductBodyTable key={field.key} {...propsProduct} formInfo={props.form} />
                                    </tr>
                                );
                            })
                        }
                    </Form.List>
                </tbody>
            </table>
        </div>
    );
});

export default GridProductItems;