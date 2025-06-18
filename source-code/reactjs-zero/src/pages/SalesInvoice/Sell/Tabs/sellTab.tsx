import '../sellForm.scss';
import {FormInstance, Modal, Tabs} from "antd";
import React, {ReactNode, useEffect, useRef, useState} from "react";
import UiUtils from "@ord-core/utils/ui.utils";
import {useCallbackPrompt} from "@pages/SalesInvoice/Utils/useCallbackPrompt";
import {useTranslation} from "react-i18next";
import {TabItemType} from "@pages/SalesInvoice/Utils/saleCommon";
import {useStore} from "@ord-store/index";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const initialItems = [
    {label: (<span>HD1</span>), key: 'HD1'},
];

export const SellTab = (props: {
    products: any,
    form: FormInstance,
    changeTabHandler: React.EventHandler<any>,
    isInvoiceReturn?: boolean,
    invoiceReturn: any,
    refreshTab?: any | undefined,
    resetTab?: any | undefined
}) => {
    const {products, form, resetTab, refreshTab, isInvoiceReturn} = props;
    const {saleInvoiceStore: mainStore} = useStore();
    const {t} = useTranslation('sale-invoice')
    const [activeKey, setActiveKey] = useState(initialItems[0].key);
    const [items, setItems] = useState(initialItems);
    const newTabIndex = useRef(2);
    const [showDialog, setShowDialog] = useState(true)
    const [showPrompt, confirmNavigation, cancelNavigation] =
        useCallbackPrompt(showDialog);

    useEffect(() => {
        setToTabContentData();
    }, [form?.getFieldsValue()]);

    useEffect(() => {
        if (resetTab)
            remove(activeKey);
    }, [resetTab]);

    useEffect(() => {
        if (refreshTab)
            reloadTab();
    }, [refreshTab]);

    useEffect(() => {
        if (isInvoiceReturn) {
            addTabReturnInvoice();
        }
    }, [isInvoiceReturn]);

    const changeShowDialog = (val: boolean) => {
        const key = 'prompt_sell';
        if (val) sessionStorage.setItem(key, `1`);
        else sessionStorage.setItem(key, `0`)
    }

    const reloadTab = () => {
        const data = mainStore.invoiceTabContentData;
        if (data && data.length > 0) {
            const index = data.findIndex((x: any) => x.key === activeKey);
            props.changeTabHandler(data[index].data);
        } else {
            props.changeTabHandler(undefined);
        }
    }

    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
        const item = mainStore.invoiceTabContentData.find((item: any) => item.key === newActiveKey);
        props.changeTabHandler(item.data);
    };

    const add = (tabType?: number) => {
        if (items.length >= 10) {
            UiUtils.showError('Tối đa 10 hóa đơn');
            return;
        }

        const keyOk = items.find((item: any) => item.key === activeKey);
        if (keyOk) {
            props.changeTabHandler(undefined);
        }

        const tabIndex = newTabIndex.current++;
        const newActiveKey = `HD${tabIndex}`;
        let tabName: ReactNode = newActiveKey;

        form.setFieldValue('tabItemType', TabItemType.SALE_INVOICE);
        if (tabType == TabItemType.INVOICE_RETURN) {
            tabName = (<span className="return">TH{tabIndex}</span>);
            form.setFieldValue('tabItemType', TabItemType.INVOICE_RETURN);
        }

        const newPanes = [...items];
        // @ts-ignore
        newPanes.push({label: tabName, key: newActiveKey});
        setItems(newPanes);
        setActiveKey(newActiveKey);
    };

    const setToTabContentData = (changeTab?: boolean) => {
        const customerFields = form.getFieldsValue(["partnerId", "partnerName"]);
        let vals = {
            key: activeKey,
            data: {
                products: [...products],
                form: {...form.getFieldsValue()},
                customer: customerFields?.partnerId ? {
                    id: customerFields?.partnerId
                } : null,
                invoiceReturn: {...props.invoiceReturn},
            }
        }
        let hasUpdated = false;
        mainStore.invoiceTabContentData.forEach((el: any) => {
            if (el.key == vals.key) {
                el.data = vals.data;
                hasUpdated = true;
            }
        })
        if (!hasUpdated) {
            mainStore.invoiceTabContentData.push(vals);
        }

        let isShowDialog = false;
        mainStore.invoiceTabContentData.forEach((el: any) => {
            if (el.data.products && el.data.products.length > 0) {
                isShowDialog = true;
            }
        })
        changeShowDialog(isShowDialog);

        if (changeTab)
            props.changeTabHandler(undefined);
    }

    const removeItemFromTabContentData = (key?: string) => {
        const index = mainStore.invoiceTabContentData.findIndex((item: any) => item.key === key);
        if (index >= 0) {
            mainStore.invoiceTabContentData.splice(index, 1);
        }
    }

    const remove = (targetKey: TargetKey) => {

        removeItemFromTabContentData(`${targetKey}`);

        let newActiveKey = activeKey;
        let lastIndex = -1;
        items.forEach((item, i) => {
            if (item.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = items.filter((item) => item.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }

        if (newPanes.length) {
            //Active tab
            setItems(newPanes);
            setActiveKey(newActiveKey);
            // const item = data.find((item: any) => item.key === newActiveKey);
            const item = mainStore.invoiceTabContentData.find((item: any) => item.key === newActiveKey);
            props.changeTabHandler(item?.data || undefined);
        } else {
            setItems([])
            setTimeout(() => {
                restTab();
            }, 300)
        }
    };

    const restTab = () => {
        newTabIndex.current = 2;
        setItems(initialItems);
        setActiveKey(initialItems[0].key);
        props.changeTabHandler(undefined);
    }

    const onEdit = (
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove',
    ) => {
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };

    const addTabReturnInvoice = () => {
        add(TabItemType.INVOICE_RETURN);
    }

    return (
        <div className="w-full pr-[40px]">
            <Tabs
                className="tab-sell"
                type="editable-card"
                onChange={onChange}
                activeKey={activeKey}
                onEdit={onEdit}
                items={items}
            />
            <Modal
                title="Xác nhận"
                cancelText={t('close')}
                okText="Về trang quản lý"
                open={showPrompt as boolean}
                onOk={confirmNavigation as () => void}
                onCancel={cancelNavigation as () => void}
            >
                <p>Còn {items.length} hóa đơn chưa thanh toán! Bạn có muốn thoát?</p>
            </Modal>
        </div>
    )
}
