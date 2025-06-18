import {observer} from "mobx-react-lite";
import '../Shared/Upsert/index.scss';
import {Form, FormInstance, Tabs, TabsProps} from "antd";
import React from "react";
import {useTranslation} from "react-i18next";
import {StockMoveFormName} from "@pages/StockManagement/Shared/Const/StockMoveConst";
import {ProductItemFormProps} from "@pages/StockManagement/Shared/Upsert/Props";
import GdpOrderHeaderProduct from "@pages/StockManagement/GdpOrderStock/FormUpsert/GdpOrderHeaderProduct";
import GdpOrderProductItemForm from "@pages/StockManagement/GdpOrderStock/FormUpsert/GdpOrderProductItemForm";

const GdpGridOrderProductItems = (props: {
    formMoveTicket: FormInstance<any>,
}) => {
    const {formMoveTicket} = props;
    const {t} = useTranslation('gdpOrderStock');
    const itemTabs: TabsProps["items"] = [
        {
            key: "1", // Đảm bảo key là string và duy nhất
            label: <strong className='uppercase'>  {t('orderInfo')}</strong>, //<ViewShopName index={tenantField.name}></ViewShopName>,
            children: (
                <table className="min-w-full bg-white border border-gray-200 min-h-[100px]">
                    <thead className="product-table-h">
                    <GdpOrderHeaderProduct/>
                    </thead>
                    <tbody>
                    <Form.List name={[StockMoveFormName.ProductItems]}>
                        {(productFields, {add: addProduct, remove: removeEmail}) => (
                            <>
                                {productFields.map((field) => {
                                    const propsProduct: ProductItemFormProps = {
                                        field,
                                        remove: removeEmail,
                                        formMoveTicket,
                                    };
                                    return (
                                        <GdpOrderProductItemForm key={field.key} {...propsProduct}/>

                                    );
                                })}
                            </>
                        )}
                    </Form.List>
                    </tbody>
                </table>
            ),
        }
    ]
    return (<div className='grid-product-item-container'>
        <Tabs size='small' items={itemTabs} type="card"/>
    </div>)
}
export default observer(GdpGridOrderProductItems);
