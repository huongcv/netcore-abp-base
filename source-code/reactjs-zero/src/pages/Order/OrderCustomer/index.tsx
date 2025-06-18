import { ModalProvider } from "@pages/SalesInvoice/Utils/modalContext";
import * as React from "react";
import { List } from "./list";

const Order: React.FC = () => {
    return (<ModalProvider><List></List></ModalProvider>)
}

export default Order;