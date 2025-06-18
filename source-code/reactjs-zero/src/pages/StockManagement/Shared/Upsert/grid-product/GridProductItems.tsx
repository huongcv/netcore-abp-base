import {observer} from "mobx-react-lite";
import "../index.scss";
import {SearchProduct} from "@pages/StockManagement/Shared/Upsert/grid-product/SearchProduct";
import {ProductUnitViewDto} from "@api/index.defs";
import {Button, Form, FormInstance} from "antd";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import ImportProductItemForm from "@pages/StockManagement/ImportStock/FormUpsert/ProductItemForm";
import {ImportProductHeaderTable} from "@pages/StockManagement/ImportStock/FormUpsert/HeaderProduct";
import ExportHeaderProduct from "@pages/StockManagement/ExportStock/FormUpsert/HeaderProduct";
import {MoveType, StockMoveFormName,} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {ProductItemFormProps} from "@pages/StockManagement/Shared/Upsert/Props";
import ExportReturnSupplierProductItemForm
    from "@pages/StockManagement/ExportStock/FormUpsert/return-supplier/ProductItemForm";
import TransferProductItemForm from "@pages/StockManagement/TransferStock/FormUpsert/ProductItemForm";
import TransferHeaderProduct from "@pages/StockManagement/TransferStock/FormUpsert/HeaderProduct";
import CheckStockHeaderProduct from "@pages/StockManagement/CheckStock/FormUpsert/HeaderProduct";
import CheckProductItemForm from "@pages/StockManagement/CheckStock/FormUpsert/ProductItemForm";
import ImportStockUploadExcel from "@pages/StockManagement/ImportStock/upload-excel/UploadExcel";
import UpsertFormUtil from "@pages/StockManagement/Shared/utils/UpsertForm.util";
import UiUtils from "@ord-core/utils/ui.utils";
import ImportExcelTransferStock from "@pages/StockManagement/TransferStock/ImportExcel/ImportExcel";
import ImportExcelCheckStock from "@pages/StockManagement/CheckStock/ImportExcel/ImportExcel";
import ImportExcelOrderStock from "@pages/StockManagement/OrderStock/ImportExcel/ImportExcel";
import {StockHelperService} from "@api/StockHelperService";
import ProductItemExcel from "@pages/StockManagement/ImportStock/upload-excel/ProductItemExcel";
import {Delete2Icon} from "@ord-components/icon/DeleteIcon";

const GridProductItems = (props: { formMoveTicket: FormInstance<any> }) => {
    const {formMoveTicket} = props;
    const [itemCount, setItemCount] = useState(0);
    const {t} = useTranslation("stock");
    const {stockMoveStore} = useStore();

    const form = Form.useFormInstance();
    const isImportFromExcel_w = Form.useWatch("isImportFromExcel", formMoveTicket);
    const isEditImport_w = Form.useWatch("isEditImport", formMoveTicket);
    const inventoryId_w = Form.useWatch("inventoryId", props.formMoveTicket);
    const moveType_w = Form.useWatch("moveType", props.formMoveTicket);
    const items_w: any[] = Form.useWatch(StockMoveFormName.ProductItems);

    const handlerProductSelect = async (
        productSelected: ProductUnitViewDto
    ) => {
        const result = await StockHelperService.stockProductSelect({
            body: {
                products: [{
                    productId: productSelected.productId!,
                    productUnitId: productSelected.productUnitId
                }],
                inventoryId: inventoryId_w,
                moveType: moveType_w
            }
        });

        if (!result.isSuccessful) {
            UiUtils.showError(t(result.message!));
            return;
        }

        if (!!result.data) {
            UpsertFormUtil.addProductIntoForm(form, result.data[0], moveType_w);
        }
    };
    const handlerMultiProductSelect = async (
        selectedProducts: ProductUnitViewDto[]
    ) => {
        const result = await StockHelperService.stockProductSelect({
            body: {
                products: selectedProducts.map(x => ({
                    productId: x.productId!,
                    productUnitId: x.productUnitId
                })),
                inventoryId: inventoryId_w,
                moveType: moveType_w
            }
        });

        if (!result.isSuccessful) {
            UiUtils.showError(t(result.message!));
            return;
        }

        if (!!result.data) {
            UpsertFormUtil.addMultiProductIntoForm(form, result.data, moveType_w);
        }
    };

    useEffect(() => {
        if (items_w) {
            setItemCount(items_w.length || 0);
        }
    }, [items_w]);

    const removeProductItemExcel = () => {
        stockMoveStore.productItemsFromExcel = [];
        formMoveTicket.setFieldValue('isImportFromExcel', false);
    }

    return (
        <div className="grid-product-item-container">
            <div className='flex items-center justify-center mb-3'>
                <div className='flex-1'>
                    <SearchProduct
                        disabled={!!isImportFromExcel_w}
                        onProductSelected={handlerProductSelect}
                        onMultiSelected={handlerMultiProductSelect}
                    />
                </div>
                <div>
                    {
                        !!isImportFromExcel_w && !isEditImport_w &&
                        <>
                            <Button onClick={removeProductItemExcel} icon={<Delete2Icon/>}>Xoá dữ liệu excel</Button>
                        </>
                    }
                </div>
            </div>
            {
                (!isImportFromExcel_w || stockMoveStore.moveType !== "import") && <>

                    <table className="min-w-full bg-white border border-gray-200 min-h-[100px]">
                        <thead className="product-table-h">
                        <tr>
                            {stockMoveStore.moveType === "import" ? (
                                <ImportProductHeaderTable/>
                            ) : (
                                <></>
                            )}
                            {stockMoveStore.moveType === "export" ? (
                                <ExportHeaderProduct/>
                            ) : (
                                <></>
                            )}
                            {stockMoveStore.moveType === "transfer" ? (
                                <TransferHeaderProduct/>
                            ) : (
                                <></>
                            )}
                            {stockMoveStore.moveType === "check" ? (
                                <CheckStockHeaderProduct/>
                            ) : (
                                <></>
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        {
                            <Form.List name={StockMoveFormName.ProductItems}>
                                {(fields, {add, remove}) =>
                                    fields.map((field) => {
                                        const propsProduct: ProductItemFormProps = {
                                            field,
                                            remove,
                                            formMoveTicket,
                                        };

                                        return (
                                            <tr className="even:bg-gray-50 grid-form" key={field.key}>
                                                {stockMoveStore.moveType === "import" && (
                                                    <ImportProductItemForm
                                                        key={field.key}
                                                        {...propsProduct}
                                                    ></ImportProductItemForm>
                                                )}
                                                {moveType_w === MoveType.PhieuXuatTraNhaCungCap && (
                                                    <ExportReturnSupplierProductItemForm
                                                        key={field.key}
                                                        {...propsProduct}
                                                    ></ExportReturnSupplierProductItemForm>
                                                )}
                                                {moveType_w === MoveType.PhieuDieuChuyen &&
                                                    stockMoveStore.moveType === "transfer" && (
                                                        <TransferProductItemForm
                                                            key={field.key}
                                                            {...propsProduct}
                                                        ></TransferProductItemForm>
                                                    )}
                                                {moveType_w === MoveType.PhieuKiemKho && (
                                                    <CheckProductItemForm
                                                        key={field.key}
                                                        {...propsProduct}
                                                    ></CheckProductItemForm>
                                                )}
                                                <td hidden>
                                                    <Form.Item
                                                        noStyle
                                                        hidden
                                                        name={[field.name, "taxPercent"]}
                                                    ></Form.Item>
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                            </Form.List>
                        }
                        </tbody>

                    </table>

                    {itemCount <= 0 && !isImportFromExcel_w && (
                        <>
                            {stockMoveStore.moveType === "import" && <ImportStockUploadExcel moveType={moveType_w}/>}
                            {stockMoveStore.moveType === "transfer" && (
                                <ImportExcelTransferStock moveType={moveType_w}/>
                            )}
                            {stockMoveStore.moveType === "check" && (
                                <ImportExcelCheckStock moveType={moveType_w}/>
                            )}
                            {stockMoveStore.moveType === "order" && (
                                <ImportExcelOrderStock inventoryId={inventoryId_w}/>
                            )}
                        </>
                    )}
                </>
            }

            {
                isImportFromExcel_w && <ProductItemExcel formMoveTicket={props.formMoveTicket}/>
            }
        </div>
    );
};
export default observer(GridProductItems);
