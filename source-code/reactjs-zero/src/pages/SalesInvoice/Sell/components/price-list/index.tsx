import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {SellContext} from "@pages/SalesInvoice/Sell";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {Form, Modal} from "antd";
import OrdSelect, {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {useSelectProductPriceList} from "@ord-components/forms/select/selectDataSource/useSelectProductPriceList";
import {useStore} from "@ord-store/index";
import {ExclamationCircleOutlined} from "@ant-design/icons";

interface PriceListInputProps {
    removeAllProductHandler: () => void;
    hidden?: boolean;
}

export const PriceListInput: React.FC<PriceListInputProps> = ({removeAllProductHandler, hidden}) => {
    const {t} = useTranslation("sale-invoice");
    const {t: tPriceList} = useTranslation("price-list");
    const {saleInvoiceStore: mainStore, sessionStore} = useStore();
    //@ts-ignore
    const {formSearch} = useContext(SellContext);
    const {confirm} = Modal;
    const priceListDataSource = useSelectProductPriceList();

    const [selectedPriceListId, setSelectedPriceListId] = useState<number | null>();
    const [isInitialized, setIsInitialized] = useState(false);

    const hasProducts = () =>
        mainStore.invoiceTabContentData.some((item: any) => item.data.products?.length > 0);

    const handlePriceListChange = (value: string, option: IOrdSelectOption) => {
        const previousPriceListId = selectedPriceListId;
        const currentPriceListId = value && !isNaN(Number(value)) ? Number(value) : null;

        if (hasProducts()) {
            confirm({
                title: tPriceList("changePriceList"),
                icon: <ExclamationCircleOutlined/>,
                content: tPriceList("confirmTitleChangePriceList"),
                cancelText: t("close"),
                okButtonProps: {className: "btn-primary custome-btn-primary", type: "primary"},
                cancelButtonProps: {className: "btn-default custome-btn-default", type: "default"},
                onOk: () => {
                    mainStore.invoiceTabContentData.forEach((el: any) => (el.data.products = []));
                    formSearch.setFieldValue("priceListId", currentPriceListId);
                    mainStore.currentPriceListId = currentPriceListId;
                    setSelectedPriceListId(currentPriceListId);
                    removeAllProductHandler();
                },
                onCancel: () => {
                    formSearch.setFieldValue("priceListId", previousPriceListId);
                    mainStore.currentPriceListId = previousPriceListId ?? null;
                    setSelectedPriceListId(previousPriceListId);
                },
            });
        } else {
            formSearch.setFieldValue("priceListId", currentPriceListId);
            setSelectedPriceListId(currentPriceListId);
            mainStore.currentPriceListId = currentPriceListId;
        }
    };

    useEffect(() => {
        const {data} = priceListDataSource;
        const {shops, currentShopId} = sessionStore;
        if (data?.length && !isInitialized) {
            const currentShop = shops.find(x => x.shopId === currentShopId);
            const defaultPriceList =
                data.find(item => item.data?.id === currentShop?.productPriceListMainId) ||
                data.find((item) => item.data?.isMain) || data[0];
            if (defaultPriceList?.value) {
                const value = defaultPriceList.value.toString();
                mainStore.currentPriceListId = defaultPriceList.value;
                handlePriceListChange(value, defaultPriceList);
                setIsInitialized(true);
            }
        }
    }, [priceListDataSource.data]);

    if (!isInitialized || hidden) return null;

    return (
        <FloatLabel style={{flex: 1}} label={<strong>Bảng giá áp dụng</strong>}>
            <Form.Item>
                <OrdSelect
                    value={selectedPriceListId}
                    onChange={handlePriceListChange}
                    datasource={priceListDataSource}
                />
            </Form.Item>
        </FloatLabel>
    );
};