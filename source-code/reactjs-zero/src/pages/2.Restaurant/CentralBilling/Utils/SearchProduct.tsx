import { SearchOutlined } from "@ant-design/icons";
import { ProductUnitViewDto } from "@api/index.defs";
import { HotKeyScope } from "@ord-core/AppConst";
import { useStore } from "@ord-store/index";
import { Button, Space } from "antd";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import VirtualizedSelectProduct from "./VirtualizedSelectProduct";
import SearchProductTableModalServerSide from "./SearchProductTableModalSide";

export const SearchProduct = (props: {
    onProductSelected?: (dto: ProductUnitViewDto) => void;
    onMultiSelected?: (items: ProductUnitViewDto[]) => void;
}) => {
    const {
        stockMoveStore,
        StockSearchProductTableServerSideStore,
        stockSearchProductFromShopTemplate: searchShopTemplateStore,
    } = useStore();
    const [show, setShow] = useState(true);
    const {onProductSelected, onMultiSelected} = props;

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
                    <VirtualizedSelectProduct
                        onProductSelected={onProductSelected}
                    />
                    <Button type={"primary"} onClick={StockSearchProductTableServerSideStore.showModal}>
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
