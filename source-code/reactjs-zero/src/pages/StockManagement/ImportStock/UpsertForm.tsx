import React, {useEffect, useRef} from 'react';
import {UpsertMoveContext} from '../Shared/Upsert/upsertMoveContext';
import {useTranslation} from "react-i18next";
import {Form} from "antd";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {useHotkeys} from "react-hotkeys-hook";
import {HotKeyScope} from "@ord-core/AppConst";
import Utils from "@ord-core/utils/utils";
import {ProductUnitViewDto} from "@api/index.defs";
import HeaderStock from "@pages/StockManagement/Shared/components/HeaderStock";
import ImportRightBox from "@pages/StockManagement/ImportStock/FormUpsert/RightBox";
import {SearchProduct} from "@pages/StockManagement/Shared/Upsert/grid-product/SearchProduct";
import {StockHelperService} from "@api/StockHelperService";
import UpsertFormUtil from "@pages/StockManagement/Shared/utils/UpsertForm.util";
import UiUtils from "@ord-core/utils/ui.utils";
import {useStore} from "@ord-store/index";
import ImportProductItemTable from "@pages/StockManagement/ImportStock/FormUpsert/ProductItemTable";
import {StockUtil} from "@pages/StockManagement/Shared/StockUtil";
import {ImportStockService} from "@api/ImportStockService";
import ServiceProxyUtils from "@ord-core/utils/service-proxy.utils";

const UpsertImportForm = () => {
    const [t] = useTranslation("stock");
    const navigate = useNavigate();
    const {id} = useParams();
    const location = useLocation();
    const pathNameRef = useRef<string>(Utils.getPathUpTo('stock'));
    const {StockSearchProductTableServerSideStore, importStockUpsertStore: mainStore} = useStore();

    const [formMoveTicket] = Form.useForm();
    const [formProductItems] = Form.useForm();
    const inventoryId_w = Form.useWatch("inventoryId", formMoveTicket);

    useHotkeys(
        "F10",
        (event) => {
            navigate(pathNameRef.current + "/import");
            event.preventDefault();
        },
        {
            scopes: [HotKeyScope.moveStockContainer],
            enableOnFormTags: true,
            enabled: !StockSearchProductTableServerSideStore?.isModalOpen,
        }
    );

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
                moveType: MoveType.PhieuNhapNhaCungCap,
            },
        });

        if (!result.isSuccessful) {
            UiUtils.showError(t(result.message!));
            return;
        }

        if (!!result.data) {
            mainStore.productItems = UpsertFormUtil.addProductIntoTable(
                mainStore.productItems,
                result.data[0],
                MoveType.PhieuNhapNhaCungCap
            );

            calculatorForm();
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
                moveType: MoveType.PhieuNhapNhaCungCap,
            },
        });

        if (!result.isSuccessful) {
            UiUtils.showError(t(result.message!));
            return;
        }

        if (!!result.data) {
            mainStore.productItems = UpsertFormUtil.addMultiProductIntoTable(
                mainStore.productItems,
                result.data,
                MoveType.PhieuNhapNhaCungCap
            );

            calculatorForm();
        }
    };
    //#endregion

    //Tính lại toàn bộ giá trị
    const calculatorForm = () => {
        const moveValueForm = formMoveTicket.getFieldsValue();
        const {
            products,
            move
        } = UpsertFormUtil.calculatorAllProduct(mainStore.productItems, moveValueForm);
        mainStore.productItems = [...products];
        formMoveTicket.setFieldsValue({
            ...moveValueForm,
            ...move
        });
    };

    const onSave = async (isDraft: boolean) => {
        let moveValue = {};
        try {
            formProductItems.submit();
            moveValue = await formMoveTicket.validateFields();
        } catch (ex) {
            UiUtils.showCommonValidateForm();
            return;
        }

        try {
            if (!mainStore.productItems?.length) {
                UiUtils.showError('Vui lòng chọn sản phẩm');
                return;
            }

            if (mainStore.productItems.some(x => x.isProductUseLotNumber === true
                && (!x.lotNumber || !x.expiryDate))) {
                UiUtils.showError('Vui lòng chọn lô cho các sản phẩm quản lý lô');
                return;
            }

            if ((moveValue?.totalAmountRound || 0) - (moveValue?.paymentAmount || 0) < 0) {
                UiUtils.showError('Công nợ không được nhỏ hơn 0');
                return;
            }

            UiUtils.setBusy();
            const values = {
                moveDto: moveValue,
                items: mainStore.productItems.map((it: any) => {
                    it.discountValue = isNaN(it.discountValue) ? 0 : +it.discountValue;
                    return StockUtil.omitMoveStockItemUpsert(it, moveValue);
                }),
                isDraft
            };

            const response = await ImportStockService.createOrUpdateMove({
                body: values,
            })

            if (response.isSuccessful) {
                UiUtils.showSuccess(t("saveDone"));
                navigate(pathNameRef.current + "/import");
            } else {
                if (!StockUtil.HandlerError(response)) {
                    ServiceProxyUtils.notifyErrorResultApi(response, "stock", {
                        ...values,
                    });
                }
            }
        } catch (ex) {
            console.error(ex)
        } finally {
            UiUtils.clearBusy();
        }
    }

    useEffect(() => {
        if (!id) {
            return;
        }

        //edit
        if (isEdit) {
            UiUtils.setBusy();
            ImportStockService.getById({idHash: id}).then(res => {
                if (!res.isSuccessful) {
                    UiUtils.showError(res.message);
                    return;
                }

                mainStore.productItems = res.data?.items as any;
                formMoveTicket.setFieldsValue(res.data?.moveDto);
            }).catch(ex => {
                UiUtils.showError(StockUtil.messageErrorNormal);
                console.error(ex);
            }).finally(UiUtils.clearBusy)
            return;
        }

        //clone
        if (isClone) {
            ImportStockService.cloneById({idHash: id}).then(res => {
                if (!res.isSuccessful) {
                    UiUtils.showError(res.message);
                    return;
                }

                mainStore.productItems = res.data?.items as any;
                formMoveTicket.setFieldsValue(res.data?.moveDto);
            }).catch(ex => {
                UiUtils.showError(StockUtil.messageErrorNormal);
                console.error(ex);
            }).finally(UiUtils.clearBusy)
            return;
        }

    }, [location]);

    const isEdit = location.pathname.includes('/stock/import/update');

    const isClone = location.pathname.includes('/stock/import/clone');

    return (
        <UpsertMoveContext.Provider
            value={{
                formMoveTicket: formMoveTicket,
                t: t as any,
            }}
        >
            <HeaderStock
                returnUrl={pathNameRef.current + "/import"}
                title={t("import.pageTitle")}
                subTitle={
                    isEdit ? 'Sửa phiếu' : isClone ? 'Sao chép phiếu' : 'Thêm mới'
                }
            />
            <div className="flex  flex-col ord-stock-move-md:flex-row">
                <div className="w-full ord-stock-move-md:flex-1 me-3 mb-3">
                    <Form form={formProductItems}>
                        <div className="grid-product-item-container">
                            <div className='mb-3'>
                                <SearchProduct
                                    onProductSelected={handlerProductSelect}
                                    onMultiSelected={handlerMultiProductSelect}
                                />
                            </div>

                            <ImportProductItemTable/>
                        </div>
                    </Form>
                </div>
                <div className="w-full ord-stock-move-md:w-[320px]">
                    <Form form={formMoveTicket}>
                        <ImportRightBox
                            onSave={onSave}
                        />
                    </Form>
                </div>
            </div>
        </UpsertMoveContext.Provider>
    );
};

export default UpsertImportForm;