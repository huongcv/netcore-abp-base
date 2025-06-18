import {makeAutoObservable} from "mobx";

class OrderStateStore {
    orderSelected: any | null = null;
    orders: any[] | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setOrderSelected(value: any | null) {
        this.orderSelected = value;
    }

    setOrders(value: any[] | null) {
        this.orders = value;
    }

    addOrder(newOrder: any) {
        if (this.orders) {
            this.orders = [...this.orders, newOrder];
        } else {
            this.orders = [newOrder];
        }
    }

    updateOrder(updatedOrder: any) {
        if (!this.orders) return;

        const index = this.orders.findIndex(o => o.tableId === updatedOrder.tableId);
        if (index === -1) return;

        const newOrders = [...this.orders];
        newOrders[index] = { ...newOrders[index], ...updatedOrder };
        this.orders = newOrders;

        if (this.orderSelected?.tableId === updatedOrder.tableId) {
            this.orderSelected = { ...this.orderSelected, ...updatedOrder };
        }
    }

    deleteOrder(tableId: number) {
        if (!this.orders) return;

        const { updatedOrders, newSelectedOrder } = this.getNearestOrderAfterDelete(this.orders, tableId);

        this.orders = updatedOrders;
        this.orderSelected = newSelectedOrder;
    }

    deleteProductFromOrder(tableId: number, productId: number) {
        if (!this.orders) return;

        const newOrders = this.orders.map(order => {
            if (order.tableId === tableId) {
                return {
                    ...order,
                    details: order.details.filter((item: any) => item.productId !== productId)
                };
            }
            return order;
        });

        this.orders = newOrders;

        if (this.orderSelected?.tableId === tableId) {
            this.orderSelected = {
                ...this.orderSelected,
                details: this.orderSelected.details.filter((item: any) => item.productId !== productId)
            };
        }
    }

    changeTableOrder(tableId: number, order: any) {
        if (!this.orders) return;

        const indexExist = this.orders.findIndex(o => o.tableId === tableId);
        if (indexExist !== -1) return;

        const index = this.orders.findIndex(o => o.tableId === order.tableId);
        if (index === -1) return;

        const newOrders = [...this.orders];
        newOrders[index] = { ...newOrders[index], ...order, tableId };
        this.orders = newOrders;

        if (this.orderSelected?.tableId === order.tableId) {
            this.orderSelected = {
                ...this.orderSelected,
                tableId,
                tableName: order?.tableName,
                partnerName: order?.partnerName
            };
        }
    }

    private getNearestOrderAfterDelete(orders: any[], tableId: number) {
        const updatedOrders = orders.filter((o) => +o.tableId !== +tableId);
        let newSelectedOrder = null;

        if (updatedOrders.length > 0) {
            const index = orders.findIndex((o) => +o.tableId === +tableId);

            if (index < updatedOrders.length) {
                newSelectedOrder = updatedOrders[index];
            } else {
                newSelectedOrder = updatedOrders[updatedOrders.length - 1];
            }
        }

        return {
            updatedOrders,
            newSelectedOrder,
        };
    }
}

export const orderStateStore = new OrderStateStore();
