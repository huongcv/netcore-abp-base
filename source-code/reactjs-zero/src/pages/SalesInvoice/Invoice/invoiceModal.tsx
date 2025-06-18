import * as React from "react";
import {forwardRef, useEffect, useImperativeHandle} from "react";
import {Modal} from "antd";
import {useTranslation} from "react-i18next";
import {useModal} from "@pages/SalesInvoice/Utils/modalContext";
import {List} from "@pages/SalesInvoice/Invoice/list";

const modalKey: string = "invoiceModal";
export const InvoiceModal = forwardRef((props: {}, ref: any) => {
    const {t} = useTranslation('sale-invoice')
    // @ts-ignore
    const {modals, openModal, closeModal} = useModal();

    useEffect(() => {
        closeModal(modalKey);
    }, []);

    const showModal = () => {
        // setOpen(true);
        openModal(modalKey);
    };

    const handleOk = () => {
        handleCancel();
    };

    const handleCancel = () => {
        closeModal(modalKey);
    };

    useImperativeHandle(ref, () => ({
        showModal
    }));

    return (<>
        <Modal title={"Danh sách hóa đơn"}
               wrapClassName="modal-list"
               open={modals[modalKey]}
               width={1500}
               maskClosable={false}
               style={{top: '30px'}}
               onCancel={() => handleCancel()}
               cancelText={t('close')}
               footer={(_, {OkBtn, CancelBtn}) => (
                   <>
                       <CancelBtn/>
                   </>
               )}
               destroyOnClose>
            <List></List>
        </Modal>
    </>)
})
