import {observer} from "mobx-react-lite";
import React from "react";
import {useStore} from "@ord-store/index";
import ProductUpdateForm from "@pages/ProductManagement/Product/forms/ProductUpdateForm";
import ProductCreateForm from "@pages/ProductManagement/Product/forms/ProductCreateForm";
import '../index.scss'

const ProductUpsertForm = () => {
    const {productStore: mainStore} = useStore();
    return (<>
        {
            mainStore.isAddNewEntity ? <ProductCreateForm/> : <ProductUpdateForm/>
        }
    </>)
}
export default observer(ProductUpsertForm);

