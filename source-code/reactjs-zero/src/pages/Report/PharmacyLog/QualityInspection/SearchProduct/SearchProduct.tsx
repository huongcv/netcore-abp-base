import {Button, Col, Row} from "antd";
import {useTranslation} from "react-i18next";
import {ProductSearchWithUnitDto} from "@api/index.defs";
import React, {useEffect, useState} from "react";
import {useStore} from "@ord-store/index";
import {useHotkeys} from "react-hotkeys-hook";
import {HotKeyScope} from "@ord-core/AppConst";
import {
    ProductSelectSearchApi
} from "@ord-components/forms/ProductSelectSearchApi";

import {observer} from "mobx-react-lite";
import SearchProductTableModal from "@pages/Report/PharmacyLog/QualityInspection/SearchProduct/SearchProductTableModal";
import {ProductFromInventorySelectSearchApi} from "@ord-components/forms/ProductFromInventorySelectSearchApi";


const SearchProduct = (props: {
    onProductSelected?: (dto: ProductSearchWithUnitDto) => void;
    onMultiSelected?: (items: ProductSearchWithUnitDto[]) => void;
    onlyGetProductUsingInventory: boolean
}) => {
    const {reportPharmacyLogQualityInspectionSearchProductStore: productSearch} = useStore();
    const [t] = useTranslation('stock');
    const {onProductSelected, onMultiSelected} = props;
    // useEffect(() => {
    //     productSearch.setGetProductUsingInventory(props.onlyGetProductUsingInventory);
    // }, [props.onlyGetProductUsingInventory]);
    useHotkeys('F3', (event) => {
        productSearch.showModal();
        event.preventDefault();
    }, {scopes: [HotKeyScope.moveStockContainer], enableOnFormTags: true});

    return (
        <>
            <Row gutter={[16,16]}>
                <Col flex="1 1 150px">
                    <ProductFromInventorySelectSearchApi onProductSelected={onProductSelected}
                                            placeholder={t('searchInputPlaceholderHotKey')}/>
                </Col>
                <Col flex={'0 1 250 px'}>
                    <Button style={{width: 156}} className={'btn-other'} type='default'
                            onClick={productSearch.showModal}>
                        {t("showSearchAdvance")}
                    </Button>
                    <SearchProductTableModal
                        onItemsSelected={onMultiSelected}/>
                </Col>
            </Row>


        </>
    )
}
export default observer(SearchProduct)