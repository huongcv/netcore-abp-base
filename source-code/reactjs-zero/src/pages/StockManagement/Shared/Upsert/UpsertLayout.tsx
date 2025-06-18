import {observer} from "mobx-react-lite";
import {Link, useNavigate} from "react-router-dom";
import {Button, Form, Space} from "antd";
import React, {useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import "./index.scss";
import GridProductItems from "@pages/StockManagement/Shared/Upsert/grid-product/GridProductItems";
import ImportRightBox from "@pages/StockManagement/ImportStock/FormUpsert/RightBox";
import ExportRightBox from "@pages/StockManagement/ExportStock/FormUpsert/RightBox";
import _ from "lodash";
import {useUpsertStockMove} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import TransferRightBox from "@pages/StockManagement/TransferStock/FormUpsert/RightBox";
import CheckStockRightBox from "@pages/StockManagement/CheckStock/FormUpsert/RightBox";
import {GdpOrderStockTicketDto, ImportStockTicketDto,} from "@api/index.defs";
import {useHotkeys} from "react-hotkeys-hook";
import {HotKeyScope} from "@ord-core/AppConst";
import {ArrowLeftOutlined} from "@ant-design/icons";
import uiUtils from "@ord-core/utils/ui.utils";
import UiUtils from "@ord-core/utils/ui.utils";
import GdpOrderRightBox from "@pages/StockManagement/GdpOrderStock/FormUpsert/GdpRightBox";
import GdpGridOrderProductItems from "@pages/StockManagement/GdpOrderStock/GridGdpOrderProductItems";
import {HomeIcon} from "@ord-components/icon/HomeIcon";
import {IconlyLight} from "@ord-components/icon/IconlyLight";
import {StockUtil} from "@pages/StockManagement/Shared/StockUtil";
import {MoveType} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import Utils from "@ord-core/utils/utils";

declare var ord: any;

const UpsertMoveStockLayout = (props: {
    onSave: (formData: any) => void;
    cloneTicketDto?: any;
    ns?: string;
}) => {
    const {cloneTicketDto, ns} = props;
    const [t] = useTranslation(ns ?? "stock");
    const {stockMoveStore, StockSearchProductTableServerSideStore} = useStore();
    const navigate = useNavigate();
    const pathNameRef = useRef<string>(Utils.getPathUpTo('stock'));
    const {
        formMoveTicket,
        formProductItems,
        editData: stockData
    } = useUpsertStockMove();
    const editData = stockData as ImportStockTicketDto;

    useEffect(() => {
        if (stockMoveStore.moveDto) {
            formMoveTicket.setFieldsValue({
                ...stockMoveStore.moveDto,
            });
        }
    }, [stockMoveStore.moveDto]);

    const patchValueIntoForm = (ticket: ImportStockTicketDto) => {
        const items = ticket.items || [];

        const productItems = items.map((it) => {
            const productDetail = _.pickBy({...it?.productDetail}, _.identity);
            return {
                ...productDetail,
                ...it,
            };
        });

        if (ticket.moveDto?.moveType === MoveType.PhieuNhapNhaCungCap ||
            ticket.moveDto?.moveType === MoveType.PhieuNhapTon) {
            formMoveTicket.setFieldValue('isImportFromExcel', true);
            formMoveTicket.setFieldValue('isEditImport', true);
            stockMoveStore.productItemsFromExcel = productItems;
        } else {
            formMoveTicket.setFieldValue('isImportFromExcel', false);
            formMoveTicket.setFieldValue('isEditImport', false);
            stockMoveStore.productItemsFromExcel = [];
            formProductItems.setFieldsValue({
                productItems: productItems,
            });
        }

        formMoveTicket.setFieldsValue({
            ...ticket.moveDto,
        });


    };

    useEffect(() => {
        if (editData) {
            patchValueIntoForm(editData);
            stockMoveStore.setMoveUpdate({
                ...editData.moveDto,
            });
        }
    }, [editData]);
    useEffect(() => {
        if (cloneTicketDto) {
            setTimeout(() => {
                patchValueIntoForm(cloneTicketDto);
            }, 100);
        }
    }, [cloneTicketDto]);
    const onSave = async (isDraft: boolean) => {
        formProductItems.submit();
        formMoveTicket.submit();
        try {
            // Validate cả hai form
            const [productItemsValues, moveTicketValues] = await Promise.all([
                formProductItems.validateFields(),
                formMoveTicket.validateFields(),
            ]);

            let formValue = {
                moveDto: {
                    ...StockUtil.omitMoveStockUpsert(moveTicketValues),
                },
                items: [],
                isDraft,
            };
            if (moveTicketValues?.isImportFromExcel === true) {
                if (!stockMoveStore.productItemsFromExcel?.length) {
                    UiUtils.showError(t("errorNoProduct"));
                    return false;
                }

                formValue.items = stockMoveStore.productItemsFromExcel.map((it: any) =>
                    StockUtil.omitMoveStockItemUpsert(it, moveTicketValues)) as any;
            } else {
                const items = productItemsValues.productItems || [];
                if (!(items.length > 0)) {
                    UiUtils.showError(t("errorNoProduct"));
                    return false;
                }

                formValue.items = items.map((it: any) =>
                    StockUtil.omitMoveStockItemUpsert(it, moveTicketValues));
            }

            props.onSave(formValue);
        } catch (error) {
            // Xử lý lỗi nếu có
            uiUtils.showCommonValidateForm();
            console.log({
                ...formMoveTicket.getFieldsValue(),
                ...formProductItems.getFieldsValue(),
            });
        }
    };

    useHotkeys(
        "F10",
        (event) => {
            if (formMoveTicket.getFieldValue('disableHotKeySave') !== true) {
                navigate(backToUrl);
                event.preventDefault();
            }
        },
        {
            scopes: [HotKeyScope.moveStockContainer],
            enableOnFormTags: true,
            enabled: () => !StockSearchProductTableServerSideStore.isModalOpen
        }
    );

    const triggerDirty = () => {
        ord.event.trigger('event@dirty.stock', true);
    }

    const ProductItemsContent = () => {
        if (stockMoveStore.moveType == "gdp-order") {
            return (
                <Form form={formProductItems}>
                    <GdpGridOrderProductItems
                        formMoveTicket={formMoveTicket}
                    ></GdpGridOrderProductItems>
                </Form>
            );
        } else {
            return (
                <>
                    <Form onInput={triggerDirty}
                          onClick={triggerDirty}
                          form={formProductItems}>
                        <GridProductItems formMoveTicket={formMoveTicket}/>
                    </Form>
                </>
            );
        }
    };
    const RightBoxContent = (
        <>
            <Form onInput={triggerDirty}
                  onClick={triggerDirty}
                  form={formMoveTicket}>
                {stockMoveStore.moveType === "import" && (
                    <ImportRightBox onSave={onSave} formProductItems={formProductItems}/>
                )}
                {stockMoveStore.moveType === "export" && (
                    <ExportRightBox onSave={onSave} formProductItems={formProductItems}/>
                )}
                {stockMoveStore.moveType === "transfer" && (
                    <TransferRightBox
                        onSave={onSave}
                        formProductItems={formProductItems}
                    />
                )}
                {stockMoveStore.moveType === "check" && (
                    <CheckStockRightBox
                        onSave={onSave}
                        formProductItems={formProductItems}
                    />
                )}
                {stockMoveStore.moveType === "gdp-order" && (
                    <GdpOrderRightBox
                        onSave={onSave}
                        formProductItems={formProductItems}
                    />
                )}
                <div hidden>
                    <Form.Item noStyle name={"id"}/>
                    <Form.Item noStyle name={"idHash"}/>
                    <Form.Item noStyle name={"moveType"}/>
                    <Form.Item noStyle name={"moveHashId"}/>
                    <Form.Item noStyle name={"moveStatus"}/>
                    <Form.Item noStyle name={"totalAmount"}/>
                    <Form.Item noStyle name={"relatedMoveId"}/>
                    <Form.Item noStyle name={"relatedMoveIdHash"}/>
                    <Form.Item noStyle name={"relatedMoveCode"}/>
                    <Form.Item noStyle name={"relatedMoveDate"}/>
                    <Form.Item noStyle name={'disableHotKeySave'}/>
                    <Form.Item noStyle name='isImportFromExcel' initialValue={false}/>
                    <Form.Item noStyle name='isEditImport' initialValue={false}/>
                </div>
            </Form>
        </>
    );

    const [backToUrl, setBackToUrl] = React.useState("");
    useEffect(() => {
        if (stockMoveStore?.moveDto?.moveType == MoveType.PhieuXuatTraNhaCungCap) {
            setBackToUrl(pathNameRef.current + "/export-supplier");
        } else {
            setBackToUrl(pathNameRef.current + "/" + stockMoveStore.moveType);
        }
    }, [stockMoveStore?.moveDto?.moveType, stockMoveStore?.moveType]);

    return (
        <>
            <div
                className="flex flex-wrap items-center justify-between leading-[1.8571428571] gap-y-[15px] gap-x-[30px] max-sm:flex-col">
                {/* text-dark dark:text-white/[.87] text-[20px] font-semibold */}
                <h4 className="text-dark text-[20px] font-semibold">
                    <Space className={"title"}>
                        <HomeIcon/>
                    </Space>
                    <Space className={"title"}>
                        <IconlyLight
                            className={"mx-1 mt-[6px]"}
                            width={20}
                            type={"Arrow - Right 2.png"}
                        ></IconlyLight>
                    </Space>
                    <span>
            <Link to={backToUrl}>
              {t(stockMoveStore.moveType + ".pageTitle")}
            </Link>
          </span>
                    <span className="mx-2 ">
            <IconlyLight
                className={"mx-1 mt-[6px]"}
                width={20}
                type={"Arrow - Right 2.png"}
            ></IconlyLight>
          </span>

                    {stockMoveStore.moveType !== "gdp-order" && (
                        <>
              <span>
                {!!editData
                    ? editData?.moveDto?.moveCode
                    : t(stockMoveStore.moveType + ".addNew")}
              </span>
                        </>
                    )}
                    {stockMoveStore.moveType === "gdp-order" && (
                        <>
              <span>
                {!!editData
                    ? (editData as GdpOrderStockTicketDto)?.moveDto?.orderCode
                    : t(stockMoveStore.moveType + ".addNew")}
              </span>
                        </>
                    )}
                </h4>
                <div className="flex items-center pt-1 mb-1">
                    <Link to={backToUrl}>
                        <Button>
                            <ArrowLeftOutlined></ArrowLeftOutlined>
                            {t("returnList")} (F10)
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex  flex-col ord-stock-move-md:flex-row">
                <div className="w-full ord-stock-move-md:flex-1 me-3 mb-3">
                    {<ProductItemsContent></ProductItemsContent>}
                </div>
                <div className="w-full ord-stock-move-md:w-[320px]">
                    {RightBoxContent}
                </div>
            </div>
        </>
    );
};

export default observer(UpsertMoveStockLayout);
