import * as React from "react";
import {ShopWorkShiftList} from "@pages/WorkShift/ShopWorkShift/list";
import {ModalProvider} from "@pages/SalesInvoice/Utils/modalContext";

const ShopWorkShift: React.FC = () => {
    return (
        <ModalProvider>
            <ShopWorkShiftList></ShopWorkShiftList>
        </ModalProvider>
    )
}

export default ShopWorkShift;
