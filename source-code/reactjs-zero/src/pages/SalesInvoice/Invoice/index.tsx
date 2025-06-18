import * as React from "react";
import {List} from "@pages/SalesInvoice/Invoice/list";
import {ModalProvider} from "@pages/SalesInvoice/Utils/modalContext";

const Invoice: React.FC = () => {
    return (<ModalProvider><List></List></ModalProvider>)
}

export default Invoice;