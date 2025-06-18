import * as React from "react";
import {useContext} from "react";
import {SellProductInputSearch} from "@pages/SalesInvoice/Sell/components/search-product/Input";
import {useTranslation} from "react-i18next";
import {Button, Dropdown, Space} from "antd";
import {DiffOutlined, DownOutlined} from "@ant-design/icons";
import {MenuProps} from "antd/lib";
import {SellContext} from "@pages/SalesInvoice/Sell";
import {SellProductSearchApiDataTable} from "@pages/SalesInvoice/Sell/components/search-product/GridApi";
import {ProductDto} from "@api/index.defs";
import {checkPermissionUser} from "@ord-core/utils/auth.utils";
import {useStore} from "@ord-store/index";
import {ROLE_PHARMACY} from "@ord-core/AppConst";

export interface ISellSearchProps {
    onProductSelected: (product: ProductDto) => void;
    onShowSalePrescription: () => void;
    onShowSalePrescriptionNational: () => void;
}

export const SellSearchProduct = (props: ISellSearchProps) => {
    const [t] = useTranslation('sale-invoice');
    // @ts-ignore
    // const {settings} = useContext(SellContext);
    const {sessionStore, invoiceSettingStore} = useStore();
    const settings = invoiceSettingStore.settings;
    const BtnSalePres = () => {
        if (checkPermissionUser(sessionStore.appSession, ROLE_PHARMACY)) {
            const items: MenuProps["items"] = [
                {
                    label: (
                        <a
                            onClick={() => {
                                props.onShowSalePrescription();
                            }}
                        >
                            <Space>
                                <DiffOutlined/>
                                {t('prescriptionOutside')}
                            </Space>
                        </a>
                    ),
                    key: "0",
                },
                {
                    label: (
                        <a
                            onClick={() => {
                                props.onShowSalePrescriptionNational();
                            }}
                        >
                            <Space>
                                <DiffOutlined/>
                                {t('prescriptionNational')}
                            </Space>
                        </a>
                    ),
                    key: "1",
                },
            ];
            return <Dropdown menu={{items}} trigger={["hover"]}>
                <Button type='primary'>
                    <Space>
                        <DiffOutlined/>
                        {t("salesPrescription")}
                        <DownOutlined/>
                    </Space>
                </Button>
            </Dropdown>
        }
        return <></>

    }
    return (<>
        <div className="flex flex-wrap gap-1 px-3">
            <div className="text-2xl font-semibold w-full justify-items-center flex justify-between">
                <span>{t("listProductSearch")}</span>
                <BtnSalePres></BtnSalePres>
            </div>

            <div className="w-full mt-[8px]">
                <SellProductInputSearch {...props}></SellProductInputSearch>
            </div>
        </div>
        {
            // (settings && settings?.useProductCache) && <SellProductSearchDataTable {...props}/>
            (settings && settings?.useProductCache) && <SellProductSearchApiDataTable {...props}/>
        }
        {
            (settings && !settings.useProductCache) && <SellProductSearchApiDataTable {...props}/>
        }
    </>);
}
