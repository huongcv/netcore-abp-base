import {ArrowLeftOutlined} from "@ant-design/icons";
import {OrderStockMoveDto, OrderStockTicketDto} from "@api/index.defs";
import {HomeIcon} from "@ord-components/icon/HomeIcon";
import {IconlyLight} from "@ord-components/icon/IconlyLight";
import {HotKeyScope} from "@ord-core/AppConst";
import uiUtils from "@ord-core/utils/ui.utils";
import {useStore} from "@ord-store/index";
import GdpOrderRightBox from "@pages/StockManagement/GdpOrderStock/FormUpsert/GdpRightBox";
import GdpGridOrderProductItems from "@pages/StockManagement/GdpOrderStock/GridGdpOrderProductItems";
import OrderRightBox from "@pages/StockManagement/OrderStock/FormUpsert/RightBox";
import GridOrderProductItems from "@pages/StockManagement/OrderStock/GridOrderProductItems";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {useUpsertStockMove} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import {Button, Col, Form, Row, Space} from "antd";
import {observer} from "mobx-react-lite";
import {useEffect, useRef} from "react";
import {useHotkeys} from "react-hotkeys-hook";
import {useTranslation} from "react-i18next";
import {Link, useNavigate} from "react-router-dom";
import "../Shared/Upsert/index.scss";
import Utils from "@ord-core/utils/utils";

const UpsertOrderLayout = (props: {
    onSave: (formData: any) => void;
    cloneTicketDto?: any;
    ns?: string;
}) => {
    const [t] = useTranslation(props.ns ?? "orderStock");
    const {stockMoveStore} = useStore();
    const navigate = useNavigate();
    const {
        formMoveTicket,
        formProductItems,
        editData: orderData,
    } = useUpsertStockMove();
    const editData = orderData as OrderStockTicketDto;
    const pathNameRef = useRef<string>(Utils.getPathUpTo('stock'));

    useEffect(() => {
        if (stockMoveStore.moveDto) {
            formMoveTicket.setFieldsValue({
                ...stockMoveStore.moveDto,
            });
        }
    }, [stockMoveStore.moveDto]);

    const patchValueIntoForm = (ticket: OrderStockTicketDto) => {
        const items = ticket.items || [];
        const data = {
            [StockMoveFormName.ProductItemsFromShop]: [
                {
                    shopId: ticket.moveDto?.supplierId,
                    [StockMoveFormName.ProductItems]: items.map((x) => {
                        const prInfo = x.productDetail;
                        if (prInfo) {
                            delete prInfo.id;
                        }
                        return {
                            ...x,
                            ...prInfo,

                            shopId: ticket.moveDto?.supplierId,
                        };
                    }),
                },
            ],
        };
        formProductItems.setFieldsValue(data);
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
        if (props.cloneTicketDto) {
            setTimeout(() => {
                patchValueIntoForm(props.cloneTicketDto);
            }, 100);
        }
    }, [props.cloneTicketDto]);
    const onSaveOrder = async (isDraft: boolean) => {
        formProductItems.submit();
        formMoveTicket.submit();
        try {
            // Validate cả hai form
            const [shopProduct, moveTicketValues] = await Promise.all([
                formProductItems.validateFields(),
                formMoveTicket.validateFields(),
            ]);
            const saveData: OrderStockTicketDto[] = [];
            const shopItems: any[] =
                shopProduct[StockMoveFormName.ProductItemsFromShop];
            shopItems.forEach((shopItem) => {
                const tempItem = {
                    moveDto: {
                        ...moveTicketValues,
                        supplierId: shopItem.shopId,
                    } as OrderStockMoveDto,
                    items: shopItem[StockMoveFormName.ProductItems],
                    isDraft,
                } as OrderStockTicketDto;
                saveData.push(tempItem);
            });
            // Nếu cả hai form đều valid, xử lý lưu data
            props.onSave(saveData);
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
            navigate(pathNameRef.current + "/" + stockMoveStore.moveType);
            event.preventDefault();
        },
        {scopes: [HotKeyScope.moveStockContainer], enableOnFormTags: true}
    );

    const ProductItemsContent = () => {
        return (
            <Form form={formProductItems}>
                {stockMoveStore.moveType == "order" && (
                    <GridOrderProductItems formMoveTicket={formMoveTicket}/>
                )}
                {stockMoveStore.moveType == "gdp-order" && (
                    <GdpGridOrderProductItems
                        formMoveTicket={formMoveTicket}
                    ></GdpGridOrderProductItems>
                )}
            </Form>
        );
    };
    const RightBoxContent = (
        <>
            <Form form={formMoveTicket}>
                {stockMoveStore.moveType == "order" && (
                    <OrderRightBox
                        onSave={onSaveOrder}
                        formProductItems={formProductItems}
                    />
                )}
                {stockMoveStore.moveType == "gdp-order" && (
                    <GdpOrderRightBox
                        onSave={onSaveOrder}
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
                </div>
            </Form>
        </>
    );

    return (
        <>
            <div
                className="flex flex-wrap items-center justify-between leading-[1.8571428571] gap-y-[15px] gap-x-[30px] max-sm:flex-col">
                <h4 className="text-dark dark:text-white/[.87] text-[20px] font-semibold">
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
            <Link to={pathNameRef.current + "/" + stockMoveStore.moveType}>
              {t(stockMoveStore.moveType + ".pageTitle")}
            </Link>
          </span>
                    <span className="mx-2">
            <IconlyLight
                className={"mx-1 mt-[6px]"}
                width={20}
                type={"Arrow - Right 2.png"}
            ></IconlyLight>
          </span>
                    <span>
            {!!editData
                ? editData?.moveDto?.orderCode
                : t(stockMoveStore.moveType + ".addNew")}
          </span>
                </h4>
                <div className="flex items-center pt-1 mb-1">
                    <Link to={pathNameRef.current + "/" + stockMoveStore.moveType}>
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
                    <Row>
                        <Col span={24}>{RightBoxContent}</Col>
                    </Row>
                </div>
            </div>
        </>
    );
};
export default observer(UpsertOrderLayout);
