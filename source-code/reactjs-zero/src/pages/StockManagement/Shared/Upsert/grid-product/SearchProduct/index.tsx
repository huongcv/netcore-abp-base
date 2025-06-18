import {Button, Form, Space} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {ProductUnitViewDto} from "@api/index.defs";
import {useUpsertStockMove} from "@pages/StockManagement/Shared/Upsert/upsertMoveContext";
import React, {useEffect, useState} from "react";
import {useStore} from "@ord-store/index";
import {useHotkeys} from "react-hotkeys-hook";
import {HotKeyScope} from "@ord-core/AppConst";
import SearchProductTableModalServerSide
    from "@pages/StockManagement/Shared/Upsert/grid-product/SearchProduct/server/SearchProductTableModalServerSide";
import VirtualizedSelectStock
    from "@pages/StockManagement/Shared/Upsert/grid-product/SearchProduct/server/VirtualizedSelectStock";

export const SearchProduct = (props: {
    onProductSelected?: (dto: ProductUnitViewDto) => void;
    onMultiSelected?: (items: ProductUnitViewDto[]) => void;
    disabled?: boolean
}) => {
    const {formMoveTicket} = useUpsertStockMove();
    const {
        stockMoveStore,
        StockSearchProductTableServerSideStore,
        stockSearchProductFromShopTemplate: searchShopTemplateStore,
    } = useStore();
    const [show, setShow] = useState(true);
    const {onProductSelected, onMultiSelected} = props;
    const relatedMoveId_w = Form.useWatch("relatedMoveId", formMoveTicket);
    useEffect(() => {
        setShow(!relatedMoveId_w);
    }, [relatedMoveId_w]);
    const onMultiProductSelected = (items: ProductUnitViewDto[]) => {
        if (onMultiSelected) {
            onMultiSelected(items);
        }
    };
    useHotkeys(
        "F3",
        (event) => {
            StockSearchProductTableServerSideStore.showModal();
            event.preventDefault();
        },
        {scopes: [HotKeyScope.moveStockContainer], enableOnFormTags: true}
    );

    return (
        <>
            {show && (
                <Space.Compact style={{width: "100%", maxWidth: "688px"}}>
                    <VirtualizedSelectStock
                        disabled={props.disabled}
                        onProductSelected={onProductSelected}
                    />
                    <Button type={"primary"} disabled={props.disabled} onClick={StockSearchProductTableServerSideStore.showModal}>
                        <SearchOutlined/>
                    </Button>
                    <SearchProductTableModalServerSide
                        moveType={stockMoveStore.moveDto?.moveType}
                        onItemsSelected={onMultiProductSelected}
                    />
                </Space.Compact>
            )}
        </>
    );
};
