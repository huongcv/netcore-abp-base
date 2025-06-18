import {ExportStockService} from "@api/ExportStockService";
import {ExportStockTicketDto, ProductUnitViewDto} from "@api/index.defs";
import {StockHelperService} from "@api/StockHelperService";
import {HotKeyScope} from "@ord-core/AppConst";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";
import {default as UiUtils, default as uiUtils,} from "@ord-core/utils/ui.utils";
import {useStore} from "@ord-store/index";
import ExportCancelProductItemForm from "@pages/StockManagement/ExportCancel/FormUpsert/ProductItemForm";
import ExportCancelRightBox from "@pages/StockManagement/ExportCancel/FormUpsert/RightBox";
import ImportExcelExportCancel from "@pages/StockManagement/ExportCancel/ImportExcel/ImportExcel";
import HeaderStock from "@pages/StockManagement/Shared/components/HeaderStock";
import {HeaderCssProduct, MoveType, StockMoveFormName,} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {StockUtil} from "@pages/StockManagement/Shared/StockUtil";
import {SearchProduct} from "@pages/StockManagement/Shared/Upsert/grid-product/SearchProduct";
import {ProductItemFormProps} from "@pages/StockManagement/Shared/Upsert/Props";
import {UpsertMoveContext} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import UpsertFormUtil from "@pages/StockManagement/Shared/utils/UpsertForm.util";
import {Form} from "antd";
import _ from "lodash";
import {observer} from "mobx-react-lite";
import {useEffect, useRef} from "react";
import {useHotkeys} from "react-hotkeys-hook";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import "../Shared/Upsert/index.scss";
import Utils from "@ord-core/utils/utils";

const UpsertExportCancelStock = (props: {
    editData?: ExportStockTicketDto;
}) => {
    const [t] = useTranslation("stock");
    const {StockSearchProductTableServerSideStore} = useStore();
    const [formMoveTicket] = Form.useForm();
    const [formProductItems] = Form.useForm();
    const navigate = useNavigate();
    const inventoryId_w = Form.useWatch("inventoryId", formMoveTicket);
    const items_w: any[] = Form.useWatch(
        StockMoveFormName.ProductItems,
        formProductItems
    );
    let {id} = useParams();
    const pathNameRef = useRef<string>(Utils.getPathUpTo('stock'));

    //#region submit form
    const onSave = async (isDraft: boolean) => {
        UiUtils.setBusy();
        try {
            const formData = await submitForm(isDraft);

            const result = await ExportStockService.createOrUpdateMove({
                body: {
                    ...formData,
                },
            });
            if (result.isSuccessful) {
                UiUtils.showSuccess(t("saveDone"));
                navigate(pathNameRef.current + "/export-cancel");
            } else {
                if (!StockUtil.HandlerError(result)) {
                    ServiceProxyUtils.notifyErrorResultApi(result, "stock", {
                        ...formData,
                    });
                }
            }
        } catch {
        } finally {
            UiUtils.clearBusy();
        }
    };

    const submitForm = async (isDraft: boolean) => {
        formProductItems.submit();
        formMoveTicket.submit();
        try {
            // Validate cả hai form
            const [productItemsValues, moveTicketValues] = await Promise.all([
                formProductItems.validateFields(),
                formMoveTicket.validateFields(),
            ]);
            const items = productItemsValues.productItems || [];

            if (!(items.length > 0)) {
                UiUtils.showError(t("errorNoProduct"));
                return false;
            }
            // Nếu cả hai form đều valid, xử lý lưu data
            const formValue = {
                moveDto: {
                    ...StockUtil.omitMoveStockUpsert(moveTicketValues),
                },
                items: items.map((it: any) =>
                    StockUtil.omitMoveStockItemUpsert(it, moveTicketValues)
                ),
                isDraft,
            };

            return formValue;
        } catch (error) {
            // Xử lý lỗi nếu có
            uiUtils.showCommonValidateForm();
            console.log({
                ...formMoveTicket.getFieldsValue(),
                ...formProductItems.getFieldsValue(),
            });
        }
    };
    //#endregion

    //#region select product
    const handlerProductSelect = async (productSelected: ProductUnitViewDto) => {
        const result = await StockHelperService.stockProductSelect({
            body: {
                products: [
                    {
                        productId: productSelected.productId!,
                        productUnitId: productSelected.productUnitId,
                    },
                ],
                inventoryId: inventoryId_w,
                moveType: MoveType.PhieuXuatHuy,
            },
        });

        if (!result.isSuccessful) {
            UiUtils.showError(t(result.message!));
            return;
        }

        if (!!result.data) {
            UpsertFormUtil.addProductIntoForm(
                formProductItems,
                result.data[0],
                MoveType.PhieuXuatHuy
            );
        }
    };
    const handlerMultiProductSelect = async (
        selectedProducts: ProductUnitViewDto[]
    ) => {
        const result = await StockHelperService.stockProductSelect({
            body: {
                products: selectedProducts.map((x) => ({
                    productId: x.productId!,
                    productUnitId: x.productUnitId,
                })),
                inventoryId: inventoryId_w,
                moveType: MoveType.PhieuXuatHuy,
            },
        });

        if (!result.isSuccessful) {
            UiUtils.showError(t(result.message!));
            return;
        }

        if (!!result.data) {
            UpsertFormUtil.addMultiProductIntoForm(
                formProductItems,
                result.data,
                MoveType.PhieuXuatHuy
            );
        }
    };
    //#endregion

    //#region get-by-id
    useEffect(() => {
        if (id) {
            loadMoveTicket().then();
        }
    }, [id]);
    const loadMoveTicket = async () => {
        UiUtils.setBusy();
        try {
            const result = await ExportStockService.getById({
                idHash: id as string,
            });

            if (!result.isSuccessful) {
                UiUtils.showError(result.message);
                return;
            }

            patchValueToForm(result.data!);
        } catch {
        } finally {
            UiUtils.clearBusy();
        }
    };
    //#endregion

    //#region clone-by-id
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const cloneMove = searchParams.get("cloneMove");
    useEffect(() => {
        if (cloneMove) {
            loadMove(cloneMove).then();
        }
    }, [cloneMove]);

    const loadMove = async (cloneMove: string) => {
        UiUtils.setBusy();
        try {
            const result = await ExportStockService.cloneById({
                idHash: cloneMove,
            });

            if (!result.isSuccessful) {
                UiUtils.showError(result.message);
                return;
            }

            patchValueToForm(result.data!);
        } catch {
        } finally {
            UiUtils.clearBusy();
        }
    };
    //#endregion

    const patchValueToForm = (data: ExportStockTicketDto) => {
        const items = data?.items || [];
        formProductItems.setFieldsValue({
            productItems: items.map((it) => {
                const productDetail = _.pickBy({...it?.productDetail}, _.identity);
                return {
                    ...productDetail,
                    ...it,
                };
            }),
        });
        formMoveTicket.setFieldsValue({
            ...data?.moveDto,
        });
    };

    useHotkeys(
        "F10",
        (event) => {
            navigate(pathNameRef.current + "/export-cancel");
            event.preventDefault();
        },
        {
            scopes: [HotKeyScope.moveStockContainer],
            enableOnFormTags: true,
            enabled: !StockSearchProductTableServerSideStore.isModalOpen,
        }
    );

    return (
        <>
            <UpsertMoveContext.Provider
                value={{
                    formMoveTicket: formMoveTicket,
                    formProductItems: formProductItems,
                    editData: props.editData,
                    t: t as any,
                }}
            >
                <HeaderStock
                    returnUrl={pathNameRef.current + "/export-cancel"}
                    title={t("exportCancel.pageTitle")}
                    subTitle={
                        props.editData?.moveDto?.moveCode ?? t("exportCancel.addNew")
                    }
                />

                <div className="flex  flex-col ord-stock-move-md:flex-row">
                    <div className="w-full ord-stock-move-md:flex-1 me-3 mb-3">
                        <Form form={formProductItems}>
                            <div className="grid-product-item-container">
                                <SearchProduct
                                    onProductSelected={handlerProductSelect}
                                    onMultiSelected={handlerMultiProductSelect}
                                />
                                <table className="min-w-full bg-white border border-gray-200 min-h-[100px] mt-3">
                                    <thead className="product-table-h">
                                    <tr>
                                        <th
                                            className={HeaderCssProduct + " w-[30px] text-center"}
                                        >
                                            #
                                        </th>
                                        <th className={HeaderCssProduct}>{t("product")}</th>
                                        <th
                                            className={HeaderCssProduct + " w-[90px] text-center"}
                                        >
                                            {t("qty")}
                                        </th>
                                        <th
                                            className={HeaderCssProduct + " w-[100px] text-center"}
                                        >
                                            {t("unit")}
                                        </th>
                                        <th
                                            className={HeaderCssProduct + " w-[200px] text-center"}
                                        >
                                            {t("cancelReason")}
                                        </th>
                                        <th
                                            className={HeaderCssProduct + " w-[120px] text-right"}
                                        >
                                            {t("costPrice")}
                                        </th>
                                        <th
                                            className={HeaderCssProduct + " w-[160px] text-right"}
                                        >
                                            {t("exportCancel.totalAmount")}
                                        </th>
                                        <th
                                            className={HeaderCssProduct + " w-[30px] text-right"}
                                        ></th>
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
                                                        <tr
                                                            className="even:bg-gray-50 grid-form"
                                                            key={field.key}
                                                        >
                                                            <ExportCancelProductItemForm
                                                                key={field.key}
                                                                {...propsProduct}
                                                            ></ExportCancelProductItemForm>
                                                        </tr>
                                                    );
                                                })
                                            }
                                        </Form.List>
                                    }
                                    </tbody>
                                </table>

                                {!items_w?.length && <ImportExcelExportCancel/>}
                            </div>
                        </Form>
                    </div>
                    <div className="w-full ord-stock-move-md:w-[320px]">
                        <Form form={formMoveTicket}>
                            <ExportCancelRightBox
                                onSave={onSave}
                                formProductItems={formProductItems}
                            />
                        </Form>
                    </div>
                </div>
            </UpsertMoveContext.Provider>
        </>
    );
};
export default observer(UpsertExportCancelStock);
