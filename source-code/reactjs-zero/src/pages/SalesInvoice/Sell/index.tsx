import * as React from "react";
import {lazy, Suspense, useEffect, useMemo, useRef, useState} from "react";
import {Button, Dropdown, Form, Input, MenuProps, Space, Spin} from "antd";

import {
    ArrowLeftOutlined,
    DollarOutlined,
    FieldTimeOutlined,
    LogoutOutlined,
    MenuOutlined,
    SettingOutlined,
    StrikethroughOutlined,
} from "@ant-design/icons";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {useStore} from "@ord-store/index";
import {SellForm} from "@pages/SalesInvoice/Sell/sellForm";
import {InvoiceReturnDto, ProductDto, SaleInvoiceDetailDto, SaleInvoiceDto,} from "@api/index.defs";
import _, {isNumber} from "lodash";
import UiUtils from "@ord-core/utils/ui.utils";
import {SaleInvoiceService} from "@api/SaleInvoiceService";
import {InvoiceReturnForm} from "@pages/SalesInvoice/Sell/invoiceReturnForm";
import {InvoiceReturnService} from "@api/InvoiceReturnService";
import {useTranslation} from "react-i18next";
import {AuthService} from "@api/AuthService";
import jwtUtils from "@ord-core/utils/jwt.utils";
import {SellTab} from "@pages/SalesInvoice/Sell/Tabs/sellTab";
import {ModalProvider} from "@pages/SalesInvoice/Utils/modalContext";
import {StockUtil} from "@pages/StockManagement/Shared/StockUtil";
import {WorkShiftModal} from "@pages/WorkShift/ShopWorkShift/workShiftModal";
import {InvoiceModal} from "../Invoice/invoiceModal";
import {InvoiceHelperService} from "@api/InvoiceHelperService";
import {PrintInvoice} from "@pages/SalesInvoice/Utils/printInvoice";
import {PaymentMethodEnum} from "@pages/SalesInvoice/Form/paymentMethodForm";
import {SaleInvoiceStatusEnum, SaleUrlParamMode, TabItemType,} from "@pages/SalesInvoice/Utils/saleCommon";
import {ListInvoiceReturn} from "@pages/SalesInvoice/InvoiceReturn/listInvoiceReturn";
import {LeftBar} from "@pages/SalesInvoice/Sell/leftBar";
import {SellSearchProduct} from "@pages/SalesInvoice/Sell/components/search-product";
import OrdCreateOrUpdateModal from "@ord-components/crud/OrdCreateOrUpdateModal";
import ProductCreateForm from "@pages/ProductManagement/Product/forms/ProductCreateForm";
import {useSelectShopBankAccount} from "@ord-components/forms/select/selectDataSource/useSelectShopBankAccount";
import {SalesPrescriptionModal} from "@pages/SalesInvoice/Sell/SalesPrescriptionModal";
import SalesPrescriptionNationalModal from "./SalesPrescriptionNationalModal";
import {observer} from "mobx-react-lite";
import Notifications from "@ord-core/layout/Header/Notifications";
import {OpenOrCloseSaleWorkShiftForm} from "@pages/WorkShift/ShopWorkShift/Form/openOrCloseSaleWorkShiftForm";
import SaleInvoiceSetting from "@pages/SalesInvoice/Sell/components/settings/saleInvoiceSetting";
// @ts-ignore
import {DiscountTypeEnum} from "@ord-core/enum/discountTypeEnum.enum";
import {CalculatorCurrencyUtil} from "@ord-core/utils/calculatorCurrency.util";

export interface IProductSaleDto extends SaleInvoiceDetailDto, ProductDto {
}

// @ts-ignore
export const SellContext = React.createContext();

const Sell: React.FC = () => {
    const {t} = useTranslation("sale-invoice");
    const [form] = Form.useForm();
    const [formSearch] = Form.useForm();
    const navigate = useNavigate();
    const {saleInvoiceStore: mainStore} = useStore();
    const {productStore: productStore, shopWorkShiftStore: shopWorkShiftStore} = useStore();
    const [isInvoiceReturn, setIsInvoiceReturn] = useState(false);
    const [saleInvoiceReturn, setSaleInvoiceReturn] = useState<SaleInvoiceDto>({});
    const [products, setProducts] = useState<IProductSaleDto[]>([]);
    const [refreshDate, setRefreshDate] = useState(new Date());
    const [searchParams, setSearchParams] = useSearchParams();
    const {sessionStore: sessionStore, invoiceSettingStore} = useStore();
    const [resetTab, setResetTab] = useState<any>();
    const location = useLocation();
    const [pdfUrl, setPdfUrl] = React.useState("");
    const tabItemType_w = Form.useWatch("tabItemType", form);
    const select_Ds = useSelectShopBankAccount();
    const settings = invoiceSettingStore.settings;

    //#region Xử lý sản phẩm
    const calculatorProductTotalPrice = (product: IProductSaleDto) => {
        const totalAmountBeforeDiscount = CalculatorCurrencyUtil.calculateTotalAmountBeforeDiscount(product.price, product.qty);
        const calculateDiscount =
            CalculatorCurrencyUtil.calculateDiscount(product.discountType, product.discountPercent,
                product.discountAmount, totalAmountBeforeDiscount);

        product.totalAmountAfterDiscount = CalculatorCurrencyUtil
            .calculateTotalAmountAfterDiscount(product.price, product.qty, calculateDiscount.discountAmount);

        product.subTaxAmount = CalculatorCurrencyUtil
            .calculateSubTaxAmount(product.price, product.qty, calculateDiscount.discountAmount, product.taxPercent)

        product.subTotalAmount = CalculatorCurrencyUtil
            .calculateSubTotalAmount(product.price, product.qty, calculateDiscount.discountAmount, product.taxPercent);
    };

    const selectProduct = (product: ProductDto) => {
        const productNew = _.cloneDeep(product) as IProductSaleDto;
        const index = products.findIndex((x) => x.productId === product.id);
        if (index < 0) {
            assDataProductSelected(productNew, product);
            setProducts([...products, productNew]);
        } else {
            updateProducts(productNew);
        }
    };

    const assDataProductSelected = (productNew: IProductSaleDto, product: ProductDto) => {
        if (tabItemType_w == TabItemType.INVOICE_RETURN && saleInvoiceReturn) {
            if (saleInvoiceReturn.id) {
                const item = saleInvoiceReturn.saleInvoiceDetails?.find(
                    (x: SaleInvoiceDetailDto) => x.productId === product.id
                );
                if (item) {
                    setProducts([...products, item]);
                } else {
                    UiUtils.showError(product.productName + ": không có trong hóa đơn");
                }
                return;
            }
        }
        productNew.qty = productNew.qty ?? 1;
        productNew.price = productNew.productPriceByPriceList ?? productNew.productPrice;

        productNew.isPriceIncludeTax = productNew.isProductPriceIncludeTax;
        productNew.priceWithTax = CalculatorCurrencyUtil.calculatePriceWithTax(productNew.price, productNew.taxPercent, productNew.isPriceIncludeTax);

        const totalAmountBeforeDiscount = CalculatorCurrencyUtil.calculateTotalAmountBeforeDiscount(productNew.price, productNew.qty);
        const calculateDiscount =
            CalculatorCurrencyUtil.calculateDiscount(DiscountTypeEnum.Percent, productNew.discountPercent,
                productNew.discountAmount, totalAmountBeforeDiscount);

        productNew.totalAmountAfterDiscount = CalculatorCurrencyUtil
            .calculateTotalAmountAfterDiscount(productNew.price, productNew.qty, calculateDiscount.discountAmount);

        productNew.subTaxAmount = CalculatorCurrencyUtil.calculateSubTaxAmount(
            productNew.price, productNew.qty, calculateDiscount.discountAmount, productNew.taxPercent);

        productNew.subTotalAmount = CalculatorCurrencyUtil.calculateSubTotalAmount(
            productNew.price, productNew.qty, calculateDiscount.discountAmount, productNew.taxPercent);
        productNew.productId = productNew.id;
    }

    const changeNotesProduct = (data: any) => {
        if (data) {
            products.forEach((el) => {
                if (el.productId === data.item.productId) {
                    el.notes = data.notes;
                }
            });
            setProducts(products);
            setRefreshDate(new Date());
        }
    };

    const upOrDownProduct = (data: any) => {
        if (data) {
            // @ts-ignore
            products.forEach((el) => {
                if (el.productId === data.item.productId) {
                    if (data.num > 0 || (data.num <= 0 && (el.qty ?? 0) > 1)) {
                        el.qty = el.qty + data.num;
                        calculatorProductTotalPrice(el);
                    }
                }
            });
            setProducts(products);
            setRefreshDate(new Date());
        }
    };
    // code cũ => const updateProducts = (product: ProductDto)
    // chỉnh sửa => product: IProductSaleDto
    const updateProducts = (product: IProductSaleDto) => {
        let maxQty: number = 0;
        if (tabItemType_w == TabItemType.INVOICE_RETURN && saleInvoiceReturn) {
            const item = saleInvoiceReturn.saleInvoiceDetails?.find(
                (x: SaleInvoiceDetailDto) => x.productId === product.id
            );
            maxQty = item?.purchasedQty || 0;
        }

        // @ts-ignore
        products.forEach((el) => {
            if (el.productId === product.id) {
                if (maxQty && (el.qty ?? 0) >= maxQty) return;
                el.qty = (el.qty ?? 0) + (product.qty ?? 1);
                calculatorProductTotalPrice(el);
            }
        });
        setProducts(products);
        setRefreshDate(new Date());
    };

    const removeProduct = (product: any) => {
        // @ts-ignore
        const index = products.findIndex((x) => x.productId === product.productId);
        if (index >= 0) {
            products.splice(index, 1);
            setProducts(products);
            setRefreshDate(new Date());
        }
    };

    const refreshProduct = () => {
        setRefreshDate(new Date());
    };

    //#endregion

    //#region Init hóa đơn mới, sửa hóa đơn
    const initInvoice = () => {
        const user = sessionStore.user;
        form.setFieldValue("creatorEmployeeName", user?.name);
        form.setFieldValue("creatorEmployeeId", user?.name);
        form.setFieldValue("tabItemType", 1);

        const mode = searchParams.get("return");
        if (mode) {
            setSearchParams();
            setIsInvoiceReturn(true);
        }
    };

    const initInvoiceEditForm = () => {
        const id = searchParams.get("return");

        const mode = searchParams.get("mode");
        if (!id) return;

        if (searchParams.has("return")) {
            searchParams.delete("return");
            searchParams.delete("mode");
            setSearchParams(searchParams);
        }
        UiUtils.setBusy();

        SaleInvoiceService.getSaleInvoiceForReturn({findId: +id}).then((res) => {
            if (!res.isSuccessful) {
                UiUtils.showError(res.message);

                if (res.errorDetail?.code === '999') {
                    newInvoice();
                    form.setFieldValue("tabItemType", TabItemType.INVOICE_RETURN);
                }
                return;
            }

            const dto = res.data!;
            const returnItem = {
                ...dto,
                id: 0,
                invoiceCode: "",
                relatedInvoiceId: dto.id + "",
                relatedInvoiceCode: dto.invoiceCode,
            } as any;

            setSaleInvoiceReturn(dto);

            setInvoiceReturnIntoForm(returnItem);

        }).catch(ex => {
            UiUtils.showError('Có lỗi xảy ra, vui lòng thử lại sau');
        }).finally(() => {
            UiUtils.clearBusy();
        });
    };

    const newInvoice = () => {
        form.resetFields();
        setSaleInvoiceReturn({});
        setIsInvoiceReturn(false);
        setProducts([]);
        // setCustomer(undefined);
        setRefreshDate(new Date());
        initInvoice();
    };

    const cloneInvoice = () => {
        try {
            const id = searchParams.get("id");
            if (!id) return;

            UiUtils.setBusy();
            SaleInvoiceService.cloneById({findId: id}).then(res => {
                if (res.isSuccessful) {
                    // @ts-ignore
                    setProducts(res.data?.saleInvoiceDetails);
                } else {
                    UiUtils.showError('Có lỗi xảy ra, vui lòng thử lại sau');
                    console.error(res.message);
                }
            }).catch(ex => {
                UiUtils.showError('Có lỗi xảy ra, vui lòng thử lại sau');
            }).finally(() => {
                UiUtils.clearBusy();
            })
        } catch (ex: any) {
            UiUtils.showError('Có lỗi xảy ra, vui lòng thử lại sau');
        }
    }
    //#endregion

    //#region Hóa đơn trả lại
    const addNewTabInvoiceReturn = () => {
        setIsInvoiceReturn(true);
        initInvoiceEditForm();
    };

    const invoiceSelectedFromList = (saleInvoiceDto: SaleInvoiceDto) => {
        initInvoiceReturnForm(saleInvoiceDto);
    };

    const initInvoiceReturnForm = (
        saleInvoiceDto?: SaleInvoiceDto,
        editItem?: SaleInvoiceDto
    ) => {
        if (!saleInvoiceDto) {
            if (editItem) {
                // @ts-ignore
                editItem.saleInvoiceDetails = editItem.saleInvoiceDetails?.map((it) => {
                    return {
                        ...it,
                        purchasedQty: null,
                    };
                });
                setInvoiceReturnIntoForm(editItem);
            } else {
                newInvoice();
                form.setFieldValue("tabItemType", TabItemType.INVOICE_RETURN);
            }
            return;
        }

        // @ts-ignore
        SaleInvoiceService.getSaleInvoiceForReturn({
            findId: +saleInvoiceDto.id!,
        }).then((res) => {
            if (!res.isSuccessful) {
                UiUtils.showError(res.message);

                if (res.errorDetail?.code === '999') {
                    newInvoice();
                    form.setFieldValue("tabItemType", TabItemType.INVOICE_RETURN);
                }
                return;
            }

            const dto = res.data!;
            setSaleInvoiceReturn(dto);

            const returnItem = {
                ...dto,
                id: "0",
                invoiceCode: "",
                relatedInvoiceId: dto.id + "",
                relatedInvoiceCode: dto.invoiceCode,
            };

            setInvoiceReturnIntoForm(returnItem);
        });
    };

    const setInvoiceReturnIntoForm = (returnItem: SaleInvoiceDto) => {
        setProducts(
            returnItem.saleInvoiceDetails
                ? _.cloneDeep(returnItem.saleInvoiceDetails)
                : []
        );
        // setCustomer({id: returnItem.partnerId, name: returnItem.partnerName || 'Khách lẻ'})
        if (returnItem.discountPercent) {
            // @ts-ignore
            returnItem["discountInput"] = returnItem.discountPercent;
        } else {
            // @ts-ignore
            returnItem["discountInput"] = returnItem.discountAmount;
        }
        // form.setFieldsValue(returnItem); code cũ
        form.setFieldsValue({
            ...returnItem,
            invoiceDate: undefined,
            invoiceDateHidden: returnItem.invoiceDate,
        }); // luồng mới thay đổi ngày hóa đơn => ngày trả => bản chất vẫn sử dụng invoiceDate
        // @ts-ignore
        returnItem.saleInvoiceDetails.forEach((it: SaleInvoiceDetailDto) => {
            if (it.discountAmount) {
                calculatorProductTotalPrice(it);
            }
        });
    };

    const saveInvoiceReturn = (values: any) => {
        const _body = {...values} as InvoiceReturnDto;
        _body.creatorEmployeeId = isNumber(values.creatorEmployeeId)
            ? values.creatorEmployeeId
            : "0";
        _body.saleInvoiceDetails = products.map((p: any) => {
            return {
                ...p,
                id: 0,
            };
        });

        InvoiceReturnService.create({body: _body}).then(
            (rsp) => {
                UiUtils.clearBusy();
                if (rsp.isSuccessful) {
                    UiUtils.showSuccess("Lưu phiếu thành công.");

                    newInvoice();
                    clearTab();
                    // fetchSyncDataInventoryLine().then();
                    // tương tự => đoạn này nhằm mục đích lấy ra id sản phẩm đã vừa thực hiện bán hàng để cập nhật lại
                    // do fetchSyncDataInventoryLine đã ko còn sử dụng nữa => check code fetchSyncDataInventoryLine
                    if (rsp.data) {
                        setIdsProductAfterActionInvoice(rsp.data);
                    }
                } else {
                    StockUtil.HandlerError(rsp);
                }
            },
            (error) => {
                UiUtils.showError(error.response?.data?.error?.message);
                UiUtils.clearBusy();
            }
        );
    };
    //#endregion

    //#region Tabs
    const changeTab = (input: any) => {
        if (input) {
            var invoice = {
                ...input,
                tabItemType: input.tabItemType || TabItemType.SALE_INVOICE,
            };
            delete invoice.form.invoiceTime;
            setProducts(invoice.products);
            form.setFieldsValue(invoice.form);
            if (invoice.customer?.id) {
                // setCustomer({id: invoice.customer?.id, name: invoice.customer?.name});
            } else {
                // setCustomer(undefined);
                form.setFieldsValue({partnerId: null});
            }
            setSaleInvoiceReturn(input.invoiceReturn);
        } else {
            newInvoice();
        }
    };

    const clearTab = () => {
        setResetTab(new Date());
    };

    //#endregion

    const formSubmit = async (values: any) => {
        try {
            if (!products || products.length <= 0) {
                UiUtils.showError("Hóa đơn chưa có sản phẩm!");
                return;
            }
            if (values.paymentMethod == PaymentMethodEnum.KET_HOP) {
                const paymentObj = values.paymentMethodObjDto;
                const jsonParse = JSON.parse(paymentObj);
                const totalOfMethod = jsonParse.reduce(
                    (total: number, participant: any) => total + participant.paymentAmount,
                    0
                );
                if (totalOfMethod != values.paymentAmount) {
                    UiUtils.showError(
                        "Tổng tiền của các phương thức kết hợp không bằng số tiền khách trả."
                    );
                    return;
                }
                values.paymentMethodObjDto = jsonParse;
            }

            const details = products.map((p: any) => {
                return {
                    ...p,
                    id: 0,
                };
            });
            const converseDataErrorObject = (list: SaleInvoiceDetailDto[]) => {
                return {
                    productName: list.map((x) => x.productName).join(", "),
                };
            };

            UiUtils.setBusy();
            delete values["partnerObj"];
            if (values.tabItemType == TabItemType.INVOICE_RETURN) {
                saveInvoiceReturn(values);
            } else {
                const _body = {...values} as SaleInvoiceDto;
                _body.saleInvoiceDetails = details;
                _body.creatorEmployeeId = isNumber(values.creatorEmployeeId)
                    ? values.creatorEmployeeId
                    : "0";

                if (values.status == SaleInvoiceStatusEnum.DANG_SOAN) {
                    // Nếu thanh toán bằng QRCode
                    if (settings.useQrCodeTingeeBox) {
                        const available = await checkQrBoxAvailable();
                        if (!available) {
                            return;
                        }
                    }

                    const dataUd = {
                        paymentMethod: PaymentMethodEnum.CHUYEN_KHOAN,
                        shopBankAccountId:
                            settings.shopBankAccountId ?? select_Ds.data[0]?.value,
                    };
                    _body.paymentMethod = dataUd.paymentMethod;
                    _body.shopBankAccountId = dataUd.shopBankAccountId as string;
                    form.setFieldsValue(dataUd);
                }

                if (values.paymentMethod == PaymentMethodEnum.CHUYEN_KHOAN && !_body.shopBankAccountId) {
                    UiUtils.showError("Vui lòng chọn tài khoản thanh toán.");
                    return;
                }

                //gán lại để tránh lỗi khi lấy data từ PartnerInput
                _body.partnerId = _body.partnerId || undefined;

                const result = await mainStore.create(_body);
                if (result.isSuccessful) {
                    if (values.status == SaleInvoiceStatusEnum.DANG_SOAN) {
                        // Tạm stop code naay
                        if (result.data) {
                            if (settings.useQrCodeTingeeBox && result.data.paymentMethod == PaymentMethodEnum.CHUYEN_KHOAN && result.data.shopBankAccountId) {
                                await getQrCode(result.data);
                                UiUtils.clearBusy();
                            } else {

                                if (settings.isOpenPopupDetail)
                                    openDetailForm(result.data as SaleInvoiceDto);
                                if (settings.isPrintInvoice)
                                    await printInvoice(
                                        settings?.isPrintInvoice as boolean,
                                        result.data
                                    );
                            }
                            form.setFieldsValue(result.data);
                        }
                    } else {
                        UiUtils.clearBusy();
                        UiUtils.showSuccess(t("saveInvoiceSuccess"));

                        if (result.notification?.message) {
                            const mes = result.notification?.message;
                            setTimeout(() => {
                                UiUtils.showError(t(mes));
                            }, 1000);
                        }
                        if (result.data) {
                            await onPaymentSuccess(result.data);
                            if (settings.useQrCodeTingeeBox && result.data.paymentMethod == PaymentMethodEnum.CHUYEN_KHOAN && result.data.shopBankAccountId) {
                                await getQrCode(result.data);
                                UiUtils.clearBusy();
                            }
                        }

                    }

                } else {
                    if (result.errorDetail?.code == "ProductIsLotExpiryDate") {
                        UiUtils.showError(
                            t(result.notification?.message ?? "Error", {
                                ...converseDataErrorObject(result.notification?.data),
                            }) as any
                        );
                        return;
                    }
                    if (!StockUtil.HandlerError(result)) {
                        UiUtils.showError(t(result.notification?.message ?? "Error"));
                    }
                }

            }
        } catch (ex) {
            console.error(ex);
        } finally {
            UiUtils.clearBusy();
        }
    };

    async function onPaymentSuccess(dataInvoice: SaleInvoiceDto) {
        newInvoice();
        clearTab();

        if (settings) {
            if (settings.isOpenPopupDetail) {
                openDetailForm(dataInvoice);
            }
            await printInvoice(settings?.isPrintInvoice as boolean, dataInvoice);
        }
        // fetchSyncDataInventoryLine().then();
        // đoạn này nhằm mục đích lấy ra id sản phẩm đã vừa thực hiện bán hàng để cập nhật lại
        // do fetchSyncDataInventoryLine đã ko còn sử dụng nữa => check code fetchSyncDataInventoryLine
        setIdsProductAfterActionInvoice(dataInvoice);
    }

    const setIdsProductAfterActionInvoice = (dataInvoice: SaleInvoiceDto) => {
        const ids = dataInvoice?.saleInvoiceDetails
            ?.map(p => p.productId)
            .filter(Boolean) as string[];
        if (ids) {
            productStore.setIdsProductAfterPaymentSuccess(ids)
            // sau khi set xong thì vào SellProductSearchApiDataTable (hay GridApi) fetching cập nhật lại sản phẩm
        }
    }


    const closeQrCode = async () => {
        // @ts-ignore
        let ports = await navigator.serial.getPorts();
        for (let port of ports) {
            await port.open({baudRate: 9600});
            const textEncoder = new TextEncoderStream();
            const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
            const writer = textEncoder.writable.getWriter();
            let data = "AT+QR_DISPLAY=0, \r\n";
            await writer.write(data);
            writer.close();
            await writableStreamClosed;
            await port.close();
        }
    };
    const checkQrBoxAvailable = async () => {
        try {
            // @ts-ignore
            let ports = await navigator.serial.getPorts();

            if (ports.length === 0) {
                try {
                    // @ts-ignore
                    const p = await navigator.serial.requestPort();
                    ports.push(p);
                    if (p) {
                        ports.push(p);
                    }
                    return true;
                } catch (error) {
                    UiUtils.showError("Vui lòng chọn máy hiển thị QR");
                }
            } else if (ports.length > 0) {
                return true;
            }
        } catch (error) {
            UiUtils.showError("Vui lòng chọn máy hiển thị QR");
        }
        return false;
    };
    const getQrCode = async (input: SaleInvoiceDto) => {
        const resQr = await SaleInvoiceService.getQrSaleOrder({
            body: {
                deviceTokenId: sessionStore.firebaseToken,
                invoiceCode: input.invoiceCode,
                invoiceId: input.id,
                shopBankAccountId: input.shopBankAccountId,
                totalAmount: input.paymentAmount,
            },
        });
        if (resQr.isSuccessful && resQr.data?.qrCode) {
            await showQrCodeToBox(resQr.data.qrCode);
            // UiUtils.showSuccess(t("pleaseCheckQr"));
        } else UiUtils.showError("ErrorGetQRTingee");
    };
    const showQrCodeToBox = async (qrCode: string) => {
        // @ts-ignore
        if (!navigator.serial) {
            UiUtils.showError(
                "Trình duyệt không hỗ trợ kết nối với thiết bị này. Vui lòng nâng cấp phiên bản trình duyệt mới nhất."
            );
            return false;
        }

        // @ts-ignore
        let ports = await navigator.serial.getPorts();
        if (ports.length == 0) {
            // @ts-ignore
            const p = await navigator.serial.requestPort();
            ports.push(p);
        }
        for (let port of ports) {
            await port.open({baudRate: 9600});
            const textEncoder = new TextEncoderStream();
            const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
            const writer = textEncoder.writable.getWriter();
            let data = "AT+QR_DISPLAY=100," + qrCode + "\r\n";
            await writer.write(data);
            writer.close();
            await writableStreamClosed;

            await port.close();
        }
    };

    const printInvoice = async (isPrint: boolean, invoice?: SaleInvoiceDto) => {
        if (isPrint && invoice?.id) {
            try {
                UiUtils.setBusy();
                const pr = await InvoiceHelperService.printInvoiceV2(
                    {
                        body: {
                            id: invoice?.id,
                            deviceTokenId: sessionStore.firebaseToken
                        },
                    },
                    {responseType: "blob"}
                );
                setPdfUrl(URL.createObjectURL(pr));
            } catch (e) {
                console.warn(e);
            }
        }
    };

    const relatedInvoiceChange = (item: SaleInvoiceDto) => {
        if (item) {
            initInvoiceReturnForm(item);
        } else if (saleInvoiceReturn.id) {
            newInvoice();
            form.setFieldValue("tabItemType", TabItemType.INVOICE_RETURN);
        }
    };

    //#region useEffect, Modal
    useEffect(() => {
        invoiceSettingStore.getSettingInfo();
        initInvoice();
        initInvoiceEditForm();
    }, []);
    useEffect(() => {
        return () => {
            mainStore.currentPriceListId = null;
            mainStore.invoiceTabContentData = [];
        };
    }, []);

    useEffect(() => {
        const isReturn = searchParams.get("return");
        if (!!isReturn) {
            setIsInvoiceReturn(true);
            initInvoiceEditForm();
            return;
        }

        const mode = searchParams.get("mode");
        if (mode === SaleUrlParamMode.COPY) {
            cloneInvoice();
        }
    }, [location.pathname]);


    const closeSell = () => {
        return navigate("/");
    };

    const invoiceListRef = useRef();
    const openInvoiceList = () => {
        // @ts-ignore
        invoiceListRef.current.showModal();
    };

    const invoiceRef = useRef();
    const openInvoice = () => {
        // @ts-ignore
        invoiceRef.current.showModal();
    };

    const workShiftRef = useRef();
    const openWorkShift = () => {
        // @ts-ignore
        workShiftRef.current.showModal();
    };

    const closingFormRef = useRef();
    const openSaleWorkShiftForm = () => {
        // @ts-ignore
        closingFormRef.current.showModal()
    }

    const openAddProduct = () => {
        productStore.openCreateModal();
    };

    const openDetailForm = (d: SaleInvoiceDto) => {
        // console.log("callPopenDetail ", d);
        mainStore.openViewInvoiceModal(d)
        // invoiceDetailRef.current.showModal(d);
    };
    const salesPrescriptionRef = useRef<any>();
    const salesPrescriptionNationalRef = useRef<any>();
    const openSalesPrescription = () => {
        salesPrescriptionRef.current.showModal(
            form.getFieldValue("prescriptionInfo")
        );
    };
    const openSalesPrescriptionNational = () => {
        salesPrescriptionNationalRef.current.showModal(form.getFieldValue("prescriptionInfo"));
    };
    //#endregion

    const menuClose: MenuProps["items"] = [
        {
            label: (
                <a onClick={closeSell} type={"text"}>
                    <Space>
                        <ArrowLeftOutlined/> {t("backToList")}
                    </Space>
                </a>
            ),
            key: "0",
        },
        {
            label: (
                <a onClick={addNewTabInvoiceReturn} type={"text"}>
                    <Space>
                        <StrikethroughOutlined/> {t("invoiceReturn")}
                    </Space>
                </a>
            ),
            key: "1",
        },
        {
            label: <a onClick={openSaleWorkShiftForm} type={'text'}>
                <Space>
                    <FieldTimeOutlined/> {t('salesShift')}
                </Space>
            </a>,
            key: '2',
        },
        {
            label: (
                <a onClick={openInvoice} type={"text"}>
                    <Space>
                        <DollarOutlined/> {t("invoiceList")}
                    </Space>
                </a>
            ),
            key: "3",
        },
        // {
        //     label: <EmployeeTimekeeping buttonType={"label"}/>,
        //     key: '4',
        // },
        {
            label: (
                <a onClick={() => {
                    invoiceSettingStore.setVisibleSetting(true)
                }} type={"text"}>
                    <Space>
                        <SettingOutlined/> {t("settings")}
                    </Space>
                </a>
            ),
            key: "5",
        },
        {
            label: (
                <a type={"text"}>
                    <Space>
                        <LogoutOutlined/> {t("logout")}
                    </Space>
                </a>
            ),
            key: "99",
            onClick: async () => {
                try {
                    await AuthService.logout();
                } catch {
                }
                jwtUtils.signOut();
            },
        },
    ];

    const contextValue = useMemo(
        () => ({formSearch}),
        [formSearch]
    );
    const ObsAreal = observer(() => {
        const LazyInvoiceDetailForm = lazy(() => import('@pages/SalesInvoice/Form/invoiceDetailForm'));
        return <>
            <Suspense fallback={<Spin/>}>
                {mainStore.viewInvoiceModal.visible && <LazyInvoiceDetailForm/>}
            </Suspense>
            {/*<InvoiceDetailForm></InvoiceDetailForm>*/}
            <SaleInvoiceSetting></SaleInvoiceSetting>
        </>
    });
    return (
        <SellContext.Provider value={contextValue}>
            <ModalProvider>
                <InvoiceModal ref={invoiceRef}></InvoiceModal>
                <WorkShiftModal ref={workShiftRef}></WorkShiftModal>
                <OpenOrCloseSaleWorkShiftForm ref={closingFormRef}/>


                <ObsAreal></ObsAreal>
                {/*<InvoiceDetailForm*/}
                {/*    ref={invoiceDetailRef}*/}
                {/*    isInvoiceReturn={isInvoiceReturn}*/}
                {/*    modalKey={"modalDetailSell"}*/}
                {/*/>*/}
                <SalesPrescriptionModal
                    ref={salesPrescriptionRef}
                    form={form}
                    modalKey={"SalesPrescription"}
                />
                <SalesPrescriptionNationalModal
                    ref={salesPrescriptionNationalRef}
                    priceListId={mainStore.currentPriceListId as number}
                    form={form}
                    onSetProduct={(data: any) => {
                        const assDateProducts = data.map((product: any) => {
                            const productNew = _.cloneDeep(product) as IProductSaleDto;
                            assDataProductSelected(productNew, product);
                            return productNew
                        })
                        setProducts(assDateProducts)
                    }}
                    modalKey={"SalesPrescriptionNational"}
                />
            </ModalProvider>
            <ListInvoiceReturn
                invoiceSelectHandler={invoiceSelectedFromList}
                ref={invoiceListRef}
            />
            <div className="bg-gray-100 fixed top-0 left-0 right-0 bottom-0 z-99">
                <div className="flex max-md:flex-wrap gap-3 py-3">
                    <LeftBar
                        removeAllProductHandler={() => {
                            setProducts([]);
                        }}
                        getListHandler={(v) => {
                            // ListProductGroup
                            formSearch.setFieldValue("productGroups", v);
                        }}
                    ></LeftBar>
                    <Form
                        className="flex-1 h-[calc(100vh-1.5rem)] bg-white py-2"
                        form={formSearch}
                    >
                        <SellSearchProduct
                            onShowSalePrescription={() => {
                                openSalesPrescription();
                            }}
                            onShowSalePrescriptionNational={() => {
                                openSalesPrescriptionNational();
                            }}
                            onProductSelected={selectProduct}
                        ></SellSearchProduct>
                        <div hidden>
                            <Form.Item name={"productGroups"} initialValue={[]}/>
                            <Form.Item name="priceListId"/>
                        </div>
                    </Form>
                    <div className="w-4/12 h-[calc(100vh-1.5rem)] bg-white py-2">
                        <div className={"h-[55px] flex items-center px-4 relative"}>
                            <div className={`text-xl font-semibold text-white w-full`}>
                                <SellTab
                                    products={products}
                                    form={form}
                                    changeTabHandler={changeTab}
                                    resetTab={resetTab}
                                    isInvoiceReturn={isInvoiceReturn}
                                    invoiceReturn={saleInvoiceReturn}
                                ></SellTab>
                            </div>
                            {/*<div className={"me-[50px]"}><ChannelForm form={form}/>*/}
                            {/*</div>*/}
                            <Notifications className="mr-4 notification"/>
                            <Dropdown menu={{items: menuClose}} trigger={["hover"]}>
                                <Button className="mb-[2px] border-[#45494E]">
                                    <MenuOutlined/>
                                </Button>
                            </Dropdown>
                        </div>
                        <Form
                            className="px-4 py-2 h-[calc(100%-60px)]"
                            autoComplete="off"
                            form={form}
                            onFinish={formSubmit}
                            layout="horizontal"
                            clearOnDestroy
                        >
                            <Form.Item hidden name="tabItemType">
                                <Input></Input>
                            </Form.Item>
                            {tabItemType_w == TabItemType.INVOICE_RETURN ? (
                                <InvoiceReturnForm
                                    form={form}
                                    products={products}
                                    removeProductHandler={removeProduct}
                                    upOrDownProductHandler={upOrDownProduct}
                                    refreshProductHandler={refreshProduct}
                                    openListInvoiceHandler={openInvoiceList}
                                    selectInvoiceHandler={relatedInvoiceChange}
                                    refreshDate={refreshDate}
                                ></InvoiceReturnForm>
                            ) : (
                                <>
                                    <SellForm
                                        form={form}
                                        products={products}
                                        changeNotesProduct={changeNotesProduct}
                                        removeProductHandler={removeProduct}
                                        upOrDownProductHandler={upOrDownProduct}
                                        refreshProductHandler={refreshProduct}
                                        refreshDate={refreshDate}
                                        onShowSalePrescription={openSalesPrescription}
                                        onShowSalePrescriptionNation={openSalesPrescriptionNational}
                                    ></SellForm>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>

            <PrintInvoice pdfUrl={pdfUrl}/>
            <OrdCreateOrUpdateModal
                stored={productStore}
                entityForm={() => <ProductCreateForm/>}
            />
        </SellContext.Provider>
    );
};

export default observer(Sell);
